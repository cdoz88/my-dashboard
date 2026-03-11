import React, { useState } from 'react';
import { Users, Mail, Settings, CheckCircle, Circle, Shield, UserCircle, X, Contact, Phone, DollarSign } from 'lucide-react';

export default function TeamDirectoryView({ users, currentUser, handleUpdateUser, setIsOnboardingModalOpen, companies, visibleCompanies, activeTeamTab, globalChecklist }) {
  const [selectedUserForOnboarding, setSelectedUserForOnboarding] = useState(null);

  const toggleChecklistItem = async (userId, itemId) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    let completedItems = [];
    try {
      if (userToUpdate.completedOnboarding) {
        completedItems = JSON.parse(userToUpdate.completedOnboarding);
      }
    } catch (e) {}

    if (completedItems.includes(itemId)) {
      completedItems = completedItems.filter(id => id !== itemId);
    } else {
      completedItems.push(itemId);
    }

    const updatedUser = { ...userToUpdate, completedOnboarding: JSON.stringify(completedItems) };
    handleUpdateUser(updatedUser);
  };

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
  const activeModalUser = selectedUserForOnboarding ? users.find(u => u.id === selectedUserForOnboarding.id) : null;

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
        {currentUser?.isAdmin && (
          <button 
            onClick={() => setIsOnboardingModalOpen(true)} 
            className="flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <Settings size={16} className="text-slate-500" />
            Edit Onboarding List
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedUsers.map(user => {
          let completedItems = [];
          try {
            if (user.completedOnboarding) completedItems = JSON.parse(user.completedOnboarding);
          } catch(e) {}

          completedItems = completedItems.filter(id => globalChecklist.some(item => item.id === id));
          
          const completedCount = completedItems.length;
          const totalCount = globalChecklist.length;
          const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
          const isFullyOnboarded = totalCount > 0 && completedCount === totalCount;

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
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Onboarding Status</h4>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isFullyOnboarded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {isFullyOnboarded ? 'Onboarded' : `${completedCount}/${totalCount} Complete`}
                            </span>
                        </div>
                        
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-4">
                            <div 
                                className={`h-full transition-all duration-500 ${isFullyOnboarded ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                style={{ width: `${progressPercent}%` }} 
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => setSelectedUserForOnboarding(user)}
                        className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-lg transition-colors border border-slate-200 mt-2 shadow-sm"
                    >
                        View Checklist
                    </button>
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

      {activeModalUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    {activeModalUser.name}'s Onboarding
                    </h3>
                    <button onClick={() => setSelectedUserForOnboarding(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                    {globalChecklist.length > 0 ? (
                        <div className="space-y-2">
                            {globalChecklist.map(item => {
                                let completedItems = [];
                                try {
                                    if (activeModalUser.completedOnboarding) completedItems = JSON.parse(activeModalUser.completedOnboarding);
                                } catch(e) {}
                                
                                const isCompleted = completedItems.includes(item.id);
                                return (
                                    <button 
                                        key={item.id} 
                                        onClick={() => {
                                            if (currentUser?.isAdmin) toggleChecklistItem(activeModalUser.id, item.id);
                                        }}
                                        disabled={!currentUser?.isAdmin}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${currentUser?.isAdmin ? 'cursor-pointer hover:border-blue-300 shadow-sm' : 'cursor-default'} ${isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}
                                    >
                                        <div className="flex-shrink-0">
                                            {isCompleted ? <CheckCircle size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-300" />}
                                        </div>
                                        <span className={`text-sm flex-1 text-left ${isCompleted ? 'text-emerald-700 font-medium' : 'text-slate-700 font-medium'}`}>
                                            {item.text}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                            The global onboarding checklist is empty.
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end flex-shrink-0 bg-white">
                    <button 
                        onClick={() => setSelectedUserForOnboarding(null)} 
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition-colors shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}