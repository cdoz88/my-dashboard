import React from 'react';
import { CheckCircle, X, Upload, RefreshCw, FileText, Download, Trash2, MessageSquare, UserCircle } from 'lucide-react';
import { availableTags, tagStyles, API_URL } from '../../utils/constants';

export default function TaskModal({
  currentTask, setCurrentTask, handleSaveTask, handleDeleteTask, setIsTaskModalOpen,
  users, isUploading, handleFileUpload, removeFile,
  newCommentText, setNewCommentText, handleAddComment, currentUser
}) {
  const getUser = (id) => users.find(u => u.id === id);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-blue-600">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <CheckCircle className="text-blue-600" size={20} />
            {currentTask.id ? 'Edit Task' : 'New Task'}
          </h3>
          <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="taskForm" onSubmit={handleSaveTask} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
              <input required type="text" value={currentTask.title} onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What needs to be done?" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                <select value={currentTask.assigneeId} onChange={(e) => setCurrentTask({...currentTask, assigneeId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input type="date" value={currentTask.dueDate} onChange={(e) => setCurrentTask({...currentTask, dueDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={currentTask.status} onChange={(e) => setCurrentTask({...currentTask, status: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Points (Weight)</label>
                <input type="number" min="1" max="100" value={currentTask.weight} onChange={(e) => setCurrentTask({...currentTask, weight: parseInt(e.target.value) || 1})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button key={tag} type="button" onClick={() => {
                    const newTags = currentTask.tags.includes(tag) ? currentTask.tags.filter(t => t !== tag) : [...currentTask.tags, tag];
                    setCurrentTask({...currentTask, tags: newTags});
                  }} className={`px-2 py-1 rounded border text-xs font-semibold transition-colors ${currentTask.tags.includes(tag) ? tagStyles[tag] : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea rows="4" value={currentTask.description} onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add more details about this task..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
              <div className="space-y-3">
                <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? <RefreshCw className="w-6 h-6 text-blue-500 mb-2 animate-spin" /> : <Upload className="w-6 h-6 text-slate-400 mb-2" />}
                    <p className="text-sm text-slate-500">
                       {isUploading ? <span className="font-semibold text-blue-600">Uploading to server...</span> : <><span className="font-semibold">Click to upload</span> or drag and drop</>}
                    </p>
                  </div>
                  <input type="file" className="hidden" multiple onChange={handleFileUpload} disabled={isUploading} />
                </label>
                
                {currentTask.files && currentTask.files.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {currentTask.files.map((file, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center">
                        {file.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || file.url.startsWith('data:image') ? (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center p-2 text-center">
                            <FileText size={24} className="text-slate-400 mb-1" />
                            <span className="text-[10px] text-slate-500 truncate w-full">{file.name}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <a href={`${API_URL}?action=download&file=${encodeURIComponent(file.url)}&name=${encodeURIComponent(file.name)}`} title="Download" className="p-1.5 bg-white text-slate-800 rounded-md hover:bg-blue-50 hover:text-blue-600"><Download size={14} /></a>
                           <button type="button" onClick={() => removeFile(index)} className="p-1.5 bg-white text-slate-800 rounded-md hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {currentTask.status === 'done' && currentTask.completedAt && (
               <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                     <h4 className="font-bold text-emerald-800 text-sm">Task Completed</h4>
                     <p className="text-emerald-600 text-xs mt-1">
                        Marked complete on {new Date(currentTask.completedAt).toLocaleString()}
                        {currentTask.completedBy && users.find(u => u.id === currentTask.completedBy) && (
                           <> by <span className="font-semibold">{users.find(u => u.id === currentTask.completedBy).name}</span></>
                        )}
                     </p>
                  </div>
               </div>
            )}

            <div className="pt-6 mt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><MessageSquare size={16} className="text-blue-500"/> Discussion</h4>
              
              <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
                {currentTask.comments && currentTask.comments.length > 0 ? (
                  currentTask.comments.map((comment) => {
                    const commentUser = getUser(comment.userId);
                    return (
                      <div key={comment.id} className="flex gap-3">
                        {commentUser?.avatarUrl ? (
                          <img src={commentUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-white" />
                        ) : (
                          <UserCircle size={32} className="text-slate-400 flex-shrink-0" />
                        )}
                        <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-slate-700">{commentUser?.name || 'Unknown User'}</span>
                            <span className="text-[10px] text-slate-400">{new Date(comment.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-slate-400 italic text-center p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No comments yet. Start the discussion!</div>
                )}
              </div>

              <div className="flex gap-3">
                 {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-white border border-slate-200" />
                  ) : (
                    <UserCircle size={32} className="text-slate-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 flex flex-col items-end gap-2">
                    <textarea
                      rows="2"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Ask a question or post an update..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddComment}
                      disabled={!newCommentText.trim() || !currentTask.id}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${!newCommentText.trim() || !currentTask.id ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      {currentTask.id ? 'Post Comment' : 'Save task to comment'}
                    </button>
                  </div>
              </div>
            </div>

          </form>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          {currentTask.id && <button type="button" onClick={() => handleDeleteTask(currentTask.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
          <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
          <button type="submit" form="taskForm" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium" disabled={isUploading}>{currentTask.id ? 'Save Changes' : 'Create Task'}</button>
        </div>
      </div>
    </div>
  );
}