import React, { useState } from 'react';
import { X, UserCircle, Lock, LogOut, FileText, Trash2, ExternalLink } from 'lucide-react';

export default function ProfileModal({
  profileForm, setProfileForm, handleSaveProfile, handleProfileImageUpload, isUploading, setIsProfileModalOpen, setLoggedInUserId
}) {
  const [newDocName, setNewDocName] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');

  const handleLogout = () => {
    setLoggedInUserId(null);
    setIsProfileModalOpen(false);
  };

  const handleAddDocumentLink = () => {
      if (!newDocName.trim() || !newDocUrl.trim()) return;
      const currentFiles = profileForm.files || [];
      setProfileForm({
          ...profileForm,
          files: [...currentFiles, { name: newDocName.trim(), url: newDocUrl.trim() }]
      });
      setNewDocName('');
      setNewDocUrl('');
  };

  const removeDocument = (indexToRemove) => {
      const currentFiles = profileForm.files || [];
      setProfileForm({
          ...profileForm,
          files: currentFiles.filter((_, idx) => idx !== indexToRemove)
      });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800">My Profile</h3>
          <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="relative">
              {profileForm.avatarUrl ? (
                <img src={profileForm.avatarUrl} className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm bg-white" alt="Avatar" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-sm">
                  <UserCircle size={48} className="text-slate-400" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-slate-700 text-white p-1.5 rounded-full shadow-md cursor-help" title="Avatar managed via WordPress">
                <Lock size={12} />
              </div>
            </div>
          </div>

          <form id="profileForm" onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" required value={profileForm.name || ''} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" required disabled value={profileForm.email || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-500 cursor-not-allowed" title="Email is managed via SSO" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title / Role</label>
                <input type="text" value={profileForm.title || ''} onChange={(e) => setProfileForm({...profileForm, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Lead Designer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="tel" value={profileForm.phone || ''} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 555-5555" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Payment Method</label>
                  <select value={profileForm.paymentMethod || ''} onChange={(e) => setProfileForm({...profileForm, paymentMethod: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Select Method...</option>
                      <option value="CashApp">CashApp</option>
                      <option value="Venmo">Venmo</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Zelle">Zelle</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Other">Other...</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Username / Account</label>
                  <input type="text" value={profileForm.paymentAccount || profileForm.venmo || ''} onChange={(e) => setProfileForm({...profileForm, paymentAccount: e.target.value, venmo: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="$cashtag, @username, or email" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Google Chat Webhook URL</label>
              <input type="url" value={profileForm.webhookUrl || ''} onChange={(e) => setProfileForm({...profileForm, webhookUrl: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://chat.googleapis.com/v1/spaces/..." />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2">Private Documents (W-2, Contracts, etc.)</label>
              
              <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-3">
                <input type="text" placeholder="Name (e.g. W-2)" value={newDocName} onChange={e => setNewDocName(e.target.value)} className="w-full sm:w-1/3 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="url" placeholder="Google Drive / Secure Link" value={newDocUrl} onChange={e => setNewDocUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDocumentLink(); } }} className="w-full flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={handleAddDocumentLink} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors w-full sm:w-auto">Add</button>
              </div>

              {(profileForm.files || []).length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  {profileForm.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border border-slate-200 bg-slate-50 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 overflow-hidden">
                          <FileText size={16} className="text-blue-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-700 truncate" title={file.name}>{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                         <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100 transition-colors flex items-center gap-1">
                             <ExternalLink size={12} /> Open
                         </a>
                         <button type="button" onClick={() => removeDocument(index)} className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors" title="Remove Link"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold">
              <LogOut size={16} /> Log Out
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm">Cancel</button>
            <button type="submit" form="profileForm" disabled={isUploading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-bold shadow-sm text-sm">Save Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}