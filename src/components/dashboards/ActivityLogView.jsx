import React from 'react';
import { Activity, LayoutDashboard, CheckCircle, Users, CalendarDays, UserCircle, Clock } from 'lucide-react';

export default function ActivityLogView({ activityLogs = [], users = [], activeActivityTab = 'overview' }) {
   // 1. Extreme safety checks to guarantee arrays exist
   const safeLogs = Array.isArray(activityLogs) ? activityLogs : [];
   const safeUsers = Array.isArray(users) ? users : [];

   // 2. Safely filter without calling .toLowerCase() on nulls or undefined values
   const filteredLogs = safeLogs.filter(log => {
      if (!log || typeof log !== 'object') return false; 
      if (activeActivityTab === 'overview') return true;
      
      const category = typeof log.actionCategory === 'string' ? log.actionCategory.toLowerCase() : '';
      const targetTab = typeof activeActivityTab === 'string' ? activeActivityTab.toLowerCase() : '';
      
      return category === targetTab;
   });

   const getCategoryIcon = (category) => {
       const cat = typeof category === 'string' ? category.toLowerCase() : '';
       if (cat === 'projects') return <LayoutDashboard size={18} className="text-blue-500" />;
       if (cat === 'tasks') return <CheckCircle size={18} className="text-emerald-500" />;
       if (cat === 'team') return <Users size={18} className="text-amber-500" />;
       if (cat === 'events') return <CalendarDays size={18} className="text-purple-500" />;
       return <Activity size={18} className="text-slate-500" />;
   };

   const getUser = (id) => {
       return safeUsers.find(u => u && u.id === id) || null;
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
                       const user = getUser(log.userId);
                       
                       // Safe date formatting
                       let displayDate = 'Just now';
                       if (log.timestamp) {
                           try {
                               displayDate = new Date(log.timestamp).toLocaleString();
                           } catch(e) {}
                       }

                       return (
                           <div key={log.id || `log-${index}`} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                               <div className="mt-1 flex-shrink-0 bg-slate-100 p-2.5 rounded-full border border-slate-200 shadow-sm">
                                   {getCategoryIcon(log.actionCategory)}
                               </div>
                               <div className="flex-1 min-w-0">
                                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-1.5">
                                       <span className="text-sm font-bold text-slate-800 truncate">{log.actionType || 'System Action'}</span>
                                       <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 flex-shrink-0">
                                          <Clock size={12} /> {displayDate}
                                       </span>
                                   </div>
                                   <p className="text-sm text-slate-600 mb-3">{log.description || 'No details provided.'}</p>
                                   <div className="flex items-center gap-2">
                                       {user?.avatarUrl ? <img src={user.avatarUrl} className="w-5 h-5 rounded-full object-cover border border-slate-200" alt="Avatar" /> : <UserCircle size={20} className="text-slate-400" />}
                                       <span className="text-xs font-semibold text-slate-600">{user?.name || 'System Auto-Action'}</span>
                                       <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-bold ml-2 border border-slate-200">{log.actionCategory || 'System'}</span>
                                   </div>
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