
export interface JobListing {
  title: string;
  url: string;
  location: string;
  postedDate?: string;
}

export interface Company {
  name: string;
  website: string;
  industry: string;
  locations: string[];
  visaSupport: boolean;
  relocationBenefits: string;
  sreJobs: JobListing[];
  description: string;
}

export interface SearchResult {
  companies: Company[];
  sources: { title: string; uri: string }[];
}
