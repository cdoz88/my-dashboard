import React, { useState } from 'react';
import { Lock, Link as LinkIcon, Copy, Trash2, Eye, EyeOff, Users, Pencil, CheckCircle, FolderTree, Search } from 'lucide-react';
import CompanyLogo from '../shared/CompanyLogo';

export default function PasswordsDashboard({ 
  passwords, activePasswordTab, openPasswordModal, handleDeletePassword, companies, currentUser 
}) {
  const [revealedPasswords, setRevealedPasswords] = useState(new Set());
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getCompany = (id) => companies.find(c => c.id === id);

  // If not an admin, ONLY show passwords that explicitly contain this user's ID in the sharedWith array!
  const viewablePasswords = currentUser?.isAdmin 
      ? passwords 
      : passwords.filter(p => (p.sharedWith || []).includes(currentUser?.id));

  const tabPasswords = activePasswordTab === 'overview' 
      ? viewablePasswords 
      : viewablePasswords.filter(p => p.companyId === activePasswordTab);

  // Apply the live search filter
  const filteredPasswords = tabPasswords.filter(pw => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
          (pw.platform && pw.platform.toLowerCase().includes(q)) ||
          (pw.username && pw.username.toLowerCase().includes(q)) ||
          (pw.url && pw.url.toLowerCase().includes(q)) ||
          (pw.notes && pw.notes.toLowerCase().includes(q))
      );
  });

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

  const confirmDelete = (id, platform) => {
      if (window.confirm(`Are you sure you want to permanently delete the password for ${platform}?`)) {
          handleDeletePassword(id);
      }
  };

  // Group the filtered passwords by category for the table view
  const categoriesList = ['Company', 'Shop', 'Content Creation', 'Content Distribution', 'Social Media', 'Website', 'Mobile App', 'Other', 'Uncategorized'];
  const groupedPasswords = {};
  categoriesList.forEach(c => groupedPasswords[c] = []);
  
  filteredPasswords.forEach(pw => {
      const cat = pw.category || 'Uncategorized';
      if (groupedPasswords[cat]) groupedPasswords[cat].push(pw);
      else groupedPasswords['Uncategorized'].push(pw);
  });

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
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
            </div>
            <input 
                type="text" 
                placeholder="Search vault..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 shadow-sm"
            />
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
                         {categoriesList.map(cat => {
                             if (groupedPasswords[cat].length === 0) return null;
                             
                             return (
                                 <React.Fragment key={cat}>
                                     {/* Group Header Row - Updated Contrast */}
                                     <tr>
                                         <td colSpan={currentUser?.isAdmin ? "5" : "4"} className="bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider p-3 px-4 border-y border-slate-300">
                                            <div className="flex items-center gap-1.5"><FolderTree size={14} className="text-slate-500" /> {cat}</div>
                                         </td>
                                     </tr>
                                     {/* Map through passwords in this category */}
                                     {groupedPasswords[cat].sort((a,b) => a.platform.localeCompare(b.platform)).map(pw => {
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
                                                             {/* Updated to use the confirmDelete function */}
                                                             <button onClick={() => confirmDelete(pw.id, pw.platform)} className="text-slate-400 hover:text-red-500 p-1 transition-colors" title="Delete"><Trash2 size={16}/></button>
                                                         </div>
                                                     </td>
                                                 )}
                                             </tr>
                                         );
                                     })}
                                 </React.Fragment>
                             );
                         })}
                         {filteredPasswords.length === 0 && <tr><td colSpan={currentUser?.isAdmin ? "5" : "4"} className="p-8 text-center text-slate-500">No passwords found in this view.</td></tr>}
                     </tbody>
                 </table>
             </div>
          </div>
      </div>
    </div>
  );
}