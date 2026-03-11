import React from 'react';
import { X, UserCog, UserCircle, Shield, CheckCircle } from 'lucide-react';

export default function SwitchUserModal({
  users, loggedInUserId, setLoggedInUserId, setIsSwitchUserModalOpen
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 className="font-bold text-slate-800 flex items-center gap-2"><UserCog size={18}/> Switch Identity</h3>
           <button onClick={() => setIsSwitchUserModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
           <p className="text-xs text-slate-500 text-center mb-4">Select a user below to see the app exactly how they see it based on their permissions.</p>
           {users.map(u => (
             <button key={u.id} onClick={() => { setLoggedInUserId(u.id); setIsSwitchUserModalOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${loggedInUserId === u.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'}`}>
               {u.avatarUrl ? <img src={u.avatarUrl} className="w-10 h-10 rounded-full object-cover bg-white" alt="Avatar" /> : <UserCircle size={40} className="text-slate-300" />}
               <div className="text-left flex-1">
                 <div className="font-bold text-slate-800 flex items-center gap-1">{u.name} {u.isAdmin && <Shield size={12} className="text-amber-500"/>}</div>
                 <div className="text-xs text-slate-500">{u.email}</div>
               </div>
               {loggedInUserId === u.id && <CheckCircle size={20} className="text-blue-500" />}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}