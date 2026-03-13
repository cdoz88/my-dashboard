import React from 'react';
import { Award, Briefcase, Trash2, Link as LinkIcon } from 'lucide-react';
import CompanyLogo from '../shared/CompanyLogo';
import { formatCurrency } from '../../utils/helpers';

export default function SponsorshipsDashboard({ 
  sponsorships, activeSponsorshipTab, openSponsorshipModal, handleDeleteSponsorship, companies, currentUser 
}) {
  const getCompany = (id) => companies.find(c => c.id === id);

  const viewSponsorships = activeSponsorshipTab === 'overview' 
    ? sponsorships 
    : sponsorships.filter(s => s.companyId === activeSponsorshipTab);

  const currentCompany = activeSponsorshipTab === 'overview' ? null : getCompany(activeSponsorshipTab);

  const getStatus = (sp) => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const start = new Date(`${sp.startDate}T12:00:00`);
      const end = new Date(`${sp.endDate}T12:00:00`);
      
      if (end < today) return { label: 'Expired', color: 'bg-slate-100 text-slate-500 border-slate-200' };
      if (start > today) return { label: 'Upcoming', color: 'bg-blue-50 text-blue-600 border-blue-200' };
      return { label: 'Active', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
  };

  const activeValue = viewSponsorships.filter(s => getStatus(s).label === 'Active').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
  const pendingValue = viewSponsorships.filter(s => s.paymentStatus === 'Pending').reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Award className="text-amber-500" size={28} />
             {activeSponsorshipTab === 'overview' ? 'Network Sponsorships' : `${currentCompany?.name} Sponsorships`}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Track brand deals, deliverables, and outstanding payments.</p>
        </div>
      </div>

      {currentUser?.isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-shrink-0">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 flex items-center justify-between">
              <div><div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">Total Active Value</div><div className="text-3xl font-bold text-slate-800">{formatCurrency(activeValue)}</div></div>
              <div className="h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center"><Award size={24} className="text-emerald-500" /></div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-red-500 flex items-center justify-between">
              <div><div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">Pending Payments</div><div className="text-3xl font-bold text-slate-800">{formatCurrency(pendingValue)}</div></div>
              <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center"><Briefcase size={24} className="text-red-500" /></div>
            </div>
          </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
             <div className="overflow-x-auto flex-1">
                 <table className="w-full text-left min-w-[1000px]">
                     <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                         <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                             <th className="p-4 w-64">Sponsor Info</th>
                             <th className="p-4 w-40">Dates & Status</th>
                             <th className="p-4 w-48">Assigned Shows</th>
                             <th className="p-4">Deliverables & Elements</th>
                             {currentUser?.isAdmin && <th className="p-4 w-32">Amount</th>}
                             <th className="p-4 w-12 text-right"></th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {viewSponsorships.sort((a,b) => new Date(a.startDate) - new Date(b.startDate)).map(sp => {
                             const company = getCompany(sp.companyId);
                             const status = getStatus(sp);
                             return (
                                 <tr key={sp.id} className="hover:bg-slate-50 transition-colors group">
                                     <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {sp.logoUrl ? <img src={sp.logoUrl} className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white" /> : <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 border border-slate-200">{sp.name.charAt(0)}</div>}
                                            <div>
                                                <div className="font-bold text-slate-800 cursor-pointer hover:text-amber-600 transition-colors truncate" onClick={() => openSponsorshipModal(sp)}>{sp.name}</div>
                                                {activeSponsorshipTab === 'overview' && <div className="text-[10px] text-slate-500 mt-0.5">{company?.name || 'Unknown Company'}</div>}
                                            </div>
                                        </div>
                                     </td>
                                     <td className="p-4">
                                         <div className="flex flex-col items-start gap-1.5">
                                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>{status.label}</span>
                                             <span className="text-xs font-medium text-slate-600">
                                                 {new Date(`${sp.startDate}T12:00:00`).toLocaleDateString('en-US', {month:'short', day:'numeric'})} - {new Date(`${sp.endDate}T12:00:00`).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'2-digit'})}
                                             </span>
                                         </div>
                                     </td>
                                     <td className="p-4">
                                         <div className="flex flex-col gap-1">
                                             {sp.showTitles?.length > 0 ? sp.showTitles.map((t, idx) => (
                                                 <span key={idx} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate" title={t}>📺 {t}</span>
                                             )) : <span className="text-xs text-slate-400 italic">None assigned</span>}
                                         </div>
                                     </td>
                                     <td className="p-4">
                                        <div className="flex flex-wrap gap-1 mb-1.5">
                                            {sp.elements?.length > 0 ? sp.elements.map((el, idx) => (
                                                <span key={idx} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-medium">{el}</span>
                                            )) : <span className="text-xs text-slate-400 italic">No deliverables tracked</span>}
                                        </div>
                                        {sp.promoCode && <div className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded w-fit border border-blue-200 flex items-center gap-1"><LinkIcon size={10}/> {sp.promoCode}</div>}
                                     </td>
                                     {currentUser?.isAdmin && (
                                         <td className="p-4">
                                             <div className="font-bold text-slate-800">{formatCurrency(sp.amount)}</div>
                                             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sp.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{sp.paymentStatus}</span>
                                         </td>
                                     )}
                                     <td className="p-4 text-right">
                                         <button onClick={() => handleDeleteSponsorship(sp.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 size={16}/></button>
                                     </td>
                                 </tr>
                             )
                         })}
                         {viewSponsorships.length === 0 && <tr><td colSpan={currentUser?.isAdmin ? "6" : "5"} className="p-8 text-center text-slate-500">No sponsorships active.</td></tr>}
                     </tbody>
                 </table>
             </div>
          </div>
      </div>
    </div>
  );
}