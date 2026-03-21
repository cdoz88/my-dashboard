import React, { useState, useMemo } from 'react';
import { Wallet, Trash2, Search, ArrowUp, ArrowDown, RefreshCw, Pencil } from 'lucide-react';
import CompanyLogo from '../shared/CompanyLogo';
import { formatCurrency, formatExpenseDate, parseNextDate } from '../../utils/helpers';

export default function BudgetDashboard({ 
    expenses, activeBudgetTab, budgetDisplayMode, 
    expenseSortConfig, setExpenseSortConfig, 
    openExpenseModal, handleDeleteExpense, companies 
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const getCompany = (id) => companies.find(c => c.id === id);

    // Initial Filter: Category is NOT domains, and match the selected tab
    const viewExpenses = activeBudgetTab === 'overview' 
        ? expenses.filter(e => e.category !== 'Domains') 
        : expenses.filter(e => e.companyId === activeBudgetTab && e.category !== 'Domains');

    // Secondary Filter: The Live Search!
    const filteredExpenses = viewExpenses.filter(e => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            (e.name && e.name.toLowerCase().includes(q)) ||
            (e.category && e.category.toLowerCase().includes(q)) ||
            (e.notes && e.notes.toLowerCase().includes(q))
        );
    });

    const currentCompany = activeBudgetTab === 'overview' ? null : getCompany(activeBudgetTab);

    // Metrics based on the currently filtered list
    const mrr = filteredExpenses.filter(e => e.cycle === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const arr = filteredExpenses.filter(e => e.cycle === 'annual').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const totalAnnual = (mrr * 12) + arr;

    const requestSort = (key) => {
        let direction = 'asc';
        if (expenseSortConfig.key === key && expenseSortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setExpenseSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (expenseSortConfig.key !== key) return null;
        return expenseSortConfig.direction === 'asc' ? <ArrowUp size={12} className="ml-1" /> : <ArrowDown size={12} className="ml-1" />;
    };

    const sortedExpenses = useMemo(() => {
        let sortableItems = [...filteredExpenses];
        sortableItems.sort((a, b) => {
            if (expenseSortConfig.key === 'amount') {
                return expenseSortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
            } else if (expenseSortConfig.key === 'renewalDate') {
                const dateA = parseNextDate(a.cycle, a.renewalDate);
                const dateB = parseNextDate(b.cycle, b.renewalDate);
                return expenseSortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            } else {
                if (a[expenseSortConfig.key] < b[expenseSortConfig.key]) return expenseSortConfig.direction === 'asc' ? -1 : 1;
                if (a[expenseSortConfig.key] > b[expenseSortConfig.key]) return expenseSortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }
        });
        return sortableItems;
    }, [filteredExpenses, expenseSortConfig]);

    const renderTimeline = () => {
        const timelineItems = [...filteredExpenses].sort((a, b) => {
            return parseNextDate(a.cycle, a.renewalDate) - parseNextDate(b.cycle, b.renewalDate);
        });

        let currentMonthYear = '';

        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
               <h3 className="font-bold text-slate-700 mb-6">Upcoming Renewals & Bills</h3>
               <div className="relative border-l-2 border-emerald-100 ml-3 space-y-8 pb-8">
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
                                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shadow-sm"></div>
                                      <h4 className="font-bold text-emerald-800 uppercase tracking-wider text-sm">{monthYear}</h4>
                                  </div>
                              )}
                              <div className="relative pl-8">
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-emerald-500"></div>
                                <div className="p-4 rounded-lg border bg-slate-50 border-slate-100 hover:shadow-md transition-shadow group flex items-start justify-between">
                                  <div>
                                    <div className="text-xs font-bold mb-1 text-slate-400">{displayDate}</div>
                                    <div className="font-bold text-slate-800 cursor-pointer transition-colors mb-1.5 flex items-center gap-2 hover:text-emerald-600" onClick={() => openExpenseModal(item)}>
                                        {item.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded capitalize">{item.cycle}</span>
                                        <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5 rounded border border-slate-200">{item.category}</span>
                                        {!item.autoRenew && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><RefreshCw size={10}/> Manual</span>}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                      <div className="font-bold text-slate-800 text-lg">{formatCurrency(item.amount)}</div>
                                  </div>
                                </div>
                              </div>
                          </React.Fragment>
                      )
                  }) : <div className="p-8 text-slate-500 text-sm text-center">No upcoming expenses matching your search.</div>}
               </div>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Wallet className="text-emerald-600" size={28} />
                        {activeBudgetTab === 'overview' ? 'Network Budget' : `${currentCompany?.name} Budget`}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Track software, subscriptions, and recurring costs.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search expenses..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sm:mb-8 flex-shrink-0">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
                    <div className="text-slate-500 text-sm font-medium mb-1">Monthly Run Rate</div>
                    <div className="text-2xl font-bold text-slate-800">{formatCurrency(mrr)}<span className="text-sm font-normal text-slate-400 ml-1">/mo</span></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
                    <div className="text-slate-500 text-sm font-medium mb-1">Annual Subscriptions</div>
                    <div className="text-2xl font-bold text-slate-800">{formatCurrency(arr)}<span className="text-sm font-normal text-slate-400 ml-1">/yr</span></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-slate-800 bg-slate-800">
                    <div className="text-slate-400 text-sm font-medium mb-1">Total Yearly Spend</div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(totalAnnual)}<span className="text-sm font-normal text-slate-400 ml-1">/yr</span></div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {budgetDisplayMode === 'timeline' ? renderTimeline() : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('name')}>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Expense Item {getSortIcon('name')}</div>
                                        </th>
                                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('amount')}>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount {getSortIcon('amount')}</div>
                                        </th>
                                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('cycle')}>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Cycle {getSortIcon('cycle')}</div>
                                        </th>
                                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('renewalDate')}>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Date {getSortIcon('renewalDate')}</div>
                                        </th>
                                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('category')}>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Category {getSortIcon('category')}</div>
                                        </th>
                                        <th className="p-4 w-12 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sortedExpenses.map(exp => {
                                        const company = getCompany(exp.companyId);
                                        return (
                                            <tr key={exp.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors flex items-center gap-2" onClick={() => openExpenseModal(exp)}>
                                                        {exp.name}
                                                    </div>
                                                    {activeBudgetTab === 'overview' && (
                                                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                                                            <CompanyLogo company={company} sizeClass="w-3 h-3" textClass="text-[6px]" />
                                                            {company?.name || 'Unknown Company'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 font-bold text-slate-700">{formatCurrency(exp.amount)}</td>
                                                <td className="p-4"><span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full capitalize">{exp.cycle}</span></td>
                                                <td className="p-4">
                                                    <div className="text-sm font-medium text-slate-600">{formatExpenseDate(exp.renewalDate, exp.cycle)}</div>
                                                    {!exp.autoRenew && <div className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-0.5"><RefreshCw size={10}/> Manual Renew</div>}
                                                </td>
                                                <td className="p-4 text-sm text-slate-600">{exp.category}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openExpenseModal(exp)} className="text-slate-400 hover:text-slate-600 p-1 transition-colors"><Pencil size={16}/></button>
                                                        <button onClick={() => handleDeleteExpense(exp.id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors"><Trash2 size={16}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {sortedExpenses.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-500">No expenses matching your search.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}