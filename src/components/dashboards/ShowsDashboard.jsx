import React, { useState } from 'react';
import { Tv, MonitorPlay, ChevronLeft, ChevronRight, Link as LinkIcon, Radio, Trash2, Award } from 'lucide-react';
import { colorStyles } from '../../utils/constants';

export default function ShowsDashboard({ 
  shows, sponsorships, activeShowTab, showDisplayMode, 
  openShowModal, handleDeleteShow, youtubeChannels, users 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [studioFilter, setStudioFilter] = useState('All');

  const getChannel = (id) => youtubeChannels.find(c => c.id === id);
  const getUser = (id) => users.find(u => u.id === id);

  let viewShows = activeShowTab === 'overview' ? shows : shows.filter(s => s.channelId === activeShowTab);
  if (studioFilter !== 'All') {
      viewShows = viewShows.filter(s => s.studio === studioFilter);
  }
  
  const currentChannel = activeShowTab === 'overview' ? null : getChannel(activeShowTab);

  // --- WEEKLY CALENDAR LOGIC ---
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  // Adjust to Monday as start of week (if Sunday, go back 6 days. Otherwise, go back day - 1)
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekDays = Array.from({length: 7}).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
  });

  const prevWeek = () => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
  };

  const nextWeek = () => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Helper to ensure YYYY-MM-DD formatting in local time
  const formatDateStr = (d) => {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const renderWeeklyCalendar = () => {
    return weekDays.map((date, index) => {
        const dateStr = formatDateStr(date);
        const dayShows = viewShows.filter(s => s.showDate === dateStr).sort((a, b) => (a.showTime || '00:00').localeCompare(b.showTime || '00:00'));
        const isToday = dateStr === formatDateStr(new Date());

        return (
            <div key={index} className={`flex flex-col min-h-[600px] border-r border-slate-200 last:border-r-0 bg-slate-50/50 ${isToday ? 'bg-blue-50/30' : ''}`}>
                <div className={`p-3 text-center border-b border-slate-200 sticky top-0 z-10 flex flex-col items-center gap-1 ${isToday ? 'bg-blue-100/50' : 'bg-slate-100'}`}>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{dayNames[index]}</span>
                    <span className={`text-sm font-black w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700'}`}>
                        {date.getDate()}
                    </span>
                </div>
                
                <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
                   {dayShows.map(show => {
                       const channel = getChannel(show.channelId);
                       const cColor = channel?.color || 'slate';
                       const colorClasses = `${colorStyles[cColor]?.bg} ${colorStyles[cColor]?.border} ${colorStyles[cColor]?.text}`;
                       
                       // Check if this show has any active sponsorships assigned to it
                       const hasSponsor = sponsorships.some(sp => (sp.showTitles || []).includes(show.title));

                       return (
                           <button 
                              key={show.id} 
                              onClick={() => openShowModal(show)} 
                              className={`text-left p-2.5 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md shadow-sm bg-white relative ${colorClasses} group`}
                           >
                               <div className="font-bold flex items-center justify-between gap-1 mb-1.5">
                                   <div className="flex items-center gap-1.5 truncate text-[11px]">
                                     {show.isLive ? <Radio size={12} className="animate-pulse" /> : <MonitorPlay size={12} />}
                                     <span className="truncate">{show.showTime ? (() => { let [h, m] = show.showTime.split(':'); let ampm = h >= 12 ? 'PM' : 'AM'; return `${h % 12 || 12}:${m} ${ampm}`; })() : 'TBD'}</span>
                                   </div>
                                   {hasSponsor && <Award size={14} className="text-amber-500 flex-shrink-0 ml-1" title="Sponsored Show" />}
                               </div>
                               <div className="truncate text-xs font-black opacity-90 mb-2 leading-tight">{show.title}</div>
                               <div className="flex items-center justify-between mt-auto pt-1 border-t border-black/5">
                                   <span className="text-[9px] font-semibold opacity-70 truncate">{show.studio}</span>
                                   <div className="flex items-center -space-x-1.5">
                                      {(show.userIds || []).slice(0, 3).map(id => {
                                          const u = getUser(id);
                                          if (!u) return null;
                                          return u.avatarUrl 
                                            ? <img key={id} src={u.avatarUrl} className="w-5 h-5 rounded-full border-2 border-white object-cover" title={u.name} />
                                            : <div key={id} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200 text-[8px] flex items-center justify-center font-bold text-slate-500" title={u.name}>{u.name.charAt(0)}</div>
                                      })}
                                   </div>
                               </div>
                           </button>
                       );
                   })}
                   {dayShows.length === 0 && <div className="text-xs text-slate-400 text-center italic mt-4">No shows</div>}
                </div>
            </div>
        );
    });
  };

  const renderTimeline = () => {
      const sortedShows = [...viewShows].sort((a, b) => new Date(`${a.showDate}T${a.showTime || '00:00'}`) - new Date(`${b.showDate}T${b.showTime || '00:00'}`));

      return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[900px]">
                     <thead className="bg-slate-50 border-b border-slate-200">
                         <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                             <th className="p-4 w-64">Show Info</th>
                             <th className="p-4 w-40">Date & Time</th>
                             <th className="p-4">Cast / Members</th>
                             <th className="p-4 w-40">Format & Studio</th>
                             <th className="p-4 w-32">Guest Link</th>
                             <th className="p-4 w-12 text-right"></th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {sortedShows.length > 0 ? sortedShows.map(show => {
                             const channel = getChannel(show.channelId);
                             const cColor = channel?.color || 'slate';
                             const hasSponsor = sponsorships.some(sp => (sp.showTitles || []).includes(show.title));

                             return (
                                 <tr key={show.id} className="hover:bg-slate-50 transition-colors group">
                                     <td className="p-4">
                                         <div className="font-bold text-slate-800 cursor-pointer hover:text-red-600 transition-colors flex items-center gap-1.5" onClick={() => openShowModal(show)}>
                                            <span className="truncate">{show.title}</span>
                                            {hasSponsor && <Award size={14} className="text-amber-500 flex-shrink-0" title="Sponsored Show" />}
                                         </div>
                                         {activeShowTab === 'overview' && <div className="text-[10px] text-slate-500 mt-0.5">{channel?.name || 'Unknown Channel'}</div>}
                                     </td>
                                     <td className="p-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                                         {new Date(`${show.showDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                         {show.showTime && <span className="text-slate-400 block text-xs mt-0.5">@ {(() => { let [h, m] = show.showTime.split(':'); return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`; })()}</span>}
                                     </td>
                                     <td className="p-4">
                                        <div className="flex items-center -space-x-2">
                                            {(show.userIds || []).map(id => {
                                                const u = getUser(id);
                                                if (!u) return null;
                                                return u.avatarUrl 
                                                    ? <img key={id} src={u.avatarUrl} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" title={u.name} />
                                                    : <div key={id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 shadow-sm" title={u.name}>{u.name.charAt(0)}</div>
                                            })}
                                            {(show.userIds || []).length === 0 && <span className="text-xs text-slate-400 italic">No members assigned</span>}
                                        </div>
                                     </td>
                                     <td className="p-4">
                                         <div className="flex flex-col gap-1.5 items-start">
                                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${colorStyles[cColor]?.bg} ${colorStyles[cColor]?.border} ${colorStyles[cColor]?.text}`}>
                                                 {show.isLive ? <Radio size={10} /> : <MonitorPlay size={10} />} {show.isLive ? 'LIVE' : 'PRE-RECORDED'}
                                             </span>
                                             <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{show.studio}</span>
                                         </div>
                                     </td>
                                     <td className="p-4">
                                         {show.guestLink ? (
                                             <a href={show.guestLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded w-fit whitespace-nowrap">
                                                 <LinkIcon size={12} /> Join Link
                                             </a>
                                         ) : <span className="text-xs text-slate-400 italic">No link</span>}
                                     </td>
                                     <td className="p-4 text-right">
                                         <button onClick={() => handleDeleteShow(show.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 size={16}/></button>
                                     </td>
                                 </tr>
                             )
                         }) : (<tr><td colSpan="6" className="p-8 text-center text-slate-500">No shows scheduled.</td></tr>)}
                     </tbody>
                 </table>
             </div>
          </div>
      );
  };

  const renderList = () => {
      // Create a unique array by grabbing the very first instance of each show title
      const uniqueMap = new Map();
      viewShows.forEach(s => {
          if (!uniqueMap.has(s.title)) {
              uniqueMap.set(s.title, s);
          }
      });
      const uniqueShows = Array.from(uniqueMap.values()).sort((a, b) => a.title.localeCompare(b.title));

      return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[900px]">
                     <thead className="bg-slate-50 border-b border-slate-200">
                         <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                             <th className="p-4 w-64">Show Info</th>
                             <th className="p-4 w-40">Typical Time</th>
                             <th className="p-4">Cast / Members</th>
                             <th className="p-4 w-40">Format & Studio</th>
                             <th className="p-4 w-32">Guest Link</th>
                             <th className="p-4 w-12 text-right"></th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {uniqueShows.length > 0 ? uniqueShows.map(show => {
                             const channel = getChannel(show.channelId);
                             const cColor = channel?.color || 'slate';
                             const hasSponsor = sponsorships.some(sp => (sp.showTitles || []).includes(show.title));

                             return (
                                 <tr key={show.id} className="hover:bg-slate-50 transition-colors group">
                                     <td className="p-4">
                                         <div className="font-bold text-slate-800 cursor-pointer hover:text-red-600 transition-colors flex items-center gap-1.5" onClick={() => openShowModal(show)}>
                                            <span className="truncate">{show.title}</span>
                                            {hasSponsor && <Award size={14} className="text-amber-500 flex-shrink-0" title="Sponsored Show" />}
                                         </div>
                                         {activeShowTab === 'overview' && <div className="text-[10px] text-slate-500 mt-0.5">{channel?.name || 'Unknown Channel'}</div>}
                                     </td>
                                     <td className="p-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                                         <span className="text-slate-400 block text-xs mb-0.5">Time:</span>
                                         {show.showTime ? (() => { let [h, m] = show.showTime.split(':'); return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`; })() : 'TBD'}
                                     </td>
                                     <td className="p-4">
                                        <div className="flex items-center -space-x-2">
                                            {(show.userIds || []).map(id => {
                                                const u = getUser(id);
                                                if (!u) return null;
                                                return u.avatarUrl 
                                                    ? <img key={id} src={u.avatarUrl} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" title={u.name} />
                                                    : <div key={id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 shadow-sm" title={u.name}>{u.name.charAt(0)}</div>
                                            })}
                                            {(show.userIds || []).length === 0 && <span className="text-xs text-slate-400 italic">No members assigned</span>}
                                        </div>
                                     </td>
                                     <td className="p-4">
                                         <div className="flex flex-col gap-1.5 items-start">
                                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${colorStyles[cColor]?.bg} ${colorStyles[cColor]?.border} ${colorStyles[cColor]?.text}`}>
                                                 {show.isLive ? <Radio size={10} /> : <MonitorPlay size={10} />} {show.isLive ? 'LIVE' : 'PRE-RECORDED'}
                                             </span>
                                             <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{show.studio}</span>
                                         </div>
                                     </td>
                                     <td className="p-4">
                                         {show.guestLink ? (
                                             <a href={show.guestLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded w-fit whitespace-nowrap">
                                                 <LinkIcon size={12} /> Join Link
                                             </a>
                                         ) : <span className="text-xs text-slate-400 italic">No link</span>}
                                     </td>
                                     <td className="p-4 text-right">
                                         <button onClick={() => handleDeleteShow(show.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 size={16}/></button>
                                     </td>
                                 </tr>
                             )
                         }) : (<tr><td colSpan="6" className="p-8 text-center text-slate-500">No shows recorded yet.</td></tr>)}
                     </tbody>
                 </table>
             </div>
          </div>
      );
  };

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Tv className="text-red-600" size={28} />
             {activeShowTab === 'overview' ? 'Network Schedule' : `${currentChannel?.name} Schedule`}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage your Live and Pre-recorded broadcast dates.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <label className="text-sm font-medium text-slate-600">Studio:</label>
           <select value={studioFilter} onChange={(e) => setStudioFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm">
              <option value="All">All Studios</option>
              <option value="Studio 1">Studio 1</option>
              <option value="Studio 2">Studio 2</option>
              <option value="Studio 3">Studio 3</option>
              <option value="Studio 4">Studio 4</option>
              <option value="Streamyard">Streamyard</option>
           </select>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {showDisplayMode === 'calendar' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col flex-1 min-h-[600px] overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h3 className="text-lg font-bold text-slate-800">
                        Week of {startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={prevWeek} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 hover:bg-slate-100 rounded-lg text-sm font-bold text-slate-600 transition-colors">Today</button>
                        <button onClick={nextWeek} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 border border-slate-200 rounded-lg overflow-x-auto flex-1 min-w-[800px]">
                    {renderWeeklyCalendar()}
                </div>
            </div>
        )}
        {showDisplayMode === 'timeline' && renderTimeline()}
        {showDisplayMode === 'list' && renderList()}
      </div>
    </div>
  );
}