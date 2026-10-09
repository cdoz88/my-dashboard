import React from 'react';
import { Youtube, ArrowLeft, Archive, RefreshCw, Plus, Save, Trash2, Play } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import PlaylistSplitModal from '../../modals/PlaylistSplitModal';

const formatAVD = (minutes, views) => {
  if (!views || views === 0 || !minutes) return '0:00';
  const avgMin = Number(minutes) / Number(views);
  const m = Math.floor(avgMin);
  const s = Math.floor((avgMin - m) * 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function YoutubeTab({
    currentUser,
    users,
    ytPlaylists,
    youtubeChannels,
    selectedYtUserId,
    setSelectedYtUserId,
    showArchivedPl,
    setShowArchivedPl,
    playlistChannelFilter,
    setPlaylistChannelFilter,
    isImportingPlaylists,
    handleImportPlaylists,
    handleAddYtPlaylist,
    editingYt,
    setEditingYt,
    handleSaveYtPlaylist,
    handleToggleArchivePl,
    handleDeleteYtPlaylist,
    openPlaylistSplitModal,
    isPlaylistSplitModalOpen,
    setIsPlaylistSplitModalOpen,
    editingPlaylistSplits,
    handleSavePlaylistSplits
}) {
    if (!currentUser?.isAdmin || selectedYtUserId) {
        const targetUserId = currentUser?.isAdmin ? selectedYtUserId : currentUser?.id;
        const targetUser = users.find(u => u.id === targetUserId);
        
        const myPlaylists = ytPlaylists.filter(pl => {
            if (showArchivedPl ? !pl.isArchived : pl.isArchived) return false;
            if (playlistChannelFilter !== 'All' && pl.channelId !== playlistChannelFilter) return false;
            
            const isOwner = pl.userId === targetUserId;
            const splitsArray = Array.isArray(pl.splits) ? pl.splits : [];
            const isSplitParticipant = splitsArray.some(s => s.userId === targetUserId);
            
            return isOwner || isSplitParticipant;
        });
        
        const totalPlaylists = myPlaylists.length;
        const totalTrackedVideos = myPlaylists.reduce((sum, pl) => sum + parseInt(pl.ledgerVideos || 0), 0);
        const totalMyEarnings = myPlaylists.reduce((sum, pl) => {
            const totalRevPool = parseFloat(pl.ledgerRevenue || 0);
            const creatorNetPool = totalRevPool * (parseFloat(pl.revShare ?? 100) / 100);
            const splitsArray = Array.isArray(pl.splits) ? pl.splits : [];
            
            if (splitsArray.length > 0) {
                const match = splitsArray.find(s => s.userId === targetUserId);
                return sum + (match ? (creatorNetPool * (parseFloat(match.percent || 0) / 100)) : 0);
            }
            return sum + (pl.userId === targetUserId ? creatorNetPool : 0);
        }, 0);

        const allVideos = [];
        myPlaylists.forEach(pl => {
            let vids = [];
            try { if (pl.video_details) vids = JSON.parse(pl.video_details); } catch(e){}
            
            vids.forEach(v => {
                const totalRev = parseFloat(v.revenue || 0);
                const netPool = totalRev * (parseFloat(pl.revShare ?? 100) / 100);
                const splitsArray = Array.isArray(pl.splits) ? pl.splits : [];
                
                let shareEarned = 0;
                if (splitsArray.length > 0) {
                    const match = splitsArray.find(s => s.userId === targetUserId);
                    shareEarned = match ? (netPool * (parseFloat(match.percent || 0) / 100)) : 0;
                } else {
                    shareEarned = pl.userId === targetUserId ? netPool : 0;
                }

                allVideos.push({
                    ...v,
                    playlistName: pl.playlistName,
                    revShare: pl.revShare,
                    earned: shareEarned
                });
            });
        });
        allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        return (
          <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
            <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            {currentUser?.isAdmin && (
                                <button onClick={() => setSelectedYtUserId(null)} className="p-2 bg-white shadow-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 flex-shrink-0" title="Back to Master List">
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <Youtube className="text-red-600" size={28} />
                                    {currentUser?.isAdmin ? `${targetUser?.name}'s YouTube Performance` : 'Your YouTube Performance'}
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">Detailed breakdown of {currentUser?.isAdmin ? 'their' : 'your'} assigned YouTube playlists.</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 mt-2 ${currentUser?.isAdmin ? 'ml-12' : ''}`}>
                            <label className="text-sm font-medium text-slate-600 hidden sm:block">Channel:</label>
                            <select value={playlistChannelFilter} onChange={(e) => setPlaylistChannelFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm text-slate-700">
                                <option value="All">All Channels</option>
                                {youtubeChannels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-start gap-3 mt-2 sm:mt-0">
                        <button onClick={() => setShowArchivedPl(!showArchivedPl)} className={`px-4 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2 border text-sm ${showArchivedPl ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}`}>
                            <Archive size={16} className={showArchivedPl ? "text-amber-500" : "text-slate-500"} /> {showArchivedPl ? 'Viewing Archived' : 'View Archived'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-slate-800">
                    <div className="text-slate-500 text-sm font-medium mb-1">Assigned Playlists</div>
                    <div className="text-3xl font-bold text-slate-800">{totalPlaylists}</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-red-500">
                    <div className="text-slate-500 text-sm font-medium mb-1">Eligible Videos Tracked</div>
                    <div className="text-3xl font-bold text-slate-800">{totalTrackedVideos.toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
                    <div className="text-slate-500 text-sm font-medium mb-1">Total Rev Share Earnings</div>
                    <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalMyEarnings)}</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">{showArchivedPl ? 'Archived Playlists' : 'Active Playlists'}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[700px]">
                            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Playlist Info</th>
                                    <th className="px-6 py-4">Channel</th>
                                    <th className="px-6 py-4 text-center">Tracked Videos</th>
                                    <th className="px-6 py-4 text-center">Your Rev Share</th>
                                    <th className="px-6 py-4 text-right">Your Earnings</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {myPlaylists.length > 0 ? myPlaylists.map(pl => {
                                    const channel = youtubeChannels.find(c => c.id === pl.channelId);
                                    
                                    const totalRev = parseFloat(pl.ledgerRevenue || 0);
                                    const creatorNet = totalRev * (parseFloat(pl.revShare ?? 100) / 100);
                                    const splitsArray = Array.isArray(pl.splits) ? pl.splits : [];
                                    
                                    let personalEarnings = 0;
                                    let personalPercentageDisplay = pl.revShare + "%";

                                    if (splitsArray.length > 0) {
                                        const match = splitsArray.find(s => s.userId === targetUserId);
                                        personalEarnings = match ? (creatorNet * (parseFloat(match.percent || 0) / 100)) : 0;
                                        personalPercentageDisplay = match ? `${match.percent}% (of Split)` : "0%";
                                    } else {
                                        personalEarnings = pl.userId === targetUserId ? creatorNet : 0;
                                    }

                                    return (
                                        <tr key={pl.id} className={`hover:bg-slate-50 transition-colors ${pl.isArchived ? 'opacity-70' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 flex items-center gap-2">
                                                    <Youtube size={16} className="text-red-500 flex-shrink-0" />
                                                    <span className="truncate max-w-[300px]" title={pl.playlistName}>{pl.playlistName || 'Unknown Playlist'}</span>
                                                    {pl.isArchived && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded border border-amber-200">Archived</span>}
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-1">{pl.playlistId}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">{channel?.name || '--'}</td>
                                            <td className="px-6 py-4 text-center font-bold text-slate-700">{pl.ledgerVideos || 0}</td>
                                            <td className="px-6 py-4 text-center font-bold text-slate-700">{personalPercentageDisplay}</td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatCurrency(personalEarnings)}</td>
                                            <td className="px-6 py-4 text-right">
                                                {pl.userId === currentUser?.id && (
                                                    <button 
                                                        onClick={() => openPlaylistSplitModal(pl)}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                                                    >
                                                        Splits
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Youtube size={48} className="text-slate-3300 mb-3" />
                                                <p className="font-semibold text-slate-700">{showArchivedPl ? 'No archived playlists match your filter.' : 'No active playlists match your filter.'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">Individual Video Performance {showArchivedPl && '(From Archived)'}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[800px]">
                            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Video</th>
                                    <th className="px-6 py-4 text-center">Avg. View Duration</th>
                                    <th className="px-6 py-4 text-center">Views</th>
                                    <th className="px-6 py-4 text-right">Revenue Generated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {allVideos.length > 0 ? allVideos.map((video, idx) => (
                                    <tr key={idx} className={`hover:bg-slate-50 transition-colors ${showArchivedPl ? 'opacity-70' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                               {video.thumbnail ? (
                                                  <img src={video.thumbnail} alt={video.title} className="w-[80px] h-[45px] object-cover rounded shadow-sm border border-slate-200" />
                                               ) : (
                                                  <div className="w-[80px] h-[45px] bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                                                      <Play size={20} className="text-slate-300" />
                                                  </div>
                                               )}
                                               <div className="flex flex-col justify-center">
                                                  <div className="font-bold text-slate-800 line-clamp-2 max-w-[300px] leading-snug">{video.title}</div>
                                                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                                                      <span className="bg-slate-100 px-1.5 rounded">{video.playlistName}</span> • 
                                                      {new Date(video.publishedAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                                                  </div>
                                               </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-slate-600">{formatAVD(video.minutes, video.views)}</td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700">{parseInt(video.views || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatCurrency(parseFloat(video.earned || 0))}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Youtube size={48} className="text-slate-300 mb-3" />
                                                <p className="font-semibold text-slate-700">No individual video data available yet.</p>
                                                <p className="text-sm mt-1 max-w-md mx-auto">Make sure the Start Date on the playlist is set properly and you have clicked Sync Latest Data.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL INJECTED HERE */}
                <PlaylistSplitModal 
                    isOpen={isPlaylistSplitModalOpen}
                    onClose={() => setIsPlaylistSplitModalOpen(false)}
                    playlist={editingPlaylistSplits}
                    users={users}
                    onSave={handleSavePlaylistSplits}
                />
            </div>
          </div>
        );
    }

    // --- ADMIN VIEW (Master Playlist Configs) ---
    const visiblePlaylists = ytPlaylists.filter(pl => {
        if (showArchivedPl ? !pl.isArchived : pl.isArchived) return false;
        if (playlistChannelFilter !== 'All' && pl.channelId !== playlistChannelFilter) return false;
        return true;
    });

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
        <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex flex-col gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Youtube className="text-red-600" size={28} />
                            YouTube Playlists
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Map YouTube playlists to creators to auto-calculate their revenue share.</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                        <label className="text-sm font-medium text-slate-600 hidden sm:block">Channel:</label>
                        <select value={playlistChannelFilter} onChange={(e) => setPlaylistChannelFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm text-slate-700">
                            <option value="All">All Channels</option>
                            {youtubeChannels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-start gap-2 mt-2 sm:mt-0">
                    <button onClick={() => setShowArchivedPl(!showArchivedPl)} className={`px-4 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2 border text-sm ${showArchivedPl ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}`}>
                        <Archive size={16} className={showArchivedPl ? "text-amber-500" : "text-slate-500"} /> <span className="hidden sm:inline">{showArchivedPl ? 'Viewing Archived' : 'View Archived'}</span>
                    </button>
                    <button onClick={handleImportPlaylists} disabled={isImportingPlaylists} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                        <RefreshCw size={16} className={isImportingPlaylists ? 'animate-spin' : ''} /> <span className="hidden lg:inline">Auto-Import Playlists</span><span className="lg:hidden">Import</span>
                    </button>
                    <button onClick={handleAddYtPlaylist} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                        <Plus size={16} /> <span className="hidden sm:inline">Add Playlist</span><span className="sm:hidden">Add</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[1000px]">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-4 w-48">YouTube Channel</th>
                                <th className="px-4 py-4">Playlist URL / ID</th>
                                <th className="px-4 py-4 w-40">Creator</th>
                                <th className="px-4 py-4 w-28">Rev Share %</th>
                                <th className="px-4 py-4 w-40">Start Date</th>
                                <th className="px-4 py-4 text-right w-32">Earnings</th>
                                <th className="px-4 py-4 text-right w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visiblePlaylists && visiblePlaylists.length > 0 ? visiblePlaylists.map((pl) => {
                                const isEditing = editingYt.hasOwnProperty(pl.id);
                                const currentPl = editingYt[pl.id] || pl;
                                const plEarned = parseFloat(pl.ledgerRevenue || 0) * (parseFloat(pl.revShare ?? 100) / 100);

                                return (
                                <tr key={pl.id} className={`hover:bg-slate-50 transition-colors ${pl.isArchived ? 'opacity-70' : ''}`}>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <select value={currentPl.channelId} onChange={(e) => setEditingYt(prev => ({...prev, [pl.id]: {...currentPl, channelId: e.target.value}}))} className="w-full border border-slate-300 rounded-md py-1.5 px-2 text-sm">
                                                <option value="">Select Channel</option>
                                                {youtubeChannels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        ) : ( <span className="font-medium text-slate-700">{youtubeChannels.find(c => c.id === pl.channelId)?.name || 'Unknown'}</span> )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <input type="text" value={currentPl.playlistId} onChange={(e) => setEditingYt(prev => ({...prev, [pl.id]: {...currentPl, playlistId: e.target.value}}))} className="w-full border border-slate-300 rounded-md py-1.5 px-2 text-sm" placeholder="Paste full URL..." />
                                        ) : ( 
                                            <div>
                                                <div className="font-bold text-slate-800 flex items-center gap-2">
                                                    <span className="truncate max-w-[200px]" title={pl.playlistName}>{pl.playlistName || 'Unknown Playlist'}</span>
                                                    {pl.isArchived && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded border border-amber-200 flex-shrink-0">Archived</span>}
                                                </div>
                                                <div className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-[200px]">{pl.playlistId}</div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <select value={currentPl.userId} onChange={(e) => setEditingYt(prev => ({...prev, [pl.id]: {...currentPl, userId: e.target.value}}))} className="w-full border border-slate-300 rounded-md py-1.5 px-2 text-sm bg-white">
                                                <option value="">Select Creator</option>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </select>
                                        ) : ( 
                                            <span 
                                                className={`font-medium ${pl.userId ? 'text-slate-700 hover:text-red-600 cursor-pointer transition-colors w-fit' : 'text-slate-400 italic'}`} 
                                                onClick={() => pl.userId ? setSelectedYtUserId(pl.userId) : null}
                                                title={pl.userId ? "View Creator Breakdown" : ""}
                                            >
                                                {users.find(u => u.id === pl.userId)?.name || 'Unassigned'}
                                            </span> 
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <div className="flex items-center gap-1">
                                                <input type="number" value={currentPl.revShare} onChange={(e) => setEditingYt(prev => ({...prev, [pl.id]: {...currentPl, revShare: e.target.value}}))} className="w-16 border border-slate-300 rounded-md py-1.5 px-2 text-sm text-right" />
                                                <span className="text-slate-500 font-bold">%</span>
                                            </div>
                                        ) : ( <span className="font-bold text-emerald-600">{pl.revShare}%</span> )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <input type="date" value={currentPl.paymentStartDate || ''} onChange={(e) => setEditingYt(prev => ({...prev, [pl.id]: {...currentPl, paymentStartDate: e.target.value}}))} className="w-full border border-slate-300 rounded-md py-1.5 px-2 text-sm" />
                                        ) : ( <span className="text-slate-600">{pl.paymentStartDate ? new Date(`${pl.paymentStartDate}T12:00:00`).toLocaleDateString() : 'None'}</span> )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="font-bold text-emerald-600">{formatCurrency(plEarned)}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {isEditing ? (
                                                <button onClick={() => handleSaveYtPlaylist(currentPl)} className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-emerald-200 transition-colors flex items-center gap-1">
                                                    <Save size={14} /> Save
                                                </button>
                                            ) : (
                                                <>
                                                    <button onClick={() => openPlaylistSplitModal(pl)} className="text-slate-400 hover:text-indigo-600 px-2 py-1 transition-colors text-xs font-bold" title="Manage Revenue Splits">Splits</button>
                                                    <button onClick={() => setEditingYt(prev => ({...prev, [pl.id]: pl}))} className="text-slate-400 hover:text-blue-600 px-2 py-1 transition-colors text-xs font-bold">Edit</button>
                                                    <button onClick={() => handleToggleArchivePl(pl)} className="text-slate-400 hover:text-amber-600 p-1 transition-colors" title={pl.isArchived ? "Restore" : "Archive"}><Archive size={16} /></button>
                                                </>
                                            )}
                                            <button onClick={() => handleDeleteYtPlaylist(pl.id)} className="text-slate-400 hover:text-red-600 p-1 transition-colors" title="Permanent Delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )}) : (
                                <tr>
                                   <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                      <div className="flex flex-col items-center justify-center">
                                         {showArchivedPl ? (
                                            <>
                                               <Archive size={48} className="text-slate-300 mb-3" />
                                               <p className="font-semibold">No archived playlists.</p>
                                            </>
                                         ) : (
                                            <>
                                               <Youtube size={48} className="text-slate-3300 mb-3" />
                                               <p className="font-semibold">No active YouTube Playlists mapped.</p>
                                               <p className="text-sm">Click "Auto-Import" to pull them in.</p>
                                            </>
                                         )}
                                      </div>
                                   </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODAL INJECTED HERE */}
                <PlaylistSplitModal 
                    isOpen={isPlaylistSplitModalOpen}
                    onClose={() => setIsPlaylistSplitModalOpen(false)}
                    playlist={editingPlaylistSplits}
                    users={users}
                    onSave={handleSavePlaylistSplits}
                />
            </div>
        </div>
      </div>
    );
}