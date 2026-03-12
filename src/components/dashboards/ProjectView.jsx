import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Trash2, Paperclip, MessageSquare, Star, Plus, GripVertical } from 'lucide-react';
import { colorStyles } from '../../utils/constants';
import { calculateProjectProgress, isOverdue, formatDate } from '../../utils/helpers';
import DynamicIcon from '../shared/DynamicIcon';
import CompanyLogo from '../shared/CompanyLogo';
import TaskDesktopRow from '../shared/TaskDesktopRow';
import TaskMobileCard from '../shared/TaskMobileCard';
import TagDisplay from '../shared/TagDisplay';

export default function ProjectView({ 
  projectId, projects, tasks, companies, users, 
  projectDisplayMode, handleToggleTaskStatus, openTaskModal, 
  handleDeleteTask, handleDragStart, handleDrop, handleDragOver, handleReorderTasks,
  setIsProjectAttachmentsModalOpen
}) {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  
  // Sort active tasks using their new custom sortOrder, falling back to 0
  const activeProjectTasks = projectTasks.filter(t => t.status !== 'done').sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const completedProjectTasks = projectTasks.filter(t => t.status === 'done').sort((a,b) => new Date(b.dueDate) - new Date(a.dueDate));
  
  const currentProject = projects.find(p => p.id === projectId);
  const currentCompany = currentProject ? companies.find(c => c.id === currentProject.companyId) : null;
  const progress = calculateProjectProgress(projectId, tasks);
  const getUser = (id) => users.find(u => u.id === id);

  // Drag and Drop Local State
  const [localTasks, setLocalTasks] = useState([]);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);

  useEffect(() => {
     setLocalTasks(activeProjectTasks);
  }, [tasks, projectId]);

  const handleListDragStart = (e, index) => {
     setDraggedTaskIndex(index);
     e.dataTransfer.effectAllowed = 'move';
     e.dataTransfer.setData('text/html', '');
  };

  const handleListDragOver = (e, index) => {
     e.preventDefault();
     if (draggedTaskIndex === null || draggedTaskIndex === index) return;
     const newList = [...localTasks];
     const draggedItem = newList[draggedTaskIndex];
     newList.splice(draggedTaskIndex, 1);
     newList.splice(index, 0, draggedItem);
     setDraggedTaskIndex(index);
     setLocalTasks(newList);
  };

  const handleListDragEnd = () => {
     setDraggedTaskIndex(null);
     const updated = localTasks.map((t, i) => ({ ...t, sortOrder: i }));
     handleReorderTasks(updated);
  };

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
             {currentProject && <DynamicIcon name={currentProject.icon} size={24} className={colorStyles[currentProject.color]?.text} />}
             {currentProject?.name || 'Unknown Project'}
          </h2>
          <div className="flex items-center gap-4 mt-2">
             <div className="flex items-center gap-2">
                 <CompanyLogo company={currentCompany} sizeClass="w-5 h-5" />
                 <p className="text-slate-500 text-sm font-medium">{currentCompany?.name || 'Unknown Company'}</p>
             </div>
             <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
             <button 
                onClick={() => setIsProjectAttachmentsModalOpen(true)} 
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm"
             >
                <Paperclip size={14} /> Project Files
             </button>
          </div>
        </div>
        <div className="w-full sm:w-64 bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1.5">
           <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-600">Project Progress</span>
              <span className={`font-bold ${currentProject ? colorStyles[currentProject.color]?.text : 'text-slate-700'}`}>{progress}%</span>
           </div>
           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${currentProject ? colorStyles[currentProject.color]?.bar : 'bg-slate-500'} transition-all duration-700`} style={{ width: `${progress}%` }} />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {projectDisplayMode === 'list' && (
          <div className="h-full overflow-y-auto pr-1 pb-8">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
               <div className="md:hidden flex flex-col divide-y divide-slate-100">
                  {localTasks.length > 0 
                    ? localTasks.map((t, i) => (
                        <TaskMobileCard 
                          key={t.id} task={t} showProject={false} users={users}
                          handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask}
                          draggable={true} onDragStart={(e) => handleListDragStart(e, i)} onDragOver={(e) => handleListDragOver(e, i)} onDragEnd={handleListDragEnd} isDragged={draggedTaskIndex === i}
                        />
                      )) 
                    : <div className="p-8 text-center text-slate-500 text-sm">No active tasks in this project.</div>
                  }
               </div>
               <div className="hidden md:block overflow-x-auto">
                 <table className="w-full text-left min-w-[600px]">
                   <thead>
                     <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                       <th className="p-4 w-16 pr-1"></th><th className="py-4 px-2 w-8"></th><th className="p-4">Task Name</th><th className="p-4">Assignee</th><th className="p-4">Due Date</th>
                     </tr>
                   </thead>
                   <tbody>
                     {localTasks.length > 0 
                        ? localTasks.map((t, i) => (
                            <TaskDesktopRow 
                              key={t.id} task={t} showProject={false} users={users}
                              handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask}
                              draggable={true} onDragStart={(e) => handleListDragStart(e, i)} onDragOver={(e) => handleListDragOver(e, i)} onDragEnd={handleListDragEnd} isDragged={draggedTaskIndex === i}
                            />
                          )) 
                        : (<tr><td colSpan="5" className="p-8 text-center text-slate-500">No active tasks in this project.</td></tr>)
                     }
                   </tbody>
                 </table>
               </div>
             </div>

             {completedProjectTasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-medium">Completed</span>
                    <span className="text-slate-400 text-sm">{completedProjectTasks.length} tasks</span>
                  </div>
                  <div className="bg-white/60 rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                    <div className="md:hidden flex flex-col divide-y divide-slate-100">
                      {completedProjectTasks.map(t => (
                        <TaskMobileCard 
                          key={t.id} task={t} showProject={false} users={users}
                          handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask}
                        />
                      ))}
                    </div>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left min-w-[600px]">
                        <tbody>
                          {completedProjectTasks.map(t => (
                            <TaskDesktopRow 
                              key={t.id} task={t} showProject={false} users={users}
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
        )}

        {projectDisplayMode === 'kanban' && (
          <div className="flex gap-6 h-full overflow-x-auto pb-4">
            {['todo', 'in-progress', 'done'].map(status => (
              <div key={status} className="bg-slate-100 rounded-xl w-80 min-w-[20rem] p-4 flex flex-col h-full border border-slate-200" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)}>
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-semibold text-slate-700 capitalize">{status === 'in-progress' ? 'In Progress' : status}</h3>
                  <span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2 rounded-full font-medium">{projectTasks.filter(t => t.status === status).length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {projectTasks.filter(t => t.status === status).sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map(task => {
                    const assignee = getUser(task.assigneeId);
                    const taskIsOverdue = isOverdue(task.dueDate, task.status);
                    return (
                      <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} className={`bg-white p-4 rounded-lg shadow-sm border cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors group ${taskIsOverdue ? 'border-red-200' : 'border-slate-200'}`}>
                        <p className={`font-medium text-sm mb-2 cursor-pointer group-hover:text-blue-600 transition-colors ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`} onClick={() => openTaskModal(task)}>{task.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                           <TagDisplay tags={task.tags} />
                           <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200"><Star size={10}/> {task.weight || 1}</span>
                           {task.files && task.files.length > 0 && <span className="flex items-center text-slate-400 bg-slate-100 p-1 rounded-md border border-slate-200" title="Has Attachments"><Paperclip size={14} /></span>}
                           {task.comments && task.comments.length > 0 && <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold" title="Comments"><MessageSquare size={12} /> {task.comments.length}</span>}
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                           <div className="flex items-center gap-2">
                             <span className={`flex items-center gap-1 px-2 py-1 rounded font-medium ${taskIsOverdue ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}><Clock size={12} /> {formatDate(task.dueDate)}</span>
                             {assignee && (
                               <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-1 rounded" title={assignee.name}>
                                 {assignee.avatarUrl ? ( <img src={assignee.avatarUrl} alt="Avatar" className="w-4 h-4 rounded-full object-cover" /> ) : ( <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold">{assignee.name.charAt(0)}</div> )}
                                 <span className="max-w-[60px] truncate">{assignee.name.split(' ')[0]}</span>
                               </span>
                             )}
                           </div>
                           <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button onClick={() => openTaskModal(null, projectId, status)} className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:bg-slate-200 rounded-lg transition-colors border border-dashed border-slate-300">
                  <Plus size={16} /> Add Task
                </button>
              </div>
            ))}
          </div>
        )}

        {projectDisplayMode === 'timeline' && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
             <div className="relative border-l-2 border-blue-100 ml-3 space-y-8">
                {projectTasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).map(task => {
                  const assignee = getUser(task.assigneeId);
                  const taskIsOverdue = isOverdue(task.dueDate, task.status);
                  return (
                    <div key={task.id} className="relative pl-8">
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                      <div className={`p-4 rounded-lg border hover:shadow-md transition-shadow group ${taskIsOverdue ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-start gap-2.5 mb-2">
                          <button className="mt-0.5 flex-shrink-0" onClick={() => handleToggleTaskStatus(task)}>{task.status === 'done' ? <CheckCircle size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}</button>
                          <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                          <div className={`flex-1 font-medium cursor-pointer transition-colors leading-tight pt-0.5 ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 hover:text-blue-600'}`} onClick={() => openTaskModal(task)}>{task.title}</div>
                        </div>
                        
                        <div className="pl-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                          <TagDisplay tags={task.tags} />
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200"><Star size={10}/> {task.weight || 1} pts</span>
                          {task.files && task.files.length > 0 && <span className="flex items-center text-slate-400 bg-slate-100 p-1 rounded-md border border-slate-200" title="Has Attachments"><Paperclip size={14} /></span>}
                          {task.comments && task.comments.length > 0 && <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold" title="Comments"><MessageSquare size={12} /> {task.comments.length}</span>}
                          {assignee && (
                            <span className={`flex items-center gap-1.5 text-xs font-medium ${task.status === 'done' ? 'text-slate-400' : 'text-slate-600'}`}>
                              {assignee.avatarUrl ? <img src={assignee.avatarUrl} alt="Avatar" className={`w-4 h-4 rounded-full object-cover ${task.status === 'done' ? 'grayscale opacity-60' : ''}`} /> : <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold">{assignee.name.charAt(0)}</div>}
                              {assignee.name.split(' ')[0]}
                            </span>
                          )}
                          <div className={`text-xs flex items-center gap-1 whitespace-nowrap ml-auto ${taskIsOverdue ? 'text-red-500 font-bold' : 'text-slate-500'} ${task.status === 'done' ? 'text-slate-400' : ''}`}><Clock size={12} className={taskIsOverdue ? 'text-red-500' : 'text-slate-400'} />{formatDate(task.dueDate)}</div>
                          <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}