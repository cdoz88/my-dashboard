import React from 'react';
import { X } from 'lucide-react';
import { availableColors, colorStyles, availableIcons } from '../../utils/constants';
import DynamicIcon from '../shared/DynamicIcon';

export default function ProjectModal({
  editingProject, setEditingProject, handleSaveProject, handleArchiveProject,
  handlePermanentDeleteProject, setIsProjectModalOpen, visibleCompanies
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
          <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <form id="projectForm" onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
            <input required type="text" value={editingProject.name} onChange={(e) => setEditingProject({...editingProject, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Website Redesign" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <select required value={editingProject.companyId} onChange={(e) => setEditingProject({...editingProject, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="" disabled>Select a company</option>
              {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Color</label>
            <div className="flex flex-wrap gap-3">
              {availableColors.map(color => (
                <button key={color} type="button" onClick={() => setEditingProject({...editingProject, color})} className={`w-8 h-8 rounded-full transition-transform ${colorStyles[color].bar} ${editingProject.color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'}`} aria-label={color} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Icon</label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
              {availableIcons.map(iconName => (
                <button key={iconName} type="button" onClick={() => setEditingProject({...editingProject, icon: iconName})} className={`p-2 rounded-lg flex items-center justify-center transition-colors ${editingProject.icon === iconName ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-white text-slate-500 border border-transparent hover:border-slate-300 hover:bg-slate-100'}`}>
                  <DynamicIcon name={iconName} size={20} />
                </button>
              ))}
            </div>
          </div>
        </form>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          {editingProject.id && (
            editingProject.isArchived 
              ? <button type="button" onClick={() => handlePermanentDeleteProject(editingProject.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete Forever</button>
              : <button type="button" onClick={() => handleArchiveProject(editingProject)} className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg font-medium mr-auto">Archive</button>
          )}
          <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
          <button type="submit" form="projectForm" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{editingProject.id ? 'Save Changes' : 'Create Project'}</button>
        </div>
      </div>
    </div>
  );
}