import React, { useState } from 'react';
import { Award, X, Camera, Plus, Building2, Upload, RefreshCw, FileText, Download, Trash2 } from 'lucide-react';
import { API_URL } from '../../utils/constants';

export default function SponsorshipModal({
  editingSponsorship, setEditingSponsorship, handleSaveSponsorship, handleDeleteSponsorship, 
  setIsSponsorshipModalOpen, visibleCompanies, isUploading, handleSponsorshipLogoUpload, shows, events,
  currentUser, handleSponsorshipAssetUpload, removeSponsorshipAsset
}) {
  const [customElement, setCustomElement] = useState('');
  const standardElements = ['Show mention', 'Rookie guide', 'Event materials', 'Website ads'];
  
  const availableShowTitles = Array.from(new Set(shows.map(s => s.title))).filter(Boolean);
  const availableEventTitles = Array.from(new Set(events.map(e => e.title))).filter(Boolean);

  const toggleElement = (element) => {
      const current = editingSponsorship.elements || [];
      const updated = current.includes(element) ? current.filter(e => e !== element) : [...current, element];
      setEditingSponsorship({ ...editingSponsorship, elements: updated });
  };

  const addCustomElement = () => {
      if (!customElement.trim()) return;
      const current = editingSponsorship.elements || [];
      if (!current.includes(customElement.trim())) {
          setEditingSponsorship({ ...editingSponsorship, elements: [...current, customElement.trim()] });
      }
      setCustomElement('');
  };

  const toggleShowTitle = (title) => {
      const current = editingSponsorship.showTitles || [];
      const updated = current.includes(title) ? current.filter(t => t !== title) : [...current, title];
      setEditingSponsorship({ ...editingSponsorship, showTitles: updated });
  };

  const toggleEventTitle = (title) => {
      const current = editingSponsorship.eventTitles || [];
      const updated = current.includes(title) ? current.filter(t => t !== title) : [...current, title];
      setEditingSponsorship({ ...editingSponsorship, eventTitles: updated });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-amber-500">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Award className="text-amber-500" size={20} />{editingSponsorship.id ? 'Edit Sponsorship' : 'Add Sponsorship'}</h3>
          <button onClick={() => setIsSponsorshipModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="sponsorshipForm" onSubmit={handleSaveSponsorship} className="space-y-6">
            
            <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                    {editingSponsorship.logoUrl ? (
                        <img src={editingSponsorship.logoUrl} className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm bg-white" />
                    ) : (
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center"><Building2 size={32} className="text-slate-400" /></div>
                    )}
                    <label className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-amber-600 shadow-md transition-colors" title="Upload Logo">
                        <Camera size={14} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleSponsorshipLogoUpload} disabled={isUploading} />
                    </label>
                </div>
                <div className="flex-1 space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sponsor / Brand Name</label>
                        <input required type="text" value={editingSponsorship.name} onChange={(e) => setEditingSponsorship({...editingSponsorship, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g., DraftKings" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company (Internal Owner)</label>
                        <select required value={editingSponsorship.companyId} onChange={(e) => setEditingSponsorship({...editingSponsorship, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50">
                            <option value="" disabled>Select a company</option>
                            {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-2 ${currentUser?.isAdmin ? 'md:grid-cols-4' : ''} gap-4 pt-4 border-t border-slate-100`}>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input required type="date" value={editingSponsorship.startDate} onChange={(e) => setEditingSponsorship({...editingSponsorship, startDate: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input required type="date" value={editingSponsorship.endDate} onChange={(e) => setEditingSponsorship({...editingSponsorship, endDate: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              {currentUser?.isAdmin && (
                  <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Deal Amount</label>
                        <input required type="number" step="0.01" min="0" value={editingSponsorship.amount} onChange={(e) => setEditingSponsorship({...editingSponsorship, amount: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="5000.00" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payment</label>
                        <select value={editingSponsorship.paymentStatus} onChange={(e) => setEditingSponsorship({...editingSponsorship, paymentStatus: e.target.value})} className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold ${editingSponsorship.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                        </select>
                      </div>
                  </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Connected Shows</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
                            {availableShowTitles.length > 0 ? availableShowTitles.map(title => (
                                <label key={`show-${title}`} className="flex items-center gap-3 p-1.5 hover:bg-white rounded-md cursor-pointer transition-colors">
                                    <input type="checkbox" checked={(editingSponsorship.showTitles || []).includes(title)} onChange={() => toggleShowTitle(title)} className="w-4 h-4 accent-amber-500 rounded" />
                                    <span className="text-sm font-medium text-slate-700">{title}</span>
                                </label>
                            )) : <span className="text-xs text-slate-400 italic p-2 block">No shows exist yet.</span>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Connected Events</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
                            {availableEventTitles.length > 0 ? availableEventTitles.map(title => (
                                <label key={`event-${title}`} className="flex items-center gap-3 p-1.5 hover:bg-white rounded-md cursor-pointer transition-colors">
                                    <input type="checkbox" checked={(editingSponsorship.eventTitles || []).includes(title)} onChange={() => toggleEventTitle(title)} className="w-4 h-4 accent-amber-500 rounded" />
                                    <span className="text-sm font-medium text-slate-700">{title}</span>
                                </label>
                            )) : <span className="text-xs text-slate-400 italic p-2 block">No events exist yet.</span>}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Deliverables / Elements</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {standardElements.map(el => (
                            <button key={el} type="button" onClick={() => toggleElement(el)} className={`px-2 py-1 rounded text-xs font-semibold transition-colors border ${editingSponsorship.elements?.includes(el) ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
                                {el}
                            </button>
                        ))}
                        {(editingSponsorship.elements || []).filter(e => !standardElements.includes(e)).map(el => (
                             <button key={el} type="button" onClick={() => toggleElement(el)} className="px-2 py-1 rounded text-xs font-semibold transition-colors border bg-amber-100 text-amber-700 border-amber-300 flex items-center gap-1">
                                {el} <X size={10} />
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input type="text" value={customElement} onChange={(e) => setCustomElement(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomElement(); } }} placeholder="Custom option..." className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <button type="button" onClick={addCustomElement} className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors">Add</button>
                    </div>
                </div>
            </div>

            {/* ONLY ADMINS SEE THE INTERNAL CONTACT DETAILS */}
            <div className={`grid grid-cols-1 ${currentUser?.isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-4 pt-4 border-t border-slate-100`}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Promo Code / Link</label>
                <input type="text" value={editingSponsorship.promoCode || ''} onChange={(e) => setEditingSponsorship({...editingSponsorship, promoCode: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g., Code: FFAN20" />
              </div>
              {currentUser?.isAdmin && (
                  <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                        <input type="text" value={editingSponsorship.contactName || ''} onChange={(e) => setEditingSponsorship({...editingSponsorship, contactName: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                        <input type="email" value={editingSponsorship.contactEmail || ''} onChange={(e) => setEditingSponsorship({...editingSponsorship, contactEmail: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="john@brand.com" />
                      </div>
                  </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad Copy / Specific Notes</label>
              <textarea rows="3" value={editingSponsorship.notes || ''} onChange={(e) => setEditingSponsorship({...editingSponsorship, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Paste script requirements or tracking details here..." />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2">Assets & Creatives</label>
              <div className="space-y-3">
                <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? <RefreshCw className="w-6 h-6 text-amber-500 mb-2 animate-spin" /> : <Upload className="w-6 h-6 text-slate-400 mb-2" />}
                    <p className="text-sm text-slate-500">
                       {isUploading ? <span className="font-semibold text-amber-600">Uploading asset...</span> : <><span className="font-semibold">Click to upload graphics</span></>}
                    </p>
                  </div>
                  <input type="file" className="hidden" multiple onChange={handleSponsorshipAssetUpload} disabled={isUploading} />
                </label>
                
                {(editingSponsorship.files || []).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {editingSponsorship.files.map((file, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square flex items-center justify-center">
                        {file.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || file.url.startsWith('data:image') ? (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center p-2 text-center">
                            <FileText size={24} className="text-slate-400 mb-1" />
                            <span className="text-[10px] text-slate-500 truncate w-full">{file.name}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <a href={`${API_URL}?action=download&file=${encodeURIComponent(file.url)}&name=${encodeURIComponent(file.name)}`} title="Force Download" className="p-2 bg-white text-amber-600 rounded-md hover:bg-amber-50 shadow-sm"><Download size={16} strokeWidth={2.5} /></a>
                           <button type="button" onClick={() => removeSponsorshipAsset(index)} className="p-2 bg-white text-red-600 rounded-md hover:bg-red-50 shadow-sm"><Trash2 size={16} strokeWidth={2.5} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </form>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          {editingSponsorship.id && <button type="button" onClick={() => handleDeleteSponsorship(editingSponsorship.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
          <button type="button" onClick={() => setIsSponsorshipModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="sponsorshipForm" disabled={isUploading} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg transition-colors font-bold shadow-sm">{editingSponsorship.id ? 'Save Changes' : 'Add Sponsorship'}</button>
        </div>
      </div>
    </div>
  );
}