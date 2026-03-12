import React from 'react';
import { Activity, LayoutDashboard, CheckCircle, Users, CalendarDays, UserCircle, Clock, Globe, Building2 } from 'lucide-react';
import { colorStyles } from '../../utils/constants';
import DynamicIcon from '../shared/DynamicIcon';

export default function ActivityLogView({ 
    activityLogs = [], 
    users = [], 
    activeActivityTab = 'overview',
    tasks = [],
    projects = [],
    setCurrentApp,
    setActiveTab
}) {
   const safeLogs = Array.isArray(activityLogs) ? activityLogs : [];
   const safeUsers = Array.isArray(users) ? users : [];

   const filteredLogs = safeLogs.filter(log => {
      if (!log || typeof log !== 'object') return false; 
      if (activeActivityTab === 'overview') return true;
      
      const category = typeof log.actionCategory === 'string' ? log.actionCategory.toLowerCase() : '';
      const targetTab = typeof activeActivityTab === 'string' ? activeActivityTab.toLowerCase() : '';
      
      return category === targetTab;
   });

   const getCategoryIcon = (category) => {
       const cat = typeof category === 'string' ? category.toLowerCase() : '';
       if (cat === 'projects') return <LayoutDashboard size={16} className="text-blue-500" />;
       if (cat === 'tasks') return <CheckCircle size={16} className="text-emerald-500" />;
       if (cat === 'team') return <Users size={16} className="text-indigo-500" />;
       if (cat === 'events') return <CalendarDays size={16} className="text-purple-500" />;
       if (cat === 'domains') return <Globe size={16} className="text-teal-500" />;
       if (cat === 'companies') return <Building2 size={16} className="text-rose-500" />;
       return <Activity size={16} className="text-slate-500" />;
   };

   // Dynamic Emoji Parser
   const getActionEmoji = (type = '') => {
       const t = type.toLowerCase();
       if (t.includes('added') || t.includes('created')) return '➕';
       if (t.includes('deleted') || t.includes('removed')) return '❌';
       if (t.includes('archived')) return '📁';
       if (t.includes('update') || t.includes('edit') || t.includes('change')) return '✏️';
       return '🔹';
   };

   const getUser = (id) => {
       return safeUsers.find(u => u && u.id === id) || null;
   };

   // Helper to intelligently preserve all text and italicize anything in quotes
   const formatDescription = (desc = '') => {
      if (!desc.includes('"')) return desc;
      
      // Split by double quotes
      const parts = desc.split('"');
      
      return (
         <>
            {parts.map((part, index) => {
               // Every odd index is the text that was inside the quotes!
               if (index % 2 === 1) {
                  return <span key={index} className="italic text-slate-800 font-medium">"{part}"</span>;
               }
               // Even indexes are normal text outside the quotes
               return <span key={index}>{part}</span>;
            })}
         </>
      );
   };

   return (
      <div className="p-4 sm:p-8 h-full overflow-y-auto w-full bg-slate-50/50">
         <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Activity className="text-slate-700" size={28} /> Activity Log
            </h2>
            <p className="text-slate-500 text-sm mt-1">A running history of actions taken across the workspace.</p>
         </div>
         
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             {filteredLogs.length > 0 ? (
                <div className="divide-y divide-slate-100">
                   {filteredLogs.map((log, index) => {
                       if (!log) return null;
                       const user = getUser(log.userId);
                       
                       let displayDate = 'Just now';
                       if (log.timestamp) {
                           try {
                               let dateStr = log.timestamp;
                               if (!dateStr.includes('T') && !dateStr.includes('Z')) {
                                   dateStr = dateStr.replace(' ', 'T') + 'Z';
                               }
                               displayDate = new Date(dateStr).toLocaleString(undefined, {
                                   year: 'numeric', month: 'short', day: 'numeric', 
                                   hour: 'numeric', minute: '2-digit'
                               });
                           } catch(e) {}
                       }

                       let associatedProject = null;
                       if (log.actionCategory === 'Tasks' && log.description) {
                           const match = log.description.match(/"([^"]+)"/);
                           if (match && match[1]) {
                               const taskTitle = match[1];
                               const task = tasks.find(t => t.title === taskTitle);
                               if (task) {
                                   associatedProject = projects.find(p => p.id === task.projectId);
                               }
                           }
                       }

                       return (
                           <div key={log.id || `log-${index}`} className="py-4 px-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                               <div className="flex-shrink-0 bg-slate-50 p-2.5 rounded-full border border-slate-200 shadow-sm mt-0.5">
                                   {getCategoryIcon(log.actionCategory)}
                               </div>
                               
                               <div className="flex-1 flex flex-col gap-2.5 min-w-0">
                                   {/* Header Row: Columnar Layout [Action | Project | User | Date] */}
                                   <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-slate-100 pb-2.5">
                                       <div className="flex-1 min-w-0">
                                          <span className="text-sm font-bold text-slate-800 truncate block">
                                              {getActionEmoji(log.actionType)} {log.actionType || 'System Action'}
                                          </span>
                                       </div>
                                       
                                       {associatedProject && (
                                           <div className="sm:w-48 flex-shrink-0">
                                              <button
                                                 onClick={() => {
                                                     setCurrentApp('projects');
                                                     setActiveTab(associatedProject.id);
                                                 }}
                                                 className={`flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded border ${colorStyles[associatedProject.color]?.bg} ${colorStyles[associatedProject.color]?.border} ${colorStyles[associatedProject.color]?.text} transition-transform hover:scale-105`}
                                              >
                                                  <DynamicIcon name={associatedProject.icon} size={11} className="flex-shrink-0" />
                                                  <span className="truncate">{associatedProject.name}</span>
                                              </button>
                                           </div>
                                       )}
                                       
                                       <div className="flex items-center gap-1.5 sm:w-40 flex-shrink-0">
                                           {user?.avatarUrl ? <img src={user.avatarUrl} className="w-4 h-4 rounded-full object-cover border border-slate-200" alt="Avatar" /> : <UserCircle size={16} className="text-slate-400" />}
                                           <span className="text-xs font-semibold text-slate-600 truncate">{user?.name || 'System Auto-Action'}</span>
                                       </div>
                                       
                                       <div className="flex items-center sm:justify-end sm:w-36 flex-shrink-0 text-xs text-slate-400 font-medium">
                                          <Clock size={12} className="mr-1.5 flex-shrink-0" /> <span className="truncate">{displayDate}</span>
                                       </div>
                                   </div>

                                   {/* Description: Full Width, properly rendering and italicizing all quotes */}
                                   <span className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                                       {formatDescription(log.description || 'No details provided.')}
                                   </span>
                               </div>
                           </div>
                       );
                   })}
                </div>
             ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
                   <Activity size={48} className="text-slate-300 mb-4" />
                   <p className="font-medium text-slate-600">No activity recorded yet.</p>
                   <p className="text-sm mt-1">Actions taken within the workspace will appear here automatically.</p>
                </div>
             )}
         </div>
      </div>
   );
}