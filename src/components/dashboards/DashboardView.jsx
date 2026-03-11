import React from 'react';
import TaskMobileCard from '../shared/TaskMobileCard';
import TaskDesktopRow from '../shared/TaskDesktopRow';

export default function DashboardView({ 
  tasks, currentUser, projects, companies, users,
  handleToggleTaskStatus, openTaskModal, handleDeleteTask 
}) {
  const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id);
  const activeTasks = myTasks.filter(t => t.status !== 'done').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const completedTasks = myTasks.filter(t => t.status === 'done').sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

  return (
    <div className="p-4 sm:p-8 h-full overflow-y-auto w-full">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">My Tasks</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="md:hidden flex flex-col divide-y divide-slate-100">
          {activeTasks.length > 0 
            ? activeTasks.map(t => (
                <TaskMobileCard 
                  key={t.id} task={t} showProject={true} projects={projects} companies={companies} users={users}
                  handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask}
                />
              )) 
            : <div className="p-8 text-center text-slate-500 text-sm">No active tasks assigned to you.</div>
          }
        </div>
        
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                <th className="p-4 w-12 pr-1"></th><th className="py-4 px-2 w-8"></th><th className="p-4">Task</th><th className="p-4">Project</th><th className="p-4">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {activeTasks.length > 0 
                ? activeTasks.map(t => (
                    <TaskDesktopRow 
                      key={t.id} task={t} showProject={true} projects={projects} companies={companies} users={users}
                      handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask}
                    />
                  )) 
                : <tr><td colSpan="5" className="p-8 text-center text-slate-500">No active tasks assigned to you.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-medium">Completed</span>
            <span className="text-slate-400 text-sm">{completedTasks.length} tasks</span>
          </div>
          <div className="bg-white/60 rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
             <div className="md:hidden flex flex-col divide-y divide-slate-100">
               {completedTasks.map(t => (
                 <TaskMobileCard 
                    key={t.id} task={t} showProject={true} projects={projects} companies={companies} users={users}
                    handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask}
                 />
               ))}
             </div>
             <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[600px]">
                 <tbody>
                   {completedTasks.map(t => (
                     <TaskDesktopRow 
                        key={t.id} task={t} showProject={true} projects={projects} companies={companies} users={users}
                        handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask}
                     />
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}