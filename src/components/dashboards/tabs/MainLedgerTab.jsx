import React, { useState } from 'react';
import { Calculator, RefreshCw, Plus, UserCircle, ExternalLink, Briefcase, Youtube, Globe, Link as LinkIcon, History, Wallet, X, FileText } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

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

// Generates dynamic outbound payment links based on preferred method
const getPaymentLink = (method, account) => {
    if (!account || !method) return null;
    let clean = account.trim();
    if (method === 'Venmo') return `https://venmo.com/${clean.replace('@', '')}`;
    if (method === 'CashApp') return `https://cash.app/$${clean.replace('$', '')}`;
    if (method === 'PayPal') return `https://paypal.me/${clean.replace('@', '')}`;
    return null;
};

export default function MainLedgerTab({
    currentUser,
    users,
    ytPlaylists,
    wpLedgerData,
    payouts,
    salaries,
    isSyncingLedger,
    handleSyncLedger,
    openPayoutModal
}) {
    const [historyModalItem, setHistoryModalItem] = useState(null);

    // --- UNIFIED CREATOR LEDGER LOGIC ---
    const unifiedLedger = users.map(user => {
        let ytEarned = 0; 
        let ytVideos = 0;
        const ytNormIds = []; 
        const ytRawIds = [];

        ytPlaylists.forEach(pl => {
            const totalRevPool = parseFloat(pl.ledgerRevenue || 0);
            const creatorNetPool = totalRevPool * (parseFloat(pl.revShare ?? 100) / 100);
            
            let activeSplits = pl.splits;
            if (typeof activeSplits === 'string') {
                try { activeSplits = JSON.parse(activeSplits); } catch(e) { activeSplits = []; }
            }
            if (!Array.isArray(activeSplits)) activeSplits = [];

            if (activeSplits.length > 0) {
                const userSplit = activeSplits.find(s => s.userId === user.id);
                if (userSplit) {
                    const distributionPercent = parseFloat(userSplit.percent || 0) / 100;
                    ytEarned += (creatorNetPool * distributionPercent);
                    ytVideos += parseInt(pl.ledgerVideos || 0);
                    ytRawIds.push(pl.playlistId);
                    ytNormIds.push(normalizePlaylistId(pl.playlistId));
                }
            } else {
                if (pl.userId === user.id) {
                    ytEarned += creatorNetPool;
                    ytVideos += parseInt(pl.ledgerVideos || 0);
                    ytRawIds.push(pl.playlistId);
                    ytNormIds.push(normalizePlaylistId(pl.playlistId));
                }
            }
        });

        const wpRecord = user.wpUserId ? wpLedgerData.find(wp => wp.wp_user_id == user.wpUserId) : null;
        const wpEarned = wpRecord ? parseFloat(wpRecord.total_earned || 0) : 0;
        const wpArticles = wpRecord ? parseInt(wpRecord.articles || 0) : 0;
        const wpShowId = `wp_articles_${user.wpUserId}`;

        let stripeEarned = 0;
        payouts.forEach(p => {
            if (p.showId === user.id && p.transactionType === 'Stripe Commission') stripeEarned += parseFloat(p.amount || 0);
        });

        // --- SALARY / BASE PAY CALCULATION ---
        let salaryEarned = 0;
        const userSalaries = (salaries || []).filter(s => s.userId === user.id);
        
        userSalaries.forEach(s => {
            const amt = parseFloat(s.amount || 0);
            if (!s.isRecurring) {
                salaryEarned += amt; // Flat rate one-time payment
            } else if (s.startDate) {
                // Calculate how many periods have passed since startDate
                const start = new Date(`${s.startDate}T12:00:00`);
                const now = new Date();
                
                if (now >= start) {
                    if (s.frequency === 'yearly') {
                        let years = now.getFullYear() - start.getFullYear();
                        if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
                            years--;
                        }
                        years = Math.max(0, years + 1); 
                        salaryEarned += (amt * years);
                    } else {
                        // Default to Monthly
                        let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
                        if (now.getDate() < start.getDate()) {
                            months--;
                        }
                        months = Math.max(0, months + 1); 
                        salaryEarned += (amt * months);
                    }
                }
            }
        });

        const totalEarned = ytEarned + wpEarned + stripeEarned + salaryEarned;
        let paid = 0; let deducted = 0;
        
        const relatedIds = [user.id, wpShowId, ...ytNormIds, ...ytRawIds];
        
        payouts.forEach(p => {
            if (relatedIds.includes(p.showId) && p.transactionType !== 'Stripe Commission') {
                if (p.transactionType === 'Payment') paid += parseFloat(p.amount || 0);
                if (p.transactionType === 'Deduction') deducted += parseFloat(p.amount || 0);
            }
        });
        const balance = totalEarned - paid - deducted;

        // CASCADE PARTIAL PAYMENTS (Salaries -> YT -> Articles -> Stripe)
        let remainingPaid = paid;

        let salaryRemaining = Math.max(0, salaryEarned - remainingPaid);
        remainingPaid = Math.max(0, remainingPaid - salaryEarned);
        
        let ytRemaining = Math.max(0, ytEarned - remainingPaid);
        remainingPaid = Math.max(0, remainingPaid - ytEarned);

        let wpRemaining = Math.max(0, wpEarned - remainingPaid);
        remainingPaid = Math.max(0, remainingPaid - wpEarned);

        let stripeRemaining = Math.max(0, stripeEarned - remainingPaid);

        return { ...user, ytEarned, ytVideos, wpEarned, wpArticles, stripeEarned, salaryEarned, totalEarned, paid, deducted, balance, relatedIds, ytRemaining, wpRemaining, stripeRemaining, salaryRemaining };
    }).filter(u => currentUser?.isAdmin ? (u.totalEarned > 0 || u.balance !== 0 || u.id === currentUser?.id || (salaries || []).some(s => s.userId === u.id)) : u.id === currentUser?.id);


    const grandTotalEarned = unifiedLedger.reduce((sum, u) => sum + u.totalEarned, 0);
    const grandTotalPaid = unifiedLedger.reduce((sum, u) => sum + u.paid, 0);
    const grandTotalOwed = unifiedLedger.reduce((sum, u) => sum + u.balance, 0);

    const currentUserUnified = unifiedLedger.find(u => u.id === currentUser?.id);
    const validHistoryIds = currentUser?.isAdmin ? payouts.map(p=>p.showId) : (currentUserUnified?.relatedIds || []);
    const visibleHistory = payouts.filter(p => validHistoryIds.includes(p.showId) && p.transactionType !== 'Stripe Commission');


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
                                   <th className="p-4 w-56">Unpaid Balance by Source</th>
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
                                           <div className="flex items-start gap-3">
                                              {u.avatarUrl ? <img src={u.avatarUrl} alt="Avatar" className="w-8 h-8 mt-1 rounded-full object-cover border border-slate-200 bg-white flex-shrink-0" /> : <UserCircle size={32} className="text-slate-400 mt-1 flex-shrink-0" />}
                                              <div className="flex flex-col">
                                                  <div className="font-bold text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => setHistoryModalItem({ id: u.id, name: u.name, relatedIds: u.relatedIds })} title="View Payment History">{u.name}</div>
                                                  {u.paymentMethod && u.paymentAccount && (
                                                      <div className="text-[10px] mt-0.5 flex flex-col items-start text-slate-500">
                                                          <span className="font-medium text-slate-600">{u.paymentMethod}: {u.paymentAccount}</span>
                                                          {getPaymentLink(u.paymentMethod, u.paymentAccount) && (
                                                              <a href={getPaymentLink(u.paymentMethod, u.paymentAccount)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-0.5 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                                  Pay via {u.paymentMethod} <ExternalLink size={10} />
                                                              </a>
                                                          )}
                                                      </div>
                                                  )}
                                              </div>
                                           </div>
                                       </td>
                                       <td className="p-4 text-xs">
                                           {/* Salaries / Base Pay */}
                                           {(u.salaryEarned > 0 || u.salaryRemaining > 0) && (
                                              <div className="flex items-center gap-2 mb-1">
                                                  <span className="w-20 text-slate-500 flex items-center gap-1"><Briefcase size={12} className={u.salaryRemaining > 0 ? "text-emerald-500" : "text-slate-400"}/> Base Pay:</span> 
                                                  <span className={`font-medium ${u.salaryRemaining > 0 ? 'text-slate-700' : 'text-slate-400 font-light'}`}>{formatCurrency(u.salaryRemaining)}</span> 
                                              </div>
                                           )}
                                           <div className="flex items-center gap-2 mb-1">
                                               <span className="w-20 text-slate-500 flex items-center gap-1"><Youtube size={12} className={u.ytRemaining > 0 ? "text-red-500" : "text-slate-400"}/> YouTube:</span> 
                                               <span className={`font-medium ${u.ytRemaining > 0 ? 'text-slate-700' : 'text-slate-400 font-light'}`}>{formatCurrency(u.ytRemaining)}</span> 
                                               {u.ytVideos > 0 && <span className="text-[9px] text-slate-400">({u.ytVideos} vids)</span>}
                                           </div>
                                           <div className="flex items-center gap-2 mb-1">
                                               <span className="w-20 text-slate-500 flex items-center gap-1"><Globe size={12} className={u.wpRemaining > 0 ? "text-sky-500" : "text-slate-400"}/> Articles:</span> 
                                               <span className={`font-medium ${u.wpRemaining > 0 ? 'text-slate-700' : 'text-slate-400 font-light'}`}>{formatCurrency(u.wpRemaining)}</span> 
                                               {u.wpArticles > 0 && <span className="text-[9px] text-slate-400">({u.wpArticles} arts)</span>}
                                           </div>
                                           <div className="flex items-center gap-2 mb-1">
                                               <span className="w-20 text-slate-500 flex items-center gap-1"><LinkIcon size={12} className={u.stripeRemaining > 0 ? "text-blue-500" : "text-slate-400"}/> {currentUser?.isAdmin ? 'Promos:' : 'Subs:'}</span> 
                                               <span className={`font-medium ${u.stripeRemaining > 0 ? 'text-slate-700' : 'text-slate-400 font-light'}`}>{formatCurrency(u.stripeRemaining)}</span>
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
                                               <button onClick={() => openPayoutModal({ 
                                                   showId: u.id, 
                                                   amount: u.balance > 0 ? u.balance : 0, 
                                                   paymentDate: new Date().toISOString().split('T')[0], 
                                                   transactionType: 'Payment',
                                                   paymentMethod: u.paymentMethod || 'Manual',
                                                   paymentAccount: u.paymentAccount || ''
                                               })} className="text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded hover:bg-slate-700 transition-colors whitespace-nowrap">
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