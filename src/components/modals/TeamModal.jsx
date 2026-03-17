import React from 'react';
import { X, Users, Plus, UserCircle, Shield, Camera, Key, LayoutDashboard, CalendarDays, Wallet, Globe, Mic, ToggleRight, ToggleLeft, Youtube, Tv, Award } from 'lucide-react';
import CompanyLogo from '../shared/CompanyLogo';

export default function TeamModal({
  users, companies, editingTeamMember, setEditingTeamMember, handleSaveTeamMember, handleDeleteUser,
  handleTeamMemberImageUpload, isUploading, setIsTeamModalOpen, currentUser
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex overflow-hidden">
        <div className="w-1/3 border-r border-slate-100 bg-slate-50 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18} className="text-blue-600"/> Team</h3>
            <button onClick={() => setEditingTeamMember({ id: null, name: '', email: '', phone: '', title: '', venmo: '', webhookUrl: '', password: '', isAdmin: false, canViewProjects: true, canViewBudget: false, canViewDomains: false, canViewEvents: true, canViewSpreaker: false, canViewYoutube: false, canViewShows: false, canViewSponsorships: false, companyIds: [], generateOnboarding: true, managerId: '', responsibilities: '' })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Plus size={18}/></button>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {users.map(u => (
              <button key={u.id} onClick={() => {
                  const userCompanyIds = companies.filter(c => c.userIds?.includes(u.id)).map(c => c.id);
                  setEditingTeamMember({...u, password: '', companyIds: userCompanyIds});
              }} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${editingTeamMember?.id === u.id ? 'bg-blue-100 border-blue-200' : 'hover:bg-white border border-transparent'}`}>
                {u.avatarUrl ? <img src={u.avatarUrl} className="w-8 h-8 rounded-full object-cover bg-white" alt="Avatar" /> : <UserCircle size={32} className="text-slate-400" />}
                <div className="overflow-hidden">
                  <div className="font-semibold text-sm text-slate-800 truncate flex items-center gap-1">{u.name} {u.isAdmin && <Shield size={12} className="text-amber-500" title="Admin"/>}</div>
                  <div className="text-xs text-slate-500 truncate">{u.email}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white relative">
          <button onClick={() => setIsTeamModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"><X size={20}/></button>
          
          {editingTeamMember ? (
            <div className="p-8 overflow-y-auto flex-1">
              <h2 className="text-2xl font-bold mb-6">{editingTeamMember.id ? 'Edit Team Member' : 'Invite New Member'}</h2>
              
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="relative">
                  {editingTeamMember.avatarUrl ? <img src={editingTeamMember.avatarUrl} className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm bg-white" alt="Avatar" /> : <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-sm"><UserCircle size={48} className="text-slate-400" /></div>}
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-colors" title="Upload Avatar"><Camera size={14} /><input type="file" accept="image/*" className="hidden" onChange={handleTeamMemberImageUpload} disabled={isUploading} /></label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" required value={editingTeamMember.name} onChange={(e) => setEditingTeamMember({...editingTeamMember, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" required value={editingTeamMember.email} onChange={(e) => setEditingTeamMember({...editingTeamMember, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" value={editingTeamMember.phone || ''} onChange={(e) => setEditingTeamMember({...editingTeamMember, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 555-5555" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title / Role</label>
                  <input type="text" value={editingTeamMember.title || ''} onChange={(e) => setEditingTeamMember({...editingTeamMember, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Lead Designer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reports To (Manager)</label>
                  <select value={editingTeamMember.managerId || ''} onChange={(e) => setEditingTeamMember({...editingTeamMember, managerId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">No Manager (Top Level)</option>
                      {users.filter(u => u.id !== editingTeamMember.id).map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Venmo Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">@</span>
                    <input type="text" value={editingTeamMember.venmo || ''} onChange={(e) => setEditingTeamMember({...editingTeamMember, venmo: e.target.value.replace('@', '')})} className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="username" />
                  </div>
                </div>
                
                <div className="md:col-span-2 pt-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Roles & Responsibilities</label>
                  <textarea rows="3" value={editingTeamMember.responsibilities || ''} onChange={(e) => setEditingTeamMember({...editingTeamMember, responsibilities: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="List core duties, projects owned, etc..." />
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Key size={14} className="text-slate-400"/> {editingTeamMember.id ? 'Reset Password' : 'Set Initial Password'}</label>
                  <input type="text" placeholder={editingTeamMember.id ? 'Leave blank to keep current password' : 'e.g. Welcome123!'} value={editingTeamMember.password || ''} onChange={(e) => setEditingTeamMember({...editingTeamMember, password: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              <div className="mb-8 pt-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">Google Chat Webhook URL <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Push Notifications</span></label>
                 <input type="text" value={editingTeamMember.webhookUrl || ''} onChange={(e) => setEditingTeamMember({...editingTeamMember, webhookUrl: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://chat.googleapis.com/v1/spaces/..." />
                 <p className="text-[10px] text-slate-400 mt-1.5">Paste the incoming webhook URL from this user's Google Chat Space to enable push notifications for task assignments.</p>
              </div>

              {!editingTeamMember.id && (
                <div className="mb-6">
                   <label className="flex items-center justify-between p-4 rounded-xl border border-indigo-200 bg-indigo-50 cursor-pointer transition-colors shadow-sm hover:border-indigo-300">
                     <div className="text-left">
                         <div className="font-bold text-indigo-800 flex items-center gap-2">Generate Onboarding Project</div>
                         <div className="text-xs text-indigo-600 mt-0.5">Automatically create an admin-only project and assign template tasks to this user.</div>
                     </div>
                     <input type="checkbox" className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" checked={editingTeamMember.generateOnboarding !== false} onChange={(e) => setEditingTeamMember({...editingTeamMember, generateOnboarding: e.target.checked})} />
                   </label>
                </div>
              )}

              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Team Assignments</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50 mb-8">
                 {companies.map(c => (
                   <label key={c.id} className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">
                     <input type="checkbox" checked={editingTeamMember.companyIds?.includes(c.id) || false} onChange={(e) => {
                        const newIds = e.target.checked 
                           ? [...(editingTeamMember.companyIds || []), c.id]
                           : (editingTeamMember.companyIds || []).filter(id => id !== c.id);
                        setEditingTeamMember({...editingTeamMember, companyIds: newIds});
                     }} className="w-4 h-4 accent-blue-600 rounded" />
                     <CompanyLogo company={c} sizeClass="w-5 h-5" />
                     <span className="text-sm font-medium text-slate-700">{c.name}</span>
                   </label>
                 ))}
              </div>

              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">App Access & Permissions</h3>
              <div className="space-y-3">
                <button type="button" onClick={() => setEditingTeamMember({...editingTeamMember, isAdmin: !editingTeamMember.isAdmin})} className={`w-full flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${editingTeamMember.isAdmin ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                  <div className="text-left">
                    <div className="font-bold text-slate-800 flex items-center gap-2"><Shield size={16} className={editingTeamMember.isAdmin ? 'text-amber-500' : 'text-slate-400'}/> Master Admin</div>
                    <div className="text-xs text-slate-500 mt-1">Can see all companies, all apps, and manage team members.</div>
                  </div>
                  <div className={editingTeamMember.isAdmin ? 'text-amber-500' : 'text-slate-300'}>{editingTeamMember.isAdmin ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}</div>
                </button>

                <div className={`space-y-3 transition-opacity ${editingTeamMember.isAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="font-medium text-slate-700 flex items-center gap-2"><LayoutDashboard size={16} className="text-blue-500"/> Projects App</div>
                    <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded" checked={editingTeamMember.canViewProjects} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewProjects: e.target.checked})} />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="font-medium text-slate-700 flex items-center gap-2"><CalendarDays size={16} className="text-purple-500"/> Events App</div>
                    <input type="checkbox" className="w-5 h-5 accent-purple-600 rounded" checked={editingTeamMember.canViewEvents} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewEvents: e.target.checked})} />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="font-medium text-slate-700 flex items-center gap-2"><Wallet size={16} className="text-emerald-500"/> Expenses App</div>
                    <input type="checkbox" className="w-5 h-5 accent-emerald-600 rounded" checked={editingTeamMember.canViewBudget} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewBudget: e.target.checked})} />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="font-medium text-slate-700 flex items-center gap-2"><Globe size={16} className="text-teal-500"/> Domains App</div>
                    <input type="checkbox" className="w-5 h-5 accent-teal-600 rounded" checked={editingTeamMember.canViewDomains} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewDomains: e.target.checked})} />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="font-medium text-slate-700 flex items-center gap-2"><Youtube size={16} className="text-red-500"/> YouTube App</div>
                    <input type="checkbox" className="w-5 h-5 accent-red-600 rounded" checked={editingTeamMember.canViewYoutube} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewYoutube: e.target.checked})} />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="font-medium text-slate-700 flex items-center gap-2"><Tv size={16} className="text-red-500"/> Shows App</div>
                    <input type="checkbox" className="w-5 h-5 accent-red-600 rounded" checked={editingTeamMember.canViewShows} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewShows: e.target.checked})} />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="font-medium text-slate-700 flex items-center gap-2"><Award size={16} className="text-amber-500"/> Sponsorships App</div>
                    <input type="checkbox" className="w-5 h-5 accent-amber-500 rounded" checked={editingTeamMember.canViewSponsorships} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewSponsorships: e.target.checked})} />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                    <div className="font-medium text-slate-700 flex items-center gap-2"><Mic size={16} className="text-[#ffc005]"/> Spreaker App</div>
                    <input type="checkbox" className="w-5 h-5 accent-[#ffc005] rounded" checked={editingTeamMember.canViewSpreaker} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewSpreaker: e.target.checked})} />
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between">
                {editingTeamMember.id && editingTeamMember.id !== currentUser.id ? (
                   <button type="button" onClick={() => handleDeleteUser(editingTeamMember.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">Remove Member</button>
                ) : <div></div>}
                <button onClick={handleSaveTeamMember} disabled={isUploading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors">Save Member</button>
              </div>
            </div>
          ) : ( <div className="flex-1 flex flex-col items-center justify-center text-slate-400"><Users size={64} className="mb-4 opacity-20" /><p>Select a user to edit or create a new one.</p></div> )}
        </div>
      </div>
    </div>
  );
}