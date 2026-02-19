
import React from 'react';
import { TrackerEntry } from '../types';

interface JobTrackerProps {
  entries: TrackerEntry[];
  onClear: () => void;
}

const JobTracker: React.FC<JobTrackerProps> = ({ entries, onClear }) => {
  if (entries.length === 0) return null;

  return (
    <div className="mt-16 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">APPLICATION TRACKER</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Your Personal Progress Report</p>
        </div>
        <button 
          onClick={onClear}
          className="text-[10px] font-black text-slate-400 hover:text-rose-400 uppercase tracking-widest transition-colors"
        >
          Clear History
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Job Title</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Company</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Applied Date</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {entries.map((entry, idx) => (
              <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-8 py-4">
                  <span className="text-sm font-bold text-slate-800">{entry.jobTitle}</span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{entry.companyName}</span>
                </td>
                <td className="px-8 py-4 text-xs font-medium text-slate-500">
                  {entry.dateApplied}
                </td>
                <td className="px-8 py-4 text-right">
                  <a 
                    href={entry.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    <i className="fas fa-external-link-alt text-sm"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTracker;
