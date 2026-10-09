import React from 'react';
import { Link as LinkIcon, RefreshCw, Save } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function StripeTab({
    currentUser,
    stripePromos,
    payouts,
    isSyncingStripe,
    handleSyncStripe,
    editingPromos,
    handleUpdatePromoField,
    savePromo,
    users
}) {
    // --- CREATOR VIEW ---
    if (!currentUser?.isAdmin) {
        const myPromos = stripePromos.filter(p => p.userId === currentUser?.id);
        const totalPromos = myPromos.length;
        let promoEarnings = 0;
        
        payouts.forEach(p => {
            if (p.showId === currentUser?.id && p.transactionType === 'Stripe Commission') {
                promoEarnings += parseFloat(p.amount || 0);
            }
        });

        return (
            <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
               <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <LinkIcon className="text-blue-600" size={28} />
                                Your Stripe Promos
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">Your assigned subscription codes and affiliate earnings.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-shrink-0">
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-slate-800">
                        <div className="text-slate-500 text-sm font-medium mb-1">Active Subscription Codes</div>
                        <div className="text-3xl font-bold text-slate-800">{totalPromos}</div>
                      </div>
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
                        <div className="text-slate-500 text-sm font-medium mb-1">Total Affiliate Earnings</div>
                        <div className="text-3xl font-bold text-blue-600">{formatCurrency(promoEarnings)}</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left min-w-[700px]">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4 text-center">Commission %</th>
                                    <th className="px-6 py-4 text-center">Uses</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {myPromos.length > 0 ? myPromos.map(promo => (
                                    <tr key={promo.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2"><LinkIcon size={16} className="text-blue-500 flex-shrink-0"/> {promo.code}</td>
                                        <td className="px-6 py-4 text-center font-bold text-blue-600">{promo.commissionRate}%</td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700">{promo.uses || 0}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <LinkIcon size={48} className="text-slate-300 mb-3" />
                                                <p className="font-semibold text-slate-700">No subscription codes assigned.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
      
    // --- ADMIN VIEW (Master List) ---
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
                                <th className="px-6 py-4 text-center">Uses</th>
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
                                    <td className="px-6 py-4 text-center font-bold text-slate-700">{promo.uses || 0}</td>
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
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
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