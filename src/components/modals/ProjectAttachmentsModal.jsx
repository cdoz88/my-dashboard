import React from 'react';
import { X, Paperclip, FileText, Download, ExternalLink } from 'lucide-react';
import { API_URL } from '../../utils/constants';

export default function ProjectAttachmentsModal({ project, tasks, setIsProjectAttachmentsModalOpen }) {
  if (!project) return null;

  // Extract all files from all tasks belonging to this project
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const allFiles = projectTasks.flatMap(t => 
    (t.files || []).map(f => ({ ...f, taskTitle: t.title, taskId: t.id }))
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-blue-600">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                 <Paperclip size={20} />
             </div>
             <div>
                 <h3 className="font-bold text-lg text-slate-800 leading-tight">Project Attachments</h3>
                 <p className="text-xs text-slate-500 font-medium">All files uploaded to "{project.name}"</p>
             </div>
          </div>
          <button onClick={() => setIsProjectAttachmentsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6 bg-slate-50">
          {allFiles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allFiles.map((file, index) => {
                const isImage = file.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || file.url.startsWith('data:image');
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group relative hover:border-blue-300 transition-colors">
                     <div className="aspect-video w-full bg-slate-100 border-b border-slate-100 flex items-center justify-center relative overflow-hidden">
                       {isImage ? (
                         <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                       ) : (
                         <FileText size={32} className="text-slate-300" />
                       )}
                       <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <a href={file.url} target="_blank" rel="noopener noreferrer" title="Open in new tab" className="p-2 bg-white text-slate-800 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"><ExternalLink size={16} /></a>
                          <a href={`${API_URL}?action=download&file=${encodeURIComponent(file.url)}&name=${encodeURIComponent(file.name)}`} title="Download" className="p-2 bg-white text-slate-800 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"><Download size={16} /></a>
                       </div>
                     </div>
                     <div className="p-3">
                       <p className="text-xs font-bold text-slate-800 truncate" title={file.name}>{file.name}</p>
                       <p className="text-[10px] text-slate-500 truncate mt-1" title={`Attached to: ${file.taskTitle}`}>Task: {file.taskTitle}</p>
                     </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
               <Paperclip size={48} className="mb-4 opacity-20" />
               <p className="font-medium text-slate-500">No attachments found.</p>
               <p className="text-sm mt-1 text-center max-w-sm">Files uploaded to tasks within this project will automatically appear here for quick access.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-100 flex justify-end flex-shrink-0 bg-white">
          <button type="button" onClick={() => setIsProjectAttachmentsModalOpen(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors font-bold shadow-sm">Done</button>
        </div>
      </div>
    </div>
  );
}