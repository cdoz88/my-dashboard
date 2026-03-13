import React from 'react';
import { Tv, X, Link as LinkIcon, MapPin, AlignLeft } from 'lucide-react';

export default function ShowModal({
  editingShow, setEditingShow, handleSaveShow, handleDeleteShow, setIsShowModalOpen, youtubeChannels
}) {
  const studios = ['Studio 1', 'Studio 2', 'Studio 3', 'Studio 4', 'Streamyard'];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-red-600">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Tv className="text-red-600" size={20} />{editingShow.id ? 'Edit Show' : 'Schedule Show'}</h3>
          <button onClick={() => setIsShowModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="showForm" onSubmit={handleSaveShow} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Show / Episode Title</label>
              <input required type="text" value={editingShow.title} onChange={(e) => setEditingShow({...editingShow, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g., Weekly Draft Recap" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">YouTube Channel</label>
              <select required value={editingShow.channelId} onChange={(e) => setEditingShow({...editingShow, channelId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50">
                <option value="" disabled>Select a channel</option>
                {youtubeChannels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input required type="date" value={editingShow.showDate} onChange={(e) => setEditingShow({...editingShow, showDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input type="time" required value={editingShow.showTime} onChange={(e) => setEditingShow({...editingShow, showTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Show Format</label>
                 <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button type="button" onClick={() => setEditingShow({...editingShow, isLive: true})} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${editingShow.isLive ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>LIVE</button>
                    <button type="button" onClick={() => setEditingShow({...editingShow, isLive: false})} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${!editingShow.isLive ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>PRE-RECORDED</button>
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> Location / Studio</label>
                <select value={editingShow.studio} onChange={(e) => setEditingShow({...editingShow, studio: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                  {studios.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><LinkIcon size={14} className="text-slate-400"/> Guest Link <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
              <input type="url" value={editingShow.guestLink || ''} onChange={(e) => setEditingShow({...editingShow, guestLink: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="https://streamyard.com/..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><AlignLeft size={14} className="text-slate-400"/> Show Notes / Topics</label>
              <textarea rows="3" value={editingShow.notes || ''} onChange={(e) => setEditingShow({...editingShow, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Talking points, outlines, etc..." />
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          {editingShow.id && <button type="button" onClick={() => handleDeleteShow(editingShow.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
          <button type="button" onClick={() => setIsShowModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="showForm" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">{editingShow.id ? 'Save Changes' : 'Schedule Show'}</button>
        </div>
      </div>
    </div>
  );
}