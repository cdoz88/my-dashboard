import React from 'react';
import { X, UserCircle, Camera, Key, LogOut } from 'lucide-react';

export default function ProfileModal({
  profileForm, setProfileForm, handleSaveProfile, handleProfileImageUpload,
  isUploading, setIsProfileModalOpen, setLoggedInUserId
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800">My Profile</h3>
          <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <form id="profileForm" onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {profileForm.avatarUrl ? (
                <img src={profileForm.avatarUrl} className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm bg-white" alt="Avatar" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-sm"><UserCircle size={48} className="text-slate-400" /></div>
              )}
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-colors" title="Upload Avatar">
                <Camera size={16} />
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} disabled={isUploading} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input required type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input required type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title / Role</label>
                <input type="text" value={profileForm.title} onChange={(e) => setProfileForm({...profileForm, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Lead Designer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 555-5555" />
              </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Venmo Username</label>
             <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">@</span>
                <input type="text" value={profileForm.venmo} onChange={(e) => setProfileForm({...profileForm, venmo: e.target.value.replace('@', '')})} className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="username" />
             </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">Google Chat Webhook URL</label>
            <input type="text" value={profileForm.webhookUrl || ''} onChange={(e) => setProfileForm({...profileForm, webhookUrl: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://chat.googleapis.com/v1/spaces/..." />
          </div>

          <div className="pt-4 border-t border-slate-100 mt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Key size={14} className="text-slate-400"/> New Password</label>
            <input type="password" value={profileForm.password} onChange={(e) => setProfileForm({...profileForm, password: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Leave blank to keep current password" />
          </div>
        </form>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between gap-3 flex-shrink-0">
          <button type="button" onClick={() => { setLoggedInUserId(null); setIsProfileModalOpen(false); }} className="px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium flex items-center gap-2 transition-colors"><LogOut size={16}/> Log Out</button>
          <div className="flex gap-3">
            <button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
            <button type="submit" form="profileForm" disabled={isUploading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}