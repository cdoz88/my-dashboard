import React from 'react';
import { X, Mic } from 'lucide-react';

export default function SpreakerModal({
  editingSpreakerShow, handleSaveSpreakerShow,
  handleDeleteSpreakerShow, setIsSpreakerModalOpen
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Mic className="text-[#ffc005]" size={20} />
            {editingSpreakerShow?.id ? 'Manage Podcast' : 'Connect Spreaker'}
          </h3>
          <button onClick={() => setIsSpreakerModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <div className="p-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">
              {editingSpreakerShow?.id 
                ? `You are managing "${editingSpreakerShow.name}". If stats aren't updating, you can reconnect your account using the button below.`
                : "Click below to securely connect your Spreaker account. We will automatically import all of your podcasts and their performance statistics."}
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
          {editingSpreakerShow?.id && (
            <button type="button" onClick={() => handleDeleteSpreakerShow(editingSpreakerShow.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
          )}
          <button type="button" onClick={() => setIsSpreakerModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
          <button type="button" onClick={handleSaveSpreakerShow} className="px-4 py-2 bg-[#ffc005] hover:bg-[#e6ad04] text-slate-900 rounded-lg font-bold">
            {editingSpreakerShow?.id ? 'Reconnect Account' : 'Connect Account'}
          </button>
        </div>
      </div>
    </div>
  );
}