import React from 'react';
import { Tv, X, Link as LinkIcon, MapPin, AlignLeft, Users, UserCircle, ToggleRight, ToggleLeft, Award, ExternalLink } from 'lucide-react';

export default function ShowModal({
  editingShow, setEditingShow, handleSaveShow, handleDeleteShow, setIsShowModalOpen, youtubeChannels, users,
  sponsorships, openSponsorshipModal
}) {
  const studios = ['Studio 1', 'Studio 2', 'Studio 3', 'Studio 4', 'Streamyard'];

  const showSponsors = (sponsorships || []).filter(sp => (sp.showTitles || []).includes(editingShow.title));

  // Time parsing logic to switch from generic 24hr picker to custom 15-minute intervals
  const timeParts = editingShow.showTime ? editingShow.showTime.split(':') : ['12', '00'];
  let showH = parseInt(timeParts[0], 10);
  const showM = timeParts[1] || '00';
  const showAmPm = showH >= 12 ? 'PM' : 'AM';
  showH = showH % 12 || 12;

  const updateTime = (newH, newM, newAmPm) => {
      let hrs = parseInt(newH, 10);
      if (newAmPm === 'PM' && hrs !== 12) hrs += 12;
      if (newAmPm === 'AM' && hrs === 12) hrs = 0;
      setEditingShow({...editingShow, showTime: `${String(hrs).padStart(2, '0')}:${newM}`});
  };

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
                <div className="flex gap-2">
                    <select value={String(showH)} onChange={(e) => updateTime(e.target.value, showM, showAmPm)} className="w-1/3 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                        {[...Array(12)].map((_,i) => <option key={i+1} value={String(i+1)}>{i+1}</option>)}
                    </select>
                    <span className="text-slate-500 font-bold py-2">:</span>
                    <select value={showM} onChange={(e) => updateTime(String(showH), e.target.value, showAmPm)} className="w-1/3 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                        <option value="00">00</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                    </select>
                    <select value={showAmPm} onChange={(e) => updateTime(String(showH), showM, e.target.value)} className="w-1/3 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
              </div>
            </div>

            {!editingShow.id && (
               <div className="pt-2 border-b border-slate-100 pb-4">
                   <div className="flex items-center justify-between mb-2">
                       <div><div className="text-sm font-bold text-slate-800">Repeat Weekly</div><div className="text-[10px] text-slate-500">Auto-generates upcoming episodes for this show.</div></div>
                       <button type="button" onClick={() => setEditingShow({...editingShow, isRecurring: !editingShow.isRecurring})} className={`${editingShow.isRecurring ? 'text-red-600' : 'text-slate-300'} transition-colors`}>{editingShow.isRecurring ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}</button>
                   </div>
                   {editingShow.isRecurring && (
                       <div className="flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                           <span className="text-sm font-medium text-red-800 flex-shrink-0">Occurrences:</span>
                           <input type="number" min="0" value={editingShow.occurrences} onChange={(e) => setEditingShow({...editingShow, occurrences: parseInt(e.target.value) || 0})} className="w-16 px-2 py-1 text-sm border border-red-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500 font-bold text-center" />
                           <span className="text-xs font-medium text-red-600 flex-shrink-0">(0 = 1 Year / 52 Weeks)</span>
                       </div>
                   )}
               </div>
            )}

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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5"><Users size={14} className="text-slate-400" /> Show Cast / Members</label>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
                {users.map(u => (
                  <label key={u.id} className="flex items-center gap-3 p-1.5 hover:bg-white rounded-md cursor-pointer transition-colors">
                    <input type="checkbox" checked={editingShow.userIds?.includes(u.id) || false} onChange={(e) => {
                       const newIds = e.target.checked 
                          ? [...(editingShow.userIds || []), u.id]
                          : (editingShow.userIds || []).filter(id => id !== u.id);
                       setEditingShow({...editingShow, userIds: newIds});
                    }} className="w-4 h-4 accent-red-600 rounded" />
                    {u.avatarUrl ? <img src={u.avatarUrl} className="w-6 h-6 rounded-full object-cover bg-white" /> : <UserCircle size={24} className="text-slate-400" />}
                    <span className="text-sm font-medium text-slate-700">{u.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><LinkIcon size={14} className="text-slate-400"/> Guest Link <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
              <input type="url" value={editingShow.guestLink || ''} onChange={(e) => setEditingShow({...editingShow, guestLink: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="https://streamyard.com/..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><AlignLeft size={14} className="text-slate-400"/> Show Notes / Topics</label>
              <textarea rows="3" value={editingShow.notes || ''} onChange={(e) => setEditingShow({...editingShow, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Talking points, outlines, etc..." />
            </div>

            {showSponsors.length > 0 && (
               <div className="pt-4 border-t border-slate-100">
                 <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5"><Award size={14} className="text-amber-500" /> Active Sponsors</label>
                 <div className="flex flex-col gap-2">
                    {showSponsors.map(sp => (
                        <button 
                            key={sp.id} 
                            type="button" 
                            onClick={() => { setIsShowModalOpen(false); openSponsorshipModal(sp); }} 
                            className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-lg hover:bg-amber-100 transition-colors text-left group"
                        >
                            <div>
                               <div className="font-bold text-amber-800 text-sm group-hover:text-amber-900">{sp.name}</div>
                               <div className="text-[10px] text-amber-600 mt-0.5 font-semibold bg-amber-200/50 px-1.5 py-0.5 rounded w-fit">{sp.promoCode ? `Promo: ${sp.promoCode}` : 'View Deliverables'}</div>
                            </div>
                            <ExternalLink size={16} className="text-amber-500 group-hover:text-amber-600" />
                        </button>
                    ))}
                 </div>
               </div>
            )}

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