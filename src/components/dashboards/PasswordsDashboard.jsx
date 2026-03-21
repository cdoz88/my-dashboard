import React, { useState } from 'react';
import { Lock, Link as LinkIcon, Copy, Trash2, Eye, EyeOff, Users, Pencil, CheckCircle } from 'lucide-react';

export default function PasswordsDashboard({ 
  passwords, activePasswordTab, openPasswordModal, handleDeletePassword, companies, currentUser 
}) {
  const [revealedPasswords, setRevealedPasswords] = useState(new Set());
  const [copyFeedback, setCopyFeedback] = useState(null);

  const getCompany = (id) => companies.find(c => c.id === id);

  // If not an admin, ONLY show passwords that explicitly contain this user's ID in the sharedWith array!
  const viewablePasswords = currentUser?.isAdmin 
      ? passwords 
      : passwords.filter(p => (p.sharedWith || []).includes(currentUser?.id));

  const tabPasswords = activePasswordTab === 'overview' 
      ? viewablePasswords 
      : viewablePasswords.filter(p => p.companyId === activePasswordTab);

  const currentCompany = activePasswordTab === 'overview' ? null : getCompany(activePasswordTab);

  const toggleVisibility = (id) => {
      const newSet = new Set(revealedPasswords);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setRevealedPasswords(newSet);
  };

  const copyToClipboard = (text, type, id) => {
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
          setCopyFeedback(`${id}-${type}`);
          setTimeout(() => setCopyFeedback(null), 2000);
      });
  };

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Lock className="text-slate-700" size={28} />
             {activePasswordTab === 'overview' ? 'Shared Vault' : `${currentCompany?.name} Vault`}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Securely manage and share account credentials.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
             <div className="overflow-x-auto flex-1">
                 <table className="w-full text-left min-w-[1000px]">
                     <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                         <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                             <th className="p-4 w-64">Platform & URL</th>
                             <th className="p-4 w-64">Username / Email</th>
                             <th className="p-4 w-64">Password</th>
                             <th className="p-4">Notes</th>
                             {currentUser?.isAdmin && <th className="p-4 w-12 text-right"></th>}
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {tabPasswords.sort((a,b) => a.platform.localeCompare(b.platform)).map(pw => {
                             const company = getCompany(pw.companyId);
                             const isRevealed = revealedPasswords.has(pw.id);
                             
                             return (
                                 <tr key={pw.id} className="hover:bg-slate-50 transition-colors group">
                                     <td className="p-4">
                                         <div 
                                             className="font-bold text-slate-800 cursor-pointer hover:text-slate-600 transition-colors flex items-center gap-2" 
                                             onClick={() => currentUser?.isAdmin ? openPasswordModal(pw) : null}
                                         >
                                             {pw.platform}
                                         </div>
                                         {pw.url && (
                                            <a 
                                                href={pw.url.startsWith('http') ? pw.url : `https://${pw.url}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-[10px] text-blue-500 hover:underline mt-0.5 flex items-center gap-1 w-fit"
                                            >
                                                <LinkIcon size={10} /> {pw.url.replace(/^https?:\/\//, '')}
                                            </a>
                                         )}
                                         {activePasswordTab === 'overview' && <div className="text-[10px] text-slate-500 mt-1">{company?.name || 'Unknown Company'}</div>}
                                     </td>
                                     <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-700 font-mono">{pw.username || '--'}</span>
                                            {pw.username && (
                                                <button onClick={() => copyToClipboard(pw.username, 'user', pw.id)} className="text-slate-300 hover:text-slate-600 transition-colors" title="Copy Username">
                                                    {copyFeedback === `${pw.id}-user` ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                </button>
                                            )}
                                        </div>
                                     </td>
                                     <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-700 font-mono tracking-wider">
                                                {isRevealed ? pw.password : '••••••••••••'}
                                            </span>
                                            {pw.password && (
                                                <div className="flex items-center gap-1 ml-2">
                                                    <button onClick={() => toggleVisibility(pw.id)} className="text-slate-300 hover:text-slate-600 transition-colors p-1" title={isRevealed ? "Hide Password" : "Show Password"}>
                                                        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                    <button onClick={() => copyToClipboard(pw.password, 'pass', pw.id)} className="text-slate-300 hover:text-slate-600 transition-colors p-1" title="Copy Password">
                                                        {copyFeedback === `${pw.id}-pass` ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                     </td>
                                     <td className="p-4">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            <span className="text-xs text-slate-500">{pw.notes || '--'}</span>
                                            {currentUser?.isAdmin && (pw.sharedWith || []).length > 0 && (
                                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded w-fit flex items-center gap-1 mt-1">
                                                    <Users size={10} /> Shared with {(pw.sharedWith || []).length} members
                                                </span>
                                            )}
                                        </div>
                                     </td>
                                     {currentUser?.isAdmin && (
                                         <td className="p-4 text-right">
                                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button onClick={() => openPasswordModal(pw)} className="text-slate-400 hover:text-slate-600 p-1 transition-colors" title="Edit"><Pencil size={16}/></button>
                                                 <button onClick={() => handleDeletePassword(pw.id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors" title="Delete"><Trash2 size={16}/></button>
                                             </div>
                                         </td>
                                     )}
                                 </tr>
                             )
                         })}
                         {tabPasswords.length === 0 && <tr><td colSpan={currentUser?.isAdmin ? "5" : "4"} className="p-8 text-center text-slate-500">No passwords found in this view.</td></tr>}
                     </tbody>
                 </table>
             </div>
          </div>
      </div>
    </div>
  );
}