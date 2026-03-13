import React, { useState } from 'react';
import { Tv, MonitorPlay, ChevronLeft, ChevronRight, Link as LinkIcon, Radio, Trash2 } from 'lucide-react';
import { colorStyles } from '../../utils/constants';

export default function ShowsDashboard({ 
  shows, activeShowTab, showDisplayMode, 
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

  // Calendar Logic
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDayOfWeek = startOfMonth.getDay(); 
  const daysInMonth = endOfMonth.getDate();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="bg-slate-50/50 p-2 min-h-[120px] border border-slate-100"></div>);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayShows = viewShows.filter(s => s.showDate === dateStr).sort((a, b) => a.showTime.localeCompare(b.showTime));
        const isToday = dateStr === new Date().toISOString().split('T')[0];

        days.push(
            <div key={i} className={`bg-white p-2 min-h-[120px] border border-slate-200 flex flex-col relative group transition-colors hover:bg-slate-50 ${isToday ? 'ring-2 ring-inset ring-red-500 z-10' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-red-500 text-white' : 'text-slate-400'}`}>{i}</span>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
                   {dayShows.map(show => {
                       const channel = getChannel(show.channelId);
                       const cColor = channel?.color || 'slate';
                       const colorClasses = `${colorStyles[cColor]?.bg} ${colorStyles[cColor]?.border} ${colorStyles[cColor]?.text}`;

                       return (
                           <button 
                              key={show.id} 
                              onClick={() => openShowModal(show)} 
                              className={`text-left text-[10px] p-1.5 rounded-md border truncate transition-all hover:scale-[1.02] shadow-sm ${colorClasses}`}
                              title={`${show.title} - ${show.studio}`}
                           >
                               <div className="font-bold flex items-center justify-between gap-1">
                                   <div className="flex items-center gap-1 truncate">
                                     {show.isLive ? <Radio size={10} className="animate-pulse" /> : <MonitorPlay size={10} />}
                                     <span className="truncate">{show.showTime ? (() => { let [h, m] = show.showTime.split(':'); let ampm = h >= 12 ? 'PM' : 'AM'; return `${h % 12 || 12}:${m} ${ampm}`; })() : 'TBD'}</span>
                                   </div>
                                   <div className="flex items-center -space-x-1">
                                      {(show.userIds || []).slice(0, 3).map(id => {
                                          const u = getUser(id);
                                          if (!u) return null;
                                          return u.avatarUrl 
                                            ? <img key={id} src={u.avatarUrl} className="w-4 h-4 rounded-full border border-white" title={u.name} />
                                            : <div key={id} className="w-4 h-4 rounded-full border border-white bg-slate-200 text-[8px] flex items-center justify-center font-bold text-slate-500" title={u.name}>{u.name.charAt(0)}</div>
                                      })}
                                      {(show.userIds || []).length > 3 && <div className="w-4 h-4 rounded-full border border-white bg-slate-100 text-[7px] flex items-center justify-center font-bold text-slate-500">+{show.userIds.length - 3}</div>}
                                   </div>
                               </div>
                               <div className="truncate opacity-90 mt-0.5">{show.title}</div>
                           </button>
                       );
                   })}
                </div>
            </div>
        );
    }
    return days;
  };

  const renderList = () => {
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

                             return (
                                 <tr key={show.id} className="hover:bg-slate-50 transition-colors group">
                                     <td className="p-4">
                                         <div className="font-bold text-slate-800 cursor-pointer hover:text-red-600 transition-colors" onClick={() => openShowModal(show)}>{show.title}</div>
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
        {showDisplayMode === 'calendar' ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col flex-1 min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 hover:bg-slate-100 rounded-lg text-sm font-bold text-slate-600 transition-colors">Today</button>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden flex-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-slate-50 p-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</div>
                    ))}
                    {renderCalendar()}
                </div>
            </div>
        ) : renderList()}
      </div>
    </div>
  );
}