import React from 'react';
import { BookUser, X, Building2, Mail, Phone, AlignLeft } from 'lucide-react';

export default function ContactModal({
  editingContact, setEditingContact, handleSaveContact, handleDeleteContact, 
  setIsContactModalOpen, visibleCompanies
}) {
  const contactTypes = ['General', 'Sponsor', 'Guest', 'Lead', 'Partner', 'Vendor'];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-sky-500">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><BookUser className="text-sky-500" size={20} />{editingContact.id ? 'Edit Contact' : 'Add Contact'}</h3>
          <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="contactForm" onSubmit={handleSaveContact} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input required type="text" value={editingContact.name} onChange={(e) => setEditingContact({...editingContact, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., Jane Doe" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company (Internal Owner)</label>
                  <select required value={editingContact.companyId} onChange={(e) => setEditingContact({...editingContact, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50">
                    <option value="" disabled>Select internal owner</option>
                    {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><Building2 size={14} className="text-slate-400"/> Organization / Brand</label>
                  <input type="text" value={editingContact.organization || ''} onChange={(e) => setEditingContact({...editingContact, organization: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Their company name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Type</label>
                  <select value={editingContact.contactType} onChange={(e) => setEditingContact({...editingContact, contactType: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                    {contactTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><Mail size={14} className="text-slate-400"/> Email Address</label>
                  <input type="email" value={editingContact.email || ''} onChange={(e) => setEditingContact({...editingContact, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><Phone size={14} className="text-slate-400"/> Phone Number</label>
                  <input type="tel" value={editingContact.phone || ''} onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="(555) 555-5555" />
                </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><AlignLeft size={14} className="text-slate-400"/> Notes / Details</label>
              <textarea rows="4" value={editingContact.notes || ''} onChange={(e) => setEditingContact({...editingContact, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Context, communication history, etc..." />
            </div>

          </form>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          {editingContact.id && <button type="button" onClick={() => handleDeleteContact(editingContact.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
          <button type="button" onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200