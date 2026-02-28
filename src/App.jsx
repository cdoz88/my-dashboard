import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, FolderKanban, ListTodo, KanbanSquare, CalendarClock, Plus, CheckCircle2, Circle, Clock, Trash2, X, Paperclip, Building2, Globe, Smartphone, Megaphone, ShoppingCart, Rocket, Code, Monitor, Heart, Star, Users, Settings, Mail, Camera, Box, PenTool, Database, Cloud, FileText, Zap, Compass, MapPin, Coffee, Music, Image as ImageIcon, FileVideo, Shield, Target, Award, Crown, Pencil, UserCircle, ImagePlus, Menu, ChevronsUpDown, ChevronUp, ChevronDown, Wallet, PieChart, DollarSign, Receipt, Landmark, Upload, RefreshCw, ToggleRight, ToggleLeft, UserCog, LogOut, Key } from 'lucide-react';

const API_URL = 'https://fytsolutions.com/api.php';

const iconMap = { Building2, Globe, Smartphone, Megaphone, ShoppingCart, Rocket, Code, Monitor, Heart, Star, Briefcase, FolderKanban, Users, Settings, Mail, Camera, Box, PenTool, Database, Cloud, FileText, Zap, Compass, MapPin, Coffee, Music, ImageIcon, FileVideo, Shield, Target, Award, Crown, Upload, RefreshCw };
const availableIcons = Object.keys(iconMap);

const colorStyles = {
  blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500', hex: '#3b82f6' },
  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', hex: '#10b981' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', bar: 'bg-purple-500', hex: '#a855f7' },
  rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500', hex: '#f43f5e' },
  amber: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500', hex: '#f59e0b' },
  slate: { text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', bar: 'bg-slate-500', hex: '#64748b' },
};
const availableColors = Object.keys(colorStyles);

const tagStyles = { 'Urgent': 'bg-red-100 text-red-700 border-red-200', 'On Hold': 'bg-orange-100 text-orange-700 border-orange-200', 'Need Info': 'bg-blue-100 text-blue-700 border-blue-200', 'See Notes': 'bg-slate-100 text-slate-700 border-slate-200', 'Needs Review': 'bg-purple-100 text-purple-700 border-purple-200', 'Ready': 'bg-emerald-100 text-emerald-700 border-emerald-200' };
const availableTags = Object.keys(tagStyles);
const expenseCategories = ['Company Expense', 'Website', 'Tools', 'Domains', 'Social Media', 'Merchandise', 'Personnel', 'Other'];

const DynamicIcon = ({ name, className, size }) => { const Icon = iconMap[name] || iconMap['Briefcase']; return <Icon className={className} size={size} />; };

const convertToBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error); });

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentApp, setCurrentApp] = useState('projects'); 
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  const [activeTab, setActiveTab] = useState('mytasks'); 
  const [projectDisplayMode, setProjectDisplayMode] = useState('list');
  const [activeBudgetTab, setActiveBudgetTab] = useState('overview'); 
  const [budgetDisplayMode, setBudgetDisplayMode] = useState('list'); 
  const [expenseSortConfig, setExpenseSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [activeDomainTab, setActiveDomainTab] = useState('overview');
  const [domainDisplayMode, setDomainDisplayMode] = useState('list'); 
  const [domainSortConfig, setDomainSortConfig] = useState({ key: 'name', direction: 'asc' });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '', description: '', dueDate: '', status: 'todo', projectId: '', files: [], assigneeId: '', tags: [], weight: 1 });
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({ id: null, name: '', amount: '', cycle: 'monthly', category: 'Tools', companyId: '', renewalDate: '', notes: '', autoRenew: true });
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState({ id: null, name: '', amount: '', cycle: 'annual', category: 'Domains', companyId: '', renewalDate: '', notes: '', autoRenew: true });
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState({ id: null, name: '', logoUrl: '', userIds: [] });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState({ id: null, name: '', companyId: '', icon: 'FolderKanban', color: 'slate' });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', password: '', avatarUrl: '' });
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [isSwitchUserModalOpen, setIsSwitchUserModalOpen] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(() => localStorage.getItem('loggedInUserId') || null);

  const currentUser = users.find(u => u.id === loggedInUserId);

  useEffect(() => {
    if (currentUser) localStorage.setItem('loggedInUserId', currentUser.id);
    else localStorage.removeItem('loggedInUserId');
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentApp === 'budget' && !currentUser.isAdmin && !currentUser.canViewBudget) setCurrentApp('projects');
      if (currentApp === 'domains' && !currentUser.isAdmin && !currentUser.canViewDomains) setCurrentApp('projects');
    }
  }, [currentUser, currentApp]);

  useEffect(() => {
    fetch(`${API_URL}?action=get_all`).then(res => res.json()).then(data => {
        if(data.users) {
           setUsers(data.users.map(u => ({ ...u, isAdmin: u.isAdmin == 1 || u.isAdmin === true, canViewProjects: u.canViewProjects == 1 || u.canViewProjects === true, canViewBudget: u.canViewBudget == 1 || u.canViewBudget === true, canViewDomains: u.canViewDomains == 1 || u.canViewDomains === true })));
        }
        if(data.companies) setCompanies(data.companies);
        if(data.projects) setProjects(data.projects);
        if(data.tasks) setTasks(data.tasks);
        if(data.expenses) setExpenses(data.expenses);
        setIsLoading(false);
      }).catch(err => { console.error("API Error:", err); setIsLoading(false); });
  }, []);

  const sendToAPI = async (action, data) => {
    try { await fetch(`${API_URL}?action=${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); } 
    catch (err) { console.error(`Error with ${action}:`, err); }
  };

  const handleSyncGoDaddy = async (companyId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=sync_godaddy`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyId }) });
      const data = await response.json();
      if (data.error) alert("Sync Failed: " + data.error);
      else {
        alert(`Successfully synced ${data.count} domains from GoDaddy!`);
        const refresh = await fetch(`${API_URL}?action=get_all`);
        const freshData = await refresh.json();
        if(freshData.expenses) setExpenses(freshData.expenses);
      }
    } catch (err) { alert("An error occurred during sync."); }
    setIsLoading(false);
  };

  const handleImportCSV = (e, companyId, isDomain = false) => {
    const file = e.target.files[0];
    if (!file || !companyId) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const lines = event.target.result.split('\n');
      let importedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.replace(/^"|"$/g, '').trim());
        if (cols.length < 3) continue; 
        const name = cols[0];
        if (!name || name === 'What' || name.includes('Total') || name === 'Website') continue;
        let amount = 0, cycle = 'monthly', autoRenew = true;
        const col1Str = (cols[1] || '').toLowerCase(), col2Str = (cols[2] || '').toLowerCase(), notesStr = (cols[7] || cols[6] || '').toLowerCase();
        if (col1Str.includes('ar off') || col2Str.includes('ar off') || notesStr.includes('ar off')) autoRenew = false;
        const monthlyStr = col1Str.replace(/[^0-9.]/g, ''), annualStr = col2Str.replace(/[^0-9.]/g, '');
        
        if (monthlyStr && parseFloat(monthlyStr) > 0) { amount = parseFloat(monthlyStr); cycle = 'monthly'; } 
        else if (annualStr && parseFloat(annualStr) > 0) { amount = parseFloat(annualStr); cycle = 'annual'; } 
        else if (autoRenew) continue; else amount = 0;

        let category = isDomain ? 'Domains' : 'Other';
        if (!isDomain) {
           if (name.toLowerCase().includes('.com') || name.toLowerCase().includes('.network')) category = 'Domains';
           else if (amount > 1000) category = 'Company Expense';
           else if (cols[1] && cols[2]) category = 'Website';
           else category = 'Tools';
        }
        const expenseData = { id: 'e' + Date.now() + Math.random().toString(36).substr(2, 5), companyId, name, amount, cycle, category, renewalDate: cols[4] || '', notes: cols[7] || cols[6] || '', autoRenew };
        setExpenses(prev => [...prev, expenseData]);
        await sendToAPI('save_expense', expenseData);
        importedCount++;
      }
      alert(`Imported ${importedCount} items!`); e.target.value = null; 
    };
    reader.readAsText(file);
  };

  const openTaskModal = (task = null, projectId = '', status = 'todo') => {
    if (task) setCurrentTask({ ...task, files: task.files || [], description: task.description || '', tags: task.tags || [], weight: task.weight || 1 });
    else setCurrentTask({ title: '', description: '', dueDate: '', status, projectId, files: [], assigneeId: currentUser?.id, tags: [], weight: 1 });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    const taskData = currentTask.id ? currentTask : { ...currentTask, id: 't' + Date.now(), projectId: currentTask.projectId || activeTab };
    setTasks(currentTask.id ? tasks.map(t => t.id === taskData.id ? taskData : t) : [...tasks, taskData]);
    setIsTaskModalOpen(false); sendToAPI('save_task', taskData);
  };

  const handleDeleteTask = (taskId) => { setTasks(tasks.filter(t => t.id !== taskId)); sendToAPI('delete_task', { id: taskId }); };
  const handleToggleTaskStatus = (task) => { const updated = { ...task, status: task.status === 'done' ? 'todo' : 'done' }; setTasks(tasks.map(t => t.id === task.id ? updated : t)); sendToAPI('save_task', updated); };

  const openExpenseModal = (expense = null, companyId = '') => {
    if (expense) setCurrentExpense({...expense, autoRenew: expense.autoRenew !== false && expense.autoRenew !== 0 && expense.autoRenew !== '0'});
    else setCurrentExpense({ id: null, name: '', amount: '', cycle: 'monthly', category: 'Tools', companyId: companyId || companies[0]?.id || '', renewalDate: '', notes: '', autoRenew: true });
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    const expenseData = currentExpense.id ? currentExpense : { ...currentExpense, id: 'e' + Date.now() };
    setExpenses(currentExpense.id ? expenses.map(exp => exp.id === expenseData.id ? expenseData : exp) : [...expenses, expenseData]);
    setIsExpenseModalOpen(false); sendToAPI('save_expense', expenseData);
  };

  const openDomainModal = (domain = null, companyId = '') => {
    if (domain) setCurrentDomain({...domain, autoRenew: domain.autoRenew !== false && domain.autoRenew !== 0 && domain.autoRenew !== '0'});
    else setCurrentDomain({ id: null, name: '', amount: '', cycle: 'annual', category: 'Domains', companyId: companyId || companies[0]?.id || '', renewalDate: '', notes: '', autoRenew: true });
    setIsDomainModalOpen(true);
  };

  const handleSaveDomain = (e) => {
    e.preventDefault();
    const domainData = currentDomain.id ? currentDomain : { ...currentDomain, id: 'e' + Date.now() };
    setExpenses(currentDomain.id ? expenses.map(exp => exp.id === domainData.id ? domainData : exp) : [...expenses, domainData]);
    setIsDomainModalOpen(false); sendToAPI('save_expense', domainData);
  };

  const handleDeleteExpense = (expenseId) => { setExpenses(expenses.filter(e => e.id !== expenseId)); sendToAPI('delete_expense', { id: expenseId }); };

  const openCompanyModal = (companyToEdit = null) => {
    if (companyToEdit) setEditingCompany({ ...companyToEdit, userIds: companyToEdit.userIds || [currentUser?.id] });
    else setEditingCompany({ id: null, name: '', logoUrl: '', userIds: [currentUser?.id] });
    setIsCompanyModalOpen(true);
  };

  const toggleCompanyUser = (userId) => { setEditingCompany({ ...editingCompany, userIds: editingCompany.userIds.includes(userId) ? editingCompany.userIds.filter(id => id !== userId) : [...editingCompany.userIds, userId] }); };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (!editingCompany.name.trim()) return;
    const companyData = editingCompany.id ? editingCompany : { ...editingCompany, id: 'c' + Date.now() };
    setCompanies(editingCompany.id ? companies.map(c => c.id === companyData.id ? companyData : c) : [...companies, companyData]);
    setIsCompanyModalOpen(false); sendToAPI('save_company', companyData);
  };

  const handleDeleteCompany = (companyId) => {
    setCompanies(companies.filter(c => c.id !== companyId)); setProjects(projects.filter(p => p.companyId !== companyId)); setExpenses(expenses.filter(e => e.companyId !== companyId));
    if (activeBudgetTab === companyId) setActiveBudgetTab('overview'); if (activeDomainTab === companyId) setActiveDomainTab('overview');
    setIsCompanyModalOpen(false); sendToAPI('delete_company', { id: companyId });
  };

  const openProjectModal = (companyId = '', projectToEdit = null) => {
    if (projectToEdit) setEditingProject(projectToEdit);
    else setEditingProject({ id: null, name: '', companyId: companyId || companies[0]?.id || '', icon: 'FolderKanban', color: 'slate' });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!editingProject.name.trim() || !editingProject.companyId) return;
    const projectData = editingProject.id ? editingProject : { ...editingProject, id: 'p' + Date.now() };
    if (editingProject.id) setProjects(projects.map(p => p.id === projectData.id ? projectData : p));
    else { setProjects([...projects, projectData]); setActiveTab(projectData.id); }
    setIsProjectModalOpen(false); sendToAPI('save_project', projectData);
  };

  const handleDeleteProject = (projectId) => { setProjects(projects.filter(p => p.id !== projectId)); setTasks(tasks.filter(t => t.projectId !== projectId)); setActiveTab('mytasks'); setIsProjectModalOpen(false); sendToAPI('delete_project', { id: projectId }); };

  const openProfileModal = () => { if(currentUser) { setProfileForm({ name: currentUser.name || '', email: currentUser.email || '', password: '', avatarUrl: currentUser.avatarUrl || '' }); setIsProfileModalOpen(true); } };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...currentUser, name: profileForm.name, email: profileForm.email, password: profileForm.password, avatarUrl: profileForm.avatarUrl };
    const localUser = { ...updatedUser }; delete localUser.password;
    setUsers(users.find(u => u.id === currentUser.id) ? users.map(u => u.id === currentUser.id ? localUser : u) : [...users, localUser]);
    setIsProfileModalOpen(false); sendToAPI('save_user', updatedUser);
  };

  const handleSaveTeamMember = (e) => {
    e.preventDefault();
    const userToSave = { ...editingTeamMember, id: editingTeamMember.id || 'u' + Date.now() };
    const localUser = { ...userToSave }; delete localUser.password;
    setUsers(users.find(u => u.id === userToSave.id) ? users.map(u => u.id === userToSave.id ? localUser : u) : [...users, localUser]);
    sendToAPI('save_user', userToSave); setEditingTeamMember(null);
  };

  const handleImageUpload = async (e, setter, stateObj, field) => { if (e.target.files[0]) setter({ ...stateObj, [field]: await convertToBase64(e.target.files[0]) }); };
  const handleFileUpload = async (e) => {
    const newFiles = await Promise.all(Array.from(e.target.files).map(async f => ({ name: f.name, url: await convertToBase64(f) })));
    setCurrentTask({ ...currentTask, files: [...(currentTask.files || []), ...newFiles] });
  };
  const removeFile = (idx) => setCurrentTask({ ...currentTask, files: currentTask.files.filter((_, i) => i !== idx) });

  const getCompany = (id) => companies.find(c => c.id === id);
  const getProject = (id) => projects.find(p => p.id === id);
  const getUser = (id) => users.find(u => u.id === id);
  const isOverdue = (dateStr, status) => { if (status === 'done' || !dateStr) return false; const d = new Date(); return dateStr < `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const formatDate = (dateStr) => { if (!dateStr) return ''; const [y, m, d] = dateStr.split('-'); return `${m}-${d}-${y.slice(2)}`; };
  const calculateProjectProgress = (projectId) => {
    const pt = tasks.filter(t => t.projectId === projectId); if (pt.length === 0) return 0;
    return Math.round((pt.filter(t => t.status === 'done').reduce((s, t) => s + (Number(t.weight)||1), 0) / pt.reduce((s, t) => s + (Number(t.weight)||1), 0)) * 100);
  };
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  const parseNextDate = (cycle, dateStr) => {
    if (!dateStr) return new Date(9999, 11, 31);
    const today = new Date();
    if (cycle === 'monthly') {
      const match = dateStr.match(/(\d+)/);
      if (match) { let d = new Date(today.getFullYear(), today.getMonth(), parseInt(match[1])); if (d < today) d.setMonth(d.getMonth() + 1); return d; }
    } else if (cycle === 'annual') {
       let d = new Date(`${dateStr} ${today.getFullYear()}`); if (!isNaN(d.getTime())) { if (d < today) d.setFullYear(d.getFullYear() + 1); return d; }
    }
    return new Date(9999, 11, 31);
  };

  const TagDisplay = ({ tags }) => tags && tags.length > 0 ? (<div className="flex flex-wrap gap-1">{tags.map(tag => <span key={tag} className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${tagStyles[tag] || tagStyles['See Notes']}`}>{tag}</span>)}</div>) : null;
  const CompanyLogo = ({ company, sizeClass = "w-5 h-5", textClass = "text-[10px]" }) => {
    if (!company) return null;
    if (company.logoUrl) return <img src={company.logoUrl} alt={company.name} className={`${sizeClass} rounded object-cover flex-shrink-0 shadow-sm border border-slate-200 bg-white`} />;
    return <div className={`${sizeClass} rounded bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center font-bold ${textClass} flex-shrink-0 shadow-sm`}>{company.name ? company.name.charAt(0).toUpperCase() : 'C'}</div>;
  };

  const visibleCompanies = companies.filter(c => currentUser?.isAdmin || (c.userIds && c.userIds.includes(currentUser?.id)));

  // --- SCREENS ---
  const AuthScreen = () => {
    const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [name, setName] = useState(''); const [isRegistering, setIsRegistering] = useState(false);
    const handleAuth = async (e) => {
      e.preventDefault();
      if (isRegistering) {
        if (!name.trim() || !email.trim() || !password.trim()) return;
        const isFirstUser = users.length === 0;
        const newUser = { id: 'u' + Date.now(), name, email: email.toLowerCase(), password, isAdmin: isFirstUser, canViewProjects: true, canViewBudget: isFirstUser, canViewDomains: isFirstUser, avatarUrl: '' };
        const localUser = { ...newUser }; delete localUser.password;
        setUsers([...users, localUser]); setLoggedInUserId(localUser.id); await sendToAPI('save_user', newUser);
      } else {
        if (!users.find(u => u.email.toLowerCase() === email.toLowerCase())) { setIsRegistering(true); return; }
        try {
          const res = await fetch(`${API_URL}?action=login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.toLowerCase(), password }) });
          const data = await res.json();
          if (data.error) alert(data.error); else { setLoggedInUserId(data.user.id); setUsers(users.map(u => u.id === data.user.id ? data.user : u)); }
        } catch (err) { alert("Could not connect to the authentication server."); }
      }
    };
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-600/20"><LayoutDashboard size={32} className="text-white" /></div>
          <h1 className="text-2xl font-black text-slate-800 text-center mb-2">Control Room</h1>
          <p className="text-slate-500 text-center mb-8">{isRegistering ? "It looks like you're new! Let's get you set up." : "Enter your credentials to sign in."}</p>
          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && <div><label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" /></div>}
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@company.com" disabled={isRegistering && email !== ''} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" /></div>
            <button type="submit" className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-md transition-colors mt-4">{isRegistering ? 'Create Account' : 'Sign In'}</button>
          </form>
          {isRegistering && <button onClick={() => setIsRegistering(false)} className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700 font-medium">Back to Sign In</button>}
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shadow-xl flex-shrink-0">
      <div className="p-5 border-b border-slate-700 flex justify-center items-center lg:hidden"><h1 className="text-xl font-bold text-white flex items-center gap-2 capitalize">{currentApp} Menu</h1></div>
      <div className="flex-1 overflow-y-auto py-6">
        {currentApp === 'projects' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Global</p>
              <div className="space-y-1">
                <button onClick={() => { setActiveTab('mytasks'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'mytasks' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}><CheckCircle2 size={18} /> My Tasks</button>
                <button onClick={() => { setActiveTab('capacity'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'capacity' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}><Users size={18} /> Team Capacity</button>
              </div>
            </div>
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Companies</p>{currentUser?.isAdmin && <button onClick={() => openCompanyModal()} className="text-slate-400 hover:text-white transition-colors p-1"><Plus size={16} /></button>}</div>
              {visibleCompanies.map(company => (
                <div key={company.id} className="mb-4">
                  <div className="flex items-center justify-between mb-1 px-1 group/company">
                    <div className="flex items-center gap-2 text-slate-400 truncate pr-2"><CompanyLogo company={company} /><span className="font-medium text-sm text-slate-200 truncate">{company.name}</span></div>
                    {currentUser?.isAdmin && (
                      <div className="flex items-center flex-shrink-0 opacity-0 group-hover/company:opacity-100 transition-opacity">
                        <button onClick={() => openCompanyModal(company)} className="text-slate-500 hover:text-white p-1"><Pencil size={12} /></button>
                        <button onClick={() => openProjectModal(company.id)} className="text-slate-500 hover:text-white p-1 ml-0.5"><Plus size={14} /></button>
                      </div>
                    )}
                  </div>
                  <div className="pl-4 flex flex-col gap-0.5">
                    {projects.filter(p => p.companyId === company.id).map(project => (
                      <div key={project.id} className="flex items-center justify-between group/project">
                        <button onClick={() => { setActiveTab(project.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors overflow-hidden ${activeTab === project.id ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                          <DynamicIcon name={project.icon} size={14} className={`flex-shrink-0 ${activeTab === project.id ? colorStyles[project.color]?.text : ''}`} />
                          <div className="flex-1 flex flex-col items-start overflow-hidden w-full"><span className="truncate w-full text-left">{project.name}</span><div className="w-full bg-slate-700/50 h-1 mt-1 rounded-full overflow-hidden"><div className={`h-full ${colorStyles[project.color]?.bar} transition-all duration-500`} style={{ width: `${calculateProjectProgress(project.id)}%` }} /></div></div>
                        </button>
                        {currentUser?.isAdmin && <button onClick={(e) => { e.stopPropagation(); openProjectModal('', project); }} className="text-slate-500 hover:text-white opacity-0 group-hover/project:opacity-100 transition-all p-1.5 flex-shrink-0"><Pencil size={12} /></button>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {currentApp === 'budget' && (
          <>
            <div className="px-4 mb-6"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Finance</p><button onClick={() => { setActiveBudgetTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeBudgetTab === 'overview' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}><PieChart size={18} /> All Budgets</button></div>
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>{currentUser?.isAdmin && <button onClick={() => openCompanyModal()} className="text-slate-400 hover:text-white transition-colors p-1"><Plus size={16} /></button>}</div>
              <div className="flex flex-col gap-1">
                {visibleCompanies.map(company => (
                  <div key={company.id} className="flex items-center justify-between group/company">
                    <button onClick={() => { setActiveBudgetTab(company.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeBudgetTab === company.id ? 'bg-slate-800 text-emerald-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}><CompanyLogo company={company} sizeClass="w-5 h-5" /><span className="truncate">{company.name}</span></button>
                    {currentUser?.isAdmin && <div className="flex items-center flex-shrink-0 opacity-0 group-hover/company:opacity-100 transition-opacity ml-1"><button onClick={(e) => { e.stopPropagation(); openCompanyModal(company); }} className="text-slate-500 hover:text-white p-1"><Pencil size={12} /></button></div>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {currentApp === 'domains' && (
          <>
            <div className="px-4 mb-6"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Portfolio</p><button onClick={() => { setActiveDomainTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeDomainTab === 'overview' ? 'bg-teal-500 text-white' : 'hover:bg-slate-800 text-slate-300'}`}><Globe size={18} /> All Domains</button></div>
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>{currentUser?.isAdmin && <button onClick={() => openCompanyModal()} className="text-slate-400 hover:text-white transition-colors p-1"><Plus size={16} /></button>}</div>
              <div className="flex flex-col gap-1">
                {visibleCompanies.map(company => (
                  <div key={company.id} className="flex items-center justify-between group/company">
                    <button onClick={() => { setActiveDomainTab(company.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeDomainTab === company.id ? 'bg-slate-800 text-teal-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}><CompanyLogo company={company} sizeClass="w-5 h-5" /><span className="truncate">{company.name}</span></button>
                    {currentUser?.isAdmin && <div className="flex items-center flex-shrink-0 opacity-0 group-hover/company:opacity-100 transition-opacity ml-1"><button onClick={(e) => { e.stopPropagation(); openCompanyModal(company); }} className="text-slate-500 hover:text-white p-1"><Pencil size={12} /></button></div>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <button onClick={openProfileModal} className="flex-1 flex items-center gap-3 px-2 py-2 rounded-lg transition-colors hover:bg-slate-800 text-slate-300 hover:text-white group overflow-hidden">
          {currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-600 flex-shrink-0 bg-white" /> : <UserCircle size={28} className="text-slate-500 group-hover:text-slate-400 flex-shrink-0" />}
          <div className="flex flex-col items-start truncate text-left pr-2">
            <span className="font-bold text-sm truncate w-full flex items-center gap-1.5 text-slate-200 group-hover:text-white transition-colors">{(currentUser?.name || 'User').split(' ')[0]}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 truncate w-full ${currentUser?.isAdmin ? 'text-amber-500' : 'text-blue-400'}`}>{currentUser?.isAdmin ? 'Workspace Admin' : 'Team Member'}</span>
          </div>
        </button>
        <div className="flex items-center gap-1 flex-shrink-0">
          {currentUser?.isAdmin && <button onClick={() => setIsTeamModalOpen(true)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Manage Team Permissions"><Users size={16} /></button>}
          <button onClick={() => setIsSwitchUserModalOpen(true)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Switch User (Test Mode)"><UserCog size={16} /></button>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => {
    const activeTasks = tasks.filter(t => t.assigneeId === currentUser?.id && t.status !== 'done').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const completedTasks = tasks.filter(t => t.assigneeId === currentUser?.id && t.status === 'done').sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    const renderRow = (task) => {
      const project = getProject(task.projectId); const company = project ? getCompany(project.companyId) : null; const isOver = isOverdue(task.dueDate, task.status);
      return (
        <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
          <td className="p-4 cursor-pointer w-12 pr-1" onClick={() => handleToggleTaskStatus(task)}>{task.status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}</td>
          <td className="py-4 px-2 w-8"><div className={`w-2.5 h-2.5 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} title={task.status} /></td>
          <td className={`p-4 font-medium cursor-pointer transition-colors ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 hover:text-blue-600'}`} onClick={() => openTaskModal(task)}>
            <div>{task.title}</div><div className="flex flex-wrap gap-2 mt-1.5"><TagDisplay tags={task.tags} /><span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200"><Star size={10}/> {task.weight || 1} pts</span></div>
          </td>
          <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{project && company && <div className={`flex items-center gap-2 ${task.status === 'done' ? 'opacity-50 grayscale' : ''}`}><CompanyLogo company={company} sizeClass="w-6 h-6" textClass="text-[10px]" /><span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-md border ${colorStyles[project.color]?.bg} ${colorStyles[project.color]?.border} ${colorStyles[project.color]?.text}`}><DynamicIcon name={project.icon} size={14} />{project.name}</span></div>}</td>
          <td className={`p-4 text-sm flex items-center justify-between whitespace-nowrap ${isOver ? 'text-red-500 font-bold' : 'text-slate-600'}`}><span className="flex items-center gap-1"><Clock size={14} className={isOver ? 'text-red-500' : 'text-slate-400'} />{formatDate(task.dueDate)}</span><button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-4"><Trash2 size={16} /></button></td>
        </tr>
      );
    };
    return (
      <div className="p-4 sm:p-8 h-full overflow-y-auto w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Tasks</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead><tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500"><th className="p-4 w-12 pr-1"></th><th className="py-4 px-2 w-8"></th><th className="p-4">Task</th><th className="p-4">Project</th><th className="p-4">Due Date</th></tr></thead>
              <tbody>{activeTasks.length > 0 ? activeTasks.map(renderRow) : <tr><td colSpan="5" className="p-8 text-center text-slate-500">No active tasks assigned to you.</td></tr>}</tbody>
            </table>
          </div>
        </div>
        {completedTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4"><span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-medium">Completed</span><span className="text-slate-400 text-sm">{completedTasks.length} tasks</span></div>
            <div className="bg-white/60 rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
               <div className="overflow-x-auto"><table className="w-full text-left border-collapse min-w-[600px]"><tbody>{completedTasks.map(renderRow)}</tbody></table></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ProjectView = ({ projectId }) => {
    const pTasks = tasks.filter(t => t.projectId === projectId);
    const activeTasks = pTasks.filter(t => t.status !== 'done').sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
    const completedTasks = pTasks.filter(t => t.status === 'done').sort((a,b) => new Date(b.dueDate) - new Date(a.dueDate));
    const project = getProject(projectId); const company = getCompany(project?.companyId);
    
    const renderRow = (task) => {
      const assignee = getUser(task.assigneeId); const isOver = isOverdue(task.dueDate, task.status);
      return (
        <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 group">
          <td className="p-4 cursor-pointer w-12 pr-1" onClick={() => handleToggleTaskStatus(task)}>{task.status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}</td>
          <td className="py-4 px-2 w-8"><div className={`w-2.5 h-2.5 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} title={task.status} /></td>
          <td className={`p-4 font-medium cursor-pointer transition-colors ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 hover:text-blue-600'}`} onClick={() => openTaskModal(task)}>
            <div>{task.title}</div><div className="flex flex-wrap gap-2 mt-1.5"><TagDisplay tags={task.tags} /><span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200"><Star size={10}/> {task.weight || 1} pts</span></div>
          </td>
          <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{assignee && <span className={`flex items-center gap-1.5 ${task.status === 'done' ? 'opacity-60 grayscale' : ''}`}>{assignee.avatarUrl ? <img src={assignee.avatarUrl} className="w-5 h-5 rounded-full object-cover" /> : <UserCircle size={16} className="text-slate-400" />}{(assignee.name || 'User').split(' ')[0]}</span>}</td>
          <td className={`p-4 text-sm flex items-center justify-between whitespace-nowrap ${isOver ? 'text-red-500 font-bold' : 'text-slate-600'}`}><span>{formatDate(task.dueDate)}</span><button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-4"><Trash2 size={16} /></button></td>
        </tr>
      );
    };

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">{project && <DynamicIcon name={project.icon} size={24} className={colorStyles[project.color]?.text} />}{project?.name || 'Unknown Project'}</h2>
            <div className="flex items-center gap-2 mt-2"><CompanyLogo company={company} sizeClass="w-5 h-5" /><p className="text-slate-500 text-sm font-medium">{company?.name || 'Unknown Company'}</p></div>
          </div>
          <div className="w-full sm:w-64 bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1.5">
             <div className="flex justify-between items-center text-sm"><span className="font-semibold text-slate-600">Project Progress</span><span className={`font-bold ${project ? colorStyles[project.color]?.text : 'text-slate-700'}`}>{calculateProjectProgress(projectId)}%</span></div>
             <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${project ? colorStyles[project.color]?.bar : 'bg-slate-500'} transition-all duration-700`} style={{ width: `${calculateProjectProgress(projectId)}%` }} /></div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {projectDisplayMode === 'list' && (
            <div className="h-full overflow-y-auto pr-1 pb-8">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[600px]">
                     <thead><tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500"><th className="p-4 w-12 pr-1"></th><th className="py-4 px-2 w-8"></th><th className="p-4">Task Name</th><th className="p-4">Assignee</th><th className="p-4">Due Date</th></tr></thead>
                     <tbody>{activeTasks.length > 0 ? activeTasks.map(renderRow) : <tr><td colSpan="5" className="p-8 text-center text-slate-500">No active tasks.</td></tr>}</tbody>
                   </table>
                 </div>
               </div>
               {completedTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4"><span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-medium">Completed</span><span className="text-slate-400 text-sm">{completedTasks.length} tasks</span></div>
                    <div className="bg-white/60 rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                      <div className="overflow-x-auto"><table className="w-full text-left min-w-[600px]"><tbody>{completedTasks.map(renderRow)}</tbody></table></div>
                    </div>
                  </div>
               )}
            </div>
          )}

          {projectDisplayMode === 'kanban' && (
            <div className="flex gap-6 h-full overflow-x-auto pb-4">
              {['todo', 'in-progress', 'done'].map(status => (
                <div key={status} className="bg-slate-100 rounded-xl w-80 min-w-[20rem] p-4 flex flex-col h-full border border-slate-200" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)}>
                  <div className="flex justify-between items-center mb-4 px-2"><h3 className="font-semibold text-slate-700 capitalize">{status.replace('-', ' ')}</h3><span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2 rounded-full font-medium">{pTasks.filter(t => t.status === status).length}</span></div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {pTasks.filter(t => t.status === status).map(task => {
                      const assignee = getUser(task.assigneeId); const isOver = isOverdue(task.dueDate, task.status);
                      return (
                        <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} className={`bg-white p-4 rounded-lg shadow-sm border cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors group ${isOver ? 'border-red-200' : 'border-slate-200'}`}>
                          <p className={`font-medium text-sm mb-2 cursor-pointer group-hover:text-blue-600 ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`} onClick={() => openTaskModal(task)}>{task.title}</p>
                          <div className="flex flex-wrap gap-2 mb-3"><TagDisplay tags={task.tags} /><span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200"><Star size={10}/> {task.weight || 1}</span></div>
                          <div className="flex justify-between items-center text-xs text-slate-500">
                             <div className="flex items-center gap-2">
                               <span className={`flex items-center gap-1 px-2 py-1 rounded font-medium ${isOver ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}><Clock size={12} /> {formatDate(task.dueDate)}</span>
                               {assignee && <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-1 rounded">{assignee.avatarUrl ? <img src={assignee.avatarUrl} className="w-4 h-4 rounded-full object-cover" /> : <UserCircle size={12} />}<span className="max-w-[60px] truncate">{(assignee.name||'').split(' ')[0]}</span></span>}
                             </div>
                             <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={() => openTaskModal(null, projectId, status)} className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:bg-slate-200 rounded-lg transition-colors border border-dashed border-slate-300"><Plus size={16} /> Add Task</button>
                </div>
              ))}
            </div>
          )}

          {projectDisplayMode === 'timeline' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
               <div className="relative border-l-2 border-blue-100 ml-3 space-y-8">
                  {pTasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).map(task => {
                    const assignee = getUser(task.assigneeId); const isOver = isOverdue(task.dueDate, task.status);
                    return (
                      <div key={task.id} className="relative pl-8">
                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                        <div className={`p-4 rounded-lg border hover:shadow-md transition-shadow group ${isOver ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-start gap-2.5 mb-2">
                            <button className="mt-0.5 flex-shrink-0" onClick={() => handleToggleTaskStatus(task)}>{task.status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}</button>
                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                            <div className={`flex-1 font-medium cursor-pointer transition-colors leading-tight pt-0.5 ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 hover:text-blue-600'}`} onClick={() => openTaskModal(task)}>{task.title}</div>
                          </div>
                          <div className="pl-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                            <TagDisplay tags={task.tags} />
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200"><Star size={10}/> {task.weight || 1} pts</span>
                            {assignee && <span className={`flex items-center gap-1.5 text-xs font-medium ${task.status === 'done' ? 'text-slate-400' : 'text-slate-600'}`}>{assignee.avatarUrl ? <img src={assignee.avatarUrl} className={`w-4 h-4 rounded-full object-cover ${task.status === 'done' ? 'grayscale opacity-60' : ''}`} /> : <UserCircle size={14} className={task.status === 'done' ? 'text-slate-300' : 'text-slate-400'} />}{(assignee.name||'').split(' ')[0]}</span>}
                            <div className={`text-xs flex items-center gap-1 whitespace-nowrap ml-auto ${isOver ? 'text-red-500 font-bold' : 'text-slate-500'}`}><Clock size={12} className={isOver ? 'text-red-500' : 'text-slate-400'} />{formatDate(task.dueDate)}</div>
                            <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
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
  };

  const TeamCapacityView = () => (
    <div className="p-4 sm:p-8 h-full overflow-y-auto w-full bg-slate-50/50">
      <div className="mb-6 sm:mb-8"><h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Users className="text-blue-600" size={24} /> Team Capacity Dashboard</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map(user => {
          const userActiveTasks = tasks.filter(t => t.assigneeId === user.id && t.status !== 'done');
          const totalPoints = userActiveTasks.reduce((sum, t) => sum + (Number(t.weight) || 1), 0);
          const pointsByProject = {}; userActiveTasks.forEach(t => { pointsByProject[t.projectId] = (pointsByProject[t.projectId] || 0) + (Number(t.weight) || 1); });

          return (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
               <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                  {user.avatarUrl ? <img src={user.avatarUrl} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-white" /> : <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm"><UserCircle size={28} className="text-slate-500" /></div>}
                  <div><h3 className="font-bold text-slate-800 flex items-center gap-1.5">{user.name} {user.isAdmin && <Shield size={14} className="text-amber-500" title="Admin" />}</h3><p className="text-xs text-slate-500">{user.email}</p></div>
               </div>
               <div className="p-5 flex-1 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                     <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-100"><div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Active Tasks</div><div className="text-2xl font-black text-slate-800">{userActiveTasks.length}</div></div>
                     <div className="flex-1 bg-purple-50 rounded-lg p-3 border border-purple-100"><div className="text-purple-600 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={12}/> Total Points</div><div className="text-2xl font-black text-slate-800">{totalPoints}</div></div>
                  </div>
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Workload by Project</h4>
                     {Object.keys(pointsByProject).length > 0 ? (
                       <div className="space-y-3">
                         {Object.entries(pointsByProject).sort((a,b) => b[1] - a[1]).map(([projectId, points]) => {
                           const project = getProject(projectId); if (!project) return null;
                           return (
                             <div key={projectId}>
                               <div className="flex justify-between items-center text-sm mb-1"><div className="flex items-center gap-1.5 font-medium text-slate-700 truncate pr-2"><DynamicIcon name={project.icon} size={14} className={colorStyles[project.color]?.text} /><span className="truncate">{project.name}</span></div><div className="font-bold text-slate-600 text-xs">{points} pts</div></div>
                               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className={`h-full ${colorStyles[project.color]?.bar || 'bg-slate-400'}`} style={{ width: `${Math.round((points / totalPoints) * 100)}%` }} /></div>
                             </div>
                           );
                         })}
                       </div>
                     ) : <div className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded border border-dashed border-slate-200 text-center">No active tasks right now.</div>}
                  </div>
               </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  const BudgetDashboard = () => {
    const viewExpenses = activeBudgetTab === 'overview' ? expenses : expenses.filter(e => e.companyId === activeBudgetTab);
    const activeExpenses = viewExpenses.filter(e => e.autoRenew !== false && e.autoRenew !== 0 && e.autoRenew !== '0');
    const monthlyTotal = activeExpenses.filter(e => e.cycle === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const annualTotal = activeExpenses.filter(e => e.cycle === 'annual').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const trueAnnualCommitment = (monthlyTotal * 12) + annualTotal;
    const currentCompany = activeBudgetTab === 'overview' ? null : getCompany(activeBudgetTab);

    const handleSort = (key) => setExpenseSortConfig({ key, direction: expenseSortConfig.key === key && expenseSortConfig.direction === 'asc' ? 'desc' : 'asc' });
    const SortIcon = ({ columnKey }) => expenseSortConfig.key !== columnKey ? <ChevronsUpDown size={14} className="opacity-30 ml-1 inline" /> : (expenseSortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1 inline text-emerald-600" /> : <ChevronDown size={14} className="ml-1 inline text-emerald-600" />);

    const sortedExpenses = [...viewExpenses].sort((a, b) => {
      let aV = a[expenseSortConfig.key], bV = b[expenseSortConfig.key];
      if (expenseSortConfig.key === 'amount') { aV = parseFloat(aV || 0); bV = parseFloat(bV || 0); } 
      else if (expenseSortConfig.key === 'companyId') { aV = getCompany(a.companyId)?.name || ''; bV = getCompany(b.companyId)?.name || ''; } 
      else if (expenseSortConfig.key === 'renewalDate') { aV = parseNextDate(a.cycle, a.renewalDate).getTime(); bV = parseNextDate(b.cycle, b.renewalDate).getTime(); }
      if (aV < bV) return expenseSortConfig.direction === 'asc' ? -1 : 1;
      if (aV > bV) return expenseSortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
        <div className="mb-6 sm:mb-8 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">{activeBudgetTab === 'overview' ? 'Global Budget Overview' : `${currentCompany?.name} Budget`}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500"><div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2"><Receipt size={16} className="text-blue-500" /> Active Monthly Rate</div><div className="text-3xl font-bold text-slate-800">{formatCurrency(monthlyTotal)}</div></div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-purple-500"><div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2"><CalendarClock size={16} className="text-purple-500" /> Active Annual Rate</div><div className="text-3xl font-bold text-slate-800">{formatCurrency(annualTotal)}</div></div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500"><div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2"><Landmark size={16} className="text-emerald-500" /> True Yearly Commitment</div><div className="text-3xl font-bold text-slate-800">{formatCurrency(trueAnnualCommitment)}</div></div>
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                      <th className="p-4 cursor-pointer" onClick={() => handleSort('name')}>Expense Name <SortIcon columnKey="name" /></th>
                      {activeBudgetTab === 'overview' && <th className="p-4 cursor-pointer" onClick={() => handleSort('companyId')}>Company <SortIcon columnKey="companyId" /></th>}
                      <th className="p-4 cursor-pointer" onClick={() => handleSort('category')}>Category <SortIcon columnKey="category" /></th>
                      <th className="p-4 cursor-pointer" onClick={() => handleSort('amount')}>Amount <SortIcon columnKey="amount" /></th>
                      <th className="p-4 cursor-pointer" onClick={() => handleSort('cycle')}>Cycle <SortIcon columnKey="cycle" /></th>
                      <th className="p-4 cursor-pointer" onClick={() => handleSort('renewalDate')}>Date <SortIcon columnKey="renewalDate" /></th>
                      <th className="p-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExpenses.map(expense => {
                      const company = getCompany(expense.companyId); const isAutoRenewOn = expense.autoRenew !== false && expense.autoRenew !== 0 && expense.autoRenew !== '0';
                      return (
                        <tr key={expense.id} className={`border-b border-slate-100 hover:bg-slate-50 group ${!isAutoRenewOn ? 'opacity-60' : ''}`}>
                          <td className="p-4 font-medium text-slate-800 cursor-pointer hover:text-emerald-600 flex items-center gap-2" onClick={() => openExpenseModal(expense)}>{expense.category === 'Domains' ? <Globe size={16} className={isAutoRenewOn ? 'text-teal-500' : 'text-slate-400'} /> : null}<span className={!isAutoRenewOn ? 'line-through' : ''}>{expense.name}</span></td>
                          {activeBudgetTab === 'overview' && <td className="p-4"><div className="flex items-center gap-2"><CompanyLogo company={company} sizeClass="w-6 h-6" /><span className="text-sm text-slate-600">{company?.name}</span></div></td>}
                          <td className="p-4"><span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">{expense.category}</span></td>
                          <td className="p-4 font-medium text-slate-700">{formatCurrency(expense.amount)}</td>
                          <td className="p-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{expense.cycle}</span></td>
                          <td className="p-4 text-sm text-slate-500">{isAutoRenewOn ? (expense.renewalDate || '--') : <span className="text-red-500 font-medium">Canceled</span>}</td>
                          <td className="p-4 text-right"><button onClick={() => handleDeleteExpense(expense.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    );
  };

  const DomainsDashboard = () => {
    const viewDomains = activeDomainTab === 'overview' ? expenses.filter(e => e.category === 'Domains') : expenses.filter(e => e.category === 'Domains' && e.companyId === activeDomainTab);
    const activeDomains = viewDomains.filter(e => e.autoRenew !== false && e.autoRenew !== 0 && e.autoRenew !== '0');
    const totalDomainCost = activeDomains.reduce((sum, e) => sum + (e.cycle === 'monthly' ? parseFloat(e.amount) * 12 : parseFloat(e.amount)), 0);
    const currentCompany = activeDomainTab === 'overview' ? null : getCompany(activeDomainTab);

    const handleSort = (key) => setDomainSortConfig({ key, direction: domainSortConfig.key === key && domainSortConfig.direction === 'asc' ? 'desc' : 'asc' });
    const SortIcon = ({ columnKey }) => domainSortConfig.key !== columnKey ? <ChevronsUpDown size={14} className="opacity-30 ml-1 inline" /> : (domainSortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1 inline text-teal-600" /> : <ChevronDown size={14} className="ml-1 inline text-teal-600" />);

    const sortedDomains = [...viewDomains].sort((a, b) => {
      let aV = a[domainSortConfig.key], bV = b[domainSortConfig.key];
      if (domainSortConfig.key === 'amount') { aV = parseFloat(aV || 0); bV = parseFloat(bV || 0); } 
      else if (domainSortConfig.key === 'companyId') { aV = getCompany(a.companyId)?.name || ''; bV = getCompany(b.companyId)?.name || ''; }
      else if (domainSortConfig.key === 'renewalDate') { aV = parseNextDate(a.cycle, a.renewalDate).getTime(); bV = parseNextDate(b.cycle, b.renewalDate).getTime(); }
      if (aV < bV) return domainSortConfig.direction === 'asc' ? -1 : 1;
      if (aV > bV) return domainSortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
        <div className="mb-6 sm:mb-8 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">{activeDomainTab === 'overview' ? 'Domain Portfolio' : `${currentCompany?.name} Domains`}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-500 flex items-center justify-between">
            <div><div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1"><Globe size={16} className="text-teal-500" /> Active Domains</div><div className="text-3xl font-bold text-slate-800">{activeDomains.length}</div></div>
            <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center"><Globe size={24} className="text-teal-500" /></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-500 flex items-center justify-between">
            <div><div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1"><Landmark size={16} className="text-teal-500" /> Estimated Annual Cost</div><div className="text-3xl font-bold text-slate-800">{formatCurrency(totalDomainCost)}</div></div>
            <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center"><DollarSign size={24} className="text-teal-500" /></div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                      <th className="p-4 cursor-pointer" onClick={() => handleSort('name')}>Domain URL <SortIcon columnKey="name" /></th>
                      {activeDomainTab === 'overview' && <th className="p-4 cursor-pointer" onClick={() => handleSort('companyId')}>Company <SortIcon columnKey="companyId" /></th>}
                      <th className="p-4 cursor-pointer" onClick={() => handleSort('amount')}>Cost <SortIcon columnKey="amount" /></th>
                      <th className="p-4 cursor-pointer" onClick={() => handleSort('autoRenew')}>Auto-Renew <SortIcon columnKey="autoRenew" /></th>
                      <th className="p-4 cursor-pointer" onClick={() => handleSort('renewalDate')}>Renewal Date <SortIcon columnKey="renewalDate" /></th>
                      <th className="p-4 w-12 bg-slate-50"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDomains.map(domain => {
                      const company = getCompany(domain.companyId); const isAutoRenewOn = domain.autoRenew !== false && domain.autoRenew !== 0 && domain.autoRenew !== '0';
                      return (
                        <tr key={domain.id} className={`border-b border-slate-100 hover:bg-slate-50 group ${!isAutoRenewOn ? 'opacity-60' : ''}`}>
                          <td className="p-4 font-bold text-slate-800 cursor-pointer hover:text-teal-600 flex items-center gap-2" onClick={() => openDomainModal(domain)}><Globe size={16} className={isAutoRenewOn ? "text-teal-500" : "text-slate-400"} /><span className={!isAutoRenewOn ? 'line-through' : ''}>{domain.name}</span></td>
                          {activeDomainTab === 'overview' && <td className="p-4"><div className="flex items-center gap-2"><CompanyLogo company={company} sizeClass="w-5 h-5" /><span className="text-sm text-slate-600">{company?.name}</span></div></td>}
                          <td className="p-4 font-medium text-slate-700">{formatCurrency(domain.amount)} <span className="text-xs text-slate-400 font-normal">/{domain.cycle === 'monthly' ? 'mo' : 'yr'}</span></td>
                          <td className="p-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isAutoRenewOn ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{isAutoRenewOn ? 'ON' : 'OFF'}</span></td>
                          <td className="p-4 text-sm font-medium text-slate-600">{isAutoRenewOn ? (domain.renewalDate || '--') : <span className="text-slate-400 font-normal">Manual/Off</span>}</td>
                          <td className="p-4 text-right"><button onClick={() => handleDeleteExpense(domain.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    );
  };

  // MAIN RENDER WITH MODALS
  if (isLoading) return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;
  if (!currentUser) return <AuthScreen />;

  return (
    <>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden flex-col lg:flex-row">
        {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        <div className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out pb-16 lg:pb-0`}><Sidebar /></div>
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
          <TopBar />
          <main className="flex-1 overflow-auto relative pb-16 lg:pb-0">
            {currentApp === 'projects' ? (activeTab === 'mytasks' ? <DashboardView /> : activeTab === 'capacity' ? <TeamCapacityView /> : <ProjectView projectId={activeTab} />) : currentApp === 'budget' ? <BudgetDashboard /> : <DomainsDashboard />}
          </main>
          <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 text-slate-300 flex items-center justify-between px-6 z-50">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -ml-2 transition-colors flex flex-col items-center gap-1">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}<span className="text-[10px] font-medium tracking-wide">{isMobileMenuOpen ? 'Close' : 'Menu'}</span></button>
             <button onClick={openProfileModal} className="p-1 -mr-1 hover:text-white transition-colors flex flex-col items-center gap-1">{currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} className="w-7 h-7 rounded-full border border-slate-600 object-cover" /> : <UserCircle size={28} />}<span className="text-[10px] font-medium tracking-wide">Profile</span></button>
          </div>
        </div>
      </div>

      {/* ALL MODALS */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0"><h3 className="font-bold text-lg text-slate-800">{currentTask.id ? 'Edit Task' : 'Add New Task'}</h3><button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button></div>
            <div className="overflow-y-auto flex-1 p-6">
              <form id="taskForm" onSubmit={handleSaveTask} className="space-y-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label><input required type="text" value={currentTask.title} onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea value={currentTask.description || ''} onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label><input required type="date" value={currentTask.dueDate} onChange={(e) => setCurrentTask({...currentTask, dueDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Status</label><select value={currentTask.status} onChange={(e) => setCurrentTask({...currentTask, status: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg"><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option></select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label><select required value={currentTask.assigneeId} onChange={(e) => setCurrentTask({...currentTask, assigneeId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg"><option value="" disabled>Select</option>{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Weight / Pts</label><input required type="number" min="1" value={currentTask.weight || 1} onChange={(e) => setCurrentTask({...currentTask, weight: parseInt(e.target.value) || 1})} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Tags</label><div className="flex flex-wrap gap-2">{availableTags.map(tag => { const isSelected = (currentTask.tags || []).includes(tag); return (<button key={tag} type="button" onClick={() => setCurrentTask({ ...currentTask, tags: isSelected ? currentTask.tags.filter(t => t !== tag) : [...(currentTask.tags||[]), tag] })} className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${isSelected ? tagStyles[tag] : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>{tag}</button>); })}</div></div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center w-fit gap-2 border border-slate-200"><Paperclip size={16} /> Attach Files<input type="file" multiple className="hidden" onChange={handleFileUpload} /></label>
                  {currentTask.files && currentTask.files.length > 0 && (<ul className="space-y-2 mt-2">{currentTask.files.map((file, idx) => (<li key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 text-sm"><div className="flex items-center gap-2 overflow-hidden"><a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{file.name}</a></div><button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 ml-2"><X size={16} /></button></li>))}</ul>)}
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              {currentTask.id && <button type="button" onClick={() => { handleDeleteTask(currentTask.id); setIsTaskModalOpen(false); }} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
              <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
              <button type="submit" form="taskForm" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border-t-4 border-t-emerald-500 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0"><h3 className="font-bold text-lg flex items-center gap-2"><Receipt className="text-emerald-500" size={20} />{currentExpense.id ? 'Edit Expense' : 'Add Expense'}</h3><button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400"><X size={20} /></button></div>
            <div className="overflow-y-auto p-6 flex-1">
              <form id="expenseForm" onSubmit={handleSaveExpense} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Expense Name</label><input required type="text" value={currentExpense.name} onChange={(e) => setCurrentExpense({...currentExpense, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border"><div><div className="text-sm font-bold">Auto-Renew</div><div className="text-xs text-slate-500">Include in yearly budget</div></div><button type="button" onClick={() => setCurrentExpense({...currentExpense, autoRenew: !currentExpense.autoRenew})} className={currentExpense.autoRenew ? 'text-emerald-500' : 'text-slate-300'}>{currentExpense.autoRenew ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}</button></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Amount ($)</label><input required type="number" step="0.01" value={currentExpense.amount} onChange={(e) => setCurrentExpense({...currentExpense, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Cycle</label><select required value={currentExpense.cycle} onChange={(e) => setCurrentExpense({...currentExpense, cycle: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="monthly">Monthly</option><option value="annual">Annually</option></select></div></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Company</label><select required value={currentExpense.companyId} onChange={(e) => setCurrentExpense({...currentExpense, companyId: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="" disabled>Select</option>{visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label className="block text-sm font-medium mb-1">Category</label><select required value={currentExpense.category} onChange={(e) => setCurrentExpense({...currentExpense, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg">{expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div></div>
                <div><label className="block text-sm font-medium mb-1">Renewal Date (Optional)</label><input type="text" value={currentExpense.renewalDate} onChange={(e) => setCurrentExpense({...currentExpense, renewalDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Notes (Optional)</label><textarea value={currentExpense.notes} onChange={(e) => setCurrentExpense({...currentExpense, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border rounded-lg" /></div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0"><button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-4 py-2 hover:bg-slate-200 rounded-lg">Cancel</button><button type="submit" form="expenseForm" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Save</button></div>
          </div>
        </div>
      )}

      {isDomainModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border-t-4 border-t-teal-500 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0"><h3 className="font-bold text-lg flex items-center gap-2"><Globe className="text-teal-500" size={20} />{currentDomain.id ? 'Edit Domain' : 'Add Domain'}</h3><button onClick={() => setIsDomainModalOpen(false)} className="text-slate-400"><X size={20} /></button></div>
            <div className="overflow-y-auto p-6 flex-1">
              <form id="domainForm" onSubmit={handleSaveDomain} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Domain URL</label><input required type="text" value={currentDomain.name} onChange={(e) => setCurrentDomain({...currentDomain, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border"><div><div className="text-sm font-bold">Auto-Renew</div><div className="text-xs text-slate-500">Include in yearly budget</div></div><button type="button" onClick={() => setCurrentDomain({...currentDomain, autoRenew: !currentDomain.autoRenew})} className={currentDomain.autoRenew ? 'text-teal-500' : 'text-slate-300'}>{currentDomain.autoRenew ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}</button></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Cost ($)</label><input required type="number" step="0.01" value={currentDomain.amount} onChange={(e) => setCurrentDomain({...currentDomain, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Cycle</label><select required value={currentDomain.cycle} onChange={(e) => setCurrentDomain({...currentDomain, cycle: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="annual">Annually</option><option value="monthly">Monthly</option></select></div></div>
                <div><label className="block text-sm font-medium mb-1">Company</label><select required value={currentDomain.companyId} onChange={(e) => setCurrentDomain({...currentDomain, companyId: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="" disabled>Select a company</option>{visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Renewal Date (Optional)</label><input type="text" value={currentDomain.renewalDate} onChange={(e) => setCurrentDomain({...currentDomain, renewalDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Notes / Registrar (Optional)</label><textarea value={currentDomain.notes} onChange={(e) => setCurrentDomain({...currentDomain, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border rounded-lg" /></div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0"><button type="button" onClick={() => setIsDomainModalOpen(false)} className="px-4 py-2 hover:bg-slate-200 rounded-lg">Cancel</button><button type="submit" form="domainForm" className="px-4 py-2 bg-teal-500 text-white rounded-lg">Save</button></div>
          </div>
        </div>
      )}

      {isCompanyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0"><h3 className="font-bold text-lg text-slate-800">{editingCompany.id ? 'Edit Company' : 'Add Company'}</h3><button onClick={() => setIsCompanyModalOpen(false)} className="text-slate-400"><X size={20} /></button></div>
            <form id="companyForm" onSubmit={handleSaveCompany} className="p-6 overflow-y-auto space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {editingCompany.logoUrl ? <img src={editingCompany.logoUrl} className="w-24 h-24 rounded-xl object-cover border-4 border-slate-100 shadow-sm bg-white" /> : <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-sm"><Building2 size={40} className="text-slate-400" /></div>}
                  <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md"><Camera size={16} /><input type="file" accept="image/*" className="hidden" onChange={handleCompanyLogoUpload} /></label>
                </div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Company Name</label><input required type="text" value={editingCompany.name} onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div>
                <label className="block text-sm font-medium mb-2">Team Access</label>
                <div className="flex flex-wrap gap-2">
                  {users.map(user => {
                    const isSelected = editingCompany.userIds && editingCompany.userIds.includes(user.id);
                    return (<button key={user.id} type="button" onClick={() => toggleCompanyUser(user.id)} className={`px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-sm font-medium border ${isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{isSelected ? <CheckCircle2 size={14}/> : <Circle size={14}/>}{(user.name || '').split(' ')[0]}</button>)
                  })}
                </div>
              </div>
            </form>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              {editingCompany.id && <button type="button" onClick={() => handleDeleteCompany(editingCompany.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>}
              <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" form="companyForm" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0"><h3 className="font-bold text-lg text-slate-800">{editingProject.id ? 'Edit Project' : 'Add Project'}</h3><button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400"><X size={20} /></button></div>
            <form id="projectForm" onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-6">
              <div><label className="block text-sm font-medium mb-1">Project Name</label><input required type="text" value={editingProject.name} onChange={(e) => setEditingProject({...editingProject, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <select required value={editingProject.companyId} onChange={(e) => setEditingProject({...editingProject, companyId: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white"><option value="" disabled>Select</option>{visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Theme Color</label>
                <div className="flex flex-wrap gap-3">{availableColors.map(color => <button key={color} type="button" onClick={() => setEditingProject({...editingProject, color})} style={{ backgroundColor: colorStyles[color].hex }} className={`w-8 h-8 rounded-full ${editingProject.color === color ? 'ring-2 ring-slate-400 ring-offset-2 scale-110' : ''}`} />)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2 h-40 overflow-y-auto">{availableIcons.map(iconName => <button key={iconName} type="button" onClick={() => setEditingProject({...editingProject, icon: iconName})} className={`p-2 rounded-lg flex justify-center items-center ${editingProject.icon === iconName ? 'bg-slate-200' : 'hover:bg-slate-100'}`}><DynamicIcon name={iconName} size={20} className={editingProject.icon === iconName ? colorStyles[editingProject.color].text : 'text-slate-600'} /></button>)}</div>
              </div>
            </form>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              {editingProject.id && <button type="button" onClick={() => handleDeleteProject(editingProject.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mr-auto">Delete</button>}
              <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" form="projectForm" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {isTeamModalOpen && currentUser?.isAdmin && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex overflow-hidden">
            <div className="w-1/3 border-r border-slate-100 bg-slate-50 flex flex-col">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18} className="text-blue-600"/> Team</h3><button onClick={() => setEditingTeamMember({ id: null, name: '', email: '', password: '', isAdmin: false, canViewProjects: true, canViewBudget: false, canViewDomains: false })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Plus size={18}/></button></div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {users.map(u => (
                  <button key={u.id} onClick={() => setEditingTeamMember({...u, password: ''})} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${editingTeamMember?.id === u.id ? 'bg-blue-100' : 'hover:bg-white'}`}>
                    {u.avatarUrl ? <img src={u.avatarUrl} className="w-8 h-8 rounded-full object-cover bg-white" /> : <UserCircle size={32} className="text-slate-400" />}
                    <div className="overflow-hidden"><div className="font-semibold text-sm truncate flex items-center gap-1">{u.name} {u.isAdmin && <Shield size={12} className="text-amber-500" title="Admin"/>}</div><div className="text-xs text-slate-500 truncate">{u.email}</div></div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-white relative">
              <button onClick={() => setIsTeamModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"><X size={20}/></button>
              {editingTeamMember ? (
                <div className="p-8 overflow-y-auto flex-1">
                  <h2 className="text-2xl font-bold mb-6">{editingTeamMember.id ? 'Edit Team Member' : 'Invite New Member'}</h2>
                  <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="relative">
                      {editingTeamMember.avatarUrl ? <img src={editingTeamMember.avatarUrl} className="w-24 h-24 rounded-full object-cover shadow-sm bg-white" /> : <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center shadow-sm"><UserCircle size={48} className="text-slate-400" /></div>}
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer shadow-md"><Camera size={14} /><input type="file" accept="image/*" className="hidden" onChange={handleTeamMemberImageUpload} /></label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="block text-sm font-medium mb-1">Full Name</label><input type="text" required value={editingTeamMember.name} onChange={(e) => setEditingTeamMember({...editingTeamMember, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" required value={editingTeamMember.email} onChange={(e) => setEditingTeamMember({...editingTeamMember, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  </div>
                  <div className="mb-8"><label className="block text-sm font-medium mb-1 flex items-center gap-1"><Key size={14} className="text-slate-400"/> {editingTeamMember.id ? 'Reset Password' : 'Set Initial Password'}</label><input type="text" placeholder={editingTeamMember.id ? 'Leave blank to keep current' : 'e.g. Welcome123!'} value={editingTeamMember.password || ''} onChange={(e) => setEditingTeamMember({...editingTeamMember, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <h3 className="font-bold border-b pb-2 mb-4">App Access & Permissions</h3>
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer ${editingTeamMember.isAdmin ? 'bg-amber-50 border-amber-200' : 'bg-white hover:bg-slate-50'}`}>
                      <div><div className="font-bold flex items-center gap-2"><Shield size={16} className={editingTeamMember.isAdmin ? 'text-amber-500' : 'text-slate-400'}/> Master Admin</div><div className="text-xs text-slate-500 mt-1">Can see all companies, all apps, and manage team.</div></div>
                      <button type="button" onClick={() => setEditingTeamMember({...editingTeamMember, isAdmin: !editingTeamMember.isAdmin})} className={editingTeamMember.isAdmin ? 'text-amber-500' : 'text-slate-300'}>{editingTeamMember.isAdmin ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}</button>
                    </label>
                    <div className={`space-y-3 ${editingTeamMember.isAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
                      <label className="flex items-center justify-between p-3 rounded-lg border bg-white cursor-pointer hover:bg-slate-50"><div className="font-medium flex items-center gap-2"><LayoutDashboard size={16} className="text-blue-500"/> Projects App</div><input type="checkbox" className="w-5 h-5 accent-blue-600 rounded" checked={editingTeamMember.canViewProjects} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewProjects: e.target.checked})} /></label>
                      <label className="flex items-center justify-between p-3 rounded-lg border bg-white cursor-pointer hover:bg-slate-50"><div className="font-medium flex items-center gap-2"><Wallet size={16} className="text-emerald-500"/> Budget App</div><input type="checkbox" className="w-5 h-5 accent-emerald-600 rounded" checked={editingTeamMember.canViewBudget} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewBudget: e.target.checked})} /></label>
                      <label className="flex items-center justify-between p-3 rounded-lg border bg-white cursor-pointer hover:bg-slate-50"><div className="font-medium flex items-center gap-2"><Globe size={16} className="text-teal-500"/> Domains App</div><input type="checkbox" className="w-5 h-5 accent-teal-600 rounded" checked={editingTeamMember.canViewDomains} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewDomains: e.target.checked})} /></label>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t flex justify-end"><button onClick={handleSaveTeamMember} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Save Member</button></div>
                </div>
              ) : <div className="flex-1 flex flex-col items-center justify-center text-slate-400"><Users size={64} className="mb-4 opacity-20" /><p>Select a user to edit.</p></div>}
            </div>
          </div>
        </div>
      )}

      {isSwitchUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold flex items-center gap-2"><UserCog size={18}/> Switch Identity</h3><button onClick={() => setIsSwitchUserModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button></div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
               <p className="text-xs text-slate-500 text-center mb-4">Select a user below to test their permissions.</p>
               {users.map(u => (
                 <button key={u.id} onClick={() => { setLoggedInUserId(u.id); setIsSwitchUserModalOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl border ${loggedInUserId === u.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white hover:border-blue-300'}`}>
                   {u.avatarUrl ? <img src={u.avatarUrl} className="w-10 h-10 rounded-full object-cover bg-white" /> : <UserCircle size={40} className="text-slate-300" />}
                   <div className="text-left flex-1"><div className="font-bold flex items-center gap-1">{u.name} {u.isAdmin && <Shield size={12} className="text-amber-500"/>}</div><div className="text-xs text-slate-500">{u.email}</div></div>
                   {loggedInUserId === u.id && <CheckCircle2 size={20} className="text-blue-500" />}
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0"><h3 className="font-bold text-lg text-slate-800">My Profile</h3><button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button></div>
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {profileForm.avatarUrl ? <img src={profileForm.avatarUrl} className="w-24 h-24 rounded-full object-cover shadow-sm bg-white" /> : <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center shadow-sm"><UserCircle size={48} className="text-slate-400" /></div>}
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer shadow-md"><Camera size={14} /><input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} /></label>
                </div>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Full Name</label><input required type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Email Address</label><input required type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled /></div>
                <div><label className="block text-sm font-medium mb-1 flex items-center gap-1"><Key size={14} className="text-slate-400"/> Change Password</label><input type="password" placeholder="Leave blank to keep current password" value={profileForm.password || ''} onChange={(e) => setProfileForm({...profileForm, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
              {!currentUser?.isAdmin && (
                <div className="pt-4 flex justify-center">
                  <button type="button" onClick={() => {
                      const updated = {...currentUser, isAdmin: true, canViewProjects: true, canViewBudget: true, canViewDomains: true};
                      sendToAPI('save_user', updated); setUsers(users.map(u => u.id === currentUser.id ? updated : u));
                    }} className="text-xs text-amber-600 font-bold hover:underline">Force Developer Admin Access</button>
                </div>
              )}
            </form>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between gap-3 flex-shrink-0">
              <button type="button" onClick={() => { setLoggedInUserId(null); setIsProfileModalOpen(false); }} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1"><LogOut size={16}/> Sign Out</button>
              <div className="flex gap-2"><button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 hover:bg-slate-200 rounded-lg">Cancel</button><button onClick={handleSaveProfile} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}