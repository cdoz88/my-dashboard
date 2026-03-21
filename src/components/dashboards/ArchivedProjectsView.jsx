import React, { useState } from 'react';
import { Archive, RotateCcw, Trash2, Search } from 'lucide-react';
import CompanyLogo from '../shared/CompanyLogo';

export default function ArchivedProjectsView({ projects, companies, handlePermanentDeleteProject, handleRestoreProject }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const archivedProjects = projects.filter(p => p.isArchived);
  const filteredProjects = archivedProjects.filter(p => {
      if (!searchQuery) return true;
      return p.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-8 h-full overflow-y-auto w-full bg-slate-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Archive className="text-slate-500" size={28} /> Archived Projects</h2>
          <p className="text-slate-500 text-sm mt-1">Restore or permanently delete completed projects.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
            </div>
            <input 
                type="text" 
                placeholder="Search archives..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {filteredProjects.length === 0 ? (
             <div className="p-12 text-center flex flex-col items-center">
                <Archive size={48} className="text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No archived projects found.</p>
             </div>
         ) : (
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Name</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredProjects.map(project => {
                        const company = companies.find(c => c.id === project.companyId);
                        return (
                            <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="p-4">
                                    <div className="font-bold text-slate-700 flex items-center gap-2">
                                        {project.name}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                        <CompanyLogo company={company} sizeClass="w-4 h-4" textClass="text-[8px]" />
                                        {company?.name || 'Unknown Company'}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleRestoreProject(project)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Restore Project">
                                            <RotateCcw size={16} />
                                        </button>
                                        <button onClick={() => { if(window.confirm(`Permanently delete "${project.name}" and all of its tasks? This cannot be undone.`)) handlePermanentDeleteProject(project.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Permanently Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
             </table>
         )}
      </div>
    </div>
  );
}