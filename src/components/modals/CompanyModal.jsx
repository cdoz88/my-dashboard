import React from 'react';
import { X, Building2, Camera, UserCircle } from 'lucide-react';

export default function CompanyModal({
  editingCompany, setEditingCompany, handleSaveCompany, handleDeleteCompany,
  setIsCompanyModalOpen, users, toggleCompanyUser, handleCompanyLogoUpload, isUploading
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">{editingCompany.id ? 'Edit Company' : 'Add New Company'}</h3>
          <button onClick={() => setIsCompanyModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <form id="companyForm" onSubmit={handleSaveCompany} className="p-6 overflow-y-auto space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {editingCompany.logoUrl ? (
                <img src={editingCompany.logoUrl} className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm bg-white" alt="Company Logo" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center"><Building2 size={32} className="text-slate-400" /></div>
              )}
              <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-colors" title="Upload Logo">
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handleCompanyLogoUpload} disabled={isUploading} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input required type="text" value={editingCompany.name} onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Acme Corp" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Team Members Access</label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
              {users.map(u => (
                <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">
                  <input type="checkbox" checked={editingCompany.userIds?.includes(u.id) || false} onChange={() => toggleCompanyUser(u.id)} className="w-4 h-4 accent-blue-600 rounded" />
                  {u.avatarUrl ? <img src={u.avatarUrl} className="w-6 h-6 rounded-full object-cover bg-white" alt="User Avatar" /> : <UserCircle size={24} className="text-slate-400" />}
                  <span className="text-sm font-medium text-slate-700">{u.name}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          {editingCompany.id && <button type="button" onClick={() => handleDeleteCompany(editingCompany.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
          <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
          <button type="submit" form="companyForm" disabled={isUploading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{editingCompany.id ? 'Save Changes' : 'Add Company'}</button>
        </div>
      </div>
    </div>
  );
}