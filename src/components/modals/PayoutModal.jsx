import React from 'react';
import { CreditCard, X, DollarSign, FileText, Calendar, Wallet } from 'lucide-react';

export default function PayoutModal({
  editingPayout, setEditingPayout, handleSavePayout, setIsPayoutModalOpen, shows
}) {

  // Create a unique list of Playlists for the dropdown
  const uniquePlaylistsMap = new Map();
  shows.filter(s => s.paymentStartDate && s.playlistId).forEach(s => {
    if (!uniquePlaylistsMap.has(s.playlistId)) {
      uniquePlaylistsMap.set(s.playlistId, s);
    }
  });
  const eligiblePlaylists = Array.from(uniquePlaylistsMap.values());

  const activePlaylist = eligiblePlaylists.find(s => s.playlistId === editingPayout.showId);

  const handlePlaylistChange = (e) => {
    const playlistId = e.target.value;
    const playlistRep = eligiblePlaylists.find(s => s.playlistId === playlistId);
    setEditingPayout({
      ...editingPayout,
      showId: playlistId,
      paymentMethod: playlistRep?.paymentMethod || '',
      paymentAccount: playlistRep?.paymentAccount || ''
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-emerald-500">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Wallet className="text-emerald-500" size={20} />
            {editingPayout.id ? 'Edit Payment Record' : 'Log New Transaction'}
          </h3>
          <button type="button" onClick={() => setIsPayoutModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <form id="payoutForm" onSubmit={handleSavePayout} className="space-y-5">

            <div className="flex bg-slate-100 p-1 rounded-lg mb-5">
                <button type="button" onClick={() => setEditingPayout({...editingPayout, transactionType: 'Payment'})} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${editingPayout.transactionType === 'Payment' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Log Payment</button>
                <button type="button" onClick={() => setEditingPayout({...editingPayout, transactionType: 'Deduction'})} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${editingPayout.transactionType === 'Deduction' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Log Penalty / Deduction</button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Playlist / Target</label>
              <select required value={editingPayout.showId} onChange={handlePlaylistChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
                <option value="" disabled>Select a playlist</option>
                {eligiblePlaylists.map(s => (
                  <option key={s.playlistId} value={s.playlistId}>{s.playlistName || s.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={14} className="text-slate-400" /></div>
                  <input required type="number" step="0.01" min="0.01" value={editingPayout.amount} onChange={(e) => setEditingPayout({...editingPayout, amount: e.target.value})} className={`w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold ${editingPayout.transactionType === 'Deduction' ? 'text-red-600' : 'text-emerald-700'}`} placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> Date Logged</label>
                <input required type="date" value={editingPayout.paymentDate} onChange={(e) => setEditingPayout({...editingPayout, paymentDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            {editingPayout.transactionType === 'Payment' && (
              <>
                <div className="pt-2 border-t border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><CreditCard size={14} className="text-slate-400"/> Payment Method Used</label>
                    <select required value={editingPayout.paymentMethod} onChange={(e) => setEditingPayout({...editingPayout, paymentMethod: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                        <option value="" disabled>Select Method</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Venmo">Venmo</option>
                        <option value="Zelle">Zelle</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Other">Other...</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Details Sent To</label>
                    <input required type="text" value={editingPayout.paymentAccount} onChange={(e) => setEditingPayout({...editingPayout, paymentAccount: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Username, Email, Account #" />
                    {activePlaylist && activePlaylist.paymentMethod && (
                       <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          💡 Default method for this playlist: <b>{activePlaylist.paymentMethod} ({activePlaylist.paymentAccount})</b>
                       </p>
                    )}
                </div>
              </>
            )}

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><FileText size={14} className="text-slate-400"/> Ledger Notes / Memo</label>
              <textarea rows="3" value={editingPayout.notes || ''} onChange={(e) => setEditingPayout({...editingPayout, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder={editingPayout.transactionType === 'Deduction' ? "Reason for fine or deduction..." : "e.g., Payment for January & February watch hours..."} />
            </div>

          </form>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={() => setIsPayoutModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="payoutForm" className={`px-4 py-2 text-white rounded-lg transition-colors font-bold shadow-sm ${editingPayout.transactionType === 'Deduction' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
             {editingPayout.id ? 'Update Record' : (editingPayout.transactionType === 'Deduction' ? 'Log Penalty' : 'Log Payment')}
          </button>
        </div>
      </div>
    </div>
  );
}