
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export const fetchSREJobs = async (): Promise<SearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Find all reputable tech companies in Amsterdam, Netherlands and Luxembourg that provide work visa sponsorship (HSM/Blue Card) and relocation benefits for Indian Site Reliability Engineers (SRE). 
  For each company, list current open SRE or DevOps job positions that are in English. 
  
  Please provide the result in structured JSON format with the following fields for each company:
  - name
  - website
  - industry
  - locations (array of strings)
  - visaSupport (boolean)
  - relocationBenefits (description string)
  - sreJobs (array of objects with 'title', 'url', 'location')
  - description (short company summary)
  
  Focus on active hiring and specific SRE roles.`;

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
                  sreJobs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        location: { type: Type.STRING }
                      },
                      required: ["title", "url"]
                    }
                  },
                  description: { type: Type.STRING }
                },
                required: ["name", "website", "visaSupport", "sreJobs"]
              }
            }
          },
          required: ["companies"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    
    // Extract grounding sources
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
