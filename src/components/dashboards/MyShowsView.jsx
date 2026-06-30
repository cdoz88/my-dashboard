import React from 'react';
import { Tv, Calendar, Clock, Video, Youtube } from 'lucide-react';

export default function MyShowsView({ shows, currentUser, openShowModal, youtubeChannels }) {
  const myShows = (shows || [])
    .filter(s => s.userIds?.includes(currentUser?.id) && s.status !== 'Archived')
    .sort((a, b) => new Date(`${a.showDate}T${a.showTime || '00:00'}`) - new Date(`${b.showDate}T${b.showTime || '00:00'}`));

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingShows = myShows.filter(s => s.showDate >= todayStr);
  const pastShows = myShows.filter(s => s.showDate < todayStr).reverse();

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
      <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Tv className="text-red-600" size={28} />
                My Upcoming Shows
              </h2>
              <p className="text-slate-500 text-sm mt-1">Your personal schedule of assigned YouTube content.</p>
            </div>
         </div>

         {/* UPCOMING SHOWS */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
           <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">Upcoming Schedule</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left min-w-[700px]">
                <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Show Title</th>
                    <th className="px-6 py-4">Channel</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4 text-center">Format</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcomingShows.length > 0 ? upcomingShows.map(show => {
                     const channel = youtubeChannels?.find(c => c.id === show.channelId);
                     return (
                       <tr key={show.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-bold text-slate-800">{show.title}</td>
                         <td className="px-6 py-4 text-slate-600 font-medium flex items-center gap-2">
                            <Youtube size={16} className={`text-${channel?.color || 'red'}-500`} />
                            {channel?.name || 'Unknown Channel'}
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex flex-col">
                             <span className="font-semibold text-slate-700 flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> {new Date(`${show.showDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                             {show.showTime && <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5"><Clock size={12} className="text-slate-400"/> {show.showTime}</span>}
                           </div>
                         </td>
                         <td className="px-6 py-4 text-center">
                           {show.isLive ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live</span>
                           ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider"><Video size={12} /> Pre-Taped</span>
                           )}
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button onClick={() => openShowModal(show, 'episode')} className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">View Details</button>
                         </td>
                       </tr>
                     )
                  }) : (
                     <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500"><Tv size={48} className="mx-auto mb-3 opacity-20"/> No upcoming shows assigned to you.</td></tr>
                  )}
                </tbody>
             </table>
           </div>
         </div>

         {/* RECENT / PAST SHOWS */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 opacity-70 hover:opacity-100 transition-opacity">
           <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">Past Shows</h3>
           </div>
           <div className="overflow-x-auto max-h-96 overflow-y-auto">
             <table className="w-full text-sm text-left min-w-[700px]">
                <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Show Title</th>
                    <th className="px-6 py-4">Channel</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pastShows.length > 0 ? pastShows.map(show => {
                     const channel = youtubeChannels?.find(c => c.id === show.channelId);
                     return (
                       <tr key={show.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-bold text-slate-800">{show.title}</td>
                         <td className="px-6 py-4 text-slate-600 font-medium flex items-center gap-2">
                            <Youtube size={16} className={`text-${channel?.color || 'red'}-500`} />
                            {channel?.name || 'Unknown Channel'}
                         </td>
                         <td className="px-6 py-4">
                           <span className="font-semibold text-slate-700">{new Date(`${show.showDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button onClick={() => openShowModal(show, 'episode')} className="text-slate-500 hover:text-blue-600 font-bold text-xs bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">View Record</button>
                         </td>
                       </tr>
                     )
                  }) : (
                     <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No past shows in the system.</td></tr>
                  )}
                </tbody>
             </table>
           </div>
         </div>

      </div>
    </div>
  );
}