import React, { useState } from 'react';
import { X, GripVertical, Plus, Trash2 } from 'lucide-react';

export default function OnboardingModal({ setIsOnboardingModalOpen, globalChecklist, handleSaveGlobalChecklist }) {
  const [checklist, setChecklist] = useState(globalChecklist);
  const [newItemText, setNewItemText] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const saveChecklist = (newList) => {
    setChecklist(newList);
    handleSaveGlobalChecklist(newList);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = { id: 'item_' + Date.now(), text: newItemText.trim() };
    saveChecklist([...checklist, newItem]);
    setNewItemText('');
  };

  const handleDeleteItem = (id) => {
    saveChecklist(checklist.filter(item => item.id !== id));
  };

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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
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

          <div className="space-y-2">
            {checklist.map((item, index) => (
              <div 
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white border p-3 rounded-lg flex items-center gap-3 group transition-all ${draggedItemIndex === index ? 'opacity-50 border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300 shadow-sm cursor-grab active:cursor-grabbing'}`}
              >
                <div className="text-slate-300 cursor-grab active:cursor-grabbing flex-shrink-0">
                  <GripVertical size={18} />
                </div>
                <span className="text-sm font-medium text-slate-700 flex-1">{item.text}</span>
                <button 
                  onClick={() => handleDeleteItem(item.id)} 
                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  title="Delete Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
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