import React, { useState } from 'react';
import { X, GripVertical, Plus, Trash2, Pencil, Upload, RefreshCw, FileText, Paperclip } from 'lucide-react';

export default function OnboardingModal({ setIsOnboardingModalOpen, globalChecklist, handleSaveGlobalChecklist, uploadFileToServer }) {
  const [checklist, setChecklist] = useState(globalChecklist);
  const [newItemText, setNewItemText] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  // Tracking which item is expanded for detailed editing
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [localUploading, setLocalUploading] = useState(false);

  const saveChecklist = (newList) => {
    setChecklist(newList);
    handleSaveGlobalChecklist(newList);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = { 
        id: 'item_' + Date.now(), 
        text: newItemText.trim(),
        assigneeType: 'new_user',
        description: '',
        files: []
    };
    saveChecklist([...checklist, newItem]);
    setNewItemText('');
  };

  const handleDeleteItem = (id) => {
    saveChecklist(checklist.filter(item => item.id !== id));
    if (expandedItemId === id) setExpandedItemId(null);
  };

  const updateItem = (id, updates) => {
    const newList = checklist.map(item => item.id === id ? { ...item, ...updates } : item);
    saveChecklist(newList);
  };

  // Internal File Uploader for Templates
  const handleFileUpload = async (e, itemId) => {
    const files = Array.from(e.target.files);
    setLocalUploading(true);
    const uploadedFiles = [];
    for (const file of files) {
        const url = await uploadFileToServer(file);
        if (url) uploadedFiles.push({ name: file.name, url: url });
    }
    const newList = checklist.map(item => {
        if (item.id === itemId) {
            return { ...item, files: [...(item.files || []), ...uploadedFiles] };
        }
        return item;
    });
    saveChecklist(newList);
    setLocalUploading(false);
    e.target.value = null; 
  };

  const removeFile = (itemId, fileIndex) => {
    const newList = checklist.map(item => {
        if (item.id === itemId) {
            return { ...item, files: item.files.filter((_, i) => i !== fileIndex) };
        }
        return item;
    });
    saveChecklist(newList);
  };

  // Drag logic (disabled if an item is actively being edited)
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', ''); 
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newList = [...checklist];
    const draggedItem = newList[draggedItemIndex];
    newList.splice(draggedItemIndex, 1);
    newList.splice(index, 0, draggedItem);
    setDraggedItemIndex(index);
    setChecklist(newList); 
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    saveChecklist(checklist); 
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-lg text-slate-800">Onboarding Task Templates</h3>
          <button onClick={() => setIsOnboardingModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <p className="text-sm text-slate-500 mb-6">
            Tasks added here act as a template. When you invite a new team member and generate an onboarding project, these items will automatically be created as assigned tasks for them.
          </p>

          <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newItemText} 
              onChange={(e) => setNewItemText(e.target.value)} 
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
              placeholder="Add new task template..." 
            />
            <button 
              type="submit" 
              disabled={!newItemText.trim()} 
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm flex items-center gap-1"
            >
              <Plus size={18} /> Add
            </button>
          </form>

          <div className="space-y-3">
            {checklist.map((item, index) => {
               const isExpanded = expandedItemId === item.id;
               
               return (
                  <div 
                    key={item.id}
                    draggable={!isExpanded}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white border p-3 rounded-lg flex flex-col gap-3 group transition-all shadow-sm ${draggedItemIndex === index ? 'opacity-50 border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'} ${!isExpanded ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  >
                      {isExpanded ? (
                          <div className="flex flex-col gap-4 w-full cursor-default">
                              <div className="flex justify-between items-center">
                                 <h4 className="font-bold text-slate-800 text-sm">Edit Template Task</h4>
                                 <button onClick={() => setExpandedItemId(null)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                              </div>
                              
                              <div>
                                  <label className="block text-xs font-medium text-slate-700 mb-1">Task Title</label>
                                  <input 
                                      type="text" 
                                      value={item.text} 
                                      onChange={(e) => updateItem(item.id, { text: e.target.value })} 
                                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                  />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                  <div>
                                      <label className="block text-xs font-medium text-slate-700 mb-1">Assign To</label>
                                      <select 
                                          value={item.assigneeType || 'new_user'} 
                                          onChange={(e) => updateItem(item.id, { assigneeType: e.target.value })}
                                          className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                      >
                                          <option value="new_user">New User</option>
                                          <option value="admin">Master Admin (You)</option>
                                          <option value="none">No One (Unassigned)</option>
                                      </select>
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-xs font-medium text-slate-700 mb-1">Description <span className="text-[10px] text-slate-400 font-normal">(Auto-populates)</span></label>
                                  <textarea 
                                      rows="3" 
                                      value={item.description || ''} 
                                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Specific instructions or links for this task..."
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-medium text-slate-700 mb-2">Template Attachments</label>
                                  <div className="space-y-3">
                                      <label className={`flex flex-col items-center justify-center w-full h-20 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${localUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                          <div className="flex flex-col items-center justify-center pt-4 pb-4">
                                              {localUploading ? <RefreshCw className="w-5 h-5 text-blue-500 mb-1 animate-spin" /> : <Upload className="w-5 h-5 text-slate-400 mb-1" />}
                                              <p className="text-xs text-slate-500 font-medium">
                                                 {localUploading ? 'Uploading...' : 'Click to upload files'}
                                              </p>
                                          </div>
                                          <input type="file" className="hidden" multiple onChange={(e) => handleFileUpload(e, item.id)} disabled={localUploading} />
                                      </label>
                                      
                                      {item.files && item.files.length > 0 && (
                                          <div className="grid grid-cols-3 gap-2">
                                              {item.files.map((file, fIndex) => {
                                                  const isImage = file.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || file.url.startsWith('data:image');
                                                  return (
                                                      <div key={fIndex} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center">
                                                          {isImage ? (
                                                              <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                                          ) : (
                                                              <div className="flex flex-col items-center p-2 text-center">
                                                                  <FileText size={20} className="text-slate-400 mb-1" />
                                                                  <span className="text-[10px] text-slate-500 truncate w-full">{file.name}</span>
                                                              </div>
                                                          )}
                                                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                             <button type="button" onClick={() => removeFile(item.id, fIndex)} className="p-1.5 bg-white text-slate-800 rounded-md hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                                                          </div>
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                      )}
                                  </div>
                              </div>

                              <div className="flex justify-end border-t border-slate-100 pt-3 mt-1">
                                 <button onClick={() => setExpandedItemId(null)} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">Done Editing</button>
                              </div>
                          </div>
                      ) : (
                          <div className="flex items-center gap-3 w-full">
                              <div className="text-slate-300 flex-shrink-0">
                                <GripVertical size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-slate-700 block truncate">{item.text}</span>
                                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">Assign: {item.assigneeType === 'admin' ? 'Admin' : item.assigneeType === 'none' ? 'No One' : 'New User'}</span>
                                      {item.files?.length > 0 && <span className="flex items-center gap-1"><Paperclip size={10}/> {item.files.length}</span>}
                                      {item.description && <span className="flex items-center gap-1"><FileText size={10}/> Desc</span>}
                                  </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => setExpandedItemId(item.id)} 
                                    className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                                    title="Edit Task Details"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteItem(item.id)} 
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                    title="Delete Item"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
               )
            })}
            
            {checklist.length === 0 && (
               <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                 The onboarding template is empty.
               </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 flex justify-end flex-shrink-0 bg-white">
          <button 
            onClick={() => setIsOnboardingModalOpen(false)} 
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}