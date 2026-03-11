import React from 'react';
import { Receipt, X, DollarSign, ToggleRight, ToggleLeft } from 'lucide-react';
import { expenseCategories } from '../../utils/constants';

export default function ExpenseModal({
  currentExpense, setCurrentExpense, handleSaveExpense, handleDeleteExpense,
  setIsExpenseModalOpen, visibleCompanies
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-emerald-600">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Receipt className="text-emerald-600" size={20} />{currentExpense.id ? 'Edit Expense' : 'Add New Expense'}</h3>
          <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="expenseForm" onSubmit={handleSaveExpense} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expense Name</label>
              <input required type="text" value={currentExpense.name} onChange={(e) => setCurrentExpense({...currentExpense, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Adobe Creative Cloud" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <select required value={currentExpense.companyId} onChange={(e) => setCurrentExpense({...currentExpense, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
                  <option value="" disabled>Select a company</option>
                  {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={currentExpense.category} onChange={(e) => setCurrentExpense({...currentExpense, category: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={16} className="text-slate-400" /></div>
                  <input required type="number" step="0.01" min="0" value={currentExpense.amount} onChange={(e) => setCurrentExpense({...currentExpense, amount: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Billing Cycle</label>
                <select value={currentExpense.cycle} onChange={(e) => setCurrentExpense({...currentExpense, cycle: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="one-time">One-Time</option>
                </select>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Next Renewal Date</label>
                  {currentExpense.cycle !== 'one-time' && (
                      <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-xs font-semibold text-slate-500">Auto-Renew:</span>
                          <button type="button" onClick={() => setCurrentExpense({...currentExpense, autoRenew: !currentExpense.autoRenew})} className={`${currentExpense.autoRenew ? 'text-emerald-500' : 'text-slate-300'} transition-colors`}>
                              {currentExpense.autoRenew ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                          </button>
                      </label>
                  )}
              </div>
              {currentExpense.cycle === 'monthly' ? (
                 <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    Renews every month on day: 
                    <input type="number" min="1" max="31" placeholder="DD" value={currentExpense.renewalDate ? currentExpense.renewalDate.replace(/\D/g,'') : ''} onChange={(e) => setCurrentExpense({...currentExpense, renewalDate: `Day ${e.target.value}`})} className="w-16 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                 </div>
              ) : currentExpense.cycle === 'annual' ? (
                 <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    Renews every year on: 
                    <input type="text" placeholder="e.g. Mar 15" value={currentExpense.renewalDate || ''} onChange={(e) => setCurrentExpense({...currentExpense, renewalDate: e.target.value})} className="flex-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                 </div>
              ) : (
                 <input type="date" value={currentExpense.renewalDate || ''} onChange={(e) => setCurrentExpense({...currentExpense, renewalDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea rows="2" value={currentExpense.notes || ''} onChange={(e) => setCurrentExpense({...currentExpense, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Optional details..." />
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          {currentExpense.id && <button type="button" onClick={() => handleDeleteExpense(currentExpense.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
          <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="expenseForm" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium">{currentExpense.id ? 'Save Changes' : 'Add Expense'}</button>
        </div>
      </div>
    </div>
  );
}