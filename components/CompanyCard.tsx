
import React from 'react';
import { Company, JobListing } from '../types';

interface CompanyCardProps {
  company: Company;
  appliedJobs: string[];
  onApply: (job: JobListing, companyName: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, appliedJobs, onApply }) => {
  // Filter out jobs that have already been applied to
  const availableJobs = company.sreJobs.filter(job => !appliedJobs.includes(job.url));

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${company.isActivelyHiringToday ? 'border-emerald-200' : 'border-slate-200'} overflow-hidden hover:shadow-md transition-all relative flex flex-col h-full`}>
      {company.isActivelyHiringToday && (
        <div className="absolute top-0 right-0 p-2">
          <span className="flex items-center space-x-1 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span>HIRING TODAY</span>
          </span>
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 pr-16">
          <div>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group/title inline-block"
            >
              <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover/title:text-indigo-600 transition-colors">
                {company.name}
                <i className="fas fa-external-link-alt text-[10px] ml-2 opacity-0 group-hover/title:opacity-100 transition-opacity align-top mt-1"></i>
              </h3>
            </a>
            <p className="text-sm text-indigo-600 font-medium">{company.industry}</p>
          </div>
          <a 
            href={company.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
            title="Visit Company Website"
          >
            <i className="fas fa-globe text-sm"></i>
          </a>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {company.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {company.locations.map(loc => (
            <span key={loc} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded uppercase tracking-wider flex items-center">
              <i className="fas fa-map-marker-alt mr-1 opacity-50"></i> {loc}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
            <span className="block text-[10px] text-indigo-700 uppercase font-black tracking-widest mb-1">Visa Support</span>
            <span className="text-xs text-indigo-900 font-bold flex items-center">
              <i className="fas fa-passport mr-1.5 text-indigo-500"></i> HSM / Blue Card
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Relocation</span>
            <span className="text-xs text-slate-900 font-bold truncate" title={company.relocationBenefits}>
              {company.relocationBenefits || "Standard Package"}
            </span>
          </div>
        </div>

        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
              <i className="fas fa-bolt mr-2 text-amber-500"></i> Available SRE Roles
            </h4>
          </div>
          
          {availableJobs.length > 0 ? (
            <ul className="space-y-2">
              {availableJobs.map((job, idx) => (
                <li key={idx} className="group">
                  <div className="flex flex-col gap-1">
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-indigo-300 group-hover:shadow-sm transition-all"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-900 truncate">
                            {job.title}
                          </p>
                          {job.isNew && (
                            <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">New</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">{job.location}</p>
                      </div>
                      <i className="fas fa-external-link-alt text-[10px] text-slate-300"></i>
                    </a>
                    <button 
                      onClick={() => onApply(job, company.name)}
                      className="w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-2">
               <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200 text-center">
                {company.sreJobs.length > 0 
                  ? "You've applied to all currently listed roles here!" 
                  : "No specific SRE links listed right now."}
              </p>
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-center py-2 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded transition-colors uppercase tracking-widest"
              >
                Check Career Site <i className="fas fa-chevron-right ml-1"></i>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
