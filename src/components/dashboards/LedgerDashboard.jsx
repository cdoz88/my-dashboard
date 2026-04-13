import React, { useState } from 'react';
import { Calculator, RefreshCw, Plus, DollarSign, Youtube, FileText, History, X, Wallet, Globe } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

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
  const [activeLedgerTab, setActiveLedgerTab] = useState('balances');
  const [historyModalItem, setHistoryModalItem] = useState(null);

  const currentFilter = ['all', 'youtube', 'wordpress'].includes(activeTab) ? activeTab : 'all';

  // --- 1. YOUTUBE SHOWS LOGIC ---
  const allowedShows = shows.filter(s => 
      currentUser?.isAdmin || (s.userIds || []).includes(currentUser?.id)
  );

  const uniquePlaylistsMap = new Map();
  allowedShows.filter(s => s.paymentStartDate && s.playlistId).forEach(s => {
      const cleanId = normalizePlaylistId(s.playlistId);
      if (!uniquePlaylistsMap.has(cleanId)) {
          uniquePlaylistsMap.set(cleanId, { ...s, normalizedPlaylistId: cleanId });
      }
  });
  const eligiblePlaylists = Array.from(uniquePlaylistsMap.values());

  const calculateTotalEarned = (show) => {
      const videos = parseInt(show.ledgerVideos || 0);
      const revenue = parseFloat(show.ledgerRevenue || 0);
      const baseTotal = videos * parseFloat(show.basePay || 0);
      const revSharePct = parseFloat(show.revShare ?? 100) / 100;
      const revShareTotal = revenue * revSharePct;
      return baseTotal + revShareTotal;
  };

  const calculateTotalPaid = (normalizedPlaylistId) => {
      const relatedShowIds = allowedShows.filter(s => normalizePlaylistId(s.playlistId) === normalizedPlaylistId).map(s => s.id);
      const rawPlaylistIds = allowedShows.filter(s => normalizePlaylistId(s.playlistId) === normalizedPlaylistId).map(s => s.playlistId);
      
      return payouts
          .filter(p => (
              p.showId === normalizedPlaylistId || 
              rawPlaylistIds.includes(p.showId) || 
              relatedShowIds.includes(p.showId)
          ) && p.transactionType === 'Payment')
          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };
  
  const calculateTotalDeducted = (normalizedPlaylistId) => {
      const relatedShowIds = allowedShows.filter(s => normalizePlaylistId(s.playlistId) === normalizedPlaylistId).map(s => s.id);
      const rawPlaylistIds = allowedShows.filter(s => normalizePlaylistId(s.playlistId) === normalizedPlaylistId).map(s => s.playlistId);
      
      return payouts
          .filter(p => (
              p.showId === normalizedPlaylistId || 
              rawPlaylistIds.includes(p.showId) || 
              relatedShowIds.includes(p.showId)
          ) && p.transactionType === 'Deduction')
          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  // --- 2. WORDPRESS ARTICLES LOGIC ---
  const visibleWpLedger = wpLedgerData.filter(wpRecord => {
      if (currentUser?.isAdmin) return true;
      return wpRecord.wp_user_id == currentUser?.wpUserId;
  });

  const calculateTotalWpPaid = (wpUserId) => {
      return payouts
          .filter(p => p.showId === `wp_articles_${wpUserId}` && p.transactionType === 'Payment')
          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  const calculateTotalWpDeducted = (wpUserId) => {
      return payouts
          .filter(p => p.showId === `wp_articles_${wpUserId}` && p.transactionType === 'Deduction')
          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  // --- 3. FILTERING FOR DISPLAY ---
  const filteredPlaylists = (currentFilter === 'all' || currentFilter === 'youtube') ? eligiblePlaylists : [];
  const filteredWpLedger = (currentFilter === 'all' || currentFilter === 'wordpress') ? visibleWpLedger : [];

  const allowedFilteredPlaylistIds = filteredPlaylists.map(s => s.normalizedPlaylistId);
  const rawAllowedFilteredPlaylistIds = filteredPlaylists.map(s => s.playlistId);
  const allowedFilteredWpShowIds = filteredWpLedger.map(wp => `wp_articles_${wp.wp_user_id}`);
  
  const visiblePayouts = payouts.filter(p => {
      if (currentFilter === 'youtube') {
          return allowedFilteredPlaylistIds.includes(p.showId) || rawAllowedFilteredPlaylistIds.includes(p.showId);
      }
      if (currentFilter === 'wordpress') {
          return allowedFilteredWpShowIds.includes(p.showId);
      }
      return (
          allowedFilteredPlaylistIds.includes(p.showId) || 
          rawAllowedFilteredPlaylistIds.includes(p.showId) || 
          allowedFilteredWpShowIds.includes(p.showId)
      );
  });

  // --- 4. DYNAMIC GRAND TOTALS ---
  const ytTotalEarned = filteredPlaylists.reduce((sum, p) => sum + calculateTotalEarned(p), 0);
  const wpTotalEarned = filteredWpLedger.reduce((sum, wp) => sum + parseFloat(wp.total_earned || 0), 0);
  
  const grandTotalEarned = ytTotalEarned + wpTotalEarned;
  const grandTotalPaid = visiblePayouts.filter(p => p.transactionType === 'Payment').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const grandTotalDeducted = visiblePayouts.filter(p => p.transactionType === 'Deduction').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const grandTotalOwed = grandTotalEarned - grandTotalPaid - grandTotalDeducted;

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Calculator className="text-emerald-600" size={28} />
             Creator Payout Ledger
          </h2>
          <p className="text-slate-500 text-sm mt-1">
             {currentUser?.isAdmin 
                 ? "Running balance calculator driven by YouTube video revenue and WordPress articles." 
                 : "Your personal earnings calculator driven by YouTube video revenue and WordPress articles."}
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
          <button onClick={() => setActiveLedgerTab('balances')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeLedgerTab === 'balances' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Current Balances</button>
          <button onClick={() => setActiveLedgerTab('history')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeLedgerTab === 'history' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Payment History</button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
         {activeLedgerTab === 'balances' ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
               <div className="overflow-x-auto flex-1">
                   <table className="w-full text-left min-w-[1000px]">
                       <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                           <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                               <th className="p-4 w-56">Playlist / Show Name</th>
                               <th className="p-4 w-32">Pay Rates</th>
                               <th className="p-4 w-40 text-center">Eligible Stats<br/><span className="text-[9px] font-normal normal-case">(Since Start Date)</span></th>
                               <th className="p-4 w-32 text-right">Total Earned</th>
                               <th className="p-4 w-32 text-right">Total Paid/Deducted</th>
                               <th className="p-4 w-32 text-right bg-slate-50">Current Balance</th>
                               {currentUser?.isAdmin && <th className="p-4 w-12 text-center"></th>}
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {/* YouTube Shows */}
                           {filteredPlaylists.map(show => {
                               const displayName = show.playlistName || show.title;
                               const earned = calculateTotalEarned(show);
                               const paid = calculateTotalPaid(show.normalizedPlaylistId);
                               const deducted = calculateTotalDeducted(show.normalizedPlaylistId);
                               const balance = earned - paid - deducted;
                               
                               return (
                                   <tr key={show.normalizedPlaylistId} className="hover:bg-slate-50 transition-colors">
                                       <td className="p-4">
                                           <div className="font-bold text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors w-fit" onClick={() => setHistoryModalItem({ id: show.normalizedPlaylistId, name: displayName, type: 'youtube' })} title="View Payment History">{displayName}</div>
                                           <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                               <Youtube size={10} className="text-red-500" /> Start: {new Date(`${show.paymentStartDate}T12:00:00`).toLocaleDateString()}
                                           </div>
                                       </td>
                                       <td className="p-4 text-xs font-medium text-slate-600">
                                           <div>Base: {formatCurrency(show.basePay)}/ep</div>
                                           <div className="mt-1">Rev Share: {show.revShare ?? 100}%</div>
                                       </td>
                                       <td className="p-4">
                                           <div className="flex justify-center gap-4 text-xs">
                                               <div className="text-center"><div className="font-bold text-slate-800">{show.ledgerVideos || 0}</div><div className="text-[9px] text-slate-400 uppercase">Videos</div></div>
                                               <div className="text-center"><div className="font-bold text-emerald-600">{formatCurrency(show.ledgerRevenue || 0)}</div><div className="text-[9px] text-slate-400 uppercase">Total Rev</div></div>
                                           </div>
                                       </td>
                                       <td className="p-4 text-right font-medium text-slate-700">{formatCurrency(earned)}</td>
                                       <td className="p-4 text-right font-medium text-slate-700">
                                           {formatCurrency(paid)}
                                           {deducted > 0 && <div className="text-[10px] text-red-500 mt-0.5 font-bold">- {formatCurrency(deducted)} (Fines)</div>}
                                       </td>
                                       <td className={`p-4 text-right font-bold ${balance < 0 ? 'text-red-600 bg-red-50/30' : 'text-emerald-600 bg-emerald-50/30'}`}>
                                           {formatCurrency(balance)}
                                       </td>
                                       {currentUser?.isAdmin && (
                                           <td className="p-4 text-center">
                                               <button onClick={() => openPayoutModal({ showId: show.normalizedPlaylistId, amount: balance > 0 ? balance : 0, paymentDate: new Date().toISOString().split('T')[0], transactionType: 'Payment' })} className="text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 transition-colors whitespace-nowrap">
                                                   Pay Now
                                               </button>
                                           </td>
                                       )}
                                   </tr>
                               )
                           })}

                           {/* WordPress Articles */}
                           {filteredWpLedger.map(wpRecord => {
                               const earned = parseFloat(wpRecord.total_earned || 0);
                               const paid = calculateTotalWpPaid(wpRecord.wp_user_id);
                               const deducted = calculateTotalWpDeducted(wpRecord.wp_user_id);
                               const balance = earned - paid - deducted;
                               const wpShowId = `wp_articles_${wpRecord.wp_user_id}`;
                               const displayName = `Articles: ${wpRecord.name}`;
                               
                               return (
                                   <tr key={wpShowId} className="hover:bg-slate-50 transition-colors bg-sky-50/30">
                                       <td className="p-4">
                                           <div className="font-bold text-slate-800 cursor-pointer hover:text-sky-600 transition-colors w-fit" onClick={() => setHistoryModalItem({ id: wpShowId, name: displayName, type: 'wordpress', wpUserId: wpRecord.wp_user_id })} title="View Payment History">{displayName}</div>
                                           <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                               <Globe size={10} className="text-sky-500" /> WordPress Writer
                                           </div>
                                       </td>
                                       <td className="p-4 text-xs font-medium text-slate-400 italic">
                                           Rates on Wordpress
                                       </td>
                                       <td className="p-4">
                                           <div className="flex justify-center gap-4 text-xs">
                                               <div className="text-center"><div className="font-bold text-slate-800">{wpRecord.articles || 0}</div><div className="text-[9px] text-slate-400 uppercase">Articles</div></div>
                                               <div className="text-center"><div className="font-bold text-slate-800">{parseInt(wpRecord.views || 0).toLocaleString()}</div><div className="text-[9px] text-slate-400 uppercase">Views</div></div>
                                           </div>
                                       </td>
                                       <td className="p-4 text-right font-medium text-slate-700">{formatCurrency(earned)}</td>
                                       <td className="p-4 text-right font-medium text-slate-700">
                                           {formatCurrency(paid)}
                                           {deducted > 0 && <div className="text-[10px] text-red-500 mt-0.5 font-bold">- {formatCurrency(deducted)} (Fines)</div>}
                                       </td>
                                       <td className={`p-4 text-right font-bold ${balance < 0 ? 'text-red-600 bg-red-50/30' : 'text-sky-600 bg-sky-50/30'}`}>
                                           {formatCurrency(balance)}
                                       </td>
                                       {currentUser?.isAdmin && (
                                           <td className="p-4 text-center">
                                               <button onClick={() => openPayoutModal({ showId: wpShowId, amount: balance > 0 ? balance : 0, paymentDate: new Date().toISOString().split('T')[0], transactionType: 'Payment' })} className="text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 transition-colors whitespace-nowrap">
                                                   Pay Now
                                               </button>
                                           </td>
                                       )}
                                   </tr>
                               );
                           })}
                           {(filteredPlaylists.length === 0 && filteredWpLedger.length === 0) && <tr><td colSpan={currentUser?.isAdmin ? "7" : "6"} className="p-8 text-center text-slate-500">No shows or articles currently available on the ledger.</td></tr>}
                       </tbody>
                   </table>
               </div>
            </div>
         ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
               <div className="overflow-x-auto flex-1">
                   <table className="w-full text-left min-w-[800px]">
                       <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                           <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                               <th className="p-4">Date Logged</th>
                               <th className="p-4">Target Account</th>
                               <th className="p-4 text-right">Amount</th>
                               <th className="p-4">Type / Account</th>
                               <th className="p-4">Memo</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {visiblePayouts.map(p => {
                               let displayName = 'Unknown Target';
                               if (p.showId.startsWith('wp_articles_')) {
                                   const wpId = p.showId.replace('wp_articles_', '');
                                   const wpUser = filteredWpLedger.find(u => u.wp_user_id == wpId);
                                   if (wpUser) displayName = `Articles: ${wpUser.name}`;
                               } else {
                                   const playlist = filteredPlaylists.find(s => s.normalizedPlaylistId === p.showId || s.playlistId === p.showId || s.id === p.showId);
                                   if (playlist) displayName = playlist.playlistName || playlist.title;
                               }
                               
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
                           {visiblePayouts.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500"><History size={32} className="mx-auto mb-2 opacity-20"/> No payment history logged yet.</td></tr>}
                       </tbody>
                   </table>
               </div>
            </div>
         )}

         {/* HISTORY MODAL OVERLAY */}
         {historyModalItem && (
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
                             let filteredPayouts = [];
                             if (historyModalItem.type === 'youtube') {
                                 const relatedShowIds = allowedShows.filter(s => normalizePlaylistId(s.playlistId) === historyModalItem.id).map(s => s.id);
                                 const rawPlaylistIds = allowedShows.filter(s => normalizePlaylistId(s.playlistId) === historyModalItem.id).map(s => s.playlistId);
                                 filteredPayouts = visiblePayouts.filter(p => p.showId === historyModalItem.id || rawPlaylistIds.includes(p.showId) || relatedShowIds.includes(p.showId));
                             } else if (historyModalItem.type === 'wordpress') {
                                 filteredPayouts = visiblePayouts.filter(p => p.showId === historyModalItem.id);
                             }
                             
                             if (filteredPayouts.length === 0) {
                                 return <tr><td colSpan="4" className="p-12 text-center text-slate-500"><History size={32} className="mx-auto mb-2 opacity-20"/> No payment history logged for this target yet.</td></tr>;
                             }
                             
                             return filteredPayouts.map(p => (
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
  );
}