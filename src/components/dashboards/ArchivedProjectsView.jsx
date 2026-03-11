import React from 'react';
import { Archive } from 'lucide-react';
import DynamicIcon from '../shared/DynamicIcon';

export default function ArchivedProjectsView({ projects, companies, handlePermanentDeleteProject, handleRestoreProject }) {
  const archived = projects.filter(p => p.isArchived);
  
  return (
    <div className="p-4 sm:p-8 h-full overflow-y-auto w-full bg-slate-50/50">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Archive className="text-slate-500" size={24} /> Archived Projects</h2>
        <p className="text-slate-500 text-sm mt-1">Projects stored away. You can restore them or permanently delete them.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archived.map(project => {
          const company = companies.find(c => c.id === project.companyId);
          return (
            <div key={project.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <DynamicIcon name={project.icon} size={24} className="text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{project.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{company?.name || 'Unknown Company'}</p>
                  </div>
               </div>
               <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button onClick={() => handlePermanentDeleteProject(project.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Delete Forever</button>
                  <button onClick={() => handleRestoreProject(project)} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Restore</button>
               </div>
            </div>
          )
        })}
        {archived.length === 0 && (
           <div className="col-span-full p-12 text-center flex flex-col items-center bg-white rounded-xl border border-slate-200 border-dashed">
             <Archive size={32} className="text-slate-300 mb-3" />
             <p className="text-slate-500 font-medium">No archived projects.</p>
           </div>
        )}
      </div>
    </div>
  );
}