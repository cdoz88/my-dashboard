import React, { useState, useMemo } from 'react';
import { Globe, Trash2, Search, ArrowUp, ArrowDown, ExternalLink, RefreshCw, Pencil } from 'lucide-react';
import CompanyLogo from '../shared/CompanyLogo';
import { formatCurrency, formatExpenseDate, parseNextDate } from '../../utils/helpers';

export default function DomainsDashboard({ 
    expenses, activeDomainTab, domainDisplayMode, 
    domainSortConfig, setDomainSortConfig, 
    openDomainModal, handleDeleteExpense, companies 
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const getCompany = (id) => companies.find(c => c.id === id);

    // Initial Filter: Category IS Domains, match selected tab
    const viewDomains = activeDomainTab === 'overview' 
        ? expenses.filter(e => e.category === 'Domains') 
        : expenses.filter(e => e.companyId === activeDomainTab && e.category === 'Domains');

    // Secondary Filter: The Live Search!
    const filteredDomains = viewDomains.filter(e => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            (e.name && e.name.toLowerCase().includes(q)) ||
            (e.notes && e.notes.toLowerCase().includes(q))
        );
    });

    const currentCompany = activeDomainTab === 'overview' ? null : getCompany(activeDomainTab);

    // Metrics based on filtered list
    const totalDomains = filteredDomains.length;
    const totalCost = filteredDomains.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const autoRenewCount = filteredDomains.filter(e => e.autoRenew).length;

    const requestSort = (key) => {
        let direction = 'asc';
        if (domainSortConfig.key === key && domainSortConfig.direction === 'asc') direction = 'desc';
        setDomainSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (domainSortConfig.key !== key) return null;
        return domainSortConfig.direction === 'asc' ? <ArrowUp size={12} className="ml-1" /> : <ArrowDown size={12} className="ml-1" />;
    };

    const sortedDomains = useMemo(() => {
        let sortableItems = [...filteredDomains];
        sortableItems.sort((a, b) => {
            if (domainSortConfig.key === 'amount') return domainSortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
            else if (domainSortConfig.key === 'renewalDate') {
                const dateA = parseNextDate(a.cycle, a.renewalDate);
                const dateB = parseNextDate(b.cycle, b.renewalDate);
                return domainSortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            } else {
                if (a[domainSortConfig.key] < b[domainSortConfig.key]) return domainSortConfig.direction === 'asc' ? -1 : 1;
                if (a[domainSortConfig.key] > b[domainSortConfig.key]) return domainSortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }
        });
        return sortableItems;
    }, [filteredDomains, domainSortConfig]);

    const renderTimeline = () => {
        const timelineItems = [...filteredDomains].sort((a, b) => parseNextDate(a.cycle, a.renewalDate) - parseNextDate(b.cycle, b.renewalDate));
        let currentMonthYear = '';

        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
               <h3 className="font-bold text-slate-700 mb-6">Domain Renewals Timeline</h3>
               <div className="relative border-l-2 border-teal-100 ml-3 space-y-8 pb-8">
                  {timelineItems.length > 0 ? timelineItems.map(item => {
                      const nextDate = parseNextDate(item.cycle, item.renewalDate);
                      const monthYear = nextDate.getFullYear() === 9999 ? 'Unscheduled' : nextDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      const showHeader = monthYear !== currentMonthYear;
                      if (showHeader) currentMonthYear = monthYear;
                      
                      const displayDate = nextDate.getFullYear() === 9999 ? '--' : nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                      return (
                          <React.Fragment key={item.id}>
                              {showHeader && (
                                  <div className="relative -left-3 flex items-center gap-3">
                                      <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs shadow-sm"></div>
                                      <h4 className="font-bold text-teal-800 uppercase tracking-wider text-sm">{monthYear}</h4>
                                  </div>
                              )}
                              <div className="relative pl-8">
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-teal-500"></div>
                                <div className="p-4 rounded-lg border bg-slate-50 border-slate-100 hover:shadow-md transition-shadow group flex items-start justify-between">
                                  <div>
                                    <div className="text-xs font-bold mb-1 text-slate-400">{displayDate}</div>
                                    <div className="font-bold text-slate-800 cursor-pointer transition-colors mb-1.5 flex items-center gap-2 hover:text-teal-600" onClick={() => openDomainModal(item)}>
                                        <Globe size={14} className="text-slate-400"/> {item.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded capitalize">{item.cycle}</span>
                                        {!item.autoRenew ? <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><RefreshCw size={10}/> Manual</span> : <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><RefreshCw size={10}/> Auto-Renew</span>}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                      <div className="font-bold text-slate-800 text-lg">{formatCurrency(item.amount)}</div>
                                      <a href={`https://${item.name}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1 justify-end mt-1"><ExternalLink size={10}/> Visit</a>
                                  </div>
                                </div>
                              </div>
                          </React.Fragment>
                      )
                  }) : <div className="p-8 text-slate-500 text-sm text-center">No upcoming domain renewals matching search.</div>}
               </div>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Globe className="text-teal-600" size={28} />
                        {activeDomainTab === 'overview' ? 'Domain Portfolio' : `${currentCompany?.name} Domains`}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Manage web properties and domain registrations.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search domains..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sm:mb-8 flex-shrink-0">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-500">
                    <div className="text-slate-500 text-sm font-medium mb-1">Total Domains</div>
                    <div className="text-2xl font-bold text-slate-800">{totalDomains}</div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-500">
                    <div className="text-slate-500 text-sm font-medium mb-1">Annual Registration Cost</div>
                    <div className="text-2xl font-bold text-slate-800">{formatCurrency(totalCost)}<span className="text-sm font-normal text-slate-400 ml-1">/yr</span></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-500">
                    <div className="text-slate-500 text-sm font-medium mb-1">Auto-Renew Protected</div>
                    <div className="text-2xl font-bold text-slate-800">{autoRenewCount} <span className="text-sm font-normal text-slate-400">/ {totalDomains}</span></div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {domainDisplayMode === 'timeline' ? renderTimeline() : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('name')}>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Domain Name {getSortIcon('name')}</div>
                                        </th>
                                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('amount')}>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost {getSortIcon('amount')}</div>
                                        </th>
                                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('renewalDate')}>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiration Date {getSortIcon('renewalDate')}</div>
                                        </th>
                                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('notes')}>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes {getSortIcon('notes')}</div>
                                        </th>
                                        <th className="p-4 w-12 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sortedDomains.map(domain => {
                                        const company = getCompany(domain.companyId);
                                        return (
                                            <tr key={domain.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-800 cursor-pointer hover:text-teal-600 transition-colors flex items-center gap-2" onClick={() => openDomainModal(domain)}>
                                                        {domain.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <a href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1"><ExternalLink size={10}/> Visit</a>
                                                        {activeDomainTab === 'overview' && (
                                                            <>
                                                              <span className="text-slate-300">•</span>
                                                              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                                                  <CompanyLogo company={company} sizeClass="w-3 h-3" textClass="text-[6px]" />
                                                                  {company?.name || 'Unknown Company'}
                                                              </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-700">{formatCurrency(domain.amount)}</div>
                                                    <div className="text-[10px] text-slate-400 capitalize">{domain.cycle}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm font-medium text-slate-600">{formatExpenseDate(domain.renewalDate, domain.cycle)}</div>
                                                    {!domain.autoRenew ? <div className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-0.5"><RefreshCw size={10}/> Manual Renew</div> : <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5"><RefreshCw size={10}/> Auto-Renew ON</div>}
                                                </td>
                                                <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={domain.notes}>{domain.notes || '--'}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openDomainModal(domain)} className="text-slate-400 hover:text-slate-600 p-1 transition-colors"><Pencil size={16}/></button>
                                                        <button onClick={() => handleDeleteExpense(domain.id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors"><Trash2 size={16}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {sortedDomains.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No domains matching your search.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}