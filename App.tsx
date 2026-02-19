
import React, { useState, useEffect, useCallback } from 'react';
import { fetchSREJobs } from './services/geminiService';
import { SearchResult, Company, TrackerEntry, JobListing } from './types';
import CompanyCard from './components/CompanyCard';
import CountdownTimer from './components/CountdownTimer';
import JobTracker from './components/JobTracker';

const App: React.FC = () => {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [appliedJobs, setAppliedJobs] = useState<TrackerEntry[]>(() => {
    const saved = localStorage.getItem('sre_applied_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sre_applied_jobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  const handleApply = (job: JobListing, companyName: string) => {
    const newEntry: TrackerEntry = {
      jobTitle: job.title,
      companyName: companyName,
      dateApplied: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      url: job.url
    };
    
    setAppliedJobs(prev => {
      if (prev.some(entry => entry.url === job.url)) return prev;
      return [newEntry, ...prev];
    });

    // Open link in new tab
    window.open(job.url, '_blank', 'noopener,noreferrer');
  };

  const handleClearTracker = () => {
    if (confirm('Are you sure you want to clear your job tracker history?')) {
      setAppliedJobs([]);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSREJobs();
      
      const sortedCompanies = [...result.companies].sort((a, b) => {
        if (a.isActivelyHiringToday === b.isActivelyHiringToday) {
          return a.name.localeCompare(b.name);
        }
        return a.isActivelyHiringToday ? -1 : 1;
      });

      setData({ ...result, companies: sortedCompanies });
    } catch (err) {
      setError("Failed to fetch latest SRE job data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCompanies = data?.companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.locations.some(l => l.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const appliedUrls = appliedJobs.map(j => j.url);

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
                <i className="fas fa-dharmachakra text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">SRE VISA HUB</h1>
                <div className="flex items-center space-x-2">
                   <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">EU EXPLORER</span>
                   <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                   <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Daily Updates</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <CountdownTimer />
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={loadData}
                disabled={loading}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-slate-700 disabled:opacity-50"
              >
                <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
                <span>REFRESH NOW</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Top Destinations</span>
              <span className="text-slate-300">—</span>
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest italic">For Indian Site Reliability Engineers</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
              Fresh Opportunities in <span className="text-indigo-600">NL & LU</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              We track companies that prioritize Indian talent with visa sponsorship and relocation support. 
              Active today status is updated in real-time based on portal activity.
            </p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <i className="fas fa-filter absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
            <input 
              type="text"
              placeholder="Search by company or tech..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-white transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Legend */}
        {!loading && data && (
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-8 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded animate-pulse"></div>
                <span className="text-xs font-bold text-slate-600">Active Hiring Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-400 rounded"></div>
                <span className="text-xs font-bold text-slate-600">New Job Postings</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:ml-auto">
              <div className="flex items-center space-x-2 mr-4 border-r border-slate-100 pr-4">
                <span className="text-xs font-bold text-slate-400">Total Companies Found:</span>
                <span className="text-xs font-black text-slate-900">{filteredCompanies.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400">Applied Tracking:</span>
                <span className="text-xs font-black text-indigo-600">{appliedJobs.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicators */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Verifying recent SRE activity...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-8 rounded-2xl text-center max-w-lg mx-auto">
            <i className="fas fa-cloud-sun-rain text-4xl mb-4 opacity-50"></i>
            <p className="font-black text-xl mb-2">Service Temporarily Weathered</p>
            <p className="text-sm opacity-90 mb-6">{error}</p>
            <button onClick={loadData} className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">TRY AGAIN</button>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && filteredCompanies.map((company, idx) => (
            <CompanyCard 
              key={idx} 
              company={company} 
              appliedJobs={appliedUrls}
              onApply={handleApply}
            />
          ))}
        </div>

        {!loading && data && filteredCompanies.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="inline-block p-6 rounded-full bg-slate-50 text-slate-300 mb-4">
              <i className="fas fa-ghost text-4xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900">No matching leads</h3>
            <p className="text-slate-500 font-medium">We couldn't find any specific matches for your current filter.</p>
          </div>
        )}

        {/* Job Tracker Section */}
        <JobTracker 
          entries={appliedJobs} 
          onClear={handleClearTracker}
        />

        {/* Grounding Sources */}
        {!loading && data && data.sources.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
              <span className="mr-4">DATA VERIFIED VIA</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </h4>
            <div className="flex flex-wrap gap-3">
              {data.sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 flex items-center bg-white px-4 py-2 rounded-xl transition-all border border-slate-100 hover:border-indigo-100 hover:shadow-sm"
                >
                  <i className="fas fa-link mr-2 opacity-30"></i> {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                  <i className="fas fa-dharmachakra text-white"></i>
                </div>
                <h3 className="text-white font-black tracking-tight text-lg">SRE VISA HUB</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Dedicated tracker for Indian engineering professionals moving to the EU. 
                Our system refreshes daily at 9 PM IST to catch fresh job board postings 
                as they appear in European time zones.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
               <div>
                 <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-6">RESOURCES</h4>
                 <ul className="space-y-4 text-sm font-medium">
                   <li><a href="#" className="hover:text-white transition-colors">IND High Skilled Migrant Guide</a></li>
                   <li><a href="#" className="hover:text-white transition-colors">Luxembourg Blue Card</a></li>
                   <li><a href="#" className="hover:text-white transition-colors">Housing Allowance Tips</a></li>
                 </ul>
               </div>
               <div>
                 <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-6">COMMUNITY</h4>
                 <ul className="space-y-4 text-sm font-medium">
                   <li><a href="#" className="hover:text-white transition-colors">Indians in Amsterdam</a></li>
                   <li><a href="#" className="hover:text-white transition-colors">SRE Slack Workspace</a></li>
                   <li><a href="#" className="hover:text-white transition-colors">Relocation Calculators</a></li>
                 </ul>
               </div>
               <div>
                 <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-6">SCHEDULE</h4>
                 <p className="text-xs font-bold bg-slate-800 p-3 rounded-xl border border-slate-700">
                    Next Scan: 21:00 IST / 15:30 UTC
                 </p>
               </div>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-widest gap-6">
            <div className="flex items-center space-x-2">
              <span>Made with</span>
              <i className="fas fa-heart text-indigo-500"></i>
              <span>for SREs worldwide</span>
            </div>
            <div className="flex space-x-8">
              <span>&copy; 2024 SRE VISA HUB</span>
              <span className="opacity-40">Privacy Policy</span>
              <span className="opacity-40">Terms of Use</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
