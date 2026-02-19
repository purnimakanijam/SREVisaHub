
import React, { useState, useEffect, useCallback } from 'react';
import { fetchSREJobs } from './services/geminiService';
import { SearchResult, Company } from './types';
import CompanyCard from './components/CompanyCard';
import CountdownTimer from './components/CountdownTimer';

const App: React.FC = () => {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSREJobs();
      setData(result);
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
                <i className="fas fa-server text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">SRE Visa Hub</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Amsterdam & Luxembourg</p>
              </div>
            </div>
            
            <div className="hidden md:block">
              <CountdownTimer />
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={loadData}
                disabled={loading}
                className="p-2 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Targeted Opportunities</h2>
            <p className="text-slate-600 leading-relaxed">
              Curated list of tech companies in Amsterdam and Luxembourg offering visa sponsorship and relocation support 
              specifically for Indian Site Reliability Engineers. Refreshed daily at 9 PM IST.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text"
              placeholder="Filter by name, location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Indicators */}
        {loading && !data && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Scanning career portals for the latest SRE roles...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center">
            <i className="fas fa-exclamation-circle text-2xl mr-4"></i>
            <div>
              <p className="font-bold">Error loading jobs</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, idx) => (
            <CompanyCard key={idx} company={company} />
          ))}
        </div>

        {!loading && data && filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-4 rounded-full bg-slate-100 text-slate-400 mb-4">
              <i className="fas fa-search text-3xl"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No companies found</h3>
            <p className="text-slate-500">Try adjusting your filter or check back tomorrow.</p>
          </div>
        )}

        {/* Grounding Sources */}
        {!loading && data && data.sources.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verified Sources</h4>
            <div className="flex flex-wrap gap-4">
              {data.sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                >
                  <i className="fas fa-globe mr-2 opacity-50"></i> {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-heart text-red-400"></i>
              <span>Built for the SRE community exploring the EU</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-indigo-600 transition-colors">Career Tips</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Visa Guide</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Relocation FAQ</a>
            </div>
            <div className="text-xs opacity-60">
              Powered by Gemini Search Grounding
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
