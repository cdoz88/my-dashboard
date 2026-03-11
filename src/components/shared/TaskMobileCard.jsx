import React from 'react';
import { CheckCircle, Circle, Clock, Trash2, Paperclip, MessageSquare, Star, GripVertical } from 'lucide-react';
import { isOverdue, formatDate } from '../../utils/helpers';
import { colorStyles } from '../../utils/constants';
import TagDisplay from './TagDisplay';
import CompanyLogo from './CompanyLogo';
import DynamicIcon from './DynamicIcon';
import { UserCircle } from 'lucide-react';

export default function TaskMobileCard({ 
  task, showProject = true, projects, companies, users, 
  handleToggleTaskStatus, openTaskModal, handleDeleteTask,
  draggable = false, onDragStart, onDragOver, onDragEnd, isDragged
}) {
  const project = projects?.find(p => p.id === task.projectId);
  const company = project ? companies?.find(c => c.id === project.companyId) : null;
  const assignee = users?.find(u => u.id === task.assigneeId);
  const taskIsOverdue = isOverdue(task.dueDate, task.status);

  return (
    <div 
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`p-4 transition-colors group border-b border-slate-100 last:border-b-0 ${isDragged ? 'opacity-50 bg-blue-50' : 'hover:bg-slate-50'} ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className="flex items-start gap-2.5 mb-2">
        {draggable && <GripVertical size={16} className="text-slate-300 mt-0.5 flex-shrink-0" />}
        <button className="mt-0.5 flex-shrink-0" onClick={() => handleToggleTaskStatus(task)}>
            {task.status === 'done' ? <CheckCircle size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}
        </button>
        <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} />
        <div className={`flex-1 font-medium cursor-pointer transition-colors leading-tight pt-0.5 ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 hover:text-blue-600'}`} onClick={() => openTaskModal(task)}>{task.title}</div>
      </div>
      <div className="pl-8 flex flex-wrap items-center gap-x-3 gap-y-2">
        <TagDisplay tags={task.tags} />
        <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200"><Star size={10}/> {task.weight || 1} pts</span>
        {task.files && task.files.length > 0 && <span className="flex items-center text-slate-400 bg-slate-100 p-1 rounded-md border border-slate-200" title="Has Attachments"><Paperclip size={14} /></span>}
        {task.comments && task.comments.length > 0 && <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold" title="Comments"><MessageSquare size={12} /> {task.comments.length}</span>}
        {showProject ? (
          project && company && (
            <div className={`flex items-center gap-1.5 ${task.status === 'done' ? 'opacity-50 grayscale' : ''}`}>
              <CompanyLogo company={company} sizeClass="w-5 h-5" textClass="text-[8px]" />
              <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${colorStyles[project.color]?.bg} ${colorStyles[project.color]?.border} ${colorStyles[project.color]?.text}`}>
                  <DynamicIcon name={project.icon} size={10} /><span className="truncate max-w-[120px]">{project.name}</span>
              </span>
            </div>
          )
        ) : (
          assignee && (
            <span className={`flex items-center gap-1.5 text-xs font-medium ${task.status === 'done' ? 'text-slate-400' : 'text-slate-600'}`}>
              {assignee.avatarUrl ? <img src={assignee.avatarUrl} alt="Avatar" className={`w-4 h-4 rounded-full object-cover ${task.status === 'done' ? 'grayscale opacity-60' : ''}`} /> : <UserCircle size={14} className={task.status === 'done' ? 'text-slate-300' : 'text-slate-400'} />}
              {assignee.name.split(' ')[0]}
            </span>
          )
        )}
        <div className={`text-xs flex items-center gap-1 whitespace-nowrap ml-auto ${taskIsOverdue ? 'text-red-500 font-bold' : 'text-slate-500'} ${task.status === 'done' ? 'text-slate-400' : ''}`}><Clock size={12} className={taskIsOverdue ? 'text-red-500' : 'text-slate-400'} />{formatDate(task.dueDate)}</div>
        <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}