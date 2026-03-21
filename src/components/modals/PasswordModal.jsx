import React from 'react';
import { Lock, X, Globe, User, Key, AlignLeft, Users, FolderTree } from 'lucide-react';

export default function PasswordModal({
  editingPassword, setEditingPassword, handleSavePassword, handleDeletePassword, 
  setIsPasswordModalOpen, visibleCompanies, users, currentUser
}) {
  const categories = ['Company', 'Shop', 'Content Creation', 'Content Distribution', 'Social Media', 'Website', 'Mobile App', 'Other', 'Uncategorized'];

  const toggleSharedUser = (userId) => {
      const current = editingPassword.sharedWith || [];
      const updated = current.includes(userId) ? current.filter(id => id !== userId) : [...current, userId];
      setEditingPassword({ ...editingPassword, sharedWith: updated });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Lock className="text-slate-800" size={20} />{editingPassword.id ? 'Edit Password' : 'Add Password'}</h3>
          <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="passwordForm" onSubmit={handleSavePassword} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Platform / Service Name</label>
                  <input required type="text" value={editingPassword.platform} onChange={(e) => setEditingPassword({...editingPassword, platform: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="e.g., Mailchimp" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company (Internal Owner)</label>
                  <select required value={editingPassword.companyId} onChange={(e) => setEditingPassword({...editingPassword, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 bg-slate-50">
                    <option value="" disabled>Select internal owner</option>
                    {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><FolderTree size={14} className="text-slate-400" /> Category</label>
                  <select required value={editingPassword.category || 'Uncategorized'} onChange={(e) => setEditingPassword({...editingPassword, category: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><Globe size={14} className="text-slate-400"/> Website URL</label>
                <input type="text" value={editingPassword.url || ''} onChange={(e) => setEditingPassword({...editingPassword, url: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="https://mailchimp.com/login" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><User size={14} className="text-slate-400"/> Username / Email</label>
                  <input type="text" value={editingPassword.username || ''} onChange={(e) => setEditingPassword({...editingPassword, username: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="login@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><Key size={14} className="text-slate-400"/> Password</label>
                  <input type="text" value={editingPassword.password || ''} onChange={(e) => setEditingPassword({...editingPassword, password: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="SuperSecret123!" />
                </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5"><AlignLeft size={14} className="text-slate-400"/> Notes / 2FA Details</label>
              <textarea rows="3" value={editingPassword.notes || ''} onChange={(e) => setEditingPassword({...editingPassword, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="2FA is connected to John's phone..." />
            </div>

            {currentUser?.isAdmin && (
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5"><Users size={14} className="text-slate-400" /> Share Access</label>
                <p className="text-xs text-slate-500 mb-3">Master Admins always have access. Select specific team members below to grant them visibility to this credential.</p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
                  {users.filter(u => !u.isAdmin).length > 0 ? users.filter(u => !u.isAdmin).map(u => (
                    <label key={u.id} className="flex items-center gap-3 p-1.5 hover:bg-white rounded-md cursor-pointer transition-colors">
                      <input type="checkbox" checked={(editingPassword.sharedWith || []).includes(u.id)} onChange={() => toggleSharedUser(u.id)} className="w-4 h-4 accent-slate-800 rounded" />
                      {u.avatarUrl ? <img src={u.avatarUrl} className="w-6 h-6 rounded-full object-cover bg-white" alt="Avatar" /> : <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">{u.name.charAt(0)}</div>}
                      <span className="text-sm font-medium text-slate-700">{u.name}</span>
                    </label>
                  )) : <span className="text-xs text-slate-400 italic p-2 block">All current users are Master Admins.</span>}
                </div>
              </div>
            )}

          </form>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          {editingPassword.id && <button type="button" onClick={() => handleDeletePassword(editingPassword.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
          <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="passwordForm" className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors font-bold shadow-sm">{editingPassword.id ? 'Save Changes' : 'Add Password'}</button>
        </div>
      </div>
    </div>
  );
}