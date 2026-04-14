import React from 'react';
import { BarChart3, X, Link as LinkIcon, Info } from 'lucide-react';

export default function AnalyticsModal({
  editingAnalyticsProperty, setEditingAnalyticsProperty, handleSaveAnalyticsProperty, handleDeleteAnalyticsProperty, setIsAnalyticsModalOpen
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden border-t-4 border-t-orange-500">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-orange-500" size={20} />
            {editingAnalyticsProperty.id ? 'Edit GA4 Property' : 'Connect GA4 Property'}
          </h3>
          <button onClick={() => setIsAnalyticsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm flex gap-3">
              <Info className="flex-shrink-0 mt-0.5 text-blue-600" size={16} />
              <div>
                  <p className="font-bold mb-1">How to connect GA4:</p>
                  <p>Find your 9-digit <b>Property ID</b> in your Google Analytics Admin settings (Admin &gt; Property Settings). After clicking "Connect", you will be asked to grant read-only access to your Google Account.</p>
              </div>
          </div>

          <form id="analyticsForm" onSubmit={handleSaveAnalyticsProperty} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Property Nickname</label>
              <input required type="text" value={editingAnalyticsProperty.name} onChange={(e) => setEditingAnalyticsProperty({...editingAnalyticsProperty, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Main Website" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GA4 Property ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LinkIcon size={14} className="text-slate-400" /></div>
                <input required type="text" value={editingAnalyticsProperty.propertyId || ''} onChange={(e) => setEditingAnalyticsProperty({...editingAnalyticsProperty, propertyId: e.target.value.replace(/[^0-9]/g, '')})} className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono" placeholder="123456789" />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 flex-shrink-0">
          {editingAnalyticsProperty.id && (
             <button type="button" onClick={() => handleDeleteAnalyticsProperty(editingAnalyticsProperty.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto transition-colors">Disconnect</button>
          )}
          <button type="button" onClick={() => setIsAnalyticsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="analyticsForm" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-bold shadow-sm">
              {editingAnalyticsProperty.id ? 'Re-Authenticate' : 'Connect with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}