import React from 'react';
import { 
  Globe, Landmark, DollarSign, Trash2, Clock, 
  ChevronsUpDown, ChevronUp, ChevronDown 
} from 'lucide-react';
import { formatCurrency, parseNextDate, formatExpenseDate } from '../../utils/helpers';
import CompanyLogo from '../shared/CompanyLogo';

export default function DomainsDashboard({
  expenses, activeDomainTab, domainDisplayMode, 
  domainSortConfig, setDomainSortConfig, 
  openDomainModal, handleDeleteExpense, companies
}) {
  const getCompany = (id) => companies.find(c => c.id === id);

  const domainExpenses = expenses.filter(e => e.category === 'Domains');
  const viewDomains = activeDomainTab === 'overview' ? domainExpenses : domainExpenses.filter(e => e.companyId === activeDomainTab);
  const activeDomains = viewDomains.filter(e => e.autoRenew !== false && e.autoRenew !== 0 && e.autoRenew !== '0');
  const activeDomainCount = activeDomains.length;
  const totalDomainCost = activeDomains.reduce((sum, e) => {
    const annualAmount = e.cycle === 'monthly' ? parseFloat(e.amount) * 12 : parseFloat(e.amount);
    return sum + annualAmount;
  }, 0);

  const currentCompany = activeDomainTab === 'overview' ? null : getCompany(activeDomainTab);

  const handleSort = (key) => {
    let direction = 'asc';
    if (domainSortConfig.key === key && domainSortConfig.direction === 'asc') direction = 'desc';
    setDomainSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
    if (domainSortConfig.key !== columnKey) return <ChevronsUpDown size={14} className="opacity-30 ml-1 inline" />;
    return domainSortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1 inline text-teal-600" /> : <ChevronDown size={14} className="ml-1 inline text-teal-600" />;
  };

  const sortedDomains = [...viewDomains].sort((a, b) => {
    let aValue = a[domainSortConfig.key], bValue = b[domainSortConfig.key];
    if (domainSortConfig.key === 'amount') { aValue = parseFloat(aValue || 0); bValue = parseFloat(bValue || 0); } 
    else if (domainSortConfig.key === 'companyId') { aValue = getCompany(a.companyId)?.name || ''; bValue = getCompany(b.companyId)?.name || ''; } 
    else if (domainSortConfig.key === 'renewalDate') { aValue = parseNextDate(a.cycle, a.renewalDate).getTime(); bValue = parseNextDate(b.cycle, b.renewalDate).getTime(); }
    if (aValue < bValue) return domainSortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return domainSortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const timelineDomains = [...viewDomains].map(e => ({ ...e, nextDateObj: parseNextDate(e.cycle, e.renewalDate) })).sort((a, b) => a.nextDateObj - b.nextDateObj);

  const renderDomainRow = (domain) => {
    const company = getCompany(domain.companyId);
    const isAutoRenewOn = domain.autoRenew !== false && domain.autoRenew !== 0 && domain.autoRenew !== '0';
    return (
      <tr key={domain.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors group ${!isAutoRenewOn ? 'opacity-60' : ''}`}>
        <td className="p-4 font-bold text-slate-800 cursor-pointer hover:text-teal-600 transition-colors flex items-center gap-2" onClick={() => openDomainModal(domain)}><Globe size={16} className={isAutoRenewOn ? "text-teal-500" : "text-slate-400"} /><span className={!isAutoRenewOn ? 'line-through' : ''}>{domain.name}</span></td>
        {activeDomainTab === 'overview' && <td className="p-4"><div className="flex items-center gap-2"><CompanyLogo company={company} sizeClass="w-5 h-5" /><span className="text-sm text-slate-600">{company?.name}</span></div></td>}
        <td className="p-4 font-medium text-slate-700">{formatCurrency(domain.amount)} <span className="text-xs text-slate-400 font-normal">/{domain.cycle === 'monthly' ? 'mo' : 'yr'}</span></td>
        <td className="p-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isAutoRenewOn ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{isAutoRenewOn ? 'ON' : 'OFF'}</span></td>
        <td className="p-4 text-sm font-medium text-slate-600">{isAutoRenewOn ? (domain.renewalDate || '--') : <span className="text-slate-400 font-normal">Manual/Off</span>}</td>
        <td className="p-4 text-right"><button onClick={() => handleDeleteExpense(domain.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button></td>
      </tr>
    );
  };

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
      <div className="mb-6 sm:mb-8 flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">{activeDomainTab === 'overview' ? 'Domain Portfolio' : `${currentCompany?.name} Domains`}</h2>
        <p className="text-slate-500 text-sm mt-1">Manage URLs and hosting renewals. Links directly to your Expenses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-500 flex items-center justify-between">
          <div><div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1"><Globe size={16} className="text-teal-500" /> Active Domains (Auto-Renew)</div><div className="text-3xl font-bold text-slate-800">{activeDomainCount}</div></div>
          <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center"><Globe size={24} className="text-teal-500" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-500 flex items-center justify-between">
          <div><div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1"><Landmark size={16} className="text-teal-500" /> Estimated Annual Cost</div><div className="text-3xl font-bold text-slate-800">{formatCurrency(totalDomainCost)}</div></div>
          <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center"><DollarSign size={24} className="text-teal-500" /></div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {domainDisplayMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0"><h3 className="font-bold text-slate-700">Registered Domains</h3></div>
            <div className="flex-1 overflow-y-auto">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                      <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>Domain URL <SortIcon columnKey="name" /></th>
                      {activeDomainTab === 'overview' && <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('companyId')}>Company <SortIcon columnKey="companyId" /></th>}
                      <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('amount')}>Cost <SortIcon columnKey="amount" /></th>
                      <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('autoRenew')}>Auto-Renew <SortIcon columnKey="autoRenew" /></th>
                      <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('renewalDate')}>Renewal Date <SortIcon columnKey="renewalDate" /></th>
                      <th className="p-4 w-12 bg-slate-50"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDomains.length > 0 ? sortedDomains.map(renderDomainRow) : (<tr><td colSpan={activeDomainTab === 'overview' ? 6 : 5} className="p-8 text-center text-slate-500">No domains registered yet.</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {domainDisplayMode === 'timeline' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
             <h3 className="font-bold text-slate-700 mb-6">Renewal Forecast</h3>
             <div className="relative border-l-2 border-teal-100 ml-3 space-y-8 pb-8">
                {timelineDomains.length > 0 ? timelineDomains.map(domain => {
                  const company = getCompany(domain.companyId);
                  const isFarFuture = domain.nextDateObj.getFullYear() === 9999;
                  const displayDate = isFarFuture ? "Date Unknown" : domain.nextDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                  const isAutoRenewOn = domain.autoRenew !== false && domain.autoRenew !== 0 && domain.autoRenew !== '0';
                  return (
                    <div key={domain.id} className={`relative pl-8 ${!isAutoRenewOn ? 'opacity-50' : ''}`}>
                      <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${isAutoRenewOn ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
                      <div className="p-4 rounded-lg border bg-slate-50 border-slate-100 hover:shadow-md transition-shadow group flex items-start justify-between">
                        <div>
                          <div className={`text-sm font-bold mb-1 ${isAutoRenewOn ? 'text-teal-600' : 'text-slate-500'}`}>{isAutoRenewOn ? displayDate : 'CANCELED'}</div>
                          <div className={`font-medium text-slate-800 cursor-pointer transition-colors mb-2 flex items-center gap-1.5 ${isAutoRenewOn ? 'hover:text-teal-600' : 'line-through'}`} onClick={() => openDomainModal(domain)}><Globe size={14} className={isAutoRenewOn ? "text-teal-500" : "text-slate-400"} /> {domain.name}</div>
                          <div className="flex items-center gap-2">
                            {activeDomainTab === 'overview' && company && <div className="flex items-center gap-1"><CompanyLogo company={company} sizeClass="w-4 h-4" textClass="text-[8px]" /><span className="text-[10px] text-slate-500 font-medium">{company.name}</span></div>}
                            {!isAutoRenewOn && <span className="text-[10px] text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded font-bold">Auto-Renew OFF</span>}
                            {domain.notes && <span className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded truncate max-w-[150px]" title={domain.notes}>{domain.notes}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-slate-800 text-lg mb-1">{formatCurrency(domain.amount)}</div>
                           <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${domain.cycle === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{domain.cycle === 'monthly' ? 'Monthly' : 'Annual'}</span>
                        </div>
                      </div>
                    </div>
                  )
                }) : <div className="p-8 text-slate-500 text-sm">No forecasted domain renewals.</div>}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}