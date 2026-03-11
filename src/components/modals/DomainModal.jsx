import React from 'react';
import { Globe, X, DollarSign, ToggleRight, ToggleLeft } from 'lucide-react';

export default function DomainModal({
  currentDomain, setCurrentDomain, handleSaveDomain, handleDeleteExpense,
  setIsDomainModalOpen, visibleCompanies
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-teal-500">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Globe className="text-teal-500" size={20} />{currentDomain.id ? 'Edit Domain' : 'Add New Domain'}</h3>
          <button onClick={() => setIsDomainModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="domainForm" onSubmit={handleSaveDomain} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Domain URL</label>
              <input required type="text" value={currentDomain.name} onChange={(e) => setCurrentDomain({...currentDomain, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., example.com" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <select required value={currentDomain.companyId} onChange={(e) => setCurrentDomain({...currentDomain, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50">
                  <option value="" disabled>Select a company</option>
                  {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Billing Cycle</label>
                <select value={currentDomain.cycle} onChange={(e) => setCurrentDomain({...currentDomain, cycle: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                  <option value="annual">Annual</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={16} className="text-slate-400" /></div>
                  <input required type="number" step="0.01" min="0" value={currentDomain.amount} onChange={(e) => setCurrentDomain({...currentDomain, amount: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="15.99" />
                </div>
              </div>
              <div>
                 <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">Auto-Renew</label>
                 </div>
                 <div className="flex items-center h-[42px]">
                     <button type="button" onClick={() => setCurrentDomain({...currentDomain, autoRenew: !currentDomain.autoRenew})} className={`${currentDomain.autoRenew ? 'text-teal-500' : 'text-slate-300'} transition-colors`}>
                         {currentDomain.autoRenew ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                     </button>
                     <span className="ml-2 text-sm font-bold text-slate-600">{currentDomain.autoRenew ? 'ON' : 'OFF'}</span>
                 </div>
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Renewal Date</label>
               {currentDomain.cycle === 'monthly' ? (
                 <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    Renews every month on day: 
                    <input type="number" min="1" max="31" placeholder="DD" value={currentDomain.renewalDate ? currentDomain.renewalDate.replace(/\D/g,'') : ''} onChange={(e) => setCurrentDomain({...currentDomain, renewalDate: `Day ${e.target.value}`})} className="w-16 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-teal-500" />
                 </div>
              ) : (
                 <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    Renews every year on: 
                    <input type="text" placeholder="e.g. Mar 15" value={currentDomain.renewalDate || ''} onChange={(e) => setCurrentDomain({...currentDomain, renewalDate: e.target.value})} className="flex-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
                 </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Where is it hosted?</label>
              <input type="text" value={currentDomain.notes || ''} onChange={(e) => setCurrentDomain({...currentDomain, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., GoDaddy, Namecheap..." />
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          {currentDomain.id && <button type="button" onClick={() => handleDeleteExpense(currentDomain.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
          <button type="button" onClick={() => setIsDomainModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="domainForm" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium">{currentDomain.id ? 'Save Changes' : 'Add Domain'}</button>
        </div>
      </div>
    </div>
  );
}