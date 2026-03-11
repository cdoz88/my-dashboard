import React from 'react';
import { X } from 'lucide-react';

export default function YoutubeModal({
  editingYoutubeChannel, setEditingYoutubeChannel, handleSaveYoutubeChannel, 
  handleDeleteYoutubeChannel, setIsYoutubeModalOpen
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800">{editingYoutubeChannel.id ? 'Edit Channel' : 'Add New Channel'}</h3>
          <button onClick={() => setIsYoutubeModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <form id="youtubeForm" onSubmit={handleSaveYoutubeChannel} className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Channel Name (Internal Label)</label>
              <input required type="text" value={editingYoutubeChannel.name} onChange={(e) => setEditingYoutubeChannel({...editingYoutubeChannel, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g., My Gaming Channel" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">OAuth Refresh Token</label>
              <input required type="text" value={editingYoutubeChannel.refreshToken || ''} onChange={(e) => setEditingYoutubeChannel({...editingYoutubeChannel, refreshToken: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="1//04J8SdfMd..." />
              <p className="text-xs text-slate-500 mt-2">Paste the Refresh Token generated from the Google OAuth Playground.</p>
            </div>
          </div>
        </form>
        <div className="p-6 mt-2 flex justify-end gap-3 border-t border-slate-100 flex-shrink-0">
          {editingYoutubeChannel.id && (
            <button type="button" onClick={() => handleDeleteYoutubeChannel(editingYoutubeChannel.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
          )}
          <button type="button" onClick={() => setIsYoutubeModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
          <button type="submit" form="youtubeForm" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">{editingYoutubeChannel.id ? 'Save Changes' : 'Add Channel'}</button>
        </div>
      </div>
    </div>
  );
}