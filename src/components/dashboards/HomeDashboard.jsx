import React, { useState } from 'react';
import { 
    CheckCircle, Tv, ArrowRight, Clock, 
    CalendarDays, MonitorPlay, Radio, Youtube, Star, Calculator, Plus 
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { colorStyles } from '../../utils/constants';
import DynamicIcon from '../shared/DynamicIcon';
import { useAppContext } from '../../context/AppContext';

const normalizePlaylistId = (input) => {
    if (!input) return '';
    let id = input.trim();
    const match = id.match(/[?&]list=([^&]+)/) || id.match(/^list=([^&]+)/);
    if (match) return match[1];
    if (id.includes('http')) {
        try {
            const url = new URL(id);
            const params = new URLSearchParams(url.search);
            if (params.has('list')) return params.get('list');
        } catch(e) {}
    }
    return id;
};

export default function HomeDashboard(props) {
    // Bypass the router and pull functions directly from the global state cloud
    const appState = useAppContext();
    
    // Merge props and appState so we guarantee access to our new announcement functions
    const { 
        currentUser, tasks, projects, shows, payouts, wpLedgerData, youtubeChannels,
        setCurrentApp, setActiveTab, openShowModal, globalAnnouncement, handleSaveGlobalAnnouncement 
    } = { ...props, ...appState };

    const [isEditingBanner, setIsEditingBanner] = useState(false);
    const [bannerText, setBannerText] = useState(globalAnnouncement || '');

    const saveBanner = () => {
        handleSaveGlobalAnnouncement(bannerText);
        setIsEditingBanner(false);
    };
    
    // --- 1. MY CAPACITY / WORKLOAD ---
    const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id && t.status !== 'done');
    
    const totalPoints = myTasks.reduce((sum, t) => sum + (Number(t.weight) || 1), 0);
    const pointsByProject = {};
    myTasks.forEach(t => {
        if (!pointsByProject[t.projectId]) pointsByProject[t.projectId] = 0;
        pointsByProject[t.projectId] += (Number(t.weight) || 1);
    });

    // --- 2. MY UPCOMING SHOWS ---
    const todayStr = new Date().toISOString().split('T')[0];
    const myShows = shows.filter(s => (s.userIds || []).includes(currentUser?.id) && s.status !== 'Archived' && s.showDate >= todayStr)
                         .sort((a, b) => new Date(`${a.showDate}T${a.showTime || '00:00'}`) - new Date(`${b.showDate}T${b.showTime || '00:00'}`))
                         .slice(0, 5); // Show max 5 upcoming shows

    // --- 3. MY PERSONAL LEDGER ---
    // Strictly scoped to the user, ignoring Admin status so their home page is purely personal
    const myYtShows = shows.filter(s => (s.userIds || []).includes(currentUser?.id) && s.paymentStartDate && s.playlistId);
    
    const uniquePlaylistsMap = new Map();
    myYtShows.forEach(s => {
        const cleanId = normalizePlaylistId(s.playlistId);
        if (!uniquePlaylistsMap.has(cleanId)) uniquePlaylistsMap.set(cleanId, { ...s, normalizedPlaylistId: cleanId });
    });
    const myPlaylists = Array.from(uniquePlaylistsMap.values());

    const ytTotalEarned = myPlaylists.reduce((sum, show) => {
        const videos = parseInt(show.ledgerVideos || 0);
        const revenue = parseFloat(show.ledgerRevenue || 0);
        const baseTotal = videos * parseFloat(show.basePay || 0);
        const revSharePct = parseFloat(show.revShare ?? 100) / 100;
        const revShareTotal = revenue * revSharePct;
        return sum + (baseTotal + revShareTotal);
    }, 0);

    const myWpLedger = wpLedgerData.filter(wp => wp.wp_user_id == currentUser?.wpUserId);
    const wpTotalEarned = myWpLedger.reduce((sum, wp) => sum + parseFloat(wp.total_earned || 0), 0);
    const grandTotalEarned = ytTotalEarned + wpTotalEarned;

    const allowedPlaylistIds = myPlaylists.map(s => s.normalizedPlaylistId);
    const rawAllowedPlaylistIds = myPlaylists.map(s => s.playlistId);
    const allowedWpShowIds = myWpLedger.map(wp => `wp_articles_${wp.wp_user_id}`);
    
    const myPayouts = payouts.filter(p => allowedPlaylistIds.includes(p.showId) || rawAllowedPlaylistIds.includes(p.showId) || allowedWpShowIds.includes(p.showId));

    const grandTotalPaid = myPayouts.filter(p => p.transactionType === 'Payment').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const grandTotalDeducted = myPayouts.filter(p => p.transactionType === 'Deduction').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const grandTotalOwed = grandTotalEarned - grandTotalPaid - grandTotalDeducted;

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
            
            <div className="mb-6 sm:mb-8 flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800">Welcome back, {currentUser?.name.split(' ')[0]}! 👋</h1>
                <p className="text-slate-500 mt-1 font-medium">Here is what is on your desk today.</p>
            </div>

            {/* ANNOUNCEMENT BANNER */}
            {(currentUser?.isAdmin || globalAnnouncement) && (
                <div className="mb-6 sm:mb-8 flex-shrink-0">
                    {currentUser?.isAdmin && isEditingBanner ? (
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 animate-in fade-in slide-in-from-top-2">
                            <textarea
                                value={bannerText}
                                onChange={(e) => setBannerText(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                                rows="3"
                                placeholder="Enter an announcement here... (Leave blank to remove the banner entirely)"
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setIsEditingBanner(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                                <button onClick={saveBanner} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">Save Announcement</button>
                            </div>
                        </div>
                    ) : globalAnnouncement ? (
                        <div className="bg-blue-50 text-blue-800 p-4 sm:p-5 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm">
                            <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{globalAnnouncement}</p>
                            {currentUser?.isAdmin && (
                                <button onClick={() => { setBannerText(globalAnnouncement); setIsEditingBanner(true); }} className="text-blue-600 hover:text-blue-800 sm:opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shrink-0 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-md">
                                    Edit Announcement
                                </button>
                            )}
                        </div>
                    ) : currentUser?.isAdmin ? (
                        <div className="bg-slate-50 border border-dashed border-slate-300 p-4 rounded-xl flex justify-center hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => { setBannerText(''); setIsEditingBanner(true); }}>
                            <button className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                <Plus size={16} /> Add Announcement Banner
                            </button>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Quick Ledger Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 flex-shrink-0">
                <div className="hidden sm:block bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Earned</div>
                    <div className="text-2xl font-black text-slate-800">{formatCurrency(grandTotalEarned)}</div>
                </div>
                <div className="hidden sm:block bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Paid</div>
                    <div className="text-2xl font-black text-slate-800">{formatCurrency(grandTotalPaid)}</div>
                </div>
                <div className="bg-slate-800 p-5 sm:p-5 rounded-xl shadow-sm border border-slate-700 relative overflow-hidden group cursor-pointer" onClick={() => { setCurrentApp('ledger'); setActiveTab('all'); }}>
                    <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Current Balance</div>
                    <div className="text-2xl sm:text-2xl font-black text-white">{formatCurrency(grandTotalOwed)}</div>
                    
                    {/* Desktop Arrow */}
                    <div className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">
                        <ArrowRight size={24} />
                    </div>

                    {/* Mobile Quick Link */}
                    <div className="sm:hidden absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 flex items-center gap-1.5 text-xs font-bold bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600">
                        View Ledger <ArrowRight size={14} />
                    </div>

                    <Calculator className="absolute right-[-10px] bottom-[-10px] text-white opacity-5" size={80} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                
                {/* My Workload / Capacity Column */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><CheckCircle className="text-blue-500" size={20}/> My Workload</h3>
                        <button onClick={() => { setCurrentApp('projects'); setActiveTab('mytasks'); }} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">View Tasks <ArrowRight size={14}/></button>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 p-5 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                             <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Active Tasks</div>
                                <div className="text-2xl font-black text-slate-800">{myTasks.length}</div>
                             </div>
                             <div className="flex-1 bg-purple-50 rounded-lg p-3 border border-purple-100">
                                <div className="text-purple-600 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={12}/> Total Points</div>
                                <div className="text-2xl font-black text-slate-800">{totalPoints}</div>
                             </div>
                        </div>

                        <div className="flex-1">
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Workload by Project</h4>
                             {Object.keys(pointsByProject).length > 0 ? (
                               <div className="space-y-4">
                                 {Object.entries(pointsByProject).sort((a,b) => b[1] - a[1]).map(([projectId, points]) => {
                                   const project = projects.find(p => p.id === projectId);
                                   if (!project) return null;
                                   const percentOfLoad = Math.round((points / totalPoints) * 100);
                                   return (
                                     <div key={projectId}>
                                       <div className="flex justify-between items-center text-sm mb-1.5">
                                         <div className="flex items-center gap-2 font-bold text-slate-700 truncate pr-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => { setCurrentApp('projects'); setActiveTab(projectId); }}>
                                           <DynamicIcon name={project.icon} size={16} className={colorStyles[project.color]?.text} />
                                           <span className="truncate">{project.name}</span>
                                         </div>
                                         <div className="font-bold text-slate-500 text-xs bg-slate-100 px-2 py-0.5 rounded flex-shrink-0">{points} pts ({percentOfLoad}%)</div>
                                       </div>
                                       <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                          <div className={`h-full ${colorStyles[project.color]?.bar || 'bg-slate-400'}`} style={{ width: `${percentOfLoad}%` }} />
                                       </div>
                                     </div>
                                   );
                                 })}
                               </div>
                             ) : ( 
                               <div className="h-full flex flex-col items-center justify-center text-slate-400 italic bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 text-center min-h-[150px]">
                                   <CheckCircle size={32} className="text-slate-300 mb-2" />
                                   <p className="font-medium">You have no active tasks right now.</p>
                               </div> 
                             )}
                        </div>
                    </div>
                </div>

                {/* My Upcoming Shows Column */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Tv className="text-red-500" size={20}/> My Upcoming Shows</h3>
                        <button onClick={() => { setCurrentApp('shows'); setActiveTab('overview'); }} className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1">Schedule <ArrowRight size={14}/></button>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
                        {myShows.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {myShows.map(show => {
                                    const channel = youtubeChannels.find(c => c.id === show.channelId);
                                    return (
                                        <div key={show.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 group cursor-pointer" onClick={() => openShowModal(show, 'episode')}>
                                            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg min-w-[50px] p-2 flex-shrink-0">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(`${show.showDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-lg font-black text-slate-800 leading-none mt-0.5">{new Date(`${show.showDate}T12:00:00`).getDate()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0 py-0.5">
                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                    <p className="font-bold text-slate-800 text-sm truncate group-hover:text-red-600">{show.title}</p>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 flex-shrink-0 ${show.isLive ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                        {show.isLive ? <Radio size={10} className="animate-pulse" /> : <MonitorPlay size={10} />} {show.isLive ? 'LIVE' : 'PRE-REC'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] font-medium text-slate-500">
                                                    {show.showTime && <span className="flex items-center gap-1"><Clock size={12} className="text-slate-400" /> {(() => { let [h, m] = show.showTime.split(':'); return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`; })()}</span>}
                                                    {channel && <span className="flex items-center gap-1 truncate text-red-600"><Youtube size={12} /> {channel.name}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500 h-full min-h-[250px]">
                                <CalendarDays size={40} className="text-slate-200 mb-3" />
                                <p className="font-medium text-slate-600">No upcoming broadcasts.</p>
                                <p className="text-xs mt-1">You are not cast in any scheduled shows.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}