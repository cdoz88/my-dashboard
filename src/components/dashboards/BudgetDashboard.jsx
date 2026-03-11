import React from 'react';
import { 
  Receipt, CalendarClock, Landmark, Ticket, Globe, Trash2, Clock, 
  ChevronsUpDown, ChevronUp, ChevronDown 
} from 'lucide-react';
import { formatCurrency, parseNextDate, formatExpenseDate } from '../../utils/helpers';
import CompanyLogo from '../shared/CompanyLogo';

export default function BudgetDashboard({
  expenses, activeBudgetTab, budgetDisplayMode, 
  expenseSortConfig, setExpenseSortConfig, 
  openExpenseModal, handleDeleteExpense, companies
}) {
  const getCompany = (id) => companies.find(c => c.id === id);

  const viewExpenses = activeBudgetTab === 'overview' 
    ? expenses 
    : expenses.filter(e => e.companyId === activeBudgetTab);

  const activeExpenses = viewExpenses.filter(e => e.autoRenew !== false && e.autoRenew !== 0 && e.autoRenew !== '0');

  const monthlyTotal = activeExpenses.filter(e => e.cycle === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const annualTotal = activeExpenses.filter(e => e.cycle === 'annual').reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const oneTimeTotal = activeExpenses.filter(e => e.cycle === 'one-time').reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const trueAnnualCommitment = (monthlyTotal * 12) + annualTotal;

  const currentCompany = activeBudgetTab === 'overview' ? null : getCompany(activeBudgetTab);

  const handleExpenseSort = (key) => {
    let direction = 'asc';
    if (expenseSortConfig.key === key && expenseSortConfig.direction === 'asc') direction = 'desc';
    setExpenseSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
    if (expenseSortConfig.key !== columnKey) return <ChevronsUpDown size={14} className="opacity-30 ml-1 inline" />;
    return expenseSortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1 inline text-emerald-600" /> : <ChevronDown size={14} className="ml-1 inline text-emerald-600" />;
  };

  const sortedExpenses = [...viewExpenses].sort((a, b) => {
    let aValue = a[expenseSortConfig.key];
    let bValue = b[expenseSortConfig.key];
    if (expenseSortConfig.key === 'amount') { aValue = parseFloat(aValue || 0); bValue = parseFloat(bValue || 0); } 
    else if (expenseSortConfig.key === 'companyId') { aValue = getCompany(a.companyId)?.name || ''; bValue = getCompany(b.companyId)?.name || ''; } 
    else if (expenseSortConfig.key === 'renewalDate') { aValue = parseNextDate(a.cycle, a.renewalDate).getTime(); bValue = parseNextDate(b.cycle, b.renewalDate).getTime(); }
    if (aValue < bValue) return expenseSortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return expenseSortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const timelineExpenses = [...viewExpenses].map(e => ({ ...e, nextDateObj: parseNextDate(e.cycle, e.renewalDate) })).sort((a, b) => a.nextDateObj - b.nextDateObj);

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
      <div className="mb-6 sm:mb-8 flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
           {activeBudgetTab === 'overview' ? 'Global Expenses Overview' : `${currentCompany?.name} Expenses`}
        </h2>
        <p className="text-slate-500 text-sm mt-1">Manage and forecast your recurring expenses (Domains included).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 flex-shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2"><Receipt size={16} className="text-blue-500" /> Active Monthly Rate</div>
          <div className="text-2xl font-bold text-slate-800">{formatCurrency(monthlyTotal)}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2"><CalendarClock size={16} className="text-purple-500" /> Active Annual Rate</div>
          <div className="text-2xl font-bold text-slate-800">{formatCurrency(annualTotal)}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2"><Landmark size={16} className="text-emerald-500" /> True Yearly Commitment</div>
          <div className="text-2xl font-bold text-slate-800">{formatCurrency(trueAnnualCommitment)}</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-slate-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2"><Ticket size={16} className="text-slate-500" /> Total One-Time / Events</div>
          <div className="text-2xl font-bold text-slate-800">{formatCurrency(oneTimeTotal)}</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {budgetDisplayMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
               <h3 className="font-bold text-slate-700">All Expenses & Domains</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="md:hidden flex flex-col">
                {sortedExpenses.length > 0 ? sortedExpenses.map(expense => {
                  const company = getCompany(expense.companyId);
                  const isAutoRenewOn = expense.autoRenew !== false && expense.autoRenew !== 0 && expense.autoRenew !== '0';
                  const cycleColor = expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600' : expense.cycle === 'annual' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600';
                  const cycleLabel = expense.cycle === 'monthly' ? 'Monthly' : expense.cycle === 'annual' ? 'Annual' : 'One-Time';
                  return (
                    <div key={expense.id} className={`p-4 hover:bg-slate-50 transition-colors group relative border-b border-slate-100 last:border-b-0 ${!isAutoRenewOn && expense.cycle !== 'one-time' ? 'opacity-60' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className={`font-medium text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors pr-8 flex items-center gap-1.5 ${!isAutoRenewOn && expense.cycle !== 'one-time' ? 'line-through' : ''}`} onClick={() => openExpenseModal(expense)}>
                          {expense.category === 'Domains' ? <Globe size={14} className={isAutoRenewOn ? 'text-teal-500' : 'text-slate-400'} /> : null}
                          {expense.name}
                        </div>
                        <div className="font-bold text-slate-800 flex-shrink-0">{formatCurrency(expense.amount)}</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cycleColor}`}>{cycleLabel}</span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{expense.category}</span>
                        {!isAutoRenewOn && expense.cycle !== 'one-time' && <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-1.5 py-0.5 rounded">Canceled</span>}
                        {activeBudgetTab === 'overview' && company && (
                          <div className="flex items-center gap-1 ml-auto">
                            <CompanyLogo company={company} sizeClass="w-4 h-4" textClass="text-[8px]" />
                            <span className="text-[10px] text-slate-500">{company.name}</span>
                          </div>
                        )}
                        <button onClick={() => handleDeleteExpense(expense.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                      </div>
                      {(isAutoRenewOn || expense.cycle === 'one-time') && expense.renewalDate && (
                         <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1"><Clock size={10} /> {expense.cycle === 'one-time' ? 'Date:' : 'Renews:'} {formatExpenseDate(expense.renewalDate, expense.cycle)}</div>
                      )}
                    </div>
                  );
                }) : <div className="p-8 text-center text-slate-500 text-sm">No expenses recorded yet.</div>}
              </div>
              <div className="hidden md:block">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                      <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('name')}>Expense Name <SortIcon columnKey="name" /></th>
                      {activeBudgetTab === 'overview' && <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('companyId')}>Company <SortIcon columnKey="companyId" /></th>}
                      <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('category')}>Category <SortIcon columnKey="category" /></th>
                      <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('amount')}>Amount <SortIcon columnKey="amount" /></th>
                      <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('cycle')}>Billing Cycle <SortIcon columnKey="cycle" /></th>
                      <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('renewalDate')}>Date <SortIcon columnKey="renewalDate" /></th>
                      <th className="p-4 w-12 bg-slate-50"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExpenses.length > 0 ? sortedExpenses.map(expense => {
                      const company = getCompany(expense.companyId);
                      const isAutoRenewOn = expense.autoRenew !== false && expense.autoRenew !== 0 && expense.autoRenew !== '0';
                      const cycleColor = expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600 border border-blue-100' : expense.cycle === 'annual' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-slate-100 text-slate-600 border border-slate-200';
                      const cycleLabel = expense.cycle === 'monthly' ? 'Monthly' : expense.cycle === 'annual' ? 'Annual' : 'One-Time';
                      return (
                        <tr key={expense.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors group ${!isAutoRenewOn && expense.cycle !== 'one-time' ? 'opacity-60' : ''}`}>
                          <td className="p-4 font-medium text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors flex items-center gap-2" onClick={() => openExpenseModal(expense)}>
                            {expense.category === 'Domains' ? <Globe size={16} className={isAutoRenewOn ? 'text-teal-500' : 'text-slate-400'} /> : null}
                            <span className={!isAutoRenewOn && expense.cycle !== 'one-time' ? 'line-through' : ''}>{expense.name}</span>
                          </td>
                          {activeBudgetTab === 'overview' && (
                            <td className="p-4">
                              <div className="flex items-center gap-2" title={company?.name}>
                                <CompanyLogo company={company} sizeClass="w-6 h-6" />
                                <span className="text-sm text-slate-600">{company?.name}</span>
                              </div>
                            </td>
                          )}
                          <td className="p-4"><span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">{expense.category}</span></td>
                          <td className="p-4 font-medium text-slate-700">{formatCurrency(expense.amount)}</td>
                          <td className="p-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${cycleColor}`}>{cycleLabel}</span></td>
                          <td className="p-4 text-sm text-slate-500">{isAutoRenewOn || expense.cycle === 'one-time' ? formatExpenseDate(expense.renewalDate, expense.cycle) : <span className="text-red-500 font-medium">Canceled</span>}</td>
                          <td className="p-4 text-right"><button onClick={() => handleDeleteExpense(expense.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button></td>
                        </tr>
                      );
                    }) : (<tr><td colSpan={activeBudgetTab === 'overview' ? 7 : 6} className="p-8 text-center text-slate-500">No expenses recorded yet.</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {budgetDisplayMode === 'timeline' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
             <h3 className="font-bold text-slate-700 mb-6">Combined Expense Forecast</h3>
             <div className="relative border-l-2 border-emerald-100 ml-3 space-y-8 pb-8">
                {timelineExpenses.length > 0 ? timelineExpenses.map(expense => {
                  const company = getCompany(expense.companyId);
                  const isFarFuture = expense.nextDateObj.getFullYear() === 9999;
                  const displayDate = isFarFuture ? "Date Unknown" : expense.nextDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                  const isAutoRenewOn = expense.autoRenew !== false && expense.autoRenew !== 0 && expense.autoRenew !== '0';
                  const cycleColor = expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600' : expense.cycle === 'annual' ? 'bg-purple-50 text-purple-600' : 'bg-slate-200 text-slate-600';
                  const cycleLabel = expense.cycle === 'monthly' ? 'Monthly' : expense.cycle === 'annual' ? 'Annual' : 'One-Time';

                  return (
                    <div key={expense.id} className={`relative pl-8 ${!isAutoRenewOn && expense.cycle !== 'one-time' ? 'opacity-50' : ''}`}>
                      <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${isAutoRenewOn || expense.cycle === 'one-time' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <div className="p-4 rounded-lg border bg-slate-50 border-slate-100 hover:shadow-md transition-shadow group flex items-start justify-between">
                        <div>
                          <div className={`text-sm font-bold mb-1 ${isAutoRenewOn || expense.cycle === 'one-time' ? 'text-emerald-600' : 'text-slate-500'}`}>{isAutoRenewOn || expense.cycle === 'one-time' ? displayDate : 'CANCELED'}</div>
                          <div className={`font-medium text-slate-800 cursor-pointer transition-colors mb-2 flex items-center gap-1.5 ${isAutoRenewOn || expense.cycle === 'one-time' ? 'hover:text-emerald-600' : 'line-through'}`} onClick={() => openExpenseModal(expense)}>{expense.category === 'Domains' ? <Globe size={14} className={isAutoRenewOn ? 'text-teal-500' : 'text-slate-400'} /> : null}{expense.name}</div>
                          <div className="flex items-center gap-2">
                            {activeBudgetTab === 'overview' && company && (
                              <div className="flex items-center gap-1">
                                <CompanyLogo company={company} sizeClass="w-4 h-4" textClass="text-[8px]" />
                                <span className="text-[10px] text-slate-500 font-medium">{company.name}</span>
                                <span className="text-slate-300 px-1">•</span>
                              </div>
                            )}
                            <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{expense.category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-slate-800 text-lg mb-1">{formatCurrency(expense.amount)}</div>
                           <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cycleColor}`}>{cycleLabel}</span>
                        </div>
                      </div>
                    </div>
                  )
                }) : ( <div className="p-8 text-slate-500 text-sm">No forecasted expenses.</div> )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}