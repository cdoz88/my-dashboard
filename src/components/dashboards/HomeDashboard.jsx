import React from 'react';
import { 
    Home, CheckCircle, Circle, Tv, Wallet, ArrowRight, Clock, 
    CalendarDays, MonitorPlay, Radio, Youtube, Star, Paperclip, 
    MessageSquare, Trash2 
} from 'lucide-react';
import { formatCurrency, formatDate, isOverdue } from '../../utils/helpers';
import { colorStyles } from '../../utils/constants';
import DynamicIcon from '../shared/DynamicIcon';

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

export default function HomeDashboard({ 
    currentUser, tasks, projects, shows, payouts, wpLedgerData, youtubeChannels,
    setCurrentApp, setActiveTab, openTaskModal, handleToggleTaskStatus, openShowModal 
}) {
    
    // --- 1. MY TASKS ---
    const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id && t.status !== 'done')
                         .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                         .slice(0, 8); // Show max 8 tasks on the home screen

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
            
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800">Welcome back, {currentUser?.name.split(' ')[0]}! 👋</h1>
                <p className="text-slate-500 mt-1 font-medium">Here is what is on your desk today.</p>
            </div>

            {/* Quick Ledger Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Earned</div>
                    <div className="text-2xl font-black text-slate-800">{formatCurrency(grandTotalEarned)}</div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Paid</div>
                    <div className="text-2xl font-black text-slate-800">{formatCurrency(grandTotalPaid)}</div>
                </div>
                <div className="bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700 relative overflow-hidden group cursor-pointer" onClick={() => { setCurrentApp('ledger'); setActiveTab('all'); }}>
                    <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Available Balance</div>
                    <div className="text-2xl font-black text-white">{formatCurrency(grandTotalOwed)}</div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">
                        <ArrowRight size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* My Tasks Column */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><CheckCircle className="text-blue-500" size={20}/> My Active Tasks</h3>
                        <button onClick={() => { setCurrentApp('projects'); setActiveTab('mytasks'); }} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">View All <ArrowRight size={14}/></button>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
                        {myTasks.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {myTasks.map(task => {
                                    const project = projects.find(p => p.id === task.projectId);
                                    const taskOverdue = isOverdue(task.dueDate, task.status);
                                    return (
                                        <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 group">
                                            <button onClick={() => handleToggleTaskStatus(task)} className="mt-0.5 flex-shrink-0 text-slate-300 hover:text-blue-500 transition-colors">
                                                {task.status === 'done' ? <CheckCircle size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-700 text-sm cursor-pointer hover:text-blue-600 truncate" onClick={() => openTaskModal(task)}>{task.title}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    {project && (
                                                        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${colorStyles[project.color]?.bg} ${colorStyles[project.color]?.text} ${colorStyles[project.color]?.border}`}>
                                                            <DynamicIcon name={project.icon} size={10} /> <span className="truncate max-w-[100px]">{project.name}</span>
                                                        </span>
                                                    )}
                                                    <span className={`text-[10px] font-bold flex items-center gap-1 ${taskOverdue ? 'text-red-500' : 'text-slate-500'}`}>
                                                        <Clock size={10} /> {formatDate(task.dueDate) || 'No Due Date'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500 h-full">
                                <CheckCircle size={40} className="text-slate-200 mb-3" />
                                <p className="font-medium text-slate-600">You're all caught up!</p>
                                <p className="text-xs mt-1">No active tasks assigned to you right now.</p>
                            </div>
                        )}
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
                            <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500 h-full">
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