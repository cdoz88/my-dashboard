import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tv, Users, Link2, AlignLeft, Info } from 'lucide-react';

export default function ShowModal({ isOpen, onClose, onSave, show = null, youtubeChannels = [], users = [], currentUser }) {
  const [formData, setFormData] = useState({
    title: '',
    channelId: youtubeChannels.length > 0 ? youtubeChannels[0].id : '',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '12:00',
    isLive: false,
    studio: 'Studio 1',
    guestLink: '',
    notes: '',
    userIds: [],
    status: 'Active'
  });

  useEffect(() => {
    if (show && isOpen) {
      setFormData({
        title: show.title || '',
        channelId: show.channelId || (youtubeChannels.length > 0 ? youtubeChannels[0].id : ''),
        showDate: show.showDate || new Date().toISOString().split('T')[0],
        showTime: show.showTime || '12:00',
        isLive: show.isLive ? true : false,
        studio: show.studio || 'Studio 1',
        guestLink: show.guestLink || '',
        notes: show.notes || '',
        userIds: show.userIds || [],
        status: show.status || 'Active'
      });
    } else if (isOpen) {
      setFormData({
        title: '',
        channelId: youtubeChannels.length > 0 ? youtubeChannels[0].id : '',
        showDate: new Date().toISOString().split('T')[0],
        showTime: '12:00',
        isLive: false,
        studio: 'Studio 1',
        guestLink: '',
        notes: '',
        userIds: [],
        status: 'Active'
      });
    }
  }, [show, isOpen, youtubeChannels]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: show ? show.id : 'show_' + Date.now()
    });
  };

  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter(id => id !== userId)
        : [...prev.userIds, userId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden my-auto border-t-4 border-t-red-600">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <Tv size={20} />
             </div>
             <div>
                 <h3 className="font-bold text-lg text-slate-800 leading-tight">{show ? 'Edit Show' : 'Schedule New Show'}</h3>
                 <p className="text-xs text-slate-500 font-medium">{show ? 'Update broadcast details' : 'Add to the network calendar'}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Show Title <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="e.g. The Fantasy Forecast" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">YouTube Channel</label>
                <select value={formData.channelId} onChange={e => setFormData({...formData, channelId: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  {youtubeChannels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="Active">Active</option>
                  <option value="Hiatus">On Hiatus</option>
                  <option value="Ended">Ended / Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Calendar size={14}/> Broadcast Date <span className="text-red-500">*</span></label>
                <input required type="date" value={formData.showDate} onChange={e => setFormData({...formData, showDate: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Clock size={14}/> Broadcast Time <span className="text-red-500">*</span></label>
                <input required type="time" value={formData.showTime} onChange={e => setFormData({...formData, showTime: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Studio Location</label>
                <select value={formData.studio} onChange={e => setFormData({...formData, studio: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="Studio 1">Studio 1</option>
                  <option value="Studio 2">Studio 2</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={formData.isLive} onChange={e => setFormData({...formData, isLive: e.target.checked})} className="peer sr-only" />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wider group-hover:text-red-600 transition-colors">Is Live Broadcast?</span>
                </label>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Users size={14}/> Hosts & Talent</label>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {users.map(user => (
                    <label key={user.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded transition-colors border border-transparent hover:border-slate-200">
                      <input type="checkbox" checked={formData.userIds.includes(user.id)} onChange={() => handleUserToggle(user.id)} className="rounded text-red-500 focus:ring-red-500 bg-slate-100 border-slate-300 cursor-pointer" />
                      <span className="text-sm text-slate-700 font-medium truncate">{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Link2 size={14}/> Guest Link / Resource Link</label>
                <input type="text" value={formData.guestLink} onChange={e => setFormData({...formData, guestLink: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="e.g. Streamyard link or Google Doc..." />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1"><AlignLeft size={14}/> Production Notes</label>
                <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Outline, topics, sponsors to mention..."></textarea>
              </div>
            </div>

          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-sm transition-colors">
              {show ? 'Update Show' : 'Schedule Show'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}