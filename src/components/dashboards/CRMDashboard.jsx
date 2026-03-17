import React from 'react';
import { BookUser, Mail, Phone, Building2, UserCircle, Trash2 } from 'lucide-react';
import CompanyLogo from '../shared/CompanyLogo';

export default function CRMDashboard({ 
  contacts, activeCRMTab, crmDisplayMode, 
  openContactModal, handleDeleteContact, companies 
}) {
  const getCompany = (id) => companies.find(c => c.id === id);

  const viewContacts = activeCRMTab === 'overview' 
    ? contacts 
    : contacts.filter(c => c.companyId === activeCRMTab);

  const currentCompany = activeCRMTab === 'overview' ? null : getCompany(activeCRMTab);

  const getTypeStyle = (type) => {
      switch (type) {
          case 'Sponsor': return 'bg-amber-100 text-amber-700 border-amber-200';
          case 'Guest': return 'bg-purple-100 text-purple-700 border-purple-200';
          case 'Lead': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          case 'Partner': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'Vendor': return 'bg-orange-100 text-orange-700 border-orange-200';
          default: return 'bg-slate-100 text-slate-600 border-slate-200';
      }
  };

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <BookUser className="text-sky-600" size={28} />
             {activeCRMTab === 'overview' ? 'Network CRM' : `${currentCompany?.name} Contacts`}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage sponsors, guests, vendors, and leads.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
         {crmDisplayMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
               <div className="overflow-x-auto flex-1">
                   <table className="w-full text-left min-w-[1000px]">
                       <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                           <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                               <th className="p-4">Contact Info</th>
                               <th className="p-4">Type & Organization</th>
                               <th className="p-4">Phone</th>
                               <th className="p-4">Email</th>
                               <th className="p-4 w-12 text-right"></th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {viewContacts.sort((a,b) => a.name.localeCompare(b.name)).map(ct => {
                               const company = getCompany(ct.companyId);
                               return (
                                   <tr key={ct.id} className="hover:bg-slate-50 transition-colors group">
                                       <td className="p-4">
                                           <div className="font-bold text-slate-800 cursor-pointer hover:text-sky-600 transition-colors flex items-center gap-2" onClick={() => openContactModal(ct)}>
                                               {ct.name}
                                           </div>
                                           {activeCRMTab === 'overview' && <div className="text-[10px] text-slate-500 mt-0.5">{company?.name || 'Unknown Company'}</div>}
                                       </td>
                                       <td className="p-4">
                                           <div className="flex flex-col items-start gap-1">
                                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTypeStyle(ct.contactType)}`}>{ct.contactType}</span>
                                               {ct.organization && <span className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5"><Building2 size={12}/> {ct.organization}</span>}
                                           </div>
                                       </td>
                                       <td className="p-4">
                                           {ct.phone ? (
                                               <a href={`tel:${ct.phone}`} className="text-sm text-slate-600 hover:text-sky-600 flex items-center gap-1.5"><Phone size={14}/> {ct.phone}</a>
                                           ) : <span className="text-xs text-slate-400 italic">--</span>}
                                       </td>
                                       <td className="p-4">
                                           {ct.email ? (
                                               <a href={`mailto:${ct.email}`} className="text-sm text-slate-600 hover:text-sky-600 flex items-center gap-1.5"><Mail size={14}/> {ct.email}</a>
                                           ) : <span className="text-xs text-slate-400 italic">--</span>}
                                       </td>
                                       <td className="p-4 text-right">
                                           <button onClick={() => handleDeleteContact(ct.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 size={16}/></button>
                                       </td>
                                   </tr>
                               )
                           })}
                           {viewContacts.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No contacts exist in this view.</td></tr>}
                       </tbody>
                   </table>
               </div>
            </div>
         )}

         {crmDisplayMode === 'cards' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {viewContacts.sort((a,b) => a.name.localeCompare(b.name)).map(ct => {
                     const company = getCompany(ct.companyId);
                     return (
                         <div key={ct.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:border-sky-300 transition-colors">
                             <div className="p-5">
                                 <div className="flex justify-between items-start mb-3">
                                     <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTypeStyle(ct.contactType)}`}>{ct.contactType}</div>
                                     {activeCRMTab === 'overview' && company && <CompanyLogo company={company} sizeClass="w-5 h-5 opacity-50" />}
                                 </div>
                                 <h3 className="font-bold text-lg text-slate-800 cursor-pointer hover:text-sky-600 transition-colors truncate" onClick={() => openContactModal(ct)}>{ct.name}</h3>
                                 {ct.organization && <div className="text-sm text-slate-500 font-medium flex items-center gap-1 mt-1 truncate"><Building2 size={14}/> {ct.organization}</div>}
                                 
                                 <div className="mt-4 space-y-2">
                                     {ct.email && <a href={`mailto:${ct.email}`} className="text-sm text-slate-600 hover:text-sky-600 flex items-center gap-2 truncate"><Mail size={14}/> {ct.email}</a>}
                                     {ct.phone && <a href={`tel:${ct.phone}`} className="text-sm text-slate-600 hover:text-sky-600 flex items-center gap-2 truncate"><Phone size={14}/> {ct.phone}</a>}
                                 </div>
                                 {ct.notes && <div className="mt-4 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 line-clamp-3 italic">"{ct.notes}"</div>}
                             </div>
                             <div className="mt-auto border-t border-slate-100 p-2 flex justify-between bg-slate-50/50">
                                 <button onClick={() => openContactModal(ct)} className="text-xs font-bold text-sky-600 hover:text-sky-800 px-2 py-1">Edit Contact</button>
                                 <button onClick={() => handleDeleteContact(ct.id)} className="text-slate-300 hover:text-red-500 p-1 transition-colors"><Trash2 size={14}/></button>
                             </div>
                         </div>
                     )
                 })}
                 {viewContacts.length === 0 && <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">No contacts exist in this view.</div>}
             </div>
         )}
      </div>
    </div>
  );
}