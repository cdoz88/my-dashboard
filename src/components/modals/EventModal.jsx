import React from 'react';
import { CalendarDays, X, DollarSign, Plus, CheckCircle, ToggleRight, ToggleLeft } from 'lucide-react';

export default function EventModal({
  editingEvent, setEditingEvent, paymentMode, setPaymentMode,
  handleSaveEvent, handleDeleteEvent, setIsEventModalOpen, visibleCompanies
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-purple-600">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><CalendarDays className="text-purple-600" size={20} />{editingEvent.id ? 'Edit Event' : 'Add New Event'}</h3>
          <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="eventForm" onSubmit={handleSaveEvent} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
              <input required type="text" value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., CES 2027" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <select required value={editingEvent.companyId} onChange={(e) => setEditingEvent({...editingEvent, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50">
                <option value="" disabled>Select a company</option>
                {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input required type="date" value={editingEvent.eventDate} onChange={(e) => setEditingEvent({...editingEvent, eventDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                <input type="time" value={editingEvent.eventTime || ''} onChange={(e) => setEditingEvent({...editingEvent, eventTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <div><div className="text-sm font-bold text-slate-800">Estimated Cost / Expenses</div><div className="text-[10px] text-slate-500">Auto-generates one-time expenses for your budget.</div></div>
                    <select value={paymentMode} onChange={(e) => { setPaymentMode(e.target.value); if (e.target.value === 'installments' && editingEvent.installments.length === 0) setEditingEvent({...editingEvent, installments: [{amount: '', date: ''}]}); }} className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-slate-50 text-slate-700 focus:outline-none" disabled={!!editingEvent.expenseId}>
                        <option value="single">Single Payment</option>
                        <option value="installments">Multiple Installments</option>
                    </select>
                </div>
                {paymentMode === 'single' ? (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Amount ($)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={14} className="text-slate-400" /></div>
                                <input type="number" step="0.01" min="0" value={editingEvent.cost} onChange={(e) => setEditingEvent({...editingEvent, cost: e.target.value})} className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="0.00" disabled={!!editingEvent.expenseId} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Billing Date</label>
                            <input type="date" value={editingEvent.billingDate || ''} onChange={(e) => setEditingEvent({...editingEvent, billingDate: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" disabled={!!editingEvent.expenseId} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-in fade-in">
                        {editingEvent.installments.map((inst, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none"><DollarSign size={12} className="text-slate-400" /></div>
                                    <input type="number" required placeholder="Amount" value={inst.amount} onChange={(e) => { const newInsts = [...editingEvent.installments]; newInsts[idx].amount = e.target.value; setEditingEvent({...editingEvent, installments: newInsts}); }} className="w-full pl-6 pr-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500" disabled={!!editingEvent.expenseId} />
                                </div>
                                <input type="date" required value={inst.date} onChange={(e) => { const newInsts = [...editingEvent.installments]; newInsts[idx].date = e.target.value; setEditingEvent({...editingEvent, installments: newInsts}); }} className="flex-1 px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500" disabled={!!editingEvent.expenseId} />
                                {!editingEvent.expenseId && <button type="button" onClick={() => { const newInsts = editingEvent.installments.filter((_, i) => i !== idx); setEditingEvent({...editingEvent, installments: newInsts}); }} className="p-1.5 text-slate-400 hover:text-red-500"><X size={14}/></button>}
                            </div>
                        ))}
                        {!editingEvent.expenseId && <button type="button" onClick={() => setEditingEvent({...editingEvent, installments: [...editingEvent.installments, {amount: '', date: ''}]})} className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-2"><Plus size={12}/> Add Installment</button>}
                    </div>
                )}
                {editingEvent.expenseId ? <p className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle size={10}/> Expenses have been mapped to your Budget.</p> : <p className="text-[10px] text-slate-400 mt-2 italic">Note: Changing the cost after saving will not update the generated expenses.</p>}
            </div>

            <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <div><div className="text-sm font-bold text-slate-800">Auto-Generate Prep Project</div><div className="text-[10px] text-slate-500">Automatically creates a project for your team to start planning.</div></div>
                    <button type="button" onClick={() => { if (editingEvent.projectId) { alert("A project has already been generated for this event. You cannot turn this off."); return; } setEditingEvent({...editingEvent, autoProject: !editingEvent.autoProject}); }} className={`${editingEvent.autoProject ? 'text-purple-600' : 'text-slate-300'} transition-colors`}>{editingEvent.autoProject ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}</button>
                </div>
                {editingEvent.autoProject && !editingEvent.projectId && (
                    <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg border border-purple-100 animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm font-medium text-purple-800 flex-shrink-0">Create</span>
                        {editingEvent.projectLeadUnit !== 'now' && <input type="number" min="1" value={editingEvent.projectLeadTime} onChange={(e) => setEditingEvent({...editingEvent, projectLeadTime: e.target.value})} className="w-16 px-2 py-1 text-sm border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />}
                        <select value={editingEvent.projectLeadUnit} onChange={(e) => setEditingEvent({...editingEvent, projectLeadUnit: e.target.value})} className="flex-1 px-2 py-1 text-sm border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-purple-800">
                            <option value="now">Immediately</option>
                            <option value="days">Days before event</option>
                            <option value="weeks">Weeks before event</option>
                            <option value="months">Months before event</option>
                            <option value="years">Years before event</option>
                        </select>
                    </div>
                )}
                {editingEvent.projectId && (
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                         <p className="text-xs text-purple-700 font-bold flex items-center gap-1"><CheckCircle size={14}/> Prep Project has been generated!</p>
                         <p className="text-[10px] text-purple-600 mt-0.5">Check your Projects dashboard to manage tasks for this event.</p>
                    </div>
                )}
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          {editingEvent.id && <button type="button" onClick={() => handleDeleteEvent(editingEvent.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
          <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="eventForm" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">{editingEvent.id ? 'Save Changes' : 'Create Event'}</button>
        </div>
      </div>
    </div>
  );
}
