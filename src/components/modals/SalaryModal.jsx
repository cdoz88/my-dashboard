import React from 'react';
import { X, DollarSign, Calendar, FileText, Briefcase, RefreshCw } from 'lucide-react';

export default function SalaryModal({
  editingSalary, setEditingSalary, handleSaveSalary, setIsSalaryModalOpen, users
}) {

  // Failsafe: Round amount to 2 decimal places to prevent float errors
  const handleAmountChange = (e) => {
      let val = e.target.value;
      if (val.includes('.')) {
          const [whole, fraction] = val.split('.');
          if (fraction && fraction.length > 2) {
              val = `${whole}.${fraction.slice(0, 2)}`;
          }
      }
      setEditingSalary({...editingSalary, amount: val});
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-emerald-500">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Briefcase className="text-emerald-500" size={20} />
            {editingSalary?.id ? 'Edit Base Pay / Salary' : 'Add Base Pay / Salary'}
          </h3>
          <button type="button" onClick={() => setIsSalaryModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <form id="salaryForm" onSubmit={handleSaveSalary} className="space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Creator</label>
              <select required value={editingSalary?.userId || ''} onChange={(e) => setEditingSalary({...editingSalary, userId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
                <option value="" disabled>Select creator...</option>
                {users && users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={14} className="text-slate-400" /></div>
                <input required type="number" step="0.01" min="0.01" value={editingSalary?.amount || ''} onChange={handleAmountChange} className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-700" placeholder="0.00" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={editingSalary?.isRecurring || false} onChange={(e) => setEditingSalary({...editingSalary, isRecurring: e.target.checked})} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                  Make this a recurring payment
              </label>
            </div>

            {editingSalary?.isRecurring && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><RefreshCw size={14} className="text-slate-400"/> Frequency</label>
                  <select required value={editingSalary?.frequency || 'monthly'} onChange={(e) => setEditingSalary({...editingSalary, frequency: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> Start Date</label>
                  <input required type="date" value={editingSalary?.startDate || ''} onChange={(e) => setEditingSalary({...editingSalary, startDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><FileText size={14} className="text-slate-400"/> Notes / Memo</label>
              <textarea rows="2" value={editingSalary?.notes || ''} onChange={(e) => setEditingSalary({...editingSalary, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Lead Editor Base Salary" />
            </div>

          </form>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={() => setIsSalaryModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="salaryForm" className="px-4 py-2 text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors font-bold shadow-sm">
             {editingSalary?.id ? 'Update Salary' : 'Save Salary'}
          </button>
        </div>
      </div>
    </div>
  );
}