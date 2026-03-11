import React from 'react';
import { X } from 'lucide-react';

export default function SpreakerModal({
  editingSpreakerShow, setEditingSpreakerShow, handleSaveSpreakerShow,
  handleDeleteSpreakerShow, setIsSpreakerModalOpen
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800">{editingSpreakerShow.id ? 'Edit Show' : 'Add New Show'}</h3>
          <button onClick={() => setIsSpreakerModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <form id="spreakerForm" onSubmit={handleSaveSpreakerShow} className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Show Name (Internal Label)</label>
              <input required type="text" value={editingSpreakerShow.name} onChange={(e) => setEditingSpreakerShow({...editingSpreakerShow, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffc005]" placeholder="e.g., My Podcast" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Developer Token / App Token</label>
              <input required type="text" value={editingSpreakerShow.apiToken || ''} onChange={(e) => setEditingSpreakerShow({...editingSpreakerShow, apiToken: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffc005]" placeholder="Paste Spreaker API Token..." />
              <p className="text-xs text-slate-500 mt-2">Generate this from your Spreaker Developer Portal.</p>
            </div>
          </div>
        </form>
        <div className="p-6 mt-2 flex justify-end gap-3 border-t border-slate-100 flex-shrink-0">
          {editingSpreakerShow.id && (
            <button type="button" onClick={() => handleDeleteSpreakerShow(editingSpreakerShow.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
          )}
          <button type="button" onClick={() => setIsSpreakerModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
          <button type="submit" form="spreakerForm" className="px-4 py-2 bg-[#ffc005] hover:bg-[#e6ad04] text-slate-900 rounded-lg font-bold">{editingSpreakerShow.id ? 'Save Changes' : 'Add Show'}</button>
        </div>
      </div>
    </div>
  );
}