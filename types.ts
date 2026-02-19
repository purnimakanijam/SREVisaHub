
export interface JobListing {
  title: string;
  url: string;
  location: string;
  postedDate?: string;
  isNew?: boolean;
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
  isActivelyHiringToday?: boolean;
  lastUpdated?: string;
}

export interface TrackerEntry {
  jobTitle: string;
  companyName: string;
  dateApplied: string;
  url: string;
}

export interface SearchResult {
  companies: Company[];
  sources: { title: string; uri: string }[];
}
