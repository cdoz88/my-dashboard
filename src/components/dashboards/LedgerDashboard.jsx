import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Plus, DollarSign, Youtube, FileText, History, X, Wallet, Globe, Link as LinkIcon, Save, Trash2, UserCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
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

export default function LedgerDashboard({
  shows, payouts, youtubeChannels, openPayoutModal, handleSyncLedger, isSyncingLedger, currentUser, wpLedgerData, users, activeTab
}) {
  const [historyModalItem, setHistoryModalItem] = useState(null);

  // --- Local State for Admin Mapping ---
  const [stripePromos, setStripePromos] = useState([]);
  const [editingPromos, setEditingPromos] = useState({});
  const [isSyncingStripe, setIsSyncingStripe] = useState(false);

  const [ytPlaylists, setYtPlaylists] = useState([]);
  const [editingYt, setEditingYt] = useState({});

  useEffect(() => {
    if (currentUser?.isAdmin) {
        fetch(`${API_URL}?action=get_all`)
            .then(res => res.json())
            .then(data => {
                if (data.stripe_promos) setStripePromos(data.stripe_promos);
                if (data.youtube_playlists) setYtPlaylists(data.youtube_playlists);
            });
    }
  }, [currentUser]);

  // --- STRIPE LOGIC ---
  const handleSyncStripe = async () => {
    const stripeKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    if (!stripeKey) {
        alert("Stripe Secret Key is missing! Please add VITE_STRIPE_SECRET_KEY to your Vercel Environment Variables.");
        return;
    }
    setIsSyncingStripe(true);
    try {
        const res = await fetch(`${API_URL}?action=sync_stripe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stripeKey }) });
        const data = await res.json();
        if (data.error) alert("Stripe Sync Error: " + data.error);
        else { alert(`Successfully synced Stripe! Added/Updated ${data.commissionsAdded} commissions.`); window.location.reload(); }
    } catch (err) { alert("Error syncing with Stripe API."); }
    setIsSyncingStripe(false);
  };

  const handleSaveStripePromo = async (promo) => {
    try {
        await fetch(`${API_URL}?action=save_stripe_promo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(promo) });
        setStripePromos(prev => prev.map(p => p.id === promo.id ? promo : p));
        setEditingPromos(prev => { const newState = { ...prev }; delete newState[promo.id]; return newState; });
    } catch (err) { console.error(err); }
  };

  const handleUpdatePromoField = (promoId, field, value) => {
      setEditingPromos(prev => ({ ...prev, [promoId]: { ...(prev[promoId] || stripePromos.find(p => p.id === promoId)), [field]: value } }));
  };

  const savePromo = (promoId) => { if (editingPromos[promoId]) handleSaveStripePromo(editingPromos[promoId]); };

  // --- YOUTUBE PLAYLIST LOGIC ---
  const handleAddYtPlaylist = () => {
      const newId = 'yt_pl_' + Date.now();
      const newPl = { id: newId, channelId: youtubeChannels[0]?.id || '', playlistId: '', playlistName: 'New Playlist', userId: '', revShare: 100, paymentStartDate: '' };
      setYtPlaylists([newPl, ...ytPlaylists]);
      setEditingYt(prev => ({ ...prev, [newId]: newPl }));
  };

  const handleSaveYtPlaylist = async (playlist) => {
      if (!playlist.playlistId || !playlist.userId || !playlist.paymentStartDate) { alert("Please fill in the Playlist URL, Creator, and Start Date before saving."); return; }
      try {
          await fetch(`${API_URL}?action=save_youtube_playlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(playlist) });
          setYtPlaylists(prev => prev.map(p => p.id === playlist.id ? playlist : p));
          setEditingYt(prev => { const newState = { ...prev }; delete newState[playlist.id]; return newState; });
      } catch (err) { console.error(err); }
  };

  const handleDeleteYtPlaylist = async (id) => {
      if (!window.confirm("Are you sure you want to remove this playlist from the ledger?")) return;
      setYtPlaylists(prev => prev.filter(p => p.id !== id));
      try { await fetch(`${API_URL}?action=delete_youtube_playlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); } 
      catch (err) { console.error(err); }
  };

  // --- UNIFIED CREATOR LEDGER LOGIC ---
  const unifiedLedger = users.map(user => {
      // 1. YouTube Earnings
      const userPlaylists = ytPlaylists.filter(pl => pl.userId === user.id);
      let ytEarned = 0; let ytVideos = 0;
      const ytNormIds = []; const ytRawIds = [];
      
      userPlaylists.forEach(pl => {
          const rev = parseFloat(pl.ledgerRevenue || 0);
          const pct = parseFloat(pl.revShare ?? 100) / 100;
          ytEarned += (rev * pct);
          ytVideos += parseInt(pl.ledgerVideos || 0);
          ytRawIds.push(pl.playlistId);
          ytNormIds.push(normalizePlaylistId(pl.playlistId));
      });

      // 2. WordPress Earnings
      const wpRecord = user.wpUserId ? wpLedgerData.find(wp => wp.wp_user_id == user.wpUserId) : null;
      const wpEarned = wpRecord ? parseFloat(wpRecord.total_earned || 0) : 0;
      const wpArticles = wpRecord ? parseInt(wpRecord.articles || 0) : 0;
      const wpShowId = `wp_articles_${user.wpUserId}`;

      // 3. Stripe Promo Earnings
      let stripeEarned = 0;
      payouts.forEach(p => {
          if (p.showId === user.id && p.transactionType === 'Stripe Commission') stripeEarned += parseFloat(p.amount || 0);
      });

      const totalEarned = ytEarned + wpEarned + stripeEarned;

      // 4. Combined Payouts & Deductions
      let paid = 0;
      let deducted = 0;
      const relatedIds = [user.id, wpShowId, ...ytNormIds, ...ytRawIds];
      
      payouts.forEach(p => {
          if (relatedIds.includes(p.showId) && p.transactionType !== 'Stripe Commission') {
              if (p.transactionType === 'Payment') paid += parseFloat(p.amount || 0);
              if (p.transactionType === 'Deduction') deducted += parseFloat(p.amount || 0);
          }
      });

      const balance = totalEarned - paid - deducted;

      return { ...user, ytEarned, ytVideos, wpEarned, wpArticles, stripeEarned, totalEarned, paid, deducted, balance, relatedIds };
  }).filter(u => currentUser?.isAdmin ? (u.totalEarned > 0 || u.balance !== 0 || u.id === currentUser?.id) : u.id === currentUser?.id);


  // --- DYNAMIC GRAND TOTALS ---
  const grandTotalEarned = unifiedLedger.reduce((sum, u) => sum + u.totalEarned, 0);
  const grandTotalPaid = unifiedLedger.reduce((sum, u) => sum + u.paid, 0);
  const grandTotalOwed = unifiedLedger.reduce((sum, u) => sum + u.balance, 0);

  // --- HISTORY FILTER LOGIC ---
  const currentUserUnified = unifiedLedger.find(u => u.id === currentUser?.id);
  const validHistoryIds = currentUser?.isAdmin ? payouts.map(p=>p.showId) : (currentUserUnified?.relatedIds || []);
  const visibleHistory = payouts.filter(p => validHistoryIds.includes(p.showId) && p.transactionType !== 'Stripe Commission');


  // ---------------------------------------------------------
  // EARLY RETURN 1: YOUTUBE PLAYLISTS ADMIN DASHBOARD
  // ---------------------------------------------------------
  if (activeTab === 'yt_playlists' && currentUser?.isAdmin) {
    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
        <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Youtube className="text-red-600" size={28} />
                        YouTube Playlists
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Map YouTube playlists to creators to auto-calculate their revenue share.</p>
                </div>
                <button onClick={handleAddYtPlaylist} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2">
                    <Plus size={18} /> Add Playlist
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[900px]">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-4 w-48">YouTube Channel</th>
                                <th className="px-4 py-4">Playlist URL / ID</th>
                                <th className="px-4 py-4 w-40">Creator</th>
                                <th className="px-4 py-4 w-28">Rev Share %</th>
                                <th className="px-4 py-4 w-40">Start Date</th>
                                <th className="px-4 py-4 text-right w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {ytPlaylists && ytPlaylists.length > 0 ? ytPlaylists.map((pl) => {
                                const isEditing = editingYt.hasOwnProperty(pl.id);
                                const currentPl = editingYt[pl.id] || pl;

                                return (
                                <tr key={pl.id} className="hover:bg-slate-50 transition-colors">
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
                                                <div className="font-bold text-slate-800">{pl.playlistName || 'Unknown Playlist'}</div>
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
                                        ) : ( <span className="font-medium text-slate-700">{users.find(u => u.id === pl.userId)?.name || 'Unassigned'}</span> )}
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
                                        <div className="flex items-center justify-end gap-2">
                                            {isEditing ? (
                                                <button onClick={() => handleSaveYtPlaylist(currentPl)} className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-emerald-200 transition-colors flex items-center gap-1">
                                                    <Save size={14} /> Save
                                                </button>
                                            ) : (
                                                <button onClick={() => setEditingYt(prev => ({...prev, [pl.id]: pl}))} className="text-slate-400 hover:text-blue-600 px-2 py-1 transition-colors text-xs font-bold">Edit</button>
                                            )}
                                            <button onClick={() => handleDeleteYtPlaylist(pl.id)} className="text-slate-400 hover:text-red-600 p-1 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )}) : (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500"><div className="flex flex-col items-center justify-center"><Youtube size={48} className="text-slate-300 mb-3" /><p className="font-semibold">No YouTube Playlists mapped.</p><p className="text-sm">Click "Add Playlist" to start tracking revenue share.</p></div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // EARLY RETURN 2: STRIPE PROMOS ADMIN DASHBOARD
  // ---------------------------------------------------------
  if (activeTab === 'promos' && currentUser?.isAdmin) {
    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
        <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <LinkIcon className="text-blue-600" size={28} />
                        Stripe Promos
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Map Stripe promotion codes to creators to calculate recurring commissions.</p>
                </div>
                <button onClick={handleSyncStripe} disabled={isSyncingStripe} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2">
                    <RefreshCw size={18} className={isSyncingStripe ? "animate-spin" : ""} /> Sync Stripe
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[700px]">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Stripe Promo Code</th>
                                <th className="px-6 py-4">Assigned Creator</th>
                                <th className="px-6 py-4">Commission %</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stripePromos && stripePromos.length > 0 ? stripePromos.map((promo) => {
                                const isEditing = editingPromos.hasOwnProperty(promo.id);
                                const currentPromoState = editingPromos[promo.id] || promo;

                                return (
                                <tr key={promo.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800">{promo.code}</td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={currentPromoState.userId || ''} 
                                            onChange={(e) => handleUpdatePromoField(promo.id, 'userId', e.target.value)}
                                            className="w-full max-w-[200px] border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2 text-sm bg-white"
                                        >
                                            <option value="">-- Unassigned --</option>
                                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                value={currentPromoState.commissionRate || ''} 
                                                onChange={(e) => handleUpdatePromoField(promo.id, 'commissionRate', e.target.value)}
                                                className="w-20 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2 text-sm text-right"
                                            />
                                            <span className="text-slate-500 font-bold">%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {isEditing ? (
                                            <button onClick={() => savePromo(promo.id)} className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-emerald-200 transition-colors flex items-center gap-1 ml-auto">
                                                <Save size={14} /> Save
                                            </button>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Saved</span>
                                        )}
                                    </td>
                                </tr>
                            )}) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <LinkIcon size={48} className="text-slate-300 mb-3" />
                                            <p className="font-semibold">No promo codes found.</p>
                                            <p className="text-sm">Click "Sync Stripe" to pull your active promotion codes.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // EARLY RETURN 3: WP ARTICLES INFORMATIONAL VIEW
  // ---------------------------------------------------------
  if (activeTab === 'wordpress') {
    const visibleWpLedger = wpLedgerData.filter(wpRecord => currentUser?.isAdmin || wpRecord.wp_user_id == currentUser?.wpUserId);
    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
        <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Globe className="text-sky-600" size={28} />
                        WordPress Articles
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">View article counts, views, and generated revenue for your writers.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[700px]">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">WordPress Writer</th>
                                <th className="px-6 py-4">Linked User Profile</th>
                                <th className="px-6 py-4 text-center">Articles</th>
                                <th className="px-6 py-4 text-center">Views</th>
                                <th className="px-6 py-4 text-right">Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visibleWpLedger.map(wpRecord => {
                                const earned = parseFloat(wpRecord.total_earned || 0);
                                const linkedUser = users.find(u => u.wpUserId == wpRecord.wp_user_id);
                                
                                return (
                                <tr key={wpRecord.wp_user_id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                                        <Globe size={16} className="text-sky-500" /> {wpRecord.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {linkedUser ? linkedUser.name : <span className="text-slate-400 italic">Unlinked</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-700">{wpRecord.articles || 0}</td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-700">{parseInt(wpRecord.views || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatCurrency(earned)}</td>
                                </tr>
                            )})}
                            {visibleWpLedger.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No WordPress article data available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN LEDGER DASHBOARD LOGIC (Unified Balances & History)
  // ---------------------------------------------------------
  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
      <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="text-emerald-600" size={28} />
              Creator Payout Ledger
            </h2>
            <p className="text-slate-500 text-sm mt-1">
               {currentUser?.isAdmin 
                   ? "Unified balance calculator driven by YouTube video revenue, Stripe codes, and WP articles." 
                   : "Your personal unified earnings calculator."}
            </p>
          </div>
          
          {currentUser?.isAdmin && (
              <div className="flex items-center gap-3">
                 <button 
                   onClick={handleSyncLedger} 
                   disabled={isSyncingLedger}
                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors border ${isSyncingLedger ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                 >
                   <RefreshCw size={16} className={isSyncingLedger ? 'animate-spin' : ''} />
                   {isSyncingLedger ? 'Syncing...' : 'Sync Latest Data'}
                 </button>

                 <button 
                   onClick={() => openPayoutModal()} 
                   className="bg-slate-900 text-emerald-400 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                 >
                   <Plus size={16} strokeWidth={2.5} /> Log Transaction
                 </button>
              </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
            <div className="text-slate-500 text-sm font-medium mb-1">Total Lifetime Earned</div>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(grandTotalEarned)}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-slate-800">
            <div className="text-slate-500 text-sm font-medium mb-1">Total Lifetime Paid</div>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(grandTotalPaid)}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
            <div className="text-slate-500 text-sm font-medium mb-1">Current Outstanding Balance</div>
            <div className={`text-3xl font-bold ${grandTotalOwed < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{formatCurrency(grandTotalOwed)}</div>
          </div>
        </div>

        <div className="flex bg-slate-200/50 p-1 rounded-lg w-fit mb-4 flex-shrink-0 border border-slate-200">
            <button onClick={() => setHistoryModalItem(null)} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${historyModalItem === null ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Current Balances</button>
            <button onClick={() => setHistoryModalItem('full_history')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${historyModalItem === 'full_history' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Payment History</button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
           {historyModalItem === null ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
                 <div className="overflow-x-auto flex-1">
                     <table className="w-full text-left min-w-[1000px]">
                         <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                             <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                 <th className="p-4 w-64">Creator</th>
                                 <th className="p-4 w-56">Earnings Breakdown</th>
                                 <th className="p-4 w-32 text-right">Total Earned</th>
                                 <th className="p-4 w-32 text-right">Paid & Deducted</th>
                                 <th className="p-4 w-32 text-right bg-slate-50">Current Balance</th>
                                 {currentUser?.isAdmin && <th className="p-4 w-24 text-center"></th>}
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                             {unifiedLedger.map(u => (
                                 <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                     <td className="p-4">
                                         <div className="flex items-center gap-3">
                                            {u.avatarUrl ? <img src={u.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-white flex-shrink-0" /> : <UserCircle size={32} className="text-slate-400 flex-shrink-0" />}
                                            <div className="font-bold text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => setHistoryModalItem({ id: u.id, name: u.name, relatedIds: u.relatedIds })} title="View Payment History">{u.name}</div>
                                         </div>
                                     </td>
                                     <td className="p-4 text-xs">
                                         <div className="flex items-center gap-2 mb-1">
                                             <span className="w-20 text-slate-500 flex items-center gap-1"><Youtube size={12} className="text-red-500"/> YouTube:</span> 
                                             <span className={`font-medium ${u.ytEarned > 0 ? 'text-slate-700' : 'text-slate-400'}`}>{formatCurrency(u.ytEarned)}</span> 
                                             <span className="text-[9px] text-slate-400">({u.ytVideos} vids)</span>
                                         </div>
                                         <div className="flex items-center gap-2 mb-1">
                                             <span className="w-20 text-slate-500 flex items-center gap-1"><Globe size={12} className="text-sky-500"/> Articles:</span> 
                                             <span className={`font-medium ${u.wpEarned > 0 ? 'text-slate-700' : 'text-slate-400'}`}>{formatCurrency(u.wpEarned)}</span> 
                                             <span className="text-[9px] text-slate-400">({u.wpArticles} arts)</span>
                                         </div>
                                         <div className="flex items-center gap-2 mb-1">
                                             <span className="w-20 text-slate-500 flex items-center gap-1"><LinkIcon size={12} className="text-blue-500"/> Promos:</span> 
                                             <span className={`font-medium ${u.stripeEarned > 0 ? 'text-slate-700' : 'text-slate-400'}`}>{formatCurrency(u.stripeEarned)}</span>
                                         </div>
                                     </td>
                                     <td className="p-4 text-right font-medium text-slate-700">{formatCurrency(u.totalEarned)}</td>
                                     <td className="p-4 text-right font-medium text-slate-700">
                                         {formatCurrency(u.paid)}
                                         {u.deducted > 0 && <div className="text-[10px] text-red-500 mt-0.5 font-bold">- {formatCurrency(u.deducted)} (Fines)</div>}
                                     </td>
                                     <td className={`p-4 text-right font-bold ${u.balance < 0 ? 'text-red-600 bg-red-50/30' : 'text-emerald-600 bg-emerald-50/30'}`}>
                                         {formatCurrency(u.balance)}
                                     </td>
                                     {currentUser?.isAdmin && (
                                         <td className="p-4 text-center">
                                             <button onClick={() => openPayoutModal({ showId: u.id, amount: u.balance > 0 ? u.balance : 0, paymentDate: new Date().toISOString().split('T')[0], transactionType: 'Payment' })} className="text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 transition-colors whitespace-nowrap">
                                                 Pay Now
                                             </button>
                                         </td>
                                     )}
                                 </tr>
                             ))}
                             {unifiedLedger.length === 0 && <tr><td colSpan={currentUser?.isAdmin ? "6" : "5"} className="p-8 text-center text-slate-500">No active creators or earnings on the ledger.</td></tr>}
                         </tbody>
                     </table>
                 </div>
              </div>
           ) : historyModalItem === 'full_history' ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
                 <div className="overflow-x-auto flex-1">
                     <table className="w-full text-left min-w-[800px]">
                         <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                             <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                 <th className="p-4">Date Logged</th>
                                 <th className="p-4">Target Creator</th>
                                 <th className="p-4 text-right">Amount</th>
                                 <th className="p-4">Type / Account</th>
                                 <th className="p-4">Memo</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                             {visibleHistory.map(p => {
                                 let displayName = 'Unknown Creator';
                                 const matchedUser = unifiedLedger.find(u => u.relatedIds.includes(p.showId));
                                 if (matchedUser) displayName = matchedUser.name;
                                 
                                 return (
                                     <tr key={p.id} className={`hover:bg-slate-50 transition-colors group ${currentUser?.isAdmin ? 'cursor-pointer' : ''}`} onClick={() => { if(currentUser?.isAdmin) openPayoutModal(p); }}>
                                         <td className="p-4 text-sm font-medium text-slate-700">
                                            {new Date(`${p.paymentDate}T12:00:00`).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                                         </td>
                                         <td className="p-4 font-bold text-slate-800">{displayName}</td>
                                         <td className="p-4 text-right font-bold">
                                             {p.transactionType === 'Deduction' ? (
                                                 <span className="text-red-500">-{formatCurrency(p.amount)}</span>
                                             ) : (
                                                 <span className="text-emerald-600">{formatCurrency(p.amount)}</span>
                                             )}
                                         </td>
                                         <td className="p-4">
                                             {p.transactionType === 'Deduction' ? (
                                                 <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Penalty / Deduction</span>
                                             ) : (
                                                 <>
                                                     <div className="text-xs font-bold text-slate-700">{p.paymentMethod}</div>
                                                     <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.paymentAccount}</div>
                                                 </>
                                             )}
                                         </td>
                                         <td className="p-4 text-xs text-slate-500 max-w-xs truncate" title={p.notes}>
                                             {p.notes ? <span className="flex items-center gap-1"><FileText size={12}/> {p.notes}</span> : '--'}
                                         </td>
                                     </tr>
                                 )
                             })}
                             {visibleHistory.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500"><History size={32} className="mx-auto mb-2 opacity-20"/> No payment history logged yet.</td></tr>}
                         </tbody>
                     </table>
                 </div>
              </div>
           ) : null}

           {/* INDIVIDUAL CREATOR HISTORY MODAL OVERLAY */}
           {historyModalItem && historyModalItem !== 'full_history' && (
             <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-emerald-500">
                 <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                          <Wallet size={20} />
                      </div>
                      <div>
                          <h3 className="font-bold text-lg text-slate-800 leading-tight">Payment History</h3>
                          <p className="text-xs text-slate-500 font-medium">History for "{historyModalItem.name}"</p>
                      </div>
                   </div>
                   <button onClick={() => setHistoryModalItem(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                 </div>
                 
                 <div className="overflow-y-auto flex-1 bg-slate-50">
                    <table className="w-full text-left">
                       <thead className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                           <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                               <th className="p-4">Date Logged</th>
                               <th className="p-4 text-right">Amount</th>
                               <th className="p-4">Type / Account</th>
                               <th className="p-4">Memo</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {(() => {
                               const modalPayouts = payouts.filter(p => historyModalItem.relatedIds.includes(p.showId) && p.transactionType !== 'Stripe Commission');
                               
                               if (modalPayouts.length === 0) {
                                   return <tr><td colSpan="4" className="p-12 text-center text-slate-500"><History size={32} className="mx-auto mb-2 opacity-20"/> No payment history logged for this creator yet.</td></tr>;
                               }
                               
                               return modalPayouts.map(p => (
                                   <tr key={p.id} className={`hover:bg-white transition-colors group ${currentUser?.isAdmin ? 'cursor-pointer' : ''}`} onClick={() => { if(currentUser?.isAdmin) { setHistoryModalItem(null); openPayoutModal(p); } }}>
                                       <td className="p-4 text-sm font-medium text-slate-700">
                                          {new Date(`${p.paymentDate}T12:00:00`).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
                                       </td>
                                       <td className="p-4 text-right font-bold">
                                           {p.transactionType === 'Deduction' ? (
                                               <span className="text-red-500">-{formatCurrency(p.amount)}</span>
                                           ) : (
                                               <span className="text-emerald-600">{formatCurrency(p.amount)}</span>
                                           )}
                                       </td>
                                       <td className="p-4">
                                           {p.transactionType === 'Deduction' ? (
                                               <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Penalty / Deduction</span>
                                           ) : (
                                               <>
                                                   <div className="text-xs font-bold text-slate-700">{p.paymentMethod}</div>
                                                   <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.paymentAccount}</div>
                                               </>
                                           )}
                                       </td>
                                       <td className="p-4 text-xs text-slate-500 max-w-xs truncate" title={p.notes}>
                                           {p.notes ? <span className="flex items-center gap-1"><FileText size={12}/> {p.notes}</span> : '--'}
                                       </td>
                                   </tr>
                               ));
                           })()}
                       </tbody>
                    </table>
                 </div>
                 
                 <div className="p-6 border-t border-slate-100 flex justify-end flex-shrink-0 bg-white">
                   <button type="button" onClick={() => setHistoryModalItem(null)} className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors font-bold shadow-sm">Close</button>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}