import React, { useState, useEffect } from 'react';
import { 
    CheckCircle, Tv, ArrowRight, Clock, 
    CalendarDays, MonitorPlay, Radio, Youtube, Star, Calculator, Plus, Trash2 
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { colorStyles } from '../../utils/constants';
import DynamicIcon from '../shared/DynamicIcon';
import { API_URL } from '../../utils/constants';

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

// Styling Maps for Banners
const themeMap = {
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-800 border-amber-200',
    slate: 'bg-slate-100 text-slate-800 border-slate-300'
};

const sizeMap = {
    small: 'text-sm font-medium',
    normal: 'text-base font-medium',
    large: 'text-lg font-bold',
    xl: 'text-xl font-black'
};

export default function HomeDashboard({ 
    currentUser, tasks, projects, shows, payouts, wpLedgerData, youtubeChannels,
    setCurrentApp, setActiveTab, openShowModal 
}) {
    // --- SELF-CONTAINED ANNOUNCEMENT LOGIC (Supports Multiple Banners) ---
    const [announcements, setAnnouncements] = useState([]);
    const [isEditingBanner, setIsEditingBanner] = useState(false);
    const [editState, setEditState] = useState([]);

    // Fetch the announcements directly on load
    useEffect(() => {
        fetch(`${API_URL}?action=get_all`)
            .then(res => res.json())
            .then(data => {
                if (data.settings && data.settings.globalAnnouncement) {
                    try {
                        const parsed = JSON.parse(data.settings.globalAnnouncement);
                        if (Array.isArray(parsed)) {
                            setAnnouncements(parsed);
                            setEditState(parsed);
                        } else {
                            // Fallback if the database has old string data
                            const legacy = [{ id: '1', text: data.settings.globalAnnouncement, theme: 'blue', size: 'normal' }];
                            setAnnouncements(legacy);
                            setEditState(legacy);
                        }
                    } catch(e) {
                        // Fallback if the database has old un-parseable string data
                        const legacy = [{ id: '1', text: data.settings.globalAnnouncement, theme: 'blue', size: 'normal' }];
                        setAnnouncements(legacy);
                        setEditState(legacy);
                    }
                }
            })
            .catch(err => console.error("Error fetching announcement:", err));
    }, []);

    // Banner Edit Handlers
    const handleAddBanner = () => {
        setEditState([...editState, { id: Date.now().toString(), text: '', theme: 'blue', size: 'normal' }]);
    };

    const handleUpdateBanner = (id, field, value) => {
        setEditState(editState.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const handleRemoveBanner = (id) => {
        setEditState(editState.filter(b => b.id !== id));
    };

    // Save directly to the database as a stringified JSON array
    const saveBanners = async () => {
        const validBanners = editState.filter(b => b.text.trim() !== '');
        try {
            await fetch(`${API_URL}?action=save_setting`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key_name: 'globalAnnouncement', setting_value: JSON.stringify(validBanners) })
            });
            setAnnouncements(validBanners);
            setEditState(validBanners);
            setIsEditingBanner(false);
        } catch (err) {
            console.error("Failed to save banners", err);
            alert("There was an error saving the announcements.");
        }
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

            {/* ANNOUNCEMENT BANNERS */}
            {(currentUser?.isAdmin || announcements.length > 0) && (
                <div className="mb-6 sm:mb-8 flex-shrink-0 flex flex-col gap-3">
                    {currentUser?.isAdmin && isEditingBanner ? (
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800">Edit Announcements</h3>
                            </div>
                            
                            <div className="space-y-4">
                                {editState.map((banner, index) => (
                                    <div key={banner.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                            <textarea
                                                value={banner.text}
                                                onChange={(e) => handleUpdateBanner(banner.id, 'text', e.target.value)}
                                                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                rows="2"
                                                placeholder="Enter announcement text..."
                                            />
                                        </div>
                                        <div className="flex sm:flex-col gap-2">
                                            <select 
                                                value={banner.theme} 
                                                onChange={(e) => handleUpdateBanner(banner.id, 'theme', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="blue">Blue Theme</option>
                                                <option value="red">Red Alert</option>
                                                <option value="green">Green Success</option>
                                                <option value="yellow">Yellow Warning</option>
                                                <option value="slate">Slate Neutral</option>
                                            </select>
                                            <select 
                                                value={banner.size} 
                                                onChange={(e) => handleUpdateBanner(banner.id, 'size', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="small">Small Text</option>
                                                <option value="normal">Normal Text</option>
                                                <option value="large">Large Text</option>
                                                <option value="xl">XL Text</option>
                                            </select>
                                            <button 
                                                onClick={() => handleRemoveBanner(banner.id)} 
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center shrink-0 sm:shrink"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={handleAddBanner} 
                                className="mt-4 text-sm font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors"
                            >
                                <Plus size={16}/> Add Another Banner
                            </button>

                            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-slate-100">
                                <button 
                                    onClick={() => { setIsEditingBanner(false); setEditState(announcements); }} 
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={saveBanners} 
                                    className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                                >
                                    Save Announcements
                                </button>
                            </div>
                        </div>
                    ) : announcements.length > 0 ? (
                        <div className="flex flex-col gap-3 relative group">
                            {announcements.map(banner => (
                                <div key={banner.id} className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${themeMap[banner.theme] || themeMap.blue}`}>
                                    <p className={`whitespace-pre-wrap leading-relaxed ${sizeMap[banner.size] || sizeMap.normal}`}>{banner.text}</p>
                                </div>
                            ))}
                            {currentUser?.isAdmin && (
                                <button 
                                    onClick={() => setIsEditingBanner(true)} 
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold bg-white/80 hover:bg-white text-slate-700 px-3 py-1.5 rounded-md shadow-sm border border-slate-200"
                                >
                                    Edit Banners
                                </button>
                            )}
                        </div>
                    ) : currentUser?.isAdmin ? (
                        <div 
                            className="bg-slate-50 border border-dashed border-slate-300 p-4 rounded-xl flex justify-center hover:bg-slate-100 transition-colors cursor-pointer" 
                            onClick={() => { setEditState([{id: Date.now().toString(), text: '', theme: 'blue', size: 'normal'}]); setIsEditingBanner(true); }}
                        >
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