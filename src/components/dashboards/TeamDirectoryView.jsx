import React, { useState } from 'react';
import { Users, Mail, Settings, CheckCircle, Shield, UserCircle, Contact, Phone, DollarSign, FolderKanban, Plus, Camera, UserMinus, Search } from 'lucide-react';
import CompanyLogo from '../shared/CompanyLogo';

export default function TeamDirectoryView({ 
  users, currentUser, handleUpdateUser, setIsOnboardingModalOpen, 
  companies, visibleCompanies, activeTeamTab, globalChecklist,
  projects, tasks, setCurrentApp, setActiveTab, handleGenerateOnboarding, handleGenerateOffboarding,
  setIsAvatarMakerModalOpen, teamDisplayMode, openTeamModal
}) {
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredUsers = displayedUsers.filter(u => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.title && u.title.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.phone && u.phone.toLowerCase().includes(q)) ||
          (u.venmo && u.venmo.toLowerCase().includes(q)) ||
          (u.responsibilities && u.responsibilities.toLowerCase().includes(q))
      );
  });

  const currentCompany = activeTeamTab === 'overview' ? null : companies.find(c => c.id === activeTeamTab);

  // --- ORG CHART RENDER LOGIC ---
  const renderOrgNode = (user, depth = 0) => {
      // Find all users who report directly to this user (we filter from the FULL displayed list so branches aren't randomly severed by search)
      const directReports = filteredUsers.filter(u => u.managerId === user.id);
      
      return (
          <div key={user.id} className="relative flex flex-col">
              {/* Card */}
              <div 
                  className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm w-72 mb-4 relative z-10 hover:border-indigo-300 transition-colors cursor-pointer group" 
                  onClick={() => currentUser?.isAdmin ? openTeamModal(user) : null}
              >
                 {user.avatarUrl ? (
                     <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt={user.name} />
                 ) : (
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200"><UserCircle size={24} /></div>
                 )}
                 <div className="flex-1 min-w-0">
                     <div className="font-bold text-sm text-slate-800 truncate flex items-center gap-1">
                        {user.name}
                        {user.isAdmin && <Shield size={12} className="text-amber-500 flex-shrink-0" />}
                     </div>
                     <div className="text-xs text-slate-500 truncate">{user.title || 'Team Member'}</div>
                 </div>
              </div>

              {/* Children (Direct Reports) */}
              {directReports.length > 0 && (
                  <div className="ml-6 pl-6 border-l-2 border-slate-200 flex flex-col relative">
                      {directReports.map(report => (
                          <div key={report.id} className="relative">
                              {/* Horizontal connector line */}
                              <div className="absolute -left-6 top-6 w-6 border-t-2 border-slate-200"></div>
                              {renderOrgNode(report, depth + 1)}
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="p-4 sm:p-8 h-full overflow-y-auto w-full bg-slate-50/50 relative">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Contact className="text-indigo-600" size={28} />
            {currentCompany ? `${currentCompany.name} Directory` : 'Team Directory'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Contact info and roles for {currentCompany ? 'this company' : 'all team members'}.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
              </div>
              <input 
                  type="text" 
                  placeholder="Search team..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsAvatarMakerModalOpen(true)} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
              >
                <Camera size={16} />
                Avatar Maker
              </button>
              {currentUser?.isAdmin && (
                <button 
                  onClick={() => setIsOnboardingModalOpen(true)} 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  <Settings size={16} className="text-slate-500" />
                  Templates
                </button>
              )}
          </div>
        </div>
      </div>

      {teamDisplayMode === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map(user => {
              return (
                <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:border-indigo-300 transition-colors">
                  <div 
                    className={`p-4 flex items-start gap-3 ${currentUser?.isAdmin ? 'cursor-pointer' : ''}`}
                    onClick={() => currentUser?.isAdmin ? openTeamModal(user) : null}
                  >
                    {user.avatarUrl ? ( 
                      <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm bg-slate-100 flex-shrink-0" /> 
                    ) : ( 
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-100 shadow-sm flex-shrink-0">
                        <UserCircle size={24} className="text-slate-400" />
                      </div> 
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 truncate">
                        {user.name}
                        {user.isAdmin && <Shield size={12} className="text-amber-500 flex-shrink-0" title="Admin" />}
                      </h3>
                      
                      {user.title && (
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 truncate">
                          {user.title}
                        </div>
                      )}
                      
                      {user.responsibilities && (
                        <div className="text-[10px] text-slate-500 mt-1.5 line-clamp-2 leading-snug" title={user.responsibilities}>
                          {user.responsibilities}
                        </div>
                      )}

                      <div className="mt-2.5 space-y-1">
                          <a href={`mailto:${user.email}`} onClick={(e) => e.stopPropagation()} className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1.5 truncate">
                            <Mail size={12} className="flex-shrink-0" />
                            {user.email}
                          </a>
                          {user.phone && (
                            <a href={`tel:${user.phone}`} onClick={(e) => e.stopPropagation()} className="text-[11px] text-slate-500 hover:text-indigo-600 hover:underline flex items-center gap-1.5 truncate">
                              <Phone size={12} className="flex-shrink-0" />
                              {user.phone}
                            </a>
                          )}
                          {user.venmo && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                              <DollarSign size={12} className="flex-shrink-0 text-emerald-500 bg-emerald-50 rounded-full p-0.5" />
                              <span className="font-medium text-slate-700">@{user.venmo}</span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  
                  {currentUser?.isAdmin && (
                      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex-1 flex flex-col justify-end">
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
                                        <div className="flex items-center justify-between mb-1.5">
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Onboarding</h4>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isFullyOnboarded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {isFullyOnboarded ? 'Complete' : `${completedCount}/${totalCount}`}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mb-2">
                                            <div className={`h-full transition-all duration-500 ${isFullyOnboarded ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${progressPercent}%` }} />
                                        </div>
                                        <button 
                                            onClick={() => { setCurrentApp('projects'); setActiveTab(onboardingProject.id); }}
                                            className="w-full py-1 bg-white hover:bg-slate-50 text-indigo-600 border-indigo-200 text-[10px] font-bold rounded flex items-center justify-center gap-1.5 transition-colors border shadow-sm"
                                        >
                                            <FolderKanban size={12} /> Open Onboarding
                                        </button>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <button 
                                            onClick={() => handleGenerateOnboarding(user)}
                                            className="w-full py-1 bg-white hover:bg-indigo-50 text-indigo-600 border-indigo-200 text-[10px] font-bold rounded flex items-center justify-center gap-1.5 transition-colors border shadow-sm"
                                        >
                                            <Plus size={12} /> Gen. Onboarding
                                        </button>
                                    </div>
                                );
                            }
                         })()}
    
                         {(() => {
                            const offboardingProject = projects.find(p => p.name === `Offboarding: ${user.name}` && p.adminOnly);
                            
                            if (offboardingProject) {
                                const userTasks = tasks.filter(t => t.projectId === offboardingProject.id);
                                const totalCount = userTasks.length;
                                const completedCount = userTasks.filter(t => t.status === 'done').length;
                                const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
                                const isFullyOffboarded = totalCount > 0 && completedCount === totalCount;
                                
                                return (
                                    <div className="pt-2.5 mt-2.5 border-t border-slate-200">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Offboarding</h4>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isFullyOffboarded ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {isFullyOffboarded ? 'Complete' : `${completedCount}/${totalCount}`}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mb-2">
                                            <div className={`h-full transition-all duration-500 ${isFullyOffboarded ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${progressPercent}%` }} />
                                        </div>
                                        <button 
                                            onClick={() => { setCurrentApp('projects'); setActiveTab(offboardingProject.id); }}
                                            className="w-full py-1 bg-white hover:bg-slate-50 text-rose-600 border-rose-200 text-[10px] font-bold rounded flex items-center justify-center gap-1.5 transition-colors border shadow-sm"
                                        >
                                            <FolderKanban size={12} /> Open Offboarding
                                        </button>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="pt-2 mt-2 border-t border-slate-200">
                                        <button 
                                            onClick={() => handleGenerateOffboarding(user)}
                                            className="w-full py-1 bg-white hover:bg-rose-50 text-rose-600 text-[10px] font-bold rounded flex items-center justify-center gap-1.5 transition-colors border border-rose-200 shadow-sm"
                                        >
                                            <UserMinus size={12} /> Gen. Offboarding
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
            {filteredUsers.length === 0 && (
                <div className="col-span-full p-12 text-center flex flex-col items-center bg-white rounded-xl border border-slate-200 border-dashed">
                    <Users size={32} className="text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">No team members match your search.</p>
                </div>
            )}
          </div>
      )}

      {teamDisplayMode === 'org' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 overflow-x-auto">
             <div className="min-w-fit">
                 {/* Top Level Roots: People who have NO manager, OR whose manager isn't in this specific filtered view */}
                 {filteredUsers.filter(u => !u.managerId || !filteredUsers.some(du => du.id === u.managerId)).map(rootUser => (
                     renderOrgNode(rootUser)
                 ))}
                 
                 {filteredUsers.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center text-slate-500">
                        <Users size={32} className="text-slate-300 mb-3" />
                        <p className="font-medium">No team members match your search.</p>
                    </div>
                 )}
             </div>
          </div>
      )}
    </div>
  );
}