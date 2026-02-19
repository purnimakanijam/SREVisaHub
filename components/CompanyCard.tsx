
import React from 'react';
import { Company } from '../types';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{company.name}</h3>
            <p className="text-sm text-indigo-600 font-medium">{company.industry}</p>
          </div>
          <a 
            href={company.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <i className="fas fa-external-link-alt"></i>
          </a>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {company.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {company.locations.map(loc => (
            <span key={loc} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full flex items-center">
              <i className="fas fa-map-marker-alt mr-1"></i> {loc}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <span className="block text-xs text-green-700 uppercase font-bold tracking-wider mb-1">Visa Sponsor</span>
            <span className="text-sm text-green-900 font-semibold">
              <i className="fas fa-check-circle mr-1"></i> Yes
            </span>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <span className="block text-xs text-blue-700 uppercase font-bold tracking-wider mb-1">Relocation</span>
            <span className="text-sm text-blue-900 font-semibold line-clamp-1" title={company.relocationBenefits}>
              {company.relocationBenefits || "Available"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center">
            <i className="fas fa-briefcase mr-2 text-indigo-500"></i> Open SRE Roles
          </h4>
          {company.sreJobs.length > 0 ? (
            <ul className="space-y-2">
              {company.sreJobs.map((job, idx) => (
                <li key={idx} className="group">
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-900 truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-400">{job.location}</p>
                    </div>
                    <i className="fas fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400 ml-2"></i>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No specific SRE links found, check career site.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
