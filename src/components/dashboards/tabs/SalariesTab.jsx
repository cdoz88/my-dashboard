import React, { useState } from 'react';
import { Briefcase, Plus, Pencil, Trash2, UserCircle } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import { API_URL } from '../../../utils/constants';
import SalaryModal from '../../modals/SalaryModal';

export default function SalariesTab({ salaries, setSalaries, currentUser, users }) {
    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
    const [editingSalary, setEditingSalary] = useState({ id: null, userId: '', amount: '', isRecurring: false, frequency: 'monthly', startDate: '', notes: '' });

    const handleSaveSalary = async (e) => {
        e.preventDefault();
        if (!editingSalary?.userId) { alert("Please select a creator."); return; }
        
        const salaryData = editingSalary.id ? editingSalary : { ...editingSalary, id: 'sal_' + Date.now() };
        
        if (editingSalary.id) {
            setSalaries(salaries.map(s => s.id === salaryData.id ? salaryData : s));
        } else {
            setSalaries([salaryData, ...salaries]);
        }
        
        setIsSalaryModalOpen(false);

        try {
            await fetch(`${API_URL}?action=save_salary`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(salaryData) 
            });
        } catch (err) {
            console.error("Error saving salary:", err);
        }
    };

    const handleDeleteSalary = async (id) => {
        if (!window.confirm("Are you sure you want to completely remove this salary/base pay rule?")) return;
        
        setSalaries(salaries.filter(s => s.id !== id));
        setIsSalaryModalOpen(false);

        try {
            await fetch(`${API_URL}?action=delete_salary`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ id }) 
            });
        } catch (err) {
            console.error("Error deleting salary:", err);
        }
    };

    const visibleSalaries = currentUser?.isAdmin ? salaries : (salaries || []).filter(s => s.userId === currentUser?.id);

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
            <div className="flex-1 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Briefcase className="text-emerald-600" size={28} />
                            Salaries & Base Pay
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {currentUser?.isAdmin ? 'Assign flat-rate or recurring salaries to creators on the ledger.' : 'View your base pay and recurring salary configurations.'}
                        </p>
                    </div>
                    {currentUser?.isAdmin && (
                        <button onClick={() => { setEditingSalary({ id: null, userId: '', amount: '', isRecurring: false, frequency: 'monthly', startDate: '', notes: '' }); setIsSalaryModalOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2">
                            <Plus size={18} /> Add Salary
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[700px]">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Creator</th>
                                    <th className="px-6 py-4 text-center">Amount</th>
                                    <th className="px-6 py-4 text-center">Frequency</th>
                                    <th className="px-6 py-4 text-center">Start Date</th>
                                    <th className="px-6 py-4">Memo</th>
                                    {currentUser?.isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visibleSalaries.length > 0 ? visibleSalaries.map((salary) => {
                                    const linkedUser = users.find(u => u.id === salary.userId);
                                    return (
                                    <tr key={salary.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                                            {linkedUser?.avatarUrl ? <img src={linkedUser.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-slate-200" /> : <UserCircle size={20} className="text-slate-400" />}
                                            {linkedUser?.name || 'Unknown User'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-emerald-600">{formatCurrency(parseFloat(salary.amount || 0))}</td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-700">
                                            {salary.isRecurring ? <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 text-xs capitalize">{salary.frequency}</span> : <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 text-xs">One-Time</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-slate-600">{salary.isRecurring && salary.startDate ? new Date(`${salary.startDate}T12:00:00`).toLocaleDateString() : '--'}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs truncate max-w-[200px]" title={salary.notes}>{salary.notes || '--'}</td>
                                        {currentUser?.isAdmin && (
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => { setEditingSalary(salary); setIsSalaryModalOpen(true); }} className="text-slate-400 hover:text-blue-600 p-1 mr-2 transition-colors" title="Edit"><Pencil size={16} /></button>
                                                <button onClick={() => handleDeleteSalary(salary.id)} className="text-slate-400 hover:text-red-600 p-1 transition-colors" title="Delete"><Trash2 size={16} /></button>
                                            </td>
                                        )}
                                    </tr>
                                )}) : (
                                    <tr>
                                        <td colSpan={currentUser?.isAdmin ? "6" : "5"} className="px-6 py-8 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Briefcase size={48} className="text-slate-300 mb-3" />
                                                <p className="font-semibold">No base salaries configured.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {isSalaryModalOpen && currentUser?.isAdmin && (
                    <SalaryModal 
                        editingSalary={editingSalary}
                        setEditingSalary={setEditingSalary}
                        handleSaveSalary={handleSaveSalary}
                        setIsSalaryModalOpen={setIsSalaryModalOpen}
                        users={users}
                    />
                )}
            </div>
        </div>
    );
}