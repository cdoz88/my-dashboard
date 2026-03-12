import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Trash2, Paperclip, MessageSquare, Star, GripVertical } from 'lucide-react';
import { isOverdue, formatDate } from '../../utils/helpers';
import { colorStyles } from '../../utils/constants';
import TagDisplay from './TagDisplay';
import CompanyLogo from './CompanyLogo';
import DynamicIcon from './DynamicIcon';
import { UserCircle } from 'lucide-react';

export default function TaskDesktopRow({ 
  task, showProject = true, projects, companies, users, 
  handleToggleTaskStatus, openTaskModal, handleDeleteTask,
  draggable = false, onDragStart, onDragOver, onDragEnd, isDragged
}) {
  const [isDragReady, setIsDragReady] = useState(false);
  
  const project = projects?.find(p => p.id === task.projectId);
  const company = project ? companies?.find(c => c.id === project.companyId) : null;
  const assignee = users?.find(u => u.id === task.assigneeId);
  const taskIsOverdue = isOverdue(task.dueDate, task.status);
  
  return (
    <tr 
      draggable={draggable && isDragReady}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`border-b border-slate-100 transition-colors group ${isDragged ? 'opacity-50 bg-blue-50' : 'hover:bg-slate-50'}`}
    >
      <td className="p-4 w-16 pr-1 align-middle">
        <div className="flex items-center h-full gap-1">
          {draggable && (
            <div 
               onMouseEnter={() => setIsDragReady(true)}
               onMouseLeave={() => setIsDragReady(false)}
               onTouchStart={() => setIsDragReady(true)}
               onTouchEnd={() => setIsDragReady(false)}
               className="cursor-grab active:cursor-grabbing p-1 -ml-2 text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
               title="Drag to Reorder"
            >
               <GripVertical size={16} />
            </div>
          )}
          <button 
             type="button"
             onClick={(e) => { e.stopPropagation(); handleToggleTaskStatus(task); }} 
             className="cursor-pointer flex-shrink-0 p-1 block mt-0.5"
          >
            {task.status === 'done' ? <CheckCircle size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}
          </button>
        </div>
      </td>
      <td className="py-4 px-2 w-8 align-middle">
        <div className={`w-2.5 h-2.5 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} title={task.status} />
      </td>
      <td className="p-4 align-middle">
        <div 
           className={`font-medium cursor-pointer transition-colors w-fit ${task.status === 'done' ? 'text-slate-400 line-through hover:text-blue-400' : 'text-slate-700 hover:text-blue-600'}`} 
           onClick={(e) => { e.stopPropagation(); openTaskModal(task); }}
        >
          {task.title}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <TagDisplay tags={task.tags} />
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200" title="Task Weight / Points"><Star size={10}/> {task.weight || 1} pts</span>
          {task.files && task.files.length > 0 && <span className="flex items-center text-slate-400 bg-slate-100 p-1 rounded-md border border-slate-200" title="Has Attachments"><Paperclip size={14} /></span>}
          {task.comments && task.comments.length > 0 && <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold" title="Comments"><MessageSquare size={12} /> {task.comments.length}</span>}
        </div>
      </td>
      <td className="p-4 text-sm text-slate-600 whitespace-nowrap align-middle">
        {showProject ? (
          project && company && (
            <div className={`flex items-center gap-2 ${task.status === 'done' ? 'opacity-50 grayscale' : ''}`}>
              <CompanyLogo company={company} sizeClass="w-6 h-6" textClass="text-[10px]" />
              <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-md border ${colorStyles[project.color]?.bg} ${colorStyles[project.color]?.border} ${colorStyles[project.color]?.text}`}>
                  <DynamicIcon name={project.icon} size={14} />{project.name}
              </span>
            </div>
          )
        ) : (
          assignee && (
            <span className={`flex items-center gap-1.5 ${task.status === 'done' ? 'opacity-60 grayscale' : ''}`}>
              {assignee.avatarUrl ? <img src={assignee.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover" /> : <UserCircle size={16} className="text-slate-400" />}
              {assignee.name.split(' ')[0]}
            </span>
          )
        )}
      </td>
      <td className={`p-4 text-sm flex items-center justify-between whitespace-nowrap align-middle ${taskIsOverdue ? 'text-red-500 font-bold' : 'text-slate-600'} ${task.status === 'done' ? 'text-slate-400' : ''}`}>
        <span className="flex items-center gap-1"><Clock size={14} className={taskIsOverdue ? 'text-red-500' : 'text-slate-400'} />{formatDate(task.dueDate)}</span>
        <button 
           type="button"
           onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }} 
           className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1 ml-4"
           title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}