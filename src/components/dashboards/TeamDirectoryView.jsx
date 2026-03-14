import React from 'react';
import { Users, Mail, Settings, CheckCircle, Shield, UserCircle, Contact, Phone, DollarSign, FolderKanban, Plus, Camera } from 'lucide-react';

export default function TeamDirectoryView({ 
  users, currentUser, handleUpdateUser, setIsOnboardingModalOpen, 
  companies, visibleCompanies, activeTeamTab, globalChecklist,
  projects, tasks, setCurrentApp, setActiveTab, handleGenerateOnboarding,
  setIsAvatarMakerModalOpen
}) {
  let displayedUsers = [];
  if (activeTeamTab === 'overview') {
      if (currentUser?.isAdmin) {
          displayedUsers = users;
      } else {
          const allowedUserIds = new Set();
          visibleCompanies.forEach(c => {
              if (c.userIds) c.userIds.forEach(id => allowedUserIds.add(id));
          });
          displayedUsers = users.filter(u => allowedUserIds.has(u.id) || u.id === currentUser.id);
      }
  } else {
      const selectedCompany = companies.find(c => c.id === activeTeamTab);
      if (selectedCompany) {
          displayedUsers = users.filter(u => selectedCompany.userIds?.includes(u.id));
      }
  }

  const currentCompany = activeTeamTab === 'overview' ? null : companies.find(c => c.id === activeTeamTab);

  return (
    <div className="p-4 sm:p-8 h-full overflow-y-auto w-full bg-slate-50/50 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Contact className="text-indigo-600" size={28} />
            {currentCompany ? `${currentCompany.name} Directory` : 'Team Directory'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Contact info and roles for {currentCompany ? 'this company' : 'all team members'}.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAvatarMakerModalOpen(true)} 
            className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <Camera size={16} />
            Avatar Maker
          </button>
          {currentUser?.isAdmin && (
            <button 
              onClick={() => setIsOnboardingModalOpen(true)} 
              className="flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              <Settings size={16} className="text-slate-500" />
              Onboarding Templates
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedUsers.map(user => {
          return (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-5 flex items-start gap-4">
                {user.avatarUrl ? ( 
                  <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm bg-slate-100 flex-shrink-0" /> 
                ) : ( 
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                    <UserCircle size={32} className="text-slate-400" />
                  </div> 
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-1.5 truncate">
                    {user.name}
                    {user.isAdmin && <Shield size={14} className="text-amber-500 flex-shrink-0" title="Admin" />}
                  </h3>
                  
                  {user.title && (
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 truncate">
                      {user.title}
                    </div>
                  )}

                  <div className="mt-3 space-y-1.5">
                      <a href={`mailto:${user.email}`} className="text-sm text-indigo-600 hover:underline flex items-center gap-2 truncate">
                        <Mail size={14} className="flex-shrink-0" />
                        {user.email}
                      </a>
                      {user.phone && (
                        <a href={`tel:${user.phone}`} className="text-sm text-slate-500 hover:text-indigo-600 hover:underline flex items-center gap-2 truncate">
                          <Phone size={14} className="flex-shrink-0" />
                          {user.phone}
                        </a>
                      )}
                      {user.venmo && (
                        <div className="text-sm text-slate-500 flex items-center gap-2 truncate">
                          <DollarSign size={14} className="flex-shrink-0 text-emerald-500 bg-emerald-50 rounded-full p-0.5" />
                          <span className="font-medium text-slate-700">@{user.venmo}</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
              
              {currentUser?.isAdmin && (
                  <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex-1 flex flex-col justify-end">
                     {(() => {
                        const onboardingProject = projects.find(p => p.name === `Onboarding: ${user.name}` && p.adminOnly);
                        
                        if (onboardingProject) {
                            const userTasks = tasks.filter(t => t.projectId === onboardingProject.id);
                            const totalCount = userTasks.length;
                            const completedCount = userTasks.filter(t => t.status === 'done').length;
                            const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
                            const isFullyOnboarded = totalCount > 0 && completedCount === totalCount;
                            
                            return (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Onboarding Project</h4>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isFullyOnboarded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {isFullyOnboarded ? 'Complete' : `${completedCount}/${totalCount} Tasks`}
                                        </span>
                                    </div>
                                    
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-4">
                                        <div 
                                            className={`h-full transition-all duration-500 ${isFullyOnboarded ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                            style={{ width: `${progressPercent}%` }} 
                                        />
                                    </div>
                                    <button 
                                        onClick={() => { setCurrentApp('projects'); setActiveTab(onboardingProject.id); }}
                                        className="w-full py-2 bg-white hover:bg-slate-50 text-indigo-600 border-indigo-200 text-sm font-bold rounded-lg transition-colors border shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <FolderKanban size={16} /> Open Project
                                    </button>
                                </div>
                            );
                        } else {
                            return (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <span className="text-xs text-slate-400 font-medium mb-3">No onboarding project exists for this user.</span>
                                    <button 
                                        onClick={() => handleGenerateOnboarding(user)}
                                        className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold rounded-lg transition-colors border border-indigo-200 flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Plus size={16} /> Generate Project
                                    </button>
                                </div>
                            );
                        }
                     })()}
                  </div>
              )}
            </div>
          )
        })}
        {displayedUsers.length === 0 && (
            <div className="col-span-full p-12 text-center flex flex-col items-center bg-white rounded-xl border border-slate-200 border-dashed">
                <Users size={32} className="text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No team members found in this view.</p>
            </div>
        )}
      </div>
    </div>
  );
}