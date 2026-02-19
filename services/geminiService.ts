
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export const fetchSREJobs = async (): Promise<SearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Find tech companies in Amsterdam (Netherlands) and Luxembourg providing work visa sponsorship and relocation for Indian Site Reliability Engineers (SRE). 
  
  CRITICAL REQUIREMENTS:
  1. Identify companies that have "just posted" jobs or are "actively hiring today" based on career page timestamps or news from the last 24-48 hours.
  2. For each job, determine if it was posted very recently (mark as isNew).
  3. Ensure jobs are in English.
  
  Please provide the result in structured JSON format:
  - name
  - website
  - industry
  - locations (array)
  - visaSupport (boolean)
  - relocationBenefits (description)
  - isActivelyHiringToday (boolean: true if news or career site shows very recent activity/urgent roles)
  - sreJobs: array of {title, url, location, isNew (boolean)}
  - description (company summary)
  
  Search thoroughly through career portals and LinkedIn updates via grounding.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  website: { type: Type.STRING },
                  industry: { type: Type.STRING },
                  locations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  visaSupport: { type: Type.BOOLEAN },
                  relocationBenefits: { type: Type.STRING },
                  isActivelyHiringToday: { type: Type.BOOLEAN },
                  sreJobs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        location: { type: Type.STRING },
                        isNew: { type: Type.BOOLEAN }
                      },
                      required: ["title", "url"]
                    }
                  },
                  description: { type: Type.STRING }
                },
                required: ["name", "website", "visaSupport", "sreJobs", "isActivelyHiringToday"]
              }
            }
          },
          required: ["companies"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || '#'
    })).filter((s: any) => s.uri !== '#');

    return {
      companies: data.companies || [],
      sources: sources
    };
  } catch (error) {
    console.error("Error fetching SRE jobs:", error);
    throw error;
  }
};
