import React from 'react';
import { Users, Shield, Star } from 'lucide-react';
import DynamicIcon from '../shared/DynamicIcon';
import { colorStyles } from '../../utils/constants';

export default function TeamCapacityView({ users, tasks, projects }) {
  
  const getProject = (id) => projects.find(p => p.id === id);

  return (
    <div className="p-4 sm:p-8 h-full overflow-y-auto w-full bg-slate-50/50">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Users className="text-blue-600" size={24} />Team Capacity Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Review active workload and point distributions across the team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map(user => {
          const userActiveTasks = tasks.filter(t => t.assigneeId === user.id && t.status !== 'done');
          const totalPoints = userActiveTasks.reduce((sum, t) => sum + (Number(t.weight) || 1), 0);
          const pointsByProject = {};
          userActiveTasks.forEach(t => {
            if (!pointsByProject[t.projectId]) pointsByProject[t.projectId] = 0;
            pointsByProject[t.projectId] += (Number(t.weight) || 1);
          });

          return (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
               <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                  {user.avatarUrl ? ( 
                    <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-white" /> 
                  ) : ( 
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm font-bold text-xl text-slate-500">
                      {user.name.charAt(0)}
                    </div> 
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-1.5">{user.name} {user.isAdmin && <Shield size={14} className="text-amber-500" title="Admin" />}</h3>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
               </div>
               
               <div className="p-5 flex-1 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                     <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Active Tasks</div>
                        <div className="text-2xl font-black text-slate-800">{userActiveTasks.length}</div>
                     </div>
                     <div className="flex-1 bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <div className="text-purple-600 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={12}/> Total Points</div>
                        <div className="text-2xl font-black text-slate-800">{totalPoints}</div>
                     </div>
                  </div>

                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Workload by Project</h4>
                     {Object.keys(pointsByProject).length > 0 ? (
                       <div className="space-y-3">
                         {Object.entries(pointsByProject).sort((a,b) => b[1] - a[1]).map(([projectId, points]) => {
                           const project = getProject(projectId);
                           if (!project) return null;
                           const percentOfLoad = Math.round((points / totalPoints) * 100);
                           return (
                             <div key={projectId}>
                               <div className="flex justify-between items-center text-sm mb-1">
                                 <div className="flex items-center gap-1.5 font-medium text-slate-700 truncate pr-2">
                                   <DynamicIcon name={project.icon} size={14} className={colorStyles[project.color]?.text} />
                                   <span className="truncate">{project.name}</span>
                                 </div>
                                 <div className="font-bold text-slate-600 text-xs">{points} pts</div>
                               </div>
                               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className={`h-full ${colorStyles[project.color]?.bar || 'bg-slate-400'}`} style={{ width: `${percentOfLoad}%` }} />
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     ) : ( 
                       <div className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded border border-dashed border-slate-200 text-center">No active tasks right now.</div> 
                     )}
                  </div>
               </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}