import React from 'react';
import { X, Youtube } from 'lucide-react';
import { availableColors, colorStyles } from '../../utils/constants';

export default function YoutubeModal({
  editingYoutubeChannel, setEditingYoutubeChannel, handleSaveYoutubeChannel, 
  handleUpdateYoutubeChannel, handleDeleteYoutubeChannel, setIsYoutubeModalOpen
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Youtube className="text-red-600" size={20} />
            {editingYoutubeChannel.id ? 'Edit Channel' : 'Add New Channel'}
          </h3>
          <button onClick={() => setIsYoutubeModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <form id="youtubeForm" onSubmit={(e) => editingYoutubeChannel.id ? handleUpdateYoutubeChannel(e) : handleSaveYoutubeChannel(e)} className="p-6 overflow-y-auto space-y-6">
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Channel Name (Internal Label)</label>
              <input required type="text" value={editingYoutubeChannel.name} onChange={(e) => setEditingYoutubeChannel({...editingYoutubeChannel, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g., My Gaming Channel" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Channel Color (For Calendar)</label>
            <div className="flex flex-wrap gap-3">
              {availableColors.map(color => (
                <button key={color} type="button" onClick={() => setEditingYoutubeChannel({...editingYoutubeChannel, color})} className={`w-8 h-8 rounded-full transition-transform ${colorStyles[color].bar} ${editingYoutubeChannel.color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'}`} aria-label={color} />
              ))}
            </div>
          </div>

          {!editingYoutubeChannel.id ? (
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
               <p className="text-sm text-slate-600">
                 Clicking the button below will redirect you to Google to securely authorize access to your YouTube Analytics. You will automatically return here once connected.
               </p>
             </div>
          ) : (
             <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-6">
               <p className="text-xs text-red-800 font-medium">Need to refresh the connection?</p>
               <button type="button" onClick={handleSaveYoutubeChannel} className="mt-2 text-xs font-bold bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-100 transition-colors">Reconnect Google Auth</button>
             </div>
          )}
        </form>
        <div className="p-6 border-t border-slate-100 flex-shrink-0 flex justify-end gap-3">
          {editingYoutubeChannel.id && (
            <button type="button" onClick={() => handleDeleteYoutubeChannel(editingYoutubeChannel.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
          )}
          <button type="button" onClick={() => setIsYoutubeModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
          <button type="submit" form="youtubeForm" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">{editingYoutubeChannel.id ? 'Save Settings' : 'Connect Account'}</button>
        </div>
      </div>
    </div>
  );
}