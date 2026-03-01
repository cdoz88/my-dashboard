import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  LayoutDashboard, Briefcase, FolderKanban, ListTodo, KanbanSquare, 
  CalendarClock, Plus, CheckCircle2, Circle, Clock, Trash2, X, Paperclip,
  Building2, Globe, Smartphone, Megaphone, ShoppingCart, Rocket, Code, 
  Monitor, Heart, Star, Users, Settings, Mail, Camera, Box, PenTool, 
  Database, Cloud, FileText, Zap, Compass, MapPin, Coffee, Music, 
  Image as ImageIcon, FileVideo, Shield, Target, Award, Crown, Pencil,
  UserCircle, ImagePlus, Menu, ChevronsUpDown, ChevronUp, ChevronDown,
  Wallet, PieChart, DollarSign, Receipt, Landmark, Upload, RefreshCw, 
  ToggleRight, ToggleLeft, UserCog, LogOut, Key, Youtube, TrendingUp, PlaySquare
} from 'lucide-react';

// API Configuration
const API_URL = 'https://api.fytsolutions.com/api.php';

// --- VISUAL ASSETS (Icons & Colors) ---
const iconMap = { 
  Building2, Globe, Smartphone, Megaphone, ShoppingCart, 
  Rocket, Code, Monitor, Heart, Star, Briefcase, FolderKanban,
  Users, Settings, Mail, Camera, Box, PenTool, Database, Cloud, 
  FileText, Zap, Compass, MapPin, Coffee, Music, ImageIcon, 
  FileVideo, Shield, Target, Award, Crown, Upload, RefreshCw
};
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

const tagStyles = {
  'Urgent': 'bg-red-100 text-red-700 border-red-200',
  'On Hold': 'bg-orange-100 text-orange-700 border-orange-200',
  'Need Info': 'bg-blue-100 text-blue-700 border-blue-200',
  'See Notes': 'bg-slate-100 text-slate-700 border-slate-200',
  'Needs Review': 'bg-purple-100 text-purple-700 border-purple-200',
  'Ready': 'bg-emerald-100 text-emerald-700 border-emerald-200'
};
const availableTags = Object.keys(tagStyles);
const expenseCategories = ['Company Expense', 'Website', 'Tools', 'Domains', 'Social Media', 'Merchandise', 'Personnel', 'Other'];

