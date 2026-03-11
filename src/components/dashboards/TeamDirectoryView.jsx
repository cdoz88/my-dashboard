import React, { useState } from 'react';
import { Users, Mail, Settings, CheckCircle, Circle, Shield, UserCircle, Plus } from 'lucide-react';

export default function TeamDirectoryView({ users, currentUser, handleUpdateUser, setIsOnboardingModalOpen }) {
  const [expandedUser, setExpandedUser] = useState(null);

  // We parse the global checklist items from localStorage, or use the defaults
  const getGlobalChecklist = () => {
    const saved = localStorage.getItem('globalOnboardingChecklist');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', text: 'Company Email Address' },
      { id: '2', text: 'Add to Google Chat' }
    ];
  };

  const globalChecklist = getGlobalChecklist();

  const toggleChecklistItem = async (userId, itemId) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    // Parse the user's specific completed items, or default to an empty array
    let completedItems = [];
    try {
      if (userToUpdate.completedOnboarding) {
        completedItems = JSON.parse(userToUpdate.completedOnboarding);
      }
    } catch (e) {}

    // Toggle the item
    if (completedItems.includes(itemId)) {
      completedItems = completedItems.filter(id => id !== itemId);
    } else {
      completedItems.push(itemId);
    }

    // Update the user
    const updatedUser = { ...userToUpdate, completedOnboarding: JSON.stringify(completedItems) };
    handleUpdateUser(updatedUser);
  };

  return (
    <div className="p-4 sm:p-8 h-full overflow-y-auto w-full bg-slate-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-600" size={28} />
            Team Directory
          </h2>
          <p className="text-slate-500 text-sm mt-1">Contact info and onboarding status for all team members.</p>
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
        {users.map(user => {
          let completedItems = [];
          try {
            if (user.completedOnboarding) completedItems = JSON.parse(user.completedOnboarding);
          } catch(e) {}

          // Remove any completed items that no longer exist in the global checklist
          completedItems = completedItems.filter(id => globalChecklist.some(item => item.id === id));
          
          const isFullyOnboarded = globalChecklist.length > 0 && completedItems.length === globalChecklist.length;
          const isExpanded = expandedUser === user.id;

          return (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-start gap-4">
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
                  <a href={`mailto:${user.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5 truncate">
                    <Mail size={14} className="flex-shrink-0" />
                    {user.email}
                  </a>
                </div>
              </div>
              
              <div className="p-5 bg-slate-50/50 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Onboarding Status</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${isFullyOnboarded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {isFullyOnboarded ? 'Onboarded' : `Onboarding ${completedItems.length}/${globalChecklist.length}`}
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-4">
                  <div 
                    className={`h-full transition-all duration-500 ${isFullyOnboarded ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                    style={{ width: `${globalChecklist.length === 0 ? 0 : (completedItems.length / globalChecklist.length) * 100}%` }} 
                  />
                </div>

                {globalChecklist.length > 0 && (
                  <div className="mt-auto">
                    {/* Only show the first 3 items unless expanded */}
                    <div className="space-y-2">
                       {(isExpanded ? globalChecklist : globalChecklist.slice(0, 3)).map(item => {
                         const isCompleted = completedItems.includes(item.id);
                         return (
                           <button 
                             key={item.id} 
                             onClick={() => {
                               if (currentUser?.isAdmin) toggleChecklistItem(user.id, item.id);
                             }}
                             disabled={!currentUser?.isAdmin}
                             className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${currentUser?.isAdmin ? 'cursor-pointer hover:bg-slate-100' : 'cursor-default'} ${isCompleted ? 'opacity-60' : ''}`}
                           >
                             <div className="flex-shrink-0 mt-0.5">
                               {isCompleted ? <CheckCircle size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300" />}
                             </div>
                             <span className={`text-sm flex-1 ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'}`}>
                               {item.text}
                             </span>
                           </button>
                         )
                       })}
                    </div>
                    
                    {globalChecklist.length > 3 && (
                      <button 
                        onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                        className="w-full text-center mt-3 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors py-2 bg-slate-100 rounded-lg"
                      >
                        {isExpanded ? 'Show Less' : `Show ${globalChecklist.length - 3} More Items`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}