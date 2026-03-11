import React from 'react';
import { Youtube, Play, Users, Clock, DollarSign, Zap, UserCircle } from 'lucide-react';
import { formatAVD } from '../../utils/helpers';

export default function YoutubeDashboard({ youtubeChannels, activeYoutubeChannelId, youtubeTimeFilter }) {
  const activeChannel = youtubeChannels.find(c => c.id === activeYoutubeChannelId);
  
  if (!activeChannel) {
    return (
      <div className="p-4 sm:p-8 h-full flex flex-col items-center justify-center bg-slate-50/50">
        <Youtube size={64} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-500">No YouTube Channel Selected</h2>
        <p className="text-slate-400 mt-2 text-center max-w-md">Select a channel from the sidebar or add a new one to see your stats.</p>
      </div>
    );
  }

  let topVideos = [];
  try { 
    if (activeChannel.topVideos) topVideos = JSON.parse(activeChannel.topVideos); 
  } catch(e) { console.error("Could not parse top videos json", e); }

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Youtube className="text-red-600" size={28} />
             {activeChannel.name} Dashboard
          </h2>
          <p className="text-slate-500 text-sm mt-1">Overview of channel performance and estimated revenue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
             <Play size={16} className="text-blue-500" /> Views {youtubeTimeFilter === 'lifetime' ? '(Lifetime)' : `(${youtubeTimeFilter} days)`}
          </div>
          <div className="text-3xl font-bold text-slate-800">{activeChannel.views}</div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
             <Users size={16} className="text-emerald-500" /> Subscribers
          </div>
          <div className="text-3xl font-bold text-slate-800">{activeChannel.subs}</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
             <Clock size={16} className="text-purple-500" /> Watch Time (hrs)
          </div>
          <div className="text-3xl font-bold text-slate-800">{activeChannel.watchTime}</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-amber-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
             <DollarSign size={16} className="text-amber-500" /> Est. Revenue
          </div>
          <div className="text-3xl font-bold text-slate-800">{activeChannel.revenue}</div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4 flex-shrink-0">Realtime (48 hours)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-shrink-0">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Views</p>
            <p className="text-2xl font-bold text-slate-800">{activeChannel.realtimeViews}</p>
          </div>
          <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
            <Zap size={24} className="text-red-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Subscribers</p>
            <p className="text-2xl font-bold text-slate-800">{activeChannel.realtimeSubs}</p>
          </div>
          <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
            <UserCircle size={24} className="text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-shrink-0 mb-8">
         <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <Play size={18} className="text-red-600" /> Top content in this period
            </h3>
         </div>
         
         {topVideos.length > 0 ? (
           <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[600px]">
                <thead>
                   <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white">
                      <th className="p-4 w-12 text-center">#</th>
                      <th className="p-4">Content</th>
                      <th className="p-4 text-right">Avg. view duration</th>
                      <th className="p-4 text-right">Views</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                   {topVideos.map((video, idx) => (
                      <tr key={video.id || idx} className="hover:bg-slate-50 transition-colors group">
                         <td className="p-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                         <td className="p-4">
                            <div className="flex items-center gap-4">
                               {video.thumbnail ? (
                                  <img src={video.thumbnail} alt={video.title} className="w-[120px] h-[68px] object-cover rounded-md shadow-sm border border-slate-200" />
                               ) : (
                                  <div className="w-[120px] h-[68px] bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center">
                                      <Play size={24} className="text-slate-300" />
                                  </div>
                               )}
                               <div className="flex flex-col justify-center">
                                  <p className="text-sm font-bold text-slate-800 line-clamp-2 max-w-md group-hover:text-blue-600 transition-colors leading-snug">{video.title}</p>
                                  <p className="text-xs text-slate-500 mt-1 font-medium">{video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : ''}</p>
                               </div>
                            </div>
                         </td>
                         <td className="p-4 text-right text-sm text-slate-600 font-medium">
                            {formatAVD(video.minutes, video.views)}
                         </td>
                         <td className="p-4 text-right text-sm text-slate-800 font-bold">
                            {Number(video.views || 0).toLocaleString()}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
         ) : (
           <div className="p-12 text-center flex flex-col items-center">
             <Youtube size={32} className="text-slate-300 mb-3" />
             <p className="text-slate-500 font-medium">Video list will populate here when real data is connected.</p>
             <p className="text-xs text-slate-400 mt-1">Make sure you hit the Sync button in the top right.</p>
           </div>
         )}
      </div>
    </div>
  );
}