const DynamicIcon = ({ name, className, size }) => {
  const Icon = iconMap[name] || iconMap['Briefcase'];
  return <Icon className={className} size={size} />;
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Core App State
  const [currentApp, setCurrentApp] = useState('projects'); 
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Database State
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  // YouTube State 
  const [youtubeChannels, setYoutubeChannels] = useState([
    { id: '1', name: 'Dynasty Football', views: '15.0K', watchTime: '907.3', subs: '+73', revenue: '$24.35', realtimeViews: '1,015', realtimeSubs: '18,404' },
    { id: '2', name: 'Second Channel', views: '8.2K', watchTime: '420.1', subs: '+12', revenue: '$12.10', realtimeViews: '450', realtimeSubs: '2,100' },
    { id: '3', name: 'Third Channel', views: '45.1K', watchTime: '1,200.5', subs: '+300', revenue: '$105.00', realtimeViews: '5,000', realtimeSubs: '45,000' },
    { id: '4', name: 'Fourth Channel', views: '1.2K', watchTime: '45.0', subs: '+2', revenue: '$1.05', realtimeViews: '100', realtimeSubs: '500' }
  ]);
  const [activeYoutubeChannelId, setActiveYoutubeChannelId] = useState('1');
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [editingYoutubeChannel, setEditingYoutubeChannel] = useState({ id: null, name: '' });

  // Projects View State
  const [activeTab, setActiveTab] = useState('mytasks'); 
  const [projectDisplayMode, setProjectDisplayMode] = useState('list');
  
  // Budget View State
  const [activeBudgetTab, setActiveBudgetTab] = useState('overview'); 
  const [budgetDisplayMode, setBudgetDisplayMode] = useState('list'); 
  const [expenseSortConfig, setExpenseSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Domains View State
  const [activeDomainTab, setActiveDomainTab] = useState('overview');
  const [domainDisplayMode, setDomainDisplayMode] = useState('list'); 
  const [domainSortConfig, setDomainSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Modal states
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

  // Team Management & Auth States
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [isSwitchUserModalOpen, setIsSwitchUserModalOpen] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(() => localStorage.getItem('loggedInUserId') || null);

  // --- COMPUTE CURRENT USER & PERMISSIONS ---
  const currentUser = users.find(u => u.id === loggedInUserId);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('loggedInUserId', currentUser.id);
    } else {
      localStorage.removeItem('loggedInUserId');
    }
  }, [currentUser]);

  // Ensure user isn't stuck in an app they lost access to
  useEffect(() => {
    if (currentUser) {
      if (currentApp === 'budget' && !currentUser.isAdmin && !currentUser.canViewBudget) setCurrentApp('projects');
      if (currentApp === 'domains' && !currentUser.isAdmin && !currentUser.canViewDomains) setCurrentApp('projects');
    }
  }, [currentUser, currentApp]);

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    fetch(`${API_URL}?action=get_all`)
      .then(res => res.json())
      .then(data => {
        if(data.users) {
           // Parse strings to strict booleans for UI
           const mappedUsers = data.users.map(u => ({
               ...u,
               isAdmin: u.isAdmin == 1 || u.isAdmin === true,
               canViewProjects: u.canViewProjects == 1 || u.canViewProjects === true,
               canViewBudget: u.canViewBudget == 1 || u.canViewBudget === true,
               canViewDomains: u.canViewDomains == 1 || u.canViewDomains === true,
           }));
           setUsers(mappedUsers);
        }
        if(data.companies) setCompanies(data.companies);
        if(data.projects) setProjects(data.projects);
        if(data.tasks) setTasks(data.tasks);
        if(data.expenses) setExpenses(data.expenses);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to connect to API:", err);
        setIsLoading(false);
      });
  }, []);

  // --- API HELPER FUNCTION ---
  const sendToAPI = async (action, data) => {
    try {
      await fetch(`${API_URL}?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error(`Error with ${action}:`, err);
    }
  };

  // --- GODADDY SYNC FUNCTION ---
  const handleSyncGoDaddy = async (companyId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=sync_godaddy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId })
      });
      const data = await response.json();
      
      if (data.error) {
        alert("Sync Failed: " + data.error);
      } else {
        alert(`Successfully synced ${data.count} domains from GoDaddy!`);
        const refresh = await fetch(`${API_URL}?action=get_all`);
        const freshData = await refresh.json();
        if(freshData.expenses) setExpenses(freshData.expenses);
      }
    } catch (err) {
      alert("An error occurred during sync. Check your server connection.");
    }
    setIsLoading(false);
  };

  // --- CSV PARSING ENGINE ---
  const handleImportCSV = (e, companyId, isDomain = false) => {
    const file = e.target.files[0];
    if (!file || !companyId) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      
      let importedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
        const cols = line.split(regex).map(col => col.replace(/^"|"$/g, '').trim());
        
        if (cols.length < 3) continue; 
        
        const name = cols[0];
        if (!name || name === 'What' || name === 'Totals' || name.includes('Total') || name === 'Website' || name === 'Tools') continue;

        let amount = 0;
        let cycle = 'monthly';
        let autoRenew = true;
        
        const col1Str = (cols[1] || '').toLowerCase();
        const col2Str = (cols[2] || '').toLowerCase();
        const notesStr = (cols[7] || cols[6] || '').toLowerCase();

        // Smart check for AR Off
        if (col1Str.includes('ar off') || col2Str.includes('ar off') || notesStr.includes('ar off')) {
            autoRenew = false;
        }
        
        const monthlyStr = col1Str.replace(/[^0-9.]/g, '');
        const annualStr = col2Str.replace(/[^0-9.]/g, '');
        
        if (monthlyStr && parseFloat(monthlyStr) > 0) {
           amount = parseFloat(monthlyStr);
           cycle = 'monthly';
        } else if (annualStr && parseFloat(annualStr) > 0) {
           amount = parseFloat(annualStr);
           cycle = 'annual';
        } else if (autoRenew) {
           continue; 
        } else {
           amount = 0; // It is off and has no explicit amount listed
        }

        const renewalDate = cols[4] || '';
        const notes = cols[7] || cols[6] || '';
        
        let category = isDomain ? 'Domains' : 'Other';
        if (!isDomain) {
           if (name.toLowerCase().includes('.com') || name.toLowerCase().includes('.network')) category = 'Domains';
           else if (amount > 1000) category = 'Company Expense';
           else if (cols[1] && cols[2]) category = 'Website';
           else category = 'Tools';
        }

        const expenseData = {
          id: 'e' + Date.now() + Math.random().toString(36).substr(2, 5),
          companyId: companyId,
          name, amount, cycle, category, renewalDate, notes, autoRenew
        };

        setExpenses(prev => [...prev, expenseData]);
        await sendToAPI('save_expense', expenseData);
        importedCount++;
      }
      
      alert(`Successfully imported ${importedCount} items from the CSV!`);
      e.target.value = null; 
    };
    reader.readAsText(file);
  };

  // --- ACTION FUNCTIONS ---
  const openTaskModal = (task = null, projectId = '', status = 'todo') => {
    if (task) setCurrentTask({ ...task, files: task.files || [], description: task.description || '', tags: task.tags || [], weight: task.weight || 1 });
    else setCurrentTask({ title: '', description: '', dueDate: '', status, projectId, files: [], assigneeId: currentUser?.id, tags: [], weight: 1 });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    const taskData = currentTask.id ? currentTask : { ...currentTask, id: 't' + Date.now(), projectId: currentTask.projectId || activeTab };
    if (currentTask.id) setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    else setTasks([...tasks, taskData]);
    setIsTaskModalOpen(false);
    sendToAPI('save_task', taskData);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    sendToAPI('delete_task', { id: taskId });
  };

  const handleToggleTaskStatus = (task) => {
    const updatedTask = { ...task, status: task.status === 'done' ? 'todo' : 'done' };
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    sendToAPI('save_task', updatedTask);
  };

  const openExpenseModal = (expense = null, companyId = '') => {
    if (expense) setCurrentExpense({...expense, autoRenew: expense.autoRenew !== false && expense.autoRenew !== 0 && expense.autoRenew !== '0'});
    else setCurrentExpense({ id: null, name: '', amount: '', cycle: 'monthly', category: 'Tools', companyId: companyId || companies[0]?.id || '', renewalDate: '', notes: '', autoRenew: true });
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    const expenseData = currentExpense.id ? currentExpense : { ...currentExpense, id: 'e' + Date.now() };
    if (currentExpense.id) setExpenses(expenses.map(exp => exp.id === expenseData.id ? expenseData : exp));
    else setExpenses([...expenses, expenseData]);
    setIsExpenseModalOpen(false);
    sendToAPI('save_expense', expenseData);
  };

  const openDomainModal = (domain = null, companyId = '') => {
    if (domain) setCurrentDomain({...domain, autoRenew: domain.autoRenew !== false && domain.autoRenew !== 0 && domain.autoRenew !== '0'});
    else setCurrentDomain({ id: null, name: '', amount: '', cycle: 'annual', category: 'Domains', companyId: companyId || companies[0]?.id || '', renewalDate: '', notes: '', autoRenew: true });
    setIsDomainModalOpen(true);
  };

  const handleSaveDomain = (e) => {
    e.preventDefault();
    const domainData = currentDomain.id ? currentDomain : { ...currentDomain, id: 'e' + Date.now() };
    if (currentDomain.id) setExpenses(expenses.map(exp => exp.id === domainData.id ? domainData : exp));
    else setExpenses([...expenses, domainData]);
    setIsDomainModalOpen(false);
    sendToAPI('save_expense', domainData);
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses(expenses.filter(e => e.id !== expenseId));
    sendToAPI('delete_expense', { id: expenseId });
  };

  const openCompanyModal = (companyToEdit = null) => {
    if (companyToEdit) setEditingCompany({ ...companyToEdit, userIds: companyToEdit.userIds || [currentUser?.id] });
    else setEditingCompany({ id: null, name: '', logoUrl: '', userIds: [currentUser?.id] });
    setIsCompanyModalOpen(true);
  };

  const toggleCompanyUser = (userId) => {
    if (editingCompany.userIds.includes(userId)) {
      setEditingCompany({ ...editingCompany, userIds: editingCompany.userIds.filter(id => id !== userId) });
    } else {
      setEditingCompany({ ...editingCompany, userIds: [...editingCompany.userIds, userId] });
    }
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (!editingCompany.name.trim()) return;
    const companyData = editingCompany.id ? editingCompany : { ...editingCompany, id: 'c' + Date.now() };
    if (editingCompany.id) setCompanies(companies.map(c => c.id === companyData.id ? companyData : c));
    else setCompanies([...companies, companyData]);
    setIsCompanyModalOpen(false);
    sendToAPI('save_company', companyData);
  };

  const handleDeleteCompany = (companyId) => {
    setCompanies(companies.filter(c => c.id !== companyId));
    setProjects(projects.filter(p => p.companyId !== companyId));
    setExpenses(expenses.filter(e => e.companyId !== companyId));
    if (activeBudgetTab === companyId) setActiveBudgetTab('overview');
    if (activeDomainTab === companyId) setActiveDomainTab('overview');
    setIsCompanyModalOpen(false);
    sendToAPI('delete_company', { id: companyId });
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
    else {
      setProjects([...projects, projectData]);
      setActiveTab(projectData.id);
    }
    setIsProjectModalOpen(false);
    sendToAPI('save_project', projectData);
  };

  const handleDeleteProject = (projectId) => {
     setProjects(projects.filter(p => p.id !== projectId));
     setTasks(tasks.filter(t => t.projectId !== projectId));
     setActiveTab('mytasks');
     setIsProjectModalOpen(false);
     sendToAPI('delete_project', { id: projectId });
  };

  const openYoutubeModal = (channel = null) => {
    if (channel) setEditingYoutubeChannel(channel);
    else setEditingYoutubeChannel({ id: null, name: '' });
    setIsYoutubeModalOpen(true);
  };

  const handleSaveYoutubeChannel = (e) => {
    e.preventDefault();
    if (!editingYoutubeChannel.name.trim()) return;

    const channelData = editingYoutubeChannel.id 
      ? editingYoutubeChannel 
      : { 
          ...editingYoutubeChannel, 
          id: 'yt' + Date.now(),
          views: '0', watchTime: '0.0', subs: '0', revenue: '$0.00', realtimeViews: '0', realtimeSubs: '0'
        };

    if (editingYoutubeChannel.id) {
      setYoutubeChannels(youtubeChannels.map(c => c.id === channelData.id ? channelData : c));
    } else {
      setYoutubeChannels([...youtubeChannels, channelData]);
      setActiveYoutubeChannelId(channelData.id);
    }
    setIsYoutubeModalOpen(false);
  };

  const openProfileModal = () => {
    if(currentUser) {
      setProfileForm({ name: currentUser.name, email: currentUser.email, password: '', avatarUrl: currentUser.avatarUrl });
      setIsProfileModalOpen(true);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { 
        ...currentUser,
        name: profileForm.name, 
        email: profileForm.email, 
        password: profileForm.password, // Only processed by backend if not empty
        avatarUrl: profileForm.avatarUrl 
    };
    
    // Update local state without saving the literal password
    const localUser = { ...updatedUser };
    delete localUser.password;
    
    if (users.find(u => u.id === currentUser.id)) {
      setUsers(users.map(u => u.id === currentUser.id ? localUser : u));
    } else {
      setUsers([...users, localUser]);
    }
    setIsProfileModalOpen(false);
    sendToAPI('save_user', updatedUser);
  };

  const handleSaveTeamMember = (e) => {
    e.preventDefault();
    const userToSave = { ...editingTeamMember };
    if (!userToSave.id) userToSave.id = 'u' + Date.now();
    
    const localUser = { ...userToSave };
    delete localUser.password; // Do not keep password in browser memory
    
    if (users.find(u => u.id === userToSave.id)) {
      setUsers(users.map(u => u.id === userToSave.id ? localUser : u));
    } else {
      setUsers([...users, localUser]);
    }
    
    sendToAPI('save_user', userToSave);
    setEditingTeamMember(null);
  };

  const handleCompanyLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setEditingCompany({ ...editingCompany, logoUrl: base64 });
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setProfileForm({ ...profileForm, avatarUrl: base64 });
    }
  };
  
  const handleTeamMemberImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setEditingTeamMember({ ...editingTeamMember, avatarUrl: base64 });
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedFiles = [];
    for (const file of files) {
      const base64 = await convertToBase64(file);
      uploadedFiles.push({ name: file.name, url: base64 });
    }
    setCurrentTask({ ...currentTask, files: [...(currentTask.files || []), ...uploadedFiles] });
  };

  const removeFile = (indexToRemove) => setCurrentTask({ ...currentTask, files: currentTask.files.filter((_, index) => index !== indexToRemove) });

  const getCompany = (id) => companies.find(c => c.id === id);
  const getProject = (id) => projects.find(p => p.id === id);
  const getUser = (id) => users.find(u => u.id === id);
  
  const isOverdue = (dateStr, status) => {
    if (status === 'done' || !dateStr) return false;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return dateStr < todayStr;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}-${day}-${year.slice(2)}`;
  };

  const calculateProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const totalWeight = projectTasks.reduce((sum, t) => sum + (Number(t.weight) || 1), 0);
    const completedWeight = projectTasks.filter(t => t.status === 'done').reduce((sum, t) => sum + (Number(t.weight) || 1), 0);
    return Math.round((completedWeight / totalWeight) * 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const parseNextDate = (cycle, dateStr) => {
    if (!dateStr) return new Date(9999, 11, 31);
    const today = new Date();
    if (cycle === 'monthly') {
      const match = dateStr.match(/(\d+)/);
      if (match) {
        let day = parseInt(match[1]);
        let nextDate = new Date(today.getFullYear(), today.getMonth(), day);
        if (nextDate < today) nextDate.setMonth(nextDate.getMonth() + 1);
        return nextDate;
      }
    } else if (cycle === 'annual') {
       const nextDate = new Date(`${dateStr} ${today.getFullYear()}`);
       if (!isNaN(nextDate.getTime())) {
         if (nextDate < today) nextDate.setFullYear(nextDate.getFullYear() + 1);
         return nextDate;
       }
    }
    return new Date(9999, 11, 31);
  };

  const TagDisplay = ({ tags, className = "" }) => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {tags.map(tag => (
          <span key={tag} className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${tagStyles[tag] || tagStyles['See Notes']}`}>
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const CompanyLogo = ({ company, sizeClass = "w-5 h-5", textClass = "text-[10px]" }) => {
    if (!company) return null;
    if (company.logoUrl) {
      return <img src={company.logoUrl} alt={company.name} className={`${sizeClass} rounded object-cover flex-shrink-0 shadow-sm border border-slate-200 bg-white`} />;
    }
    return (
      <div className={`${sizeClass} rounded bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center font-bold ${textClass} flex-shrink-0 shadow-sm`}>
        {company.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  const handleDragStart = (e, taskId) => e.dataTransfer.setData('taskId', taskId);
  const handleDrop = (e, newStatus) => {
     const taskId = e.dataTransfer.getData('taskId');
     const task = tasks.find(t => t.id === taskId);
     if(task) {
        const updatedTask = { ...task, status: newStatus };
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
        sendToAPI('save_task', updatedTask);
     }
  };
  const handleDragOver = (e) => e.preventDefault();

  // --- ENFORCE PERMISSIONS ON COMPANIES ---
  const visibleCompanies = companies.filter(c => currentUser?.isAdmin || (c.userIds && c.userIds.includes(currentUser?.id)));

  // --- INTERNAL COMPONENTS ---
  const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleAuth = async (e) => {
      e.preventDefault();
      
      if (isRegistering) {
        if (!name.trim() || !email.trim() || !password.trim()) return;
        
        const isFirstUser = users.length === 0;
        const newUser = {
           id: 'u' + Date.now(),
           name: name,
           email: email.toLowerCase(),
           password: password, 
           isAdmin: isFirstUser, 
           canViewProjects: true,
           canViewBudget: isFirstUser,
           canViewDomains: isFirstUser,
           avatarUrl: ''
        };
        
        const localUser = { ...newUser };
        delete localUser.password;
        
        setUsers([...users, localUser]);
        setLoggedInUserId(localUser.id);
        await sendToAPI('save_user', newUser);
        
      } else {
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!existingUser) {
          setIsRegistering(true);
          return;
        }
        
        // Authenticate with server
        try {
          const response = await fetch(`${API_URL}?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.toLowerCase(), password: password })
          });
          const data = await response.json();
          
          if (data.error) {
            alert(data.error);
          } else {
            setLoggedInUserId(data.user.id);
            setUsers(users.map(u => u.id === data.user.id ? data.user : u));
          }
        } catch (err) {
          alert("Could not connect to the authentication server.");
        }
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-600/20">
            <LayoutDashboard size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 text-center mb-2">Control Room</h1>
          <p className="text-slate-500 text-center mb-8">
            {isRegistering ? "It looks like you're new! Let's get you set up." : "Enter your credentials to sign in."}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                  placeholder="John Doe" 
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                placeholder="you@company.com" 
                disabled={isRegistering && email !== ''}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                placeholder="••••••••" 
              />
            </div>
            <button type="submit" className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-md transition-colors mt-4">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {isRegistering && (
            <button onClick={() => setIsRegistering(false)} className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700 font-medium">
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    );
  };

  const TopBar = () => {
    const isProjectView = currentApp === 'projects' && activeTab !== 'mytasks' && activeTab !== 'capacity';
    const isBudgetView = currentApp === 'budget';
    const isDomainView = currentApp === 'domains';
    
    return (
      <header className={`${currentApp === 'projects' ? 'bg-blue-600' : currentApp === 'budget' ? 'bg-emerald-600' : currentApp === 'youtube' ? 'bg-red-600' : 'bg-teal-500'} text-white h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-md z-40 w-full transition-colors duration-300`}>
        <div className="relative">
          <button 
            onClick={() => setIsAppSwitcherOpen(!isAppSwitcherOpen)}
            className={`flex items-center gap-2 font-bold text-xl tracking-tight px-2 py-1.5 -ml-2 rounded-lg transition-colors ${currentApp === 'projects' ? 'hover:bg-blue-700' : currentApp === 'budget' ? 'hover:bg-emerald-700' : currentApp === 'youtube' ? 'hover:bg-red-700' : 'hover:bg-teal-600'}`}
          >
            {currentApp === 'projects' ? (
              <LayoutDashboard size={24} className="text-white/70" />
            ) : currentApp === 'budget' ? (
              <Wallet size={24} className="text-white/70" />
            ) : currentApp === 'youtube' ? (
              <Youtube size={24} className="text-white/70" />
            ) : (
              <Globe size={24} className="text-white/70" />
            )}
            <span className="capitalize">{currentApp === 'youtube' ? 'YouTube Studio' : currentApp}</span>
            <ChevronsUpDown size={18} className="text-white/60 ml-1" />
          </button>

          {isAppSwitcherOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsAppSwitcherOpen(false)} />
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1">
                {(currentUser.isAdmin || currentUser.canViewProjects) && (
                  <button 
                    onClick={() => { setCurrentApp('projects'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'projects' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className={`p-1.5 rounded-md ${currentApp === 'projects' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      <LayoutDashboard size={18} />
                    </div>
                    Projects
                  </button>
                )}
                {(currentUser.isAdmin || currentUser.canViewBudget) && (
                  <button 
                    onClick={() => { setCurrentApp('budget'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'budget' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className={`p-1.5 rounded-md ${currentApp === 'budget' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Wallet size={18} />
                    </div>
                    Budget
                  </button>
                )}
                {(currentUser.isAdmin || currentUser.canViewDomains) && (
                  <button 
                    onClick={() => { setCurrentApp('domains'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'domains' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className={`p-1.5 rounded-md ${currentApp === 'domains' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Globe size={18} />
                    </div>
                    Domains
                  </button>
                )}
                {/* Relying on generic permission to view YouTube, we can add custom permission later */}
                {(currentUser.isAdmin || currentUser.canViewProjects) && ( 
                  <button 
                    onClick={() => { setCurrentApp('youtube'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'youtube' ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className={`p-1.5 rounded-md ${currentApp === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Youtube size={18} />
                    </div>
                    YouTube
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {isProjectView && (
             <>
               <div className="flex bg-blue-700/50 rounded-lg p-1 border border-blue-500/50">
                  <button onClick={() => setProjectDisplayMode('list')} className={`p-1.5 rounded-md transition-colors ${projectDisplayMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-500/50'}`}><ListTodo size={16} /></button>
                  <button onClick={() => setProjectDisplayMode('kanban')} className={`p-1.5 rounded-md transition-colors ${projectDisplayMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-500/50'}`}><KanbanSquare size={16} /></button>
                  <button onClick={() => setProjectDisplayMode('timeline')} className={`p-1.5 rounded-md transition-colors ${projectDisplayMode === 'timeline' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-500/50'}`}><CalendarClock size={16} /></button>
               </div>
               <button onClick={() => openTaskModal(null, activeTab, 'todo')} className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
                 <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Task</span>
               </button>
             </>
          )}
          {isBudgetView && (
             <>
               <div className="flex bg-emerald-700/50 rounded-lg p-1 border border-emerald-500/50">
                  <button onClick={() => setBudgetDisplayMode('list')} className={`p-1.5 rounded-md transition-colors ${budgetDisplayMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-emerald-100 hover:text-white hover:bg-emerald-500/50'}`}><ListTodo size={16} /></button>
                  <button onClick={() => setBudgetDisplayMode('timeline')} className={`p-1.5 rounded-md transition-colors ${budgetDisplayMode === 'timeline' ? 'bg-white text-emerald-600 shadow-sm' : 'text-emerald-100 hover:text-white hover:bg-emerald-500/50'}`}><CalendarClock size={16} /></button>
               </div>
               <label className={`${activeBudgetTab === 'overview' ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer'} text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors`} title="Import Expenses from CSV">
                 <Upload size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Import</span>
                 <input type="file" accept=".csv" className="hidden" disabled={activeBudgetTab === 'overview'} onClick={(e) => { if(activeBudgetTab === 'overview') { e.preventDefault(); alert("Please select a specific company from the left sidebar before importing."); } }} onChange={(e) => handleImportCSV(e, activeBudgetTab, false)} />
               </label>
               <button 
                 onClick={() => openExpenseModal(null, activeBudgetTab === 'overview' ? '' : activeBudgetTab)} 
                 className="bg-white text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors"
               >
                 <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Expense</span>
               </button>
             </>
          )}
          {isDomainView && (
             <>
               <div className="flex bg-teal-700/50 rounded-lg p-1 border border-teal-500/50">
                  <button onClick={() => setDomainDisplayMode('list')} className={`p-1.5 rounded-md transition-colors ${domainDisplayMode === 'list' ? 'bg-white text-teal-600 shadow-sm' : 'text-teal-100 hover:text-white hover:bg-teal-500/50'}`}><ListTodo size={16} /></button>
                  <button onClick={() => setDomainDisplayMode('timeline')} className={`p-1.5 rounded-md transition-colors ${domainDisplayMode === 'timeline' ? 'bg-white text-teal-600 shadow-sm' : 'text-teal-100 hover:text-white hover:bg-teal-500/50'}`}><CalendarClock size={16} /></button>
               </div>
               {activeDomainTab !== 'overview' && (
                 <button 
                   onClick={() => handleSyncGoDaddy(activeDomainTab)}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                   title="Sync with GoDaddy API"
                 >
                   <RefreshCw size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Sync</span>
                 </button>
               )}
               <label className={`${activeDomainTab === 'overview' ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-700 hover:bg-teal-800 cursor-pointer'} text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors`} title="Import Domains from CSV">
                 <Upload size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">CSV</span>
                 <input type="file" accept=".csv" className="hidden" disabled={activeDomainTab === 'overview'} onClick={(e) => { if(activeDomainTab === 'overview') { e.preventDefault(); alert("Please select a specific company from the left sidebar before importing."); } }} onChange={(e) => handleImportCSV(e, activeDomainTab, true)} />
               </label>
               <button 
                 onClick={() => openDomainModal(null, activeDomainTab === 'overview' ? '' : activeDomainTab)} 
                 className="bg-white text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors"
               >
                 <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Add</span>
               </button>
             </>
          )}
        </div>
      </header>
    );
  };

  const Sidebar = () => {
    return (
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shadow-xl flex-shrink-0">
        <div className="p-5 border-b border-slate-700 flex justify-center items-center lg:hidden">
          <h1 className="text-xl font-bold text-white flex items-center gap-2 capitalize">{currentApp} Menu</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          {currentApp === 'projects' && (
            <>
              <div className="px-4 mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Global</p>
                <div className="space-y-1">
                  <button 
                    onClick={() => { setActiveTab('mytasks'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'mytasks' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
                  >
                    <CheckCircle2 size={18} />
                    My Tasks
                  </button>
                  <button 
                    onClick={() => { setActiveTab('capacity'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'capacity' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
                  >
                    <Users size={18} />
                    Team Capacity
                  </button>
                </div>
              </div>

              <div className="px-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Companies</p>
                  {currentUser?.isAdmin && (
                    <button onClick={() => openCompanyModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Company">
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                
                {visibleCompanies.map(company => (
                  <div key={company.id} className="mb-4">
                    <div className="flex items-center justify-between mb-1 px-1 group/company">
                      <div className="flex items-center gap-2 text-slate-400 truncate pr-2">
                        <CompanyLogo company={company} />
                        <span className="font-medium text-sm text-slate-200 truncate">{company.name}</span>
                      </div>
                      {currentUser?.isAdmin && (
                        <div className="flex items-center flex-shrink-0 opacity-0 group-hover/company:opacity-100 transition-opacity">
                          <button onClick={() => openCompanyModal(company)} className="text-slate-500 hover:text-white p-1" title="Edit Company"><Pencil size={12} /></button>
                          <button onClick={() => openProjectModal(company.id)} className="text-slate-500 hover:text-white p-1 ml-0.5" title="Add Project"><Plus size={14} /></button>
                        </div>
                      )}
                    </div>
                    <div className="pl-4 flex flex-col gap-0.5">
                      {projects.filter(p => p.companyId === company.id).map(project => (
                        <div key={project.id} className="flex items-center justify-between group/project">
                          <button
                            onClick={() => { setActiveTab(project.id); setIsMobileMenuOpen(false); }}
                            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors overflow-hidden ${activeTab === project.id ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}
                          >
                            <DynamicIcon name={project.icon} size={14} className={`flex-shrink-0 ${activeTab === project.id ? colorStyles[project.color]?.text : ''}`} />
                            <div className="flex-1 flex flex-col items-start overflow-hidden w-full">
                               <span className="truncate w-full text-left">{project.name}</span>
                               <div className="w-full bg-slate-700/50 h-1 mt-1 rounded-full overflow-hidden">
                                 <div className={`h-full ${colorStyles[project.color]?.bar} transition-all duration-500`} style={{ width: `${calculateProjectProgress(project.id)}%` }} />
                               </div>
                            </div>
                          </button>
                          {currentUser?.isAdmin && (
                            <button onClick={(e) => { e.stopPropagation(); openProjectModal('', project); }} className="text-slate-500 hover:text-white opacity-0 group-hover/project:opacity-100 transition-all p-1.5 flex-shrink-0" title="Edit Project">
                              <Pencil size={12} />
                            </button>
                          )}
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
              <div className="px-4 mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Finance</p>
                <button 
                  onClick={() => { setActiveBudgetTab('overview'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeBudgetTab === 'overview' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                >
                  <PieChart size={18} />
                  All Budgets
                </button>
              </div>
              
              <div className="px-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>
                  {currentUser?.isAdmin && (
                    <button onClick={() => openCompanyModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Company">
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {visibleCompanies.map(company => (
                    <div key={company.id} className="flex items-center justify-between group/company">
                      <button
                        onClick={() => { setActiveBudgetTab(company.id); setIsMobileMenuOpen(false); }}
                        className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeBudgetTab === company.id ? 'bg-slate-800 text-emerald-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}
                      >
                        <CompanyLogo company={company} sizeClass="w-5 h-5" />
                        <span className="truncate">{company.name}</span>
                      </button>
                      {currentUser?.isAdmin && (
                        <div className="flex items-center flex-shrink-0 opacity-0 group-hover/company:opacity-100 transition-opacity ml-1">
                          <button onClick={(e) => { e.stopPropagation(); openCompanyModal(company); }} className="text-slate-500 hover:text-white p-1" title="Edit Company"><Pencil size={12} /></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentApp === 'domains' && (
            <>
              <div className="px-4 mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Portfolio</p>
                <button 
                  onClick={() => { setActiveDomainTab('overview'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeDomainTab === 'overview' ? 'bg-teal-500 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                >
                  <Globe size={18} />
                  All Domains
                </button>
              </div>
              
              <div className="px-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>
                  {currentUser?.isAdmin && (
                    <button onClick={() => openCompanyModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Company">
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {visibleCompanies.map(company => (
                    <div key={company.id} className="flex items-center justify-between group/company">
                      <button
                        onClick={() => { setActiveDomainTab(company.id); setIsMobileMenuOpen(false); }}
                        className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeDomainTab === company.id ? 'bg-slate-800 text-teal-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}
                      >
                        <CompanyLogo company={company} sizeClass="w-5 h-5" />
                        <span className="truncate">{company.name}</span>
                      </button>
                      {currentUser?.isAdmin && (
                        <div className="flex items-center flex-shrink-0 opacity-0 group-hover/company:opacity-100 transition-opacity ml-1">
                          <button onClick={(e) => { e.stopPropagation(); openCompanyModal(company); }} className="text-slate-500 hover:text-white p-1" title="Edit Company"><Pencil size={12} /></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentApp === 'youtube' && (
            <>
              <div className="px-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Channels</p>
                  {currentUser?.isAdmin && (
                    <button onClick={() => openYoutubeModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Channel">
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {youtubeChannels.map(channel => (
                    <div key={channel.id} className="flex items-center justify-between group/channel">
                      <button
                        onClick={() => { setActiveYoutubeChannelId(channel.id); setIsMobileMenuOpen(false); }}
                        className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm overflow-hidden ${activeYoutubeChannelId === channel.id ? 'bg-slate-800 text-red-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}
                      >
                        <Youtube size={16} className={`flex-shrink-0 ${activeYoutubeChannelId === channel.id ? 'text-red-500' : 'text-slate-500'}`} />
                        <span className="truncate">{channel.name}</span>
                      </button>
                      {currentUser?.isAdmin && (
                        <div className="flex items-center flex-shrink-0 opacity-0 group-hover/channel:opacity-100 transition-opacity ml-1">
                          <button onClick={(e) => { e.stopPropagation(); openYoutubeModal(channel); }} className="text-slate-500 hover:text-white p-1" title="Edit Channel"><Pencil size={12} /></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <button 
            onClick={openProfileModal}
            className="flex-1 flex items-center gap-3 px-2 py-2 rounded-lg transition-colors hover:bg-slate-800 text-slate-300 hover:text-white group overflow-hidden"
          >
            {currentUser?.avatarUrl ? (
               <img src={currentUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-600 flex-shrink-0 bg-white" />
            ) : (
               <UserCircle size={28} className="text-slate-500 group-hover:text-slate-400 flex-shrink-0" />
            )}
            <div className="flex flex-col items-start truncate text-left pr-2">
              <span className="font-bold text-sm truncate w-full flex items-center gap-1.5 text-slate-200 group-hover:text-white transition-colors">
                {currentUser?.name.split(' ')[0]}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 truncate w-full ${currentUser?.isAdmin ? 'text-amber-500' : 'text-blue-400'}`}>
                {currentUser?.isAdmin ? 'Workspace Admin' : 'Team Member'}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1">
            {currentUser?.isAdmin && (
               <button onClick={() => setIsTeamModalOpen(true)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Manage Team Permissions">
                  <Users size={16} />
               </button>
            )}
            <button onClick={() => setIsSwitchUserModalOpen(true)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Switch User (Test Mode)">
               <UserCog size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DashboardView = () => {
    const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id);
    const activeTasks = myTasks.filter(t => t.status !== 'done').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const completedTasks = myTasks.filter(t => t.status === 'done').sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

    const renderDesktopRow = (task) => {
      const project = getProject(task.projectId);
      const company = project ? getCompany(project.companyId) : null;
      const taskIsOverdue = isOverdue(task.dueDate, task.status);
      
      return (
        <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
          <td className="p-4 cursor-pointer w-12 pr-1" onClick={() => handleToggleTaskStatus(task)}>
            {task.status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}
          </td>
          <td className="py-4 px-2 w-8">
            <div className={`w-2.5 h-2.5 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} title={task.status} />
          </td>
          <td 
            className={`p-4 font-medium cursor-pointer transition-colors ${task.status === 'done' ? 'text-slate-400 line-through hover:text-blue-400' : 'text-slate-700 hover:text-blue-600'}`}
            onClick={() => openTaskModal(task)}
          >
            <div>{task.title}</div>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <TagDisplay tags={task.tags} />
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200" title="Task Weight / Points">
                 <Star size={10}/> {task.weight || 1} pts
              </span>
            </div>
          </td>
          <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
            {project && company && (
              <div className={`flex items-center gap-2 ${task.status === 'done' ? 'opacity-50 grayscale' : ''}`}>
                <CompanyLogo company={company} sizeClass="w-6 h-6" textClass="text-[10px]" />
                <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-md border ${colorStyles[project.color]?.bg} ${colorStyles[project.color]?.border} ${colorStyles[project.color]?.text}`}>
                  <DynamicIcon name={project.icon} size={14} />
                  {project.name}
                </span>
              </div>
            )}
          </td>
          <td className={`p-4 text-sm flex items-center justify-between whitespace-nowrap ${taskIsOverdue ? 'text-red-500 font-bold' : 'text-slate-600'} ${task.status === 'done' ? 'text-slate-400' : ''}`}>
            <span className="flex items-center gap-1">
              <Clock size={14} className={taskIsOverdue ? 'text-red-500' : 'text-slate-400'} />
              {formatDate(task.dueDate)}
            </span>
            <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-4">
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      );
    };

    const renderMobileCard = (task) => {
      const project = getProject(task.projectId);
      const company = project ? getCompany(project.companyId) : null;
      const taskIsOverdue = isOverdue(task.dueDate, task.status);
      
      return (
        <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors group">
          <div className="flex items-start gap-2.5 mb-2">
            <button className="mt-0.5 flex-shrink-0" onClick={() => handleToggleTaskStatus(task)}>
              {task.status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}
            </button>
            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} />
            <div 
              className={`flex-1 font-medium cursor-pointer transition-colors leading-tight pt-0.5 ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 hover:text-blue-600'}`}
              onClick={() => openTaskModal(task)}
            >
              {task.title}
            </div>
          </div>
          
          <div className="pl-8 flex flex-wrap items-center gap-x-3 gap-y-2">
            <TagDisplay tags={task.tags} />
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200">
               <Star size={10}/> {task.weight || 1} pts
            </span>
            {project && company && (
              <div className={`flex items-center gap-1.5 ${task.status === 'done' ? 'opacity-50 grayscale' : ''}`}>
                <CompanyLogo company={company} sizeClass="w-5 h-5" textClass="text-[8px]" />
                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${colorStyles[project.color]?.bg} ${colorStyles[project.color]?.border} ${colorStyles[project.color]?.text}`}>
                  <DynamicIcon name={project.icon} size={10} />
                  <span className="truncate max-w-[120px]">{project.name}</span>
                </span>
              </div>
            )}
            <div className={`text-xs flex items-center gap-1 whitespace-nowrap ml-auto ${taskIsOverdue ? 'text-red-500 font-bold' : 'text-slate-500'} ${task.status === 'done' ? 'text-slate-400' : ''}`}>
              <Clock size={12} className={taskIsOverdue ? 'text-red-500' : 'text-slate-400'} />
              {formatDate(task.dueDate)}
            </div>
            <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="p-4 sm:p-8 h-full overflow-y-auto w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Tasks</h2>
        
        {/* ACTIVE TASKS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="md:hidden flex flex-col divide-y divide-slate-100">
             {activeTasks.length > 0 ? activeTasks.map(renderMobileCard) : <div className="p-8 text-center text-slate-500 text-sm">No active tasks assigned to you.</div>}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="p-4 w-12 pr-1"></th>
                  <th className="py-4 px-2 w-8"></th>
                  <th className="p-4">Task</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {activeTasks.length > 0 ? activeTasks.map(renderDesktopRow) : (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">No active tasks assigned to you.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* COMPLETED TASKS */}
        {completedTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-medium">Completed</span>
              <span className="text-slate-400 text-sm">{completedTasks.length} tasks</span>
            </div>
            <div className="bg-white/60 rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
               <div className="md:hidden flex flex-col divide-y divide-slate-100">
                  {completedTasks.map(renderMobileCard)}
               </div>
               <div className="hidden md:block overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[600px]">
                   <tbody>
                     {completedTasks.map(renderDesktopRow)}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ProjectView = ({ projectId }) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const activeProjectTasks = projectTasks.filter(t => t.status !== 'done').sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
    const completedProjectTasks = projectTasks.filter(t => t.status === 'done').sort((a,b) => new Date(b.dueDate) - new Date(a.dueDate));
    
    const currentProject = getProject(projectId);
    const currentCompany = getCompany(currentProject?.companyId);
    const progress = calculateProjectProgress(projectId);

    const renderProjectDesktopRow = (task) => {
      const assignee = getUser(task.assigneeId);
      const taskIsOverdue = isOverdue(task.dueDate, task.status);
      return (
        <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 group">
          <td className="p-4 cursor-pointer w-12 pr-1" onClick={() => handleToggleTaskStatus(task)}>
            {task.status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}
          </td>
          <td className="py-4 px-2 w-8">
            <div className={`w-2.5 h-2.5 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} title={task.status} />
          </td>
          <td className={`p-4 font-medium cursor-pointer transition-colors ${task.status === 'done' ? 'text-slate-400 line-through hover:text-blue-400' : 'text-slate-700 hover:text-blue-600'}`} onClick={() => openTaskModal(task)}>
            <div>{task.title}</div>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <TagDisplay tags={task.tags} />
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200" title="Task Weight / Points">
                 <Star size={10}/> {task.weight || 1} pts
              </span>
            </div>
          </td>
          <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
            {assignee && (
              <span className={`flex items-center gap-1.5 ${task.status === 'done' ? 'opacity-60 grayscale' : ''}`}>
                {assignee.avatarUrl ? <img src={assignee.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover" /> : <UserCircle size={16} className="text-slate-400" />}
                {assignee.name.split(' ')[0]}
              </span>
            )}
          </td>
          <td className={`p-4 text-sm flex items-center justify-between whitespace-nowrap ${taskIsOverdue ? 'text-red-500 font-bold' : 'text-slate-600'} ${task.status === 'done' ? 'text-slate-400' : ''}`}>
            <span>{formatDate(task.dueDate)}</span>
            <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-4">
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      );
    };

    const renderProjectMobileCard = (task) => {
      const assignee = getUser(task.assigneeId);
      const taskIsOverdue = isOverdue(task.dueDate, task.status);

      return (
        <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors group">
          <div className="flex items-start gap-2.5 mb-2">
            <button className="mt-0.5 flex-shrink-0" onClick={() => handleToggleTaskStatus(task)}>
              {task.status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}
            </button>
            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} />
            <div 
              className={`flex-1 font-medium cursor-pointer transition-colors leading-tight pt-0.5 ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 hover:text-blue-600'}`}
              onClick={() => openTaskModal(task)}
            >
              {task.title}
            </div>
          </div>
          
          <div className="pl-8 flex flex-wrap items-center gap-x-3 gap-y-2">
            <TagDisplay tags={task.tags} />
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200">
               <Star size={10}/> {task.weight || 1} pts
            </span>
            {assignee && (
              <span className={`flex items-center gap-1.5 text-xs font-medium ${task.status === 'done' ? 'text-slate-400' : 'text-slate-600'}`}>
                {assignee.avatarUrl ? (
                   <img src={assignee.avatarUrl} alt="Avatar" className={`w-4 h-4 rounded-full object-cover ${task.status === 'done' ? 'grayscale opacity-60' : ''}`} />
                ) : (
                   <UserCircle size={14} className={task.status === 'done' ? 'text-slate-300' : 'text-slate-400'} />
                )}
                {assignee.name.split(' ')[0]}
              </span>
            )}
            <div className={`text-xs flex items-center gap-1 whitespace-nowrap ml-auto ${taskIsOverdue ? 'text-red-500 font-bold' : 'text-slate-500'} ${task.status === 'done' ? 'text-slate-400' : ''}`}>
              <Clock size={12} className={taskIsOverdue ? 'text-red-500' : 'text-slate-400'} />
              {formatDate(task.dueDate)}
            </div>
            <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
               {currentProject && <DynamicIcon name={currentProject.icon} size={24} className={colorStyles[currentProject.color]?.text} />}
               {currentProject?.name || 'Unknown Project'}
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <CompanyLogo company={currentCompany} sizeClass="w-5 h-5" />
               <p className="text-slate-500 text-sm font-medium">{currentCompany?.name || 'Unknown Company'}</p>
            </div>
          </div>
          <div className="w-full sm:w-64 bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1.5">
             <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-600">Project Progress</span>
                <span className={`font-bold ${currentProject ? colorStyles[currentProject.color]?.text : 'text-slate-700'}`}>{progress}%</span>
             </div>
             <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${currentProject ? colorStyles[currentProject.color]?.bar : 'bg-slate-500'} transition-all duration-700`} style={{ width: `${progress}%` }} />
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {projectDisplayMode === 'list' && (
            <div className="h-full overflow-y-auto pr-1 pb-8">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                 <div className="md:hidden flex flex-col divide-y divide-slate-100">
                    {activeProjectTasks.length > 0 ? activeProjectTasks.map(renderProjectMobileCard) : <div className="p-8 text-center text-slate-500 text-sm">No active tasks in this project.</div>}
                 </div>
                 <div className="hidden md:block overflow-x-auto">
                   <table className="w-full text-left min-w-[600px]">
                     <thead>
                       <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                         <th className="p-4 w-12 pr-1"></th>
                         <th className="py-4 px-2 w-8"></th>
                         <th className="p-4">Task Name</th>
                         <th className="p-4">Assignee</th>
                         <th className="p-4">Due Date</th>
                       </tr>
                     </thead>
                     <tbody>
                       {activeProjectTasks.length > 0 ? activeProjectTasks.map(renderProjectDesktopRow) : (
                         <tr><td colSpan="5" className="p-8 text-center text-slate-500">No active tasks in this project.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>

               {completedProjectTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-medium">Completed</span>
                      <span className="text-slate-400 text-sm">{completedProjectTasks.length} tasks</span>
                    </div>
                    <div className="bg-white/60 rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                      <div className="md:hidden flex flex-col divide-y divide-slate-100">
                         {completedProjectTasks.map(renderProjectMobileCard)}
                      </div>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                          <tbody>
                            {completedProjectTasks.map(renderProjectDesktopRow)}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
               )}
            </div>
          )}

          {projectDisplayMode === 'kanban' && (
            <div className="flex gap-6 h-full overflow-x-auto pb-4">
              {['todo', 'in-progress', 'done'].map(status => (
                <div 
                  key={status} 
                  className="bg-slate-100 rounded-xl w-80 min-w-[20rem] p-4 flex flex-col h-full border border-slate-200"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <div className="flex justify-between items-center mb-4 px-2">
                    <h3 className="font-semibold text-slate-700 capitalize">
                      {status === 'in-progress' ? 'In Progress' : status}
                    </h3>
                    <span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2 rounded-full font-medium">
                      {projectTasks.filter(t => t.status === status).length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {projectTasks.filter(t => t.status === status).map(task => {
                      const assignee = getUser(task.assigneeId);
                      const taskIsOverdue = isOverdue(task.dueDate, task.status);
                      return (
                        <div 
                          key={task.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          className={`bg-white p-4 rounded-lg shadow-sm border cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors group ${taskIsOverdue ? 'border-red-200' : 'border-slate-200'}`}
                        >
                          <p 
                            className={`font-medium text-sm mb-2 cursor-pointer group-hover:text-blue-600 transition-colors ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                            onClick={() => openTaskModal(task)}
                          >
                            {task.title}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                             <TagDisplay tags={task.tags} />
                             <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200">
                               <Star size={10}/> {task.weight || 1}
                             </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-500">
                             <div className="flex items-center gap-2">
                               <span className={`flex items-center gap-1 px-2 py-1 rounded font-medium ${taskIsOverdue ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                                 <Clock size={12} /> {formatDate(task.dueDate)}
                               </span>
                               {assignee && (
                                 <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-1 rounded" title={assignee.name}>
                                   {assignee.avatarUrl ? (
                                      <img src={assignee.avatarUrl} alt="Avatar" className="w-4 h-4 rounded-full object-cover" />
                                   ) : (
                                      <UserCircle size={12} />
                                   )}
                                   <span className="max-w-[60px] truncate">{assignee.name.split(' ')[0]}</span>
                                 </span>
                               )}
                             </div>
                             <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1">
                               <Trash2 size={14} />
                             </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <button 
                    onClick={() => openTaskModal(null, projectId, status)}
                    className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:bg-slate-200 rounded-lg transition-colors border border-dashed border-slate-300"
                  >
                    <Plus size={16} /> Add Task
                  </button>
                </div>
              ))}
            </div>
          )}

          {projectDisplayMode === 'timeline' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
               <div className="relative border-l-2 border-blue-100 ml-3 space-y-8">
                  {projectTasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).map(task => {
                    const assignee = getUser(task.assigneeId);
                    const taskIsOverdue = isOverdue(task.dueDate, task.status);
                    return (
                      <div key={task.id} className="relative pl-8">
                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                        <div className={`p-4 rounded-lg border hover:shadow-md transition-shadow group ${taskIsOverdue ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-start gap-2.5 mb-2">
                            <button className="mt-0.5 flex-shrink-0" onClick={() => handleToggleTaskStatus(task)}>
                              {task.status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-blue-500" />}
                            </button>
                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                            <div 
                              className={`flex-1 font-medium cursor-pointer transition-colors leading-tight pt-0.5 ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 hover:text-blue-600'}`}
                              onClick={() => openTaskModal(task)}
                            >
                              {task.title}
                            </div>
                          </div>
                          
                          <div className="pl-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                            <TagDisplay tags={task.tags} />
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border bg-slate-50 text-slate-500 border-slate-200">
                               <Star size={10}/> {task.weight || 1} pts
                            </span>
                            {assignee && (
                              <span className={`flex items-center gap-1.5 text-xs font-medium ${task.status === 'done' ? 'text-slate-400' : 'text-slate-600'}`}>
                                {assignee.avatarUrl ? (
                                   <img src={assignee.avatarUrl} alt="Avatar" className={`w-4 h-4 rounded-full object-cover ${task.status === 'done' ? 'grayscale opacity-60' : ''}`} />
                                ) : (
                                   <UserCircle size={14} className={task.status === 'done' ? 'text-slate-300' : 'text-slate-400'} />
                                )}
                                {assignee.name.split(' ')[0]}
                              </span>
                            )}
                            <div className={`text-xs flex items-center gap-1 whitespace-nowrap ml-auto ${taskIsOverdue ? 'text-red-500 font-bold' : 'text-slate-500'} ${task.status === 'done' ? 'text-slate-400' : ''}`}>
                              <Clock size={12} className={taskIsOverdue ? 'text-red-500' : 'text-slate-400'} />
                              {formatDate(task.dueDate)}
                            </div>
                            <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <Trash2 size={14} />
                            </button>
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

  const TeamCapacityView = () => {
    return (
      <div className="p-4 sm:p-8 h-full overflow-y-auto w-full bg-slate-50/50">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Users className="text-blue-600" size={24} />
             Team Capacity Dashboard
          </h2>
          <p className="text-slate-500 text-sm mt-1">Review active workload and point distributions across the team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map(user => {
            const userActiveTasks = tasks.filter(t => t.assigneeId === user.id && t.status !== 'done');
            const totalPoints = userActiveTasks.reduce((sum, t) => sum + (Number(t.weight) || 1), 0);
            
            const pointsByProject = {};
            userActiveTasks.forEach(t => {
              if (!pointsByProject[t.projectId]) pointsByProject[t.projectId] = 0;
              pointsByProject[t.projectId] += (Number(t.weight) || 1);
            });

            return (
              <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                 <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-white" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
                         <UserCircle size={28} className="text-slate-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                        {user.name} 
                        {user.isAdmin && <Shield size={14} className="text-amber-500" title="Admin" />}
                      </h3>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                 </div>
                 
                 <div className="p-5 flex-1 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                       <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-100">
                          <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Active Tasks</div>
                          <div className="text-2xl font-black text-slate-800">{userActiveTasks.length}</div>
                       </div>
                       <div className="flex-1 bg-purple-50 rounded-lg p-3 border border-purple-100">
                          <div className="text-purple-600 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={12}/> Total Points</div>
                          <div className="text-2xl font-black text-slate-800">{totalPoints}</div>
                       </div>
                    </div>

                    <div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Workload by Project</h4>
                       {Object.keys(pointsByProject).length > 0 ? (
                         <div className="space-y-3">
                           {Object.entries(pointsByProject).sort((a,b) => b[1] - a[1]).map(([projectId, points]) => {
                             const project = getProject(projectId);
                             if (!project) return null;
                             const percentOfLoad = Math.round((points / totalPoints) * 100);
                             return (
                               <div key={projectId}>
                                 <div className="flex justify-between items-center text-sm mb-1">
                                   <div className="flex items-center gap-1.5 font-medium text-slate-700 truncate pr-2">
                                     <DynamicIcon name={project.icon} size={14} className={colorStyles[project.color]?.text} />
                                     <span className="truncate">{project.name}</span>
                                   </div>
                                   <div className="font-bold text-slate-600 text-xs">{points} pts</div>
                                 </div>
                                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full ${colorStyles[project.color]?.bar || 'bg-slate-400'}`} style={{ width: `${percentOfLoad}%` }} />
                                 </div>
                               </div>
                             );
                           })}
                         </div>
                       ) : (
                         <div className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded border border-dashed border-slate-200 text-center">
                           No active tasks right now.
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  const BudgetDashboard = () => {
    const viewExpenses = activeBudgetTab === 'overview' 
      ? expenses 
      : expenses.filter(e => e.companyId === activeBudgetTab);

    // EXCLUDE items where Auto-Renew is explicitly OFF from the financial totals
    const activeExpenses = viewExpenses.filter(e => e.autoRenew !== false && e.autoRenew !== 0 && e.autoRenew !== '0');

    const monthlyTotal = activeExpenses.filter(e => e.cycle === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const annualTotal = activeExpenses.filter(e => e.cycle === 'annual').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const trueAnnualCommitment = (monthlyTotal * 12) + annualTotal;

    const currentCompany = activeBudgetTab === 'overview' ? null : getCompany(activeBudgetTab);

    const handleExpenseSort = (key) => {
      let direction = 'asc';
      if (expenseSortConfig.key === key && expenseSortConfig.direction === 'asc') direction = 'desc';
      setExpenseSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }) => {
      if (expenseSortConfig.key !== columnKey) return <ChevronsUpDown size={14} className="opacity-30 ml-1 inline" />;
      return expenseSortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1 inline text-emerald-600" /> : <ChevronDown size={14} className="ml-1 inline text-emerald-600" />;
    };

    const sortedExpenses = [...viewExpenses].sort((a, b) => {
      let aValue = a[expenseSortConfig.key];
      let bValue = b[expenseSortConfig.key];

      if (expenseSortConfig.key === 'amount') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      } else if (expenseSortConfig.key === 'companyId') {
        aValue = getCompany(a.companyId)?.name || '';
        bValue = getCompany(b.companyId)?.name || '';
      } else if (expenseSortConfig.key === 'renewalDate') {
        aValue = parseNextDate(a.cycle, a.renewalDate).getTime();
        bValue = parseNextDate(b.cycle, b.renewalDate).getTime();
      }

      if (aValue < bValue) return expenseSortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return expenseSortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const timelineExpenses = [...viewExpenses]
      .map(e => ({ ...e, nextDateObj: parseNextDate(e.cycle, e.renewalDate) }))
      .sort((a, b) => a.nextDateObj - b.nextDateObj);

    const renderExpenseDesktopRow = (expense) => {
      const company = getCompany(expense.companyId);
      const isAutoRenewOn = expense.autoRenew !== false && expense.autoRenew !== 0 && expense.autoRenew !== '0';

      return (
        <tr key={expense.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors group ${!isAutoRenewOn ? 'opacity-60' : ''}`}>
          <td className="p-4 font-medium text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors flex items-center gap-2" onClick={() => openExpenseModal(expense)}>
            {expense.category === 'Domains' ? <Globe size={16} className={isAutoRenewOn ? 'text-teal-500' : 'text-slate-400'} /> : null}
            <span className={!isAutoRenewOn ? 'line-through' : ''}>{expense.name}</span>
          </td>
          {activeBudgetTab === 'overview' && (
            <td className="p-4">
              <div className="flex items-center gap-2" title={company?.name}>
                <CompanyLogo company={company} sizeClass="w-6 h-6" />
                <span className="text-sm text-slate-600">{company?.name}</span>
              </div>
            </td>
          )}
          <td className="p-4">
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {expense.category}
            </span>
          </td>
          <td className="p-4 font-medium text-slate-700">
            {formatCurrency(expense.amount)}
          </td>
          <td className="p-4">
             <span className={`text-xs font-semibold px-2 py-1 rounded-full ${expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                {expense.cycle === 'monthly' ? 'Monthly' : 'Annual'}
             </span>
          </td>
          <td className="p-4 text-sm text-slate-500">
             {isAutoRenewOn ? (expense.renewalDate || '--') : <span className="text-red-500 font-medium">Canceled</span>}
          </td>
          <td className="p-4 text-right">
             <button onClick={() => handleDeleteExpense(expense.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
               <Trash2 size={16} />
             </button>
          </td>
        </tr>
      );
    };

    const renderExpenseMobileCard = (expense) => {
      const company = getCompany(expense.companyId);
      const isAutoRenewOn = expense.autoRenew !== false && expense.autoRenew !== 0 && expense.autoRenew !== '0';

      return (
        <div key={expense.id} className={`p-4 hover:bg-slate-50 transition-colors group relative border-b border-slate-100 last:border-b-0 ${!isAutoRenewOn ? 'opacity-60' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <div className={`font-medium text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors pr-8 flex items-center gap-1.5 ${!isAutoRenewOn ? 'line-through' : ''}`} onClick={() => openExpenseModal(expense)}>
              {expense.category === 'Domains' ? <Globe size={14} className={isAutoRenewOn ? 'text-teal-500' : 'text-slate-400'} /> : null}
              {expense.name}
            </div>
            <div className="font-bold text-slate-800 flex-shrink-0">
              {formatCurrency(expense.amount)}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
              {expense.cycle === 'monthly' ? 'Monthly' : 'Annual'}
            </span>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              {expense.category}
            </span>
            {!isAutoRenewOn && (
              <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-1.5 py-0.5 rounded">Canceled</span>
            )}
            {activeBudgetTab === 'overview' && company && (
              <div className="flex items-center gap-1 ml-auto">
                <CompanyLogo company={company} sizeClass="w-4 h-4" textClass="text-[8px]" />
                <span className="text-[10px] text-slate-500">{company.name}</span>
              </div>
            )}
            <button onClick={() => handleDeleteExpense(expense.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
               <Trash2 size={14} />
            </button>
          </div>
          {isAutoRenewOn && expense.renewalDate && (
             <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
               <Clock size={10} /> Renews: {expense.renewalDate}
             </div>
          )}
        </div>
      );
    };

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
        <div className="mb-6 sm:mb-8 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             {activeBudgetTab === 'overview' ? 'Global Budget Overview' : `${currentCompany?.name} Budget`}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage and forecast your recurring expenses (Domains included).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Receipt size={16} className="text-blue-500" /> Active Monthly Rate
            </div>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(monthlyTotal)}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <CalendarClock size={16} className="text-purple-500" /> Active Annual Rate
            </div>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(annualTotal)}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Landmark size={16} className="text-emerald-500" /> True Yearly Commitment
            </div>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(trueAnnualCommitment)}</div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {budgetDisplayMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                 <h3 className="font-bold text-slate-700">All Expenses & Domains</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="md:hidden flex flex-col">
                   {sortedExpenses.length > 0 ? sortedExpenses.map(renderExpenseMobileCard) : <div className="p-8 text-center text-slate-500 text-sm">No expenses recorded yet.</div>}
                </div>
                <div className="hidden md:block">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="sticky top-0 bg-slate-50 z-10">
                      <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('name')}>
                          Expense Name <SortIcon columnKey="name" />
                        </th>
                        {activeBudgetTab === 'overview' && (
                          <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('companyId')}>
                            Company <SortIcon columnKey="companyId" />
                          </th>
                        )}
                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('category')}>
                          Category <SortIcon columnKey="category" />
                        </th>
                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('amount')}>
                          Amount <SortIcon columnKey="amount" />
                        </th>
                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('cycle')}>
                          Billing Cycle <SortIcon columnKey="cycle" />
                        </th>
                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleExpenseSort('renewalDate')}>
                          Renewal Date <SortIcon columnKey="renewalDate" />
                        </th>
                        <th className="p-4 w-12 bg-slate-50"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedExpenses.length > 0 ? sortedExpenses.map(renderExpenseDesktopRow) : (
                        <tr><td colSpan={activeBudgetTab === 'overview' ? 7 : 6} className="p-8 text-center text-slate-500">No expenses recorded yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {budgetDisplayMode === 'timeline' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
               <h3 className="font-bold text-slate-700 mb-6">Combined Expense Forecast</h3>
               <div className="relative border-l-2 border-emerald-100 ml-3 space-y-8 pb-8">
                  {timelineExpenses.length > 0 ? timelineExpenses.map(expense => {
                    const company = getCompany(expense.companyId);
                    const isFarFuture = expense.nextDateObj.getFullYear() === 9999;
                    const displayDate = isFarFuture ? "Date Unknown" : expense.nextDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                    const isAutoRenewOn = expense.autoRenew !== false && expense.autoRenew !== 0 && expense.autoRenew !== '0';

                    return (
                      <div key={expense.id} className={`relative pl-8 ${!isAutoRenewOn ? 'opacity-50' : ''}`}>
                        <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${isAutoRenewOn ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <div className="p-4 rounded-lg border bg-slate-50 border-slate-100 hover:shadow-md transition-shadow group flex items-start justify-between">
                          <div>
                            <div className={`text-sm font-bold mb-1 ${isAutoRenewOn ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {isAutoRenewOn ? displayDate : 'CANCELED'}
                            </div>
                            <div className={`font-medium text-slate-800 cursor-pointer transition-colors mb-2 flex items-center gap-1.5 ${isAutoRenewOn ? 'hover:text-emerald-600' : 'line-through'}`} onClick={() => openExpenseModal(expense)}>
                              {expense.category === 'Domains' ? <Globe size={14} className={isAutoRenewOn ? 'text-teal-500' : 'text-slate-400'} /> : null}
                              {expense.name}
                            </div>
                            <div className="flex items-center gap-2">
                              {activeBudgetTab === 'overview' && company && (
                                <div className="flex items-center gap-1">
                                  <CompanyLogo company={company} sizeClass="w-4 h-4" textClass="text-[8px]" />
                                  <span className="text-[10px] text-slate-500 font-medium">{company.name}</span>
                                  <span className="text-slate-300 px-1">•</span>
                                </div>
                              )}
                              <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                {expense.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="font-bold text-slate-800 text-lg mb-1">{formatCurrency(expense.amount)}</div>
                             <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                               {expense.cycle === 'monthly' ? 'Monthly' : 'Annual'}
                             </span>
                          </div>
                        </div>
                      </div>
                    )
                  }) : (
                     <div className="p-8 text-slate-500 text-sm">No forecasted expenses.</div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DomainsDashboard = () => {
    const domainExpenses = expenses.filter(e => e.category === 'Domains');
    const viewDomains = activeDomainTab === 'overview' 
      ? domainExpenses 
      : domainExpenses.filter(e => e.companyId === activeDomainTab);

    // Exclude domains that are NOT auto-renewing from the active counts
    const activeDomains = viewDomains.filter(e => e.autoRenew !== false && e.autoRenew !== 0 && e.autoRenew !== '0');

    const activeDomainCount = activeDomains.length;
    const totalDomainCost = activeDomains.reduce((sum, e) => {
      const annualAmount = e.cycle === 'monthly' ? parseFloat(e.amount) * 12 : parseFloat(e.amount);
      return sum + annualAmount;
    }, 0);

    const currentCompany = activeDomainTab === 'overview' ? null : getCompany(activeDomainTab);

    const handleSort = (key) => {
      let direction = 'asc';
      if (domainSortConfig.key === key && domainSortConfig.direction === 'asc') direction = 'desc';
      setDomainSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }) => {
      if (domainSortConfig.key !== columnKey) return <ChevronsUpDown size={14} className="opacity-30 ml-1 inline" />;
      return domainSortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1 inline text-teal-600" /> : <ChevronDown size={14} className="ml-1 inline text-teal-600" />;
    };

    const sortedDomains = [...viewDomains].sort((a, b) => {
      let aValue = a[domainSortConfig.key];
      let bValue = b[domainSortConfig.key];

      if (domainSortConfig.key === 'amount') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      } else if (domainSortConfig.key === 'companyId') {
        aValue = getCompany(a.companyId)?.name || '';
        bValue = getCompany(b.companyId)?.name || '';
      } else if (domainSortConfig.key === 'renewalDate') {
        aValue = parseNextDate(a.cycle, a.renewalDate).getTime();
        bValue = parseNextDate(b.cycle, b.renewalDate).getTime();
      }

      if (aValue < bValue) return domainSortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return domainSortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const timelineDomains = [...viewDomains]
      .map(e => ({ ...e, nextDateObj: parseNextDate(e.cycle, e.renewalDate) }))
      .sort((a, b) => a.nextDateObj - b.nextDateObj);

    const renderDomainRow = (domain) => {
      const company = getCompany(domain.companyId);
      const isAutoRenewOn = domain.autoRenew !== false && domain.autoRenew !== 0 && domain.autoRenew !== '0';

      return (
        <tr key={domain.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors group ${!isAutoRenewOn ? 'opacity-60' : ''}`}>
          <td className="p-4 font-bold text-slate-800 cursor-pointer hover:text-teal-600 transition-colors flex items-center gap-2" onClick={() => openDomainModal(domain)}>
            <Globe size={16} className={isAutoRenewOn ? "text-teal-500" : "text-slate-400"} />
            <span className={!isAutoRenewOn ? 'line-through' : ''}>{domain.name}</span>
          </td>
          {activeDomainTab === 'overview' && (
            <td className="p-4">
              <div className="flex items-center gap-2">
                <CompanyLogo company={company} sizeClass="w-5 h-5" />
                <span className="text-sm text-slate-600">{company?.name}</span>
              </div>
            </td>
          )}
          <td className="p-4 font-medium text-slate-700">
            {formatCurrency(domain.amount)} <span className="text-xs text-slate-400 font-normal">/{domain.cycle === 'monthly' ? 'mo' : 'yr'}</span>
          </td>
          <td className="p-4">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isAutoRenewOn ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
              {isAutoRenewOn ? 'ON' : 'OFF'}
            </span>
          </td>
          <td className="p-4 text-sm font-medium text-slate-600">
            {isAutoRenewOn ? (domain.renewalDate || '--') : <span className="text-slate-400 font-normal">Manual/Off</span>}
          </td>
          <td className="p-4 text-right">
             <button onClick={() => handleDeleteExpense(domain.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
               <Trash2 size={16} />
             </button>
          </td>
        </tr>
      );
    };

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
        <div className="mb-6 sm:mb-8 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             {activeDomainTab === 'overview' ? 'Domain Portfolio' : `${currentCompany?.name} Domains`}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage URLs and hosting renewals. Links directly to your Budget.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-500 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                 <Globe size={16} className="text-teal-500" /> Active Domains (Auto-Renew)
              </div>
              <div className="text-3xl font-bold text-slate-800">{activeDomainCount}</div>
            </div>
            <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center">
              <Globe size={24} className="text-teal-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-500 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                 <Landmark size={16} className="text-teal-500" /> Estimated Annual Cost
              </div>
              <div className="text-3xl font-bold text-slate-800">{formatCurrency(totalDomainCost)}</div>
            </div>
            <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center">
              <DollarSign size={24} className="text-teal-500" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {domainDisplayMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                 <h3 className="font-bold text-slate-700">Registered Domains</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="sticky top-0 bg-slate-50 z-10">
                      <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                          Domain URL <SortIcon columnKey="name" />
                        </th>
                        {activeDomainTab === 'overview' && (
                          <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('companyId')}>
                            Company <SortIcon columnKey="companyId" />
                          </th>
                        )}
                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('amount')}>
                          Cost <SortIcon columnKey="amount" />
                        </th>
                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('autoRenew')}>
                          Auto-Renew <SortIcon columnKey="autoRenew" />
                        </th>
                        <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('renewalDate')}>
                          Renewal Date <SortIcon columnKey="renewalDate" />
                        </th>
                        <th className="p-4 w-12 bg-slate-50"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedDomains.length > 0 ? sortedDomains.map(renderDomainRow) : (
                        <tr><td colSpan={activeDomainTab === 'overview' ? 6 : 5} className="p-8 text-center text-slate-500">No domains registered yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {domainDisplayMode === 'timeline' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
               <h3 className="font-bold text-slate-700 mb-6">Renewal Forecast</h3>
               <div className="relative border-l-2 border-teal-100 ml-3 space-y-8 pb-8">
                  {timelineDomains.length > 0 ? timelineDomains.map(domain => {
                    const company = getCompany(domain.companyId);
                    const isFarFuture = domain.nextDateObj.getFullYear() === 9999;
                    const displayDate = isFarFuture ? "Date Unknown" : domain.nextDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                    const isAutoRenewOn = domain.autoRenew !== false && domain.autoRenew !== 0 && domain.autoRenew !== '0';

                    return (
                      <div key={domain.id} className={`relative pl-8 ${!isAutoRenewOn ? 'opacity-50' : ''}`}>
                        <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${isAutoRenewOn ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
                        <div className="p-4 rounded-lg border bg-slate-50 border-slate-100 hover:shadow-md transition-shadow group flex items-start justify-between">
                          <div>
                            <div className={`text-sm font-bold mb-1 ${isAutoRenewOn ? 'text-teal-600' : 'text-slate-500'}`}>
                              {isAutoRenewOn ? displayDate : 'CANCELED'}
                            </div>
                            <div className={`font-medium text-slate-800 cursor-pointer transition-colors mb-2 flex items-center gap-1.5 ${isAutoRenewOn ? 'hover:text-teal-600' : 'line-through'}`} onClick={() => openDomainModal(domain)}>
                              <Globe size={14} className={isAutoRenewOn ? "text-teal-500" : "text-slate-400"} /> {domain.name}
                            </div>
                            <div className="flex items-center gap-2">
                              {activeDomainTab === 'overview' && company && (
                                <div className="flex items-center gap-1">
                                  <CompanyLogo company={company} sizeClass="w-4 h-4" textClass="text-[8px]" />
                                  <span className="text-[10px] text-slate-500 font-medium">{company.name}</span>
                                </div>
                              )}
                              {!isAutoRenewOn && (
                                <span className="text-[10px] text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded font-bold">Auto-Renew OFF</span>
                              )}
                              {domain.notes && (
                                <span className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded truncate max-w-[150px]" title={domain.notes}>
                                  {domain.notes}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="font-bold text-slate-800 text-lg mb-1">{formatCurrency(domain.amount)}</div>
                             <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${domain.cycle === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                               {domain.cycle === 'monthly' ? 'Monthly' : 'Annual'}
                             </span>
                          </div>
                        </div>
                      </div>
                    )
                  }) : (
                     <div className="p-8 text-slate-500 text-sm">No forecasted domain renewals.</div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- STOP UNAUTHORIZED ACCESS ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  // --- MAIN APP RENDER ---
  return (
    <>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden flex-col lg:flex-row">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        <div className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out pb-16 lg:pb-0`}>
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
          <TopBar />
          <main className="flex-1 overflow-auto relative pb-16 lg:pb-0">
            {currentApp === 'projects' ? (
              activeTab === 'mytasks' ? <DashboardView /> : 
              activeTab === 'capacity' ? <TeamCapacityView /> : 
              <ProjectView projectId={activeTab} />
            ) : currentApp === 'budget' ? (
              <BudgetDashboard />
            ) : currentApp === 'domains' ? (
              <DomainsDashboard />
            ) : (
              <YoutubeDashboard />
            )}
          </main>
          <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 text-slate-300 flex items-center justify-between px-6 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 -ml-2 transition-colors flex flex-col items-center gap-1 ${isMobileMenuOpen ? 'text-white' : 'hover:text-white'}`}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                <span className="text-[10px] font-medium tracking-wide">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
             </button>
             <button onClick={openProfileModal} className="p-1 -mr-1 hover:text-white transition-colors flex flex-col items-center gap-1">
                {currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} className="w-7 h-7 rounded-full border border-slate-600 object-cover" alt="Profile" /> : <UserCircle size={28} />}
                <span className="text-[10px] font-medium tracking-wide">Profile</span>
             </button>
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* YOUTUBE CHANNEL MODAL */}
      {isYoutubeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800">{editingYoutubeChannel.id ? 'Edit Channel' : 'Add New Channel'}</h3>
              <button onClick={() => setIsYoutubeModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form id="youtubeForm" onSubmit={handleSaveYoutubeChannel} className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Channel Name</label>
                  <input required type="text" value={editingYoutubeChannel.name} onChange={(e) => setEditingYoutubeChannel({...editingYoutubeChannel, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g., My Gaming Channel" />
                </div>
                {/* Note: In the next step, we will add fields here for the actual YouTube Channel ID from Google! */}
              </div>
            </form>
            <div className="p-6 mt-2 flex justify-end gap-3 border-t border-slate-100 flex-shrink-0">
              {editingYoutubeChannel.id && (
                <button type="button" onClick={() => {
                  setYoutubeChannels(youtubeChannels.filter(c => c.id !== editingYoutubeChannel.id));
                  if(activeYoutubeChannelId === editingYoutubeChannel.id) setActiveYoutubeChannelId(youtubeChannels[0]?.id || null);
                  setIsYoutubeModalOpen(false);
                }} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
              )}
              <button type="button" onClick={() => setIsYoutubeModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
              <button type="submit" form="youtubeForm" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">{editingYoutubeChannel.id ? 'Save Changes' : 'Add Channel'}</button>
            </div>
          </div>
        </div>
      )}

      {/* TASK MODAL */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800">{currentTask.id ? 'Edit Task' : 'Add New Task'}</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <form id="taskForm" onSubmit={handleSaveTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                  <input required type="text" value={currentTask.title} onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Update landing page copy" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description / Notes</label>
                  <textarea value={currentTask.description || ''} onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Add details, notes, or links here..." />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                    <input required type="date" value={currentTask.dueDate} onChange={(e) => setCurrentTask({...currentTask, dueDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select value={currentTask.status} onChange={(e) => setCurrentTask({...currentTask, status: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
                    <select required value={currentTask.assigneeId} onChange={(e) => setCurrentTask({...currentTask, assigneeId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                      <option value="" disabled>Select teammate</option>
                      {users.length === 0 && <option value={currentUser?.id}>{currentUser?.name}</option>}
                      {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Weight / Pts</label>
                    <input required type="number" min="1" value={currentTask.weight || 1} onChange={(e) => setCurrentTask({...currentTask, weight: parseInt(e.target.value) || 1})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => {
                      const isSelected = (currentTask.tags || []).includes(tag);
                      return (
                        <button key={tag} type="button" onClick={() => { const tags = currentTask.tags || []; setCurrentTask({ ...currentTask, tags: isSelected ? tags.filter(t => t !== tag) : [...tags, tag] }); }} className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${isSelected ? (tagStyles[tag] || tagStyles['See Notes']) + ' ring-2 ring-offset-1 ring-slate-300 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'}`}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
                  <div className="flex items-center gap-3 mb-3">
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-slate-200">
                      <Paperclip size={16} /> Attach Files
                      <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                  {currentTask.files && currentTask.files.length > 0 && (
                    <ul className="space-y-2">
                      {currentTask.files.map((file, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 text-sm">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Paperclip size={14} className="text-slate-400 flex-shrink-0" />
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{file.name}</a>
                          </div>
                          <button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 ml-2"><X size={16} /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              {currentTask.id && (
                <button type="button" onClick={() => { handleDeleteTask(currentTask.id); setIsTaskModalOpen(false); }} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
              )}
              <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
              <button type="submit" form="taskForm" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">{currentTask.id ? 'Save Changes' : 'Create Task'}</button>
            </div>
          </div>
        </div>
      )}

      {/* EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-emerald-500">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Receipt className="text-emerald-500" size={20} />
                {currentExpense.id ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <form id="expenseForm" onSubmit={handleSaveExpense} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expense Name</label>
                  <input required type="text" value={currentExpense.name} onChange={(e) => setCurrentExpense({...currentExpense, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Google Workspace, Canva Pro" />
                </div>

                {/* AUTO-RENEW TOGGLE */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Active / Auto-Renew</div>
                    <div className="text-xs text-slate-500">Include this cost in yearly budget totals</div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCurrentExpense({...currentExpense, autoRenew: !currentExpense.autoRenew})}
                    className={`${currentExpense.autoRenew ? 'text-emerald-500' : 'text-slate-300'} transition-colors`}
                  >
                    {currentExpense.autoRenew ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                  </button>
                </div>

                <div className={`grid grid-cols-2 gap-4 transition-opacity ${!currentExpense.autoRenew ? 'opacity-50' : ''}`}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-slate-400" />
                      </div>
                      <input required type="number" step="0.01" min="0" value={currentExpense.amount} onChange={(e) => setCurrentExpense({...currentExpense, amount: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800" placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Billing Cycle</label>
                    <select required value={currentExpense.cycle} onChange={(e) => setCurrentExpense({...currentExpense, cycle: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annually</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                    <select required value={currentExpense.companyId} onChange={(e) => setCurrentExpense({...currentExpense, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
                      <option value="" disabled>Select a company</option>
                      {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select required value={currentExpense.category} onChange={(e) => setCurrentExpense({...currentExpense, category: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
                      {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Renewal Date <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                  <input type="text" value={currentExpense.renewalDate} onChange={(e) => setCurrentExpense({...currentExpense, renewalDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., 1st of month, Jan 15" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                  <textarea value={currentExpense.notes} onChange={(e) => setCurrentExpense({...currentExpense, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Account info, login details, etc." />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
              <button type="submit" form="expenseForm" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium">{currentExpense.id ? 'Save Changes' : 'Add Expense'}</button>
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN MODAL */}
      {isDomainModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-teal-500">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Globe className="text-teal-500" size={20} />
                {currentDomain.id ? 'Edit Domain' : 'Add New Domain'}
              </h3>
              <button onClick={() => setIsDomainModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <form id="domainForm" onSubmit={handleSaveDomain} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Domain URL</label>
                  <input required type="text" value={currentDomain.name} onChange={(e) => setCurrentDomain({...currentDomain, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., mywebsite.com" />
                </div>
                
                {/* AUTO-RENEW TOGGLE */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Auto-Renew</div>
                    <div className="text-xs text-slate-500">Include this domain in yearly budget totals</div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCurrentDomain({...currentDomain, autoRenew: !currentDomain.autoRenew})}
                    className={`${currentDomain.autoRenew ? 'text-teal-500' : 'text-slate-300'} transition-colors`}
                  >
                    {currentDomain.autoRenew ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                  </button>
                </div>

                <div className={`grid grid-cols-2 gap-4 transition-opacity ${!currentDomain.autoRenew ? 'opacity-50' : ''}`}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-slate-400" />
                      </div>
                      <input required type="number" step="0.01" min="0" value={currentDomain.amount} onChange={(e) => setCurrentDomain({...currentDomain, amount: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800" placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Billing Cycle</label>
                    <select required value={currentDomain.cycle} onChange={(e) => setCurrentDomain({...currentDomain, cycle: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                      <option value="annual">Annually</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <select required value={currentDomain.companyId} onChange={(e) => setCurrentDomain({...currentDomain, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50">
                    <option value="" disabled>Select a company</option>
                    {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Renewal Date <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                  <input type="text" value={currentDomain.renewalDate} onChange={(e) => setCurrentDomain({...currentDomain, renewalDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g., Nov 22" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Registrar <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                  <textarea value={currentDomain.notes} onChange={(e) => setCurrentDomain({...currentDomain, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" placeholder="Registered on GoDaddy, points to Vercel, etc." />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={() => setIsDomainModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
              <button type="submit" form="domainForm" className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium">{currentDomain.id ? 'Save Changes' : 'Add Domain'}</button>
            </div>
          </div>
        </div>
      )}

      {/* COMPANY MODAL */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800">{editingCompany.id ? 'Edit Company' : 'Add New Company'}</h3>
              <button onClick={() => setIsCompanyModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form id="companyForm" onSubmit={handleSaveCompany} className="p-6 overflow-y-auto space-y-6">
              
              {/* COMPANY LOGO UPLOAD */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {editingCompany.logoUrl ? (
                    <img src={editingCompany.logoUrl} alt="Preview" className="w-24 h-24 rounded-xl object-cover border-4 border-slate-100 shadow-sm bg-white" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-sm">
                      <Building2 size={40} className="text-slate-400" />
                    </div>
                  )}
                  <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-colors" title="Upload Company Logo">
                    <Camera size={16} /><input type="file" accept="image/*" className="hidden" onChange={handleCompanyLogoUpload} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input required type="text" value={editingCompany.name} onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Acme Corp" />
              </div>
              
              {/* TEAM ACCESS CONTROLS */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Team Access</label>
                <div className="flex flex-wrap gap-2">
                  {users.length > 0 ? users.map(user => {
                    const isSelected = editingCompany.userIds && editingCompany.userIds.includes(user.id);
                    return (
                      <button 
                        key={user.id} 
                        type="button" 
                        onClick={() => toggleCompanyUser(user.id)} 
                        className={`px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-sm font-medium border transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                      >
                        {isSelected ? <CheckCircle2 size={14} className="text-blue-500"/> : <Circle size={14} className="text-slate-300"/>}
                        {user.name.split(' ')[0]}
                      </button>
                    )
                  }) : (
                    <span className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-dashed border-slate-200">Save your profile first to add team members.</span>
                  )}
                </div>
              </div>
            </form>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              {editingCompany.id && (
                <button type="button" onClick={() => handleDeleteCompany(editingCompany.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
              )}
              <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
              <button type="submit" form="companyForm" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{editingCompany.id ? 'Save Changes' : 'Create Company'}</button>
            </div>
          </div>
        </div>
      )}

      {/* TEAM MANAGEMENT MODAL (ADMIN ONLY) */}
      {isTeamModalOpen && currentUser?.isAdmin && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex overflow-hidden">
            
            {/* Left Sidebar: User List */}
            <div className="w-1/3 border-r border-slate-100 bg-slate-50 flex flex-col">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18} className="text-blue-600"/> Team</h3>
                <button onClick={() => setEditingTeamMember({ id: null, name: '', email: '', password: '', isAdmin: false, canViewProjects: true, canViewBudget: false, canViewDomains: false })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Plus size={18}/></button>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {users.map(u => (
                  <button 
                    key={u.id} 
                    onClick={() => setEditingTeamMember({...u, password: ''})}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${editingTeamMember?.id === u.id ? 'bg-blue-100 border-blue-200' : 'hover:bg-white border border-transparent'}`}
                  >
                    {u.avatarUrl ? <img src={u.avatarUrl} className="w-8 h-8 rounded-full object-cover bg-white" /> : <UserCircle size={32} className="text-slate-400" />}
                    <div className="overflow-hidden">
                      <div className="font-semibold text-sm text-slate-800 truncate flex items-center gap-1">
                        {u.name} {u.isAdmin && <Shield size={12} className="text-amber-500" title="Admin"/>}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{u.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Pane: Edit Form */}
            <div className="flex-1 flex flex-col bg-white relative">
              <button onClick={() => setIsTeamModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"><X size={20}/></button>
              
              {editingTeamMember ? (
                <div className="p-8 overflow-y-auto flex-1">
                  <h2 className="text-2xl font-bold mb-6">{editingTeamMember.id ? 'Edit Team Member' : 'Invite New Member'}</h2>
                  
                  <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="relative">
                      {editingTeamMember.avatarUrl ? <img src={editingTeamMember.avatarUrl} className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm bg-white" /> : <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-sm"><UserCircle size={48} className="text-slate-400" /></div>}
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-colors" title="Upload Avatar">
                        <Camera size={14} /><input type="file" accept="image/*" className="hidden" onChange={handleTeamMemberImageUpload} />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input type="text" required value={editingTeamMember.name} onChange={(e) => setEditingTeamMember({...editingTeamMember, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input type="email" required value={editingTeamMember.email} onChange={(e) => setEditingTeamMember({...editingTeamMember, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  <div className="mb-8">
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <Key size={14} className="text-slate-400"/> {editingTeamMember.id ? 'Reset Password' : 'Set Initial Password'}
                      </label>
                      <input type="text" placeholder={editingTeamMember.id ? 'Leave blank to keep current password' : 'e.g. Welcome123!'} value={editingTeamMember.password || ''} onChange={(e) => setEditingTeamMember({...editingTeamMember, password: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">App Access & Permissions</h3>
                  
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${editingTeamMember.isAdmin ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2"><Shield size={16} className={editingTeamMember.isAdmin ? 'text-amber-500' : 'text-slate-400'}/> Master Admin</div>
                        <div className="text-xs text-slate-500 mt-1">Can see all companies, all apps, and manage team members.</div>
                      </div>
                      <button type="button" onClick={() => setEditingTeamMember({...editingTeamMember, isAdmin: !editingTeamMember.isAdmin})} className={editingTeamMember.isAdmin ? 'text-amber-500' : 'text-slate-300'}>
                        {editingTeamMember.isAdmin ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                      </button>
                    </label>

                    <div className={`space-y-3 transition-opacity ${editingTeamMember.isAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                        <div className="font-medium text-slate-700 flex items-center gap-2"><LayoutDashboard size={16} className="text-blue-500"/> Projects App</div>
                        <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded" checked={editingTeamMember.canViewProjects} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewProjects: e.target.checked})} />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                        <div className="font-medium text-slate-700 flex items-center gap-2"><Wallet size={16} className="text-emerald-500"/> Budget App</div>
                        <input type="checkbox" className="w-5 h-5 accent-emerald-600 rounded" checked={editingTeamMember.canViewBudget} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewBudget: e.target.checked})} />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                        <div className="font-medium text-slate-700 flex items-center gap-2"><Globe size={16} className="text-teal-500"/> Domains App</div>
                        <input type="checkbox" className="w-5 h-5 accent-teal-600 rounded" checked={editingTeamMember.canViewDomains} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewDomains: e.target.checked})} />
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                    <button onClick={handleSaveTeamMember} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">Save Member</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <Users size={64} className="mb-4 opacity-20" />
                  <p>Select a user to edit or create a new one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SWITCH USER MODAL (FOR TESTING) */}
      {isSwitchUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800 flex items-center gap-2"><UserCog size={18}/> Switch Identity</h3>
               <button onClick={() => setIsSwitchUserModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
               <p className="text-xs text-slate-500 text-center mb-4">Select a user below to see the app exactly how they see it based on their permissions.</p>
               {users.map(u => (
                 <button 
                   key={u.id}
                   onClick={() => { setLoggedInUserId(u.id); setIsSwitchUserModalOpen(false); }}
                   className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${loggedInUserId === u.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'}`}
                 >
                   {u.avatarUrl ? <img src={u.avatarUrl} className="w-10 h-10 rounded-full object-cover bg-white" /> : <UserCircle size={40} className="text-slate-300" />}
                   <div className="text-left flex-1">
                     <div className="font-bold text-slate-800 flex items-center gap-1">
                        {u.name} {u.isAdmin && <Shield size={12} className="text-amber-500"/>}
                     </div>
                     <div className="text-xs text-slate-500">{u.email}</div>
                   </div>
                   {loggedInUserId === u.id && <CheckCircle2 size={20} className="text-blue-500" />}
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800">{editingProject.id ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form id="projectForm" onSubmit={handleSaveProject} className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                  <input required type="text" value={editingProject.name} onChange={(e) => setEditingProject({...editingProject, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Website Redesign" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <select required value={editingProject.companyId} onChange={(e) => setEditingProject({...editingProject, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    <option value="" disabled>Select a company</option>
                    {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Theme Color</label>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map(color => (
                      <button key={color} type="button" onClick={() => setEditingProject({...editingProject, color})} style={{ backgroundColor: colorStyles[color].hex }} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${editingProject.color === color ? 'ring-2 ring-slate-400 ring-offset-2 scale-110' : ''}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                  <div className="grid grid-cols-6 gap-2 h-40 overflow-y-auto pr-2">
                    {availableIcons.map(iconName => (
                      <button key={iconName} type="button" onClick={() => setEditingProject({...editingProject, icon: iconName})} className={`p-2 rounded-lg flex justify-center items-center transition-colors ${editingProject.icon === iconName ? 'bg-slate-200 shadow-inner' : 'hover:bg-slate-100'}`}>
                        <DynamicIcon name={iconName} size={20} className={editingProject.icon === iconName ? colorStyles[editingProject.color].text : 'text-slate-600'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>
            <div className="p-6 mt-2 flex justify-end gap-3 border-t border-slate-100 flex-shrink-0">
              {editingProject.id && (
                <button type="button" onClick={() => handleDeleteProject(editingProject.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
              )}
              <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
              <button type="submit" form="projectForm" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{editingProject.id ? 'Save Changes' : 'Create Project'}</button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800">My Profile Settings</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {profileForm.avatarUrl ? <img src={profileForm.avatarUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm bg-white" /> : <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-sm"><UserCircle size={48} className="text-slate-400" /></div>}
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-colors" title="Upload Avatar">
                    <Camera size={14} /><input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input required type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input required type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Key size={14} className="text-slate-400"/> Change Password
                  </label>
                  <input type="text" placeholder="Leave blank to keep current password" value={profileForm.password || ''} onChange={(e) => setProfileForm({...profileForm, password: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              {/* Emergency Fallback Button just in case dev gets locked out of Admin */}
              {!currentUser?.isAdmin && (
                <div className="pt-4 flex justify-center">
                  <button 
                    type="button" 
                    onClick={() => {
                      const updated = {...currentUser, isAdmin: true, canViewProjects: true, canViewBudget: true, canViewDomains: true};
                      sendToAPI('save_user', updated);
                      setUsers(users.map(u => u.id === currentUser.id ? updated : u));
                    }} 
                    className="text-xs text-amber-600 font-bold hover:underline"
                  >
                    Force Developer Admin Access
                  </button>
                </div>
              )}
            </form>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between gap-3 flex-shrink-0">
              <button type="button" onClick={() => { setLoggedInUserId(null); setIsProfileModalOpen(false); }} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 transition-colors">
                <LogOut size={16}/> Sign Out
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
                <button onClick={handleSaveProfile} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Save Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}