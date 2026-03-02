import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, FolderKanban, ListTodo, KanbanSquare, 
  CalendarClock, Plus, CheckCircle2, Circle, Clock, Trash2, X, Paperclip,
  Building2, Globe, Smartphone, Megaphone, ShoppingCart, Rocket, Code, 
  Monitor, Heart, Star, Users, Settings, Mail, Camera, Box, PenTool, 
  Database, Cloud, FileText, Zap, Compass, MapPin, Coffee, Music, 
  Image as ImageIcon, FileVideo, Shield, Target, Award, Crown, Pencil,
  UserCircle, ImagePlus, Menu, ChevronsUpDown, ChevronUp, ChevronDown,
  Wallet, PieChart, DollarSign, Receipt, Landmark, Upload, RefreshCw, ToggleRight, ToggleLeft, UserCog, LogOut, Key, Youtube, PlaySquare, CalendarDays, Ticket, Mic, Headphones, Play, Download
} from 'lucide-react';

// API Configuration
const API_URL = 'https://api.fytsolutions.com/api.php';

// --- VISUAL ASSETS (Icons & Colors) ---
const iconMap = { 
  Building2, Globe, Smartphone, Megaphone, ShoppingCart, 
  Rocket, Code, Monitor, Heart, Star, Briefcase, FolderKanban,
  Users, Settings, Mail, Camera, Box, PenTool, Database, Cloud, 
  FileText, Zap, Compass, MapPin, Coffee, Music, ImageIcon, 
  FileVideo, Shield, Target, Award, Crown, Upload, RefreshCw,
  CalendarDays, Ticket, Mic, Headphones
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

  // Set Document Title
  useEffect(() => {
    document.title = "FYT Solutions Control Room";
  }, []);

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
  const [events, setEvents] = useState([]);
  
  // YouTube State 
  const [youtubeChannels, setYoutubeChannels] = useState([]);
  const [activeYoutubeChannelId, setActiveYoutubeChannelId] = useState(null);
  const [youtubeTimeFilter, setYoutubeTimeFilter] = useState('28'); 

  // Spreaker State
  const [spreakerShows, setSpreakerShows] = useState([]);
  const [activeSpreakerShowId, setActiveSpreakerShowId] = useState(null);
  const [isSpreakerModalOpen, setIsSpreakerModalOpen] = useState(false);
  const [editingSpreakerShow, setEditingSpreakerShow] = useState({ id: null, name: '', apiToken: '' });

  // Projects View State
  const [activeTab, setActiveTab] = useState('mytasks'); 
  const [projectDisplayMode, setProjectDisplayMode] = useState('list');
  
  // Expenses View State (Formerly Budget)
  const [activeBudgetTab, setActiveBudgetTab] = useState('overview'); 
  const [budgetDisplayMode, setBudgetDisplayMode] = useState('list'); 
  const [expenseSortConfig, setExpenseSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Domains View State
  const [activeDomainTab, setActiveDomainTab] = useState('overview');
  const [domainDisplayMode, setDomainDisplayMode] = useState('list'); 
  const [domainSortConfig, setDomainSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Events View State
  const [activeEventTab, setActiveEventTab] = useState('overview');
  const [eventDisplayMode, setEventDisplayMode] = useState('timeline');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState({ id: null, title: '', companyId: '', eventDate: '', eventTime: '', cost: '', autoProject: false, projectLeadTime: 1, projectLeadUnit: 'months', billingDate: '', installments: [] });
  const [paymentMode, setPaymentMode] = useState('single'); // 'single' or 'installments'

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
  
  // YOUTUBE Channel States
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [editingYoutubeChannel, setEditingYoutubeChannel] = useState({ id: null, name: '', refreshToken: '' });

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
      if (currentApp === 'events' && !currentUser.isAdmin && !currentUser.canViewEvents) setCurrentApp('projects');
      if (currentApp === 'spreaker' && !currentUser.isAdmin && !currentUser.canViewSpreaker) setCurrentApp('projects');
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
               canViewEvents: u.canViewEvents == 1 || u.canViewEvents === true || u.canViewEvents === undefined, 
               canViewSpreaker: u.canViewSpreaker == 1 || u.canViewSpreaker === true || u.canViewSpreaker === undefined, 
           }));
           setUsers(mappedUsers);
        }
        if(data.companies) setCompanies(data.companies);
        if(data.projects) setProjects(data.projects);
        if(data.tasks) setTasks(data.tasks);
        if(data.expenses) setExpenses(data.expenses);
        if(data.events) setEvents(data.events);
        
        if(data.youtube_channels) {
            setYoutubeChannels(data.youtube_channels);
            if(data.youtube_channels.length > 0 && !activeYoutubeChannelId) {
                setActiveYoutubeChannelId(data.youtube_channels[0].id);
            }
        }

        if(data.spreaker_shows) {
            setSpreakerShows(data.spreaker_shows);
            if(data.spreaker_shows.length > 0 && !activeSpreakerShowId) {
                setActiveSpreakerShowId(data.spreaker_shows[0].id);
            }
        }

        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to connect to API:", err);
        setIsLoading(false);
      });
  }, []);

  // --- AUTO-TRIGGER ENGINE FOR EVENTS ---
  useEffect(() => {
     if (events.length > 0 && currentUser?.isAdmin) {
         events.forEach(event => {
             let updatedEvent = null;
             
             // Sync Event Expense
             if (!event.expenseId) {
                 const isInstallments = event.installments && event.installments.length > 0;
                 const hasCost = parseFloat(event.cost) > 0;

                 if (isInstallments) {
                     const newIds = [];
                     let tempExpenses = [];
                     event.installments.forEach((inst, idx) => {
                         const newExpenseId = 'e' + Date.now() + idx + Math.random().toString(36).substr(2, 5);
                         newIds.push(newExpenseId);
                         const newExpense = {
                             id: newExpenseId,
                             companyId: event.companyId,
                             name: `Event: ${event.title} (Installment ${idx + 1})`,
                             category: 'Company Expense',
                             amount: inst.amount,
                             cycle: 'one-time', 
                             renewalDate: inst.date,
                             notes: `Auto-generated installment for event ${event.title}`,
                             autoRenew: false 
                         };
                         sendToAPI('save_expense', newExpense);
                         tempExpenses.push(newExpense);
                     });
                     setExpenses(prev => [...prev, ...tempExpenses]);
                     updatedEvent = { ...event, expenseId: newIds.join(',') };

                 } else if (hasCost) {
                     const newExpenseId = 'e' + Date.now() + Math.random().toString(36).substr(2, 5);
                     const newExpense = {
                         id: newExpenseId,
                         companyId: event.companyId,
                         name: `Event: ${event.title}`,
                         category: 'Company Expense',
                         amount: event.cost,
                         cycle: 'one-time', 
                         renewalDate: event.billingDate || event.eventDate,
                         notes: `Auto-generated for event ${event.title}`,
                         autoRenew: false 
                     };
                     sendToAPI('save_expense', newExpense);
                     setExpenses(prev => [...prev, newExpense]);
                     updatedEvent = { ...event, expenseId: newExpenseId };
                 }
             }

             // Sync Event Project
             if ((event.autoProject == 1 || event.autoProject === true) && !event.projectId && event.eventDate) {
                 const eventDateObj = new Date(`${event.eventDate}T12:00:00`); 
                 let triggerDate = new Date(eventDateObj);
                 
                 if (event.projectLeadUnit === 'now') {
                     triggerDate = new Date(0); // Force it to immediately trigger
                 } else {
                     const leadTime = parseInt(event.projectLeadTime);
                     if (event.projectLeadUnit === 'days') triggerDate.setDate(triggerDate.getDate() - leadTime);
                     if (event.projectLeadUnit === 'weeks') triggerDate.setDate(triggerDate.getDate() - (leadTime * 7));
                     if (event.projectLeadUnit === 'months') triggerDate.setMonth(triggerDate.getMonth() - leadTime);
                     if (event.projectLeadUnit === 'years') triggerDate.setFullYear(triggerDate.getFullYear() - leadTime);
                 }
                 
                 const today = new Date();
                 if (today >= triggerDate) {
                     const newProjectId = 'p' + Date.now() + Math.random().toString(36).substr(2, 5);
                     const newProject = {
                         id: newProjectId,
                         companyId: event.companyId,
                         name: `${event.title} (Event Prep)`,
                         icon: 'CalendarDays',
                         color: 'purple'
                     };
                     sendToAPI('save_project', newProject);
                     setProjects(prev => [...prev, newProject]);
                     updatedEvent = { ...(updatedEvent || event), projectId: newProjectId };
                 }
             }

             // Only save if something was updated to prevent infinite loops
             if (updatedEvent) {
                 sendToAPI('save_event', updatedEvent);
                 setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
             }
         });
     }
  }, [events, currentUser]); 

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

  // --- YOUTUBE SYNC FUNCTION ---
  const handleSyncYoutube = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=sync_youtube&days=${youtubeTimeFilter}`);
      const data = await response.json();
      
      if (data.error) {
        let errorMsg = "YouTube Sync Failed: " + data.error;
        if (data.details && data.details.length > 0) {
            errorMsg += "\n\nDetails:\n" + data.details.join("\n");
        }
        alert(errorMsg);
      } else {
        let msg = `YouTube data synced successfully! Processed ${data.synced} channel(s).`;
        if (data.errors && data.errors.length > 0) {
            msg += "\n\nSome channels had minor issues:\n" + data.errors.join("\n");
        }
        alert(msg);
        const refresh = await fetch(`${API_URL}?action=get_all`);
        const freshData = await refresh.json();
        if(freshData.youtube_channels) {
            setYoutubeChannels(freshData.youtube_channels);
            if(freshData.youtube_channels.length > 0 && !activeYoutubeChannelId) {
                setActiveYoutubeChannelId(freshData.youtube_channels[0].id);
            }
        }
      }
    } catch (err) {
      alert("An error occurred during sync. Check your server connection.");
    }
    setIsLoading(false);
  };

  // --- SPREAKER SYNC FUNCTION ---
  const handleSyncSpreaker = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=sync_spreaker`);
      const data = await response.json();
      
      if (data.error) {
        let errorMsg = "Spreaker Sync Failed: " + data.error;
        if (data.details && data.details.length > 0) {
            errorMsg += "\n\nDetails:\n" + data.details.join("\n");
        }
        alert(errorMsg);
      } else {
        let msg = `Spreaker data synced successfully! Processed ${data.synced} show(s).`;
        if (data.errors && data.errors.length > 0) {
            msg += "\n\nSome shows had minor issues:\n" + data.errors.join("\n");
        }
        alert(msg);
        const refresh = await fetch(`${API_URL}?action=get_all`);
        const freshData = await refresh.json();
        if(freshData.spreaker_shows) {
            setSpreakerShows(freshData.spreaker_shows);
            if(freshData.spreaker_shows.length > 0 && !activeSpreakerShowId) {
                setActiveSpreakerShowId(freshData.spreaker_shows[0].id);
            }
        }
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
           amount = 0; 
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

  const openEventModal = (ev = null) => {
    if (ev) {
        setEditingEvent({ ...ev, autoProject: ev.autoProject == 1 || ev.autoProject === true, installments: ev.installments || [] });
        setPaymentMode(ev.installments && ev.installments.length > 0 ? 'installments' : 'single');
    } else {
        setEditingEvent({ id: null, title: '', companyId: companies[0]?.id || '', eventDate: '', eventTime: '', cost: '', autoProject: false, projectLeadTime: 1, projectLeadUnit: 'months', billingDate: '', installments: [] });
        setPaymentMode('single');
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    let finalCost = editingEvent.cost;
    
    // Auto-calculate cost from installments if applicable
    if (paymentMode === 'installments') {
        const total = editingEvent.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
        finalCost = total;
    }

    const eventData = editingEvent.id 
        ? { ...editingEvent, cost: finalCost, installments: paymentMode === 'installments' ? editingEvent.installments : [] } 
        : { ...editingEvent, id: 'ev' + Date.now(), cost: finalCost, installments: paymentMode === 'installments' ? editingEvent.installments : [] };
    
    if (editingEvent.id) setEvents(events.map(ev => ev.id === eventData.id ? eventData : ev));
    else setEvents([...events, eventData]);
    
    setIsEventModalOpen(false);
    sendToAPI('save_event', eventData);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
    setIsEventModalOpen(false);
    sendToAPI('delete_event', { id: eventId });
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
    if (activeEventTab === companyId) setActiveEventTab('overview');
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
    if (channel) setEditingYoutubeChannel({ ...channel, refreshToken: channel.refreshToken || '' });
    else setEditingYoutubeChannel({ id: null, name: '', refreshToken: '' });
    setIsYoutubeModalOpen(true);
  };

  const handleSaveYoutubeChannel = (e) => {
    e.preventDefault();
    if (!editingYoutubeChannel.name.trim() || !editingYoutubeChannel.refreshToken?.trim()) {
        alert("Please provide both a Channel Name and a Refresh Token.");
        return;
    }

    const channelData = editingYoutubeChannel.id 
      ? editingYoutubeChannel 
      : { 
          ...editingYoutubeChannel, 
          id: 'yt' + Date.now(),
          views: '0', watchTime: '0.0', subs: '0', revenue: '$0.00', realtimeViews: '0', realtimeSubs: '0', topVideos: '[]'
        };

    if (editingYoutubeChannel.id) {
      setYoutubeChannels(youtubeChannels.map(c => c.id === channelData.id ? channelData : c));
    } else {
      setYoutubeChannels([...youtubeChannels, channelData]);
      setActiveYoutubeChannelId(channelData.id);
    }
    setIsYoutubeModalOpen(false);
    sendToAPI('save_youtube_channel', channelData);
  };

  const handleDeleteYoutubeChannel = (channelId) => {
    setYoutubeChannels(youtubeChannels.filter(c => c.id !== channelId));
    if(activeYoutubeChannelId === channelId) {
        const remaining = youtubeChannels.filter(c => c.id !== channelId);
        setActiveYoutubeChannelId(remaining.length > 0 ? remaining[0].id : null);
    }
    setIsYoutubeModalOpen(false);
    sendToAPI('delete_youtube_channel', { id: channelId });
  };

  const openSpreakerModal = (show = null) => {
    if (show) setEditingSpreakerShow({ ...show, apiToken: show.apiToken || '' });
    else setEditingSpreakerShow({ id: null, name: '', apiToken: '' });
    setIsSpreakerModalOpen(true);
  };

  const handleSaveSpreakerShow = (e) => {
    e.preventDefault();
    if (!editingSpreakerShow.name.trim() || !editingSpreakerShow.apiToken?.trim()) {
        alert("Please provide both a Show Name and a Developer Token.");
        return;
    }

    const showData = editingSpreakerShow.id 
      ? editingSpreakerShow 
      : { 
          ...editingSpreakerShow, 
          id: 'sp' + Date.now(),
          plays: '0', downloads: '0', likes: '0', followers: '0'
        };

    if (editingSpreakerShow.id) {
      setSpreakerShows(spreakerShows.map(c => c.id === showData.id ? showData : c));
    } else {
      setSpreakerShows([...spreakerShows, showData]);
      setActiveSpreakerShowId(showData.id);
    }
    setIsSpreakerModalOpen(false);
    sendToAPI('save_spreaker_show', showData);
  };

  const handleDeleteSpreakerShow = (showId) => {
    setSpreakerShows(spreakerShows.filter(c => c.id !== showId));
    if(activeSpreakerShowId === showId) {
        const remaining = spreakerShows.filter(c => c.id !== showId);
        setActiveSpreakerShowId(remaining.length > 0 ? remaining[0].id : null);
    }
    setIsSpreakerModalOpen(false);
    sendToAPI('delete_spreaker_show', { id: showId });
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
        password: profileForm.password, 
        avatarUrl: profileForm.avatarUrl 
    };
    
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
    delete localUser.password; 
    
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

  const formatExpenseDate = (dateStr, cycle) => {
    if (cycle !== 'one-time') return dateStr || '--';
    if (!dateStr) return '--';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const d = new Date(`${dateStr}T12:00:00`);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  };

  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    let [hours, minutes] = time24.split(':');
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
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
    } else if (cycle === 'one-time') {
       const nextDate = new Date(`${dateStr}T12:00:00`);
       if (!isNaN(nextDate.getTime())) return nextDate;
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

  const formatAVD = (minutes, views) => {
    if (!views || views === 0 || !minutes) return '0:00';
    const avgMin = Number(minutes) / Number(views);
    const m = Math.floor(avgMin);
    const s = Math.floor((avgMin - m) * 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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
           canViewEvents: isFirstUser,
           canViewSpreaker: isFirstUser,
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
            setUsers(prevUsers => {
              if (prevUsers.find(u => u.id === data.user.id)) {
                return prevUsers.map(u => u.id === data.user.id ? data.user : u);
              }
              return [...prevUsers, data.user];
            });
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
    const isYoutubeView = currentApp === 'youtube';
    const isEventView = currentApp === 'events';
    const isSpreakerView = currentApp === 'spreaker';
    
    return (
      <header className={`${currentApp === 'projects' ? 'bg-blue-600' : currentApp === 'budget' ? 'bg-emerald-600' : currentApp === 'youtube' ? 'bg-red-600' : currentApp === 'events' ? 'bg-purple-600' : currentApp === 'spreaker' ? 'bg-[#ffc005]' : 'bg-teal-500'} ${currentApp === 'spreaker' ? 'text-slate-900' : 'text-white'} h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-md z-40 w-full transition-colors duration-300`}>
        <div className="relative">
          <button 
            onClick={() => setIsAppSwitcherOpen(!isAppSwitcherOpen)}
            className={`flex items-center gap-2 font-bold text-xl tracking-tight px-2 py-1.5 -ml-2 rounded-lg transition-colors ${currentApp === 'projects' ? 'hover:bg-blue-700' : currentApp === 'budget' ? 'hover:bg-emerald-700' : currentApp === 'youtube' ? 'hover:bg-red-700' : currentApp === 'events' ? 'hover:bg-purple-700' : currentApp === 'spreaker' ? 'hover:bg-[#e6ad04]' : 'hover:bg-teal-600'}`}
          >
            {currentApp === 'projects' ? (
              <LayoutDashboard size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} />
            ) : currentApp === 'budget' ? (
              <Wallet size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} />
            ) : currentApp === 'youtube' ? (
              <Youtube size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} />
            ) : currentApp === 'events' ? (
              <CalendarDays size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} />
            ) : currentApp === 'spreaker' ? (
              <Mic size={24} className="text-slate-900/70" />
            ) : (
              <Globe size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} />
            )}
            <span className="capitalize">{currentApp === 'budget' ? 'Expenses' : currentApp === 'youtube' ? 'YouTube Studio' : currentApp === 'spreaker' ? 'Spreaker Studio' : currentApp}</span>
            <ChevronsUpDown size={18} className={`${currentApp === 'spreaker' ? 'text-slate-900/60' : 'text-white/60'} ml-1`} />
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
                {(currentUser.isAdmin || currentUser.canViewEvents) && (
                  <button 
                    onClick={() => { setCurrentApp('events'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'events' ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className={`p-1.5 rounded-md ${currentApp === 'events' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                      <CalendarDays size={18} />
                    </div>
                    Events
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
                    Expenses
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
                {(currentUser.isAdmin || currentUser.canViewSpreaker) && ( 
                  <button 
                    onClick={() => { setCurrentApp('spreaker'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'spreaker' ? 'bg-[#ffc005]/10 text-[#d9a304]' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className={`p-1.5 rounded-md ${currentApp === 'spreaker' ? 'bg-[#ffc005]/20 text-[#ffc005]' : 'bg-slate-100 text-slate-500'}`}>
                      <Mic size={18} />
                    </div>
                    Spreaker
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {isEventView && (
             <>
               <div className="flex bg-purple-700/50 rounded-lg p-1 border border-purple-500/50">
                  <button onClick={() => setEventDisplayMode('list')} className={`p-1.5 rounded-md transition-colors ${eventDisplayMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-purple-100 hover:text-white hover:bg-purple-500/50'}`}><ListTodo size={16} /></button>
                  <button onClick={() => setEventDisplayMode('timeline')} className={`p-1.5 rounded-md transition-colors ${eventDisplayMode === 'timeline' ? 'bg-white text-purple-600 shadow-sm' : 'text-purple-100 hover:text-white hover:bg-purple-500/50'}`}><CalendarClock size={16} /></button>
               </div>
               <button onClick={() => openEventModal()} className="bg-white text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
                 <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Event</span>
               </button>
             </>
          )}
          {isYoutubeView && (
             <>
               <div className="relative flex items-center bg-red-700/50 rounded-lg border border-red-500/50 px-3 py-1.5 hover:bg-red-700 transition-colors cursor-pointer">
                 <Clock size={16} className="text-red-200 mr-2" />
                 <select 
                   value={youtubeTimeFilter}
                   onChange={(e) => setYoutubeTimeFilter(e.target.value)}
                   className="bg-transparent text-white text-sm font-bold focus:outline-none cursor-pointer appearance-none pr-6"
                 >
                   <option value="7" className="text-slate-800 font-medium">Last 7 days</option>
                   <option value="28" className="text-slate-800 font-medium">Last 28 days</option>
                   <option value="90" className="text-slate-800 font-medium">Last 90 days</option>
                   <option value="365" className="text-slate-800 font-medium">Last 365 days</option>
                 </select>
                 <ChevronDown size={14} className="text-red-200 absolute right-3 pointer-events-none" />
               </div>
               {currentUser?.isAdmin && (
                 <button 
                   onClick={handleSyncYoutube}
                   className="bg-white text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                   title="Sync with Google API"
                 >
                   <RefreshCw size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Sync</span>
                 </button>
               )}
             </>
          )}
          {isSpreakerView && currentUser?.isAdmin && (
             <button 
               onClick={handleSyncSpreaker}
               className="bg-slate-900 text-[#ffc005] hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors"
               title="Sync with Spreaker API"
             >
               <RefreshCw size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Sync</span>
             </button>
          )}
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
                  All Expenses
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
                  {youtubeChannels.length > 0 ? youtubeChannels.map(channel => (
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
                  )) : (
                     <div className="text-xs text-slate-500 p-3 text-center italic">No channels added yet.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {currentApp === 'spreaker' && (
            <>
              <div className="px-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Podcasts</p>
                  {currentUser?.isAdmin && (
                    <button onClick={() => openSpreakerModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Show">
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {spreakerShows.length > 0 ? spreakerShows.map(show => (
                    <div key={show.id} className="flex items-center justify-between group/show">
                      <button
                        onClick={() => { setActiveSpreakerShowId(show.id); setIsMobileMenuOpen(false); }}
                        className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm overflow-hidden ${activeSpreakerShowId === show.id ? 'bg-slate-800 text-[#ffc005] font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}
                      >
                        <Mic size={16} className={`flex-shrink-0 ${activeSpreakerShowId === show.id ? 'text-[#ffc005]' : 'text-slate-500'}`} />
                        <span className="truncate">{show.name}</span>
                      </button>
                      {currentUser?.isAdmin && (
                        <div className="flex items-center flex-shrink-0 opacity-0 group-hover/show:opacity-100 transition-opacity ml-1">
                          <button onClick={(e) => { e.stopPropagation(); openSpreakerModal(show); }} className="text-slate-500 hover:text-white p-1" title="Edit Show"><Pencil size={12} /></button>
                        </div>
                      )}
                    </div>
                  )) : (
                     <div className="text-xs text-slate-500 p-3 text-center italic">No podcasts added yet.</div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {currentApp === 'events' && (
            <>
              <div className="px-4 mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Planning</p>
                <button 
                  onClick={() => { setActiveEventTab('overview'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeEventTab === 'overview' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                >
                  <CalendarDays size={18} />
                  All Events
                </button>
              </div>
              
              <div className="px-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>
                </div>
                <div className="flex flex-col gap-1">
                  {visibleCompanies.filter(c => events.some(e => e.companyId === c.id)).map(company => (
                    <div key={company.id} className="flex items-center justify-between group/company">
                      <button
                        onClick={() => { setActiveEventTab(company.id); setIsMobileMenuOpen(false); }}
                        className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeEventTab === company.id ? 'bg-slate-800 text-purple-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}
                      >
                        <CompanyLogo company={company} sizeClass="w-5 h-5" />
                        <span className="truncate">{company.name}</span>
                      </button>
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
                {(currentUser?.name || 'User').split(' ')[0]}
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
    const oneTimeTotal = activeExpenses.filter(e => e.cycle === 'one-time').reduce((sum, e) => sum + parseFloat(e.amount), 0);
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
        <tr key={expense.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors group ${!isAutoRenewOn && expense.cycle !== 'one-time' ? 'opacity-60' : ''}`}>
          <td className="p-4 font-medium text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors flex items-center gap-2" onClick={() => openExpenseModal(expense)}>
            {expense.category === 'Domains' ? <Globe size={16} className={isAutoRenewOn ? 'text-teal-500' : 'text-slate-400'} /> : null}
            <span className={!isAutoRenewOn && expense.cycle !== 'one-time' ? 'line-through' : ''}>{expense.name}</span>
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
             <span className={`text-xs font-semibold px-2 py-1 rounded-full ${expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600 border border-blue-100' : expense.cycle === 'annual' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                {expense.cycle === 'monthly' ? 'Monthly' : expense.cycle === 'annual' ? 'Annual' : 'One-Time'}
             </span>
          </td>
          <td className="p-4 text-sm text-slate-500">
             {isAutoRenewOn || expense.cycle === 'one-time' ? formatExpenseDate(expense.renewalDate, expense.cycle) : <span className="text-red-500 font-medium">Canceled</span>}
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
        <div key={expense.id} className={`p-4 hover:bg-slate-50 transition-colors group relative border-b border-slate-100 last:border-b-0 ${!isAutoRenewOn && expense.cycle !== 'one-time' ? 'opacity-60' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <div className={`font-medium text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors pr-8 flex items-center gap-1.5 ${!isAutoRenewOn && expense.cycle !== 'one-time' ? 'line-through' : ''}`} onClick={() => openExpenseModal(expense)}>
              {expense.category === 'Domains' ? <Globe size={14} className={isAutoRenewOn ? 'text-teal-500' : 'text-slate-400'} /> : null}
              {expense.name}
            </div>
            <div className="font-bold text-slate-800 flex-shrink-0">
              {formatCurrency(expense.amount)}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600' : expense.cycle === 'annual' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
              {expense.cycle === 'monthly' ? 'Monthly' : expense.cycle === 'annual' ? 'Annual' : 'One-Time'}
            </span>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              {expense.category}
            </span>
            {!isAutoRenewOn && expense.cycle !== 'one-time' && (
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
          {(isAutoRenewOn || expense.cycle === 'one-time') && expense.renewalDate && (
             <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
               <Clock size={10} /> {expense.cycle === 'one-time' ? 'Date:' : 'Renews:'} {formatExpenseDate(expense.renewalDate, expense.cycle)}
             </div>
          )}
        </div>
      );
    };

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50">
        <div className="mb-6 sm:mb-8 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             {activeBudgetTab === 'overview' ? 'Global Expenses Overview' : `${currentCompany?.name} Expenses`}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage and forecast your recurring expenses (Domains included).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Receipt size={16} className="text-blue-500" /> Active Monthly Rate
            </div>
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(monthlyTotal)}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <CalendarClock size={16} className="text-purple-500" /> Active Annual Rate
            </div>
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(annualTotal)}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Landmark size={16} className="text-emerald-500" /> True Yearly Commitment
            </div>
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(trueAnnualCommitment)}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-slate-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Ticket size={16} className="text-slate-500" /> Total One-Time / Events
            </div>
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(oneTimeTotal)}</div>
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
                          Date <SortIcon columnKey="renewalDate" />
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
                      <div key={expense.id} className={`relative pl-8 ${!isAutoRenewOn && expense.cycle !== 'one-time' ? 'opacity-50' : ''}`}>
                        <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${isAutoRenewOn || expense.cycle === 'one-time' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <div className="p-4 rounded-lg border bg-slate-50 border-slate-100 hover:shadow-md transition-shadow group flex items-start justify-between">
                          <div>
                            <div className={`text-sm font-bold mb-1 ${isAutoRenewOn || expense.cycle === 'one-time' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {isAutoRenewOn || expense.cycle === 'one-time' ? displayDate : 'CANCELED'}
                            </div>
                            <div className={`font-medium text-slate-800 cursor-pointer transition-colors mb-2 flex items-center gap-1.5 ${isAutoRenewOn || expense.cycle === 'one-time' ? 'hover:text-emerald-600' : 'line-through'}`} onClick={() => openExpenseModal(expense)}>
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
                             <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${expense.cycle === 'monthly' ? 'bg-blue-50 text-blue-600' : expense.cycle === 'annual' ? 'bg-purple-50 text-purple-600' : 'bg-slate-200 text-slate-600'}`}>
                               {expense.cycle === 'monthly' ? 'Monthly' : expense.cycle === 'annual' ? 'Annual' : 'One-Time'}
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
          <p className="text-slate-500 text-sm mt-1">Manage URLs and hosting renewals. Links directly to your Expenses.</p>
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

  const EventsDashboard = () => {
    const viewEvents = activeEventTab === 'overview' 
      ? events 
      : events.filter(e => e.companyId === activeEventTab);

    const upcomingEvents = viewEvents.filter(e => new Date(`${e.eventDate}T12:00:00`) >= new Date(new Date().setHours(0,0,0,0))).sort((a,b) => new Date(a.eventDate) - new Date(b.eventDate));
    const pastEvents = viewEvents.filter(e => new Date(`${e.eventDate}T12:00:00`) < new Date(new Date().setHours(0,0,0,0))).sort((a,b) => new Date(b.eventDate) - new Date(a.eventDate));

    const currentCompany = activeEventTab === 'overview' ? null : getCompany(activeEventTab);

    const renderEventRow = (ev) => {
        const company = getCompany(ev.companyId);
        const evDate = new Date(`${ev.eventDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        
        return (
            <tr key={ev.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
              <td className="p-4 font-bold text-slate-800 cursor-pointer hover:text-purple-600 transition-colors flex items-center gap-2" onClick={() => openEventModal(ev)}>
                <CalendarDays size={16} className="text-purple-500" />
                {ev.title}
              </td>
              {activeEventTab === 'overview' && (
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <CompanyLogo company={company} sizeClass="w-5 h-5" />
                    <span className="text-sm text-slate-600">{company?.name}</span>
                  </div>
                </td>
              )}
              <td className="p-4 text-sm font-medium text-slate-700">
                {evDate} {ev.eventTime && <span className="text-slate-400 text-xs ml-1 block">{formatTime12Hour(ev.eventTime)}</span>}
              </td>
              <td className="p-4 font-medium text-slate-700">
                {ev.cost > 0 ? formatCurrency(ev.cost) : <span className="text-slate-400 text-sm font-normal">--</span>}
                {ev.installments && ev.installments.length > 0 && <span className="text-xs text-slate-400 font-normal ml-1 border bg-slate-50 px-1 rounded">Mult</span>}
              </td>
              <td className="p-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${ev.autoProject == 1 ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {ev.autoProject == 1 ? (ev.projectLeadUnit === 'now' ? 'YES (Immediate)' : `YES (${ev.projectLeadTime}${ev.projectLeadUnit.charAt(0)})`) : 'NO'}
                </span>
              </td>
              <td className="p-4 text-right">
                 <button onClick={() => handleDeleteEvent(ev.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
               <CalendarDays className="text-purple-600" size={28} />
               {activeEventTab === 'overview' ? 'Events' : `${currentCompany?.name} Events`}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Plan for your major events.</p>
          </div>
  
          <div className="flex-1 overflow-hidden">
            {eventDisplayMode === 'list' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                   <h3 className="font-bold text-slate-700">All Scheduled Events</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="sticky top-0 bg-slate-50 z-10">
                        <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                          <th className="p-4">Event Name</th>
                          {activeEventTab === 'overview' && <th className="p-4">Company</th>}
                          <th className="p-4">Date & Time</th>
                          <th className="p-4">Estimated Cost</th>
                          <th className="p-4">Auto-Project</th>
                          <th className="p-4 w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingEvents.length > 0 && <tr><td colSpan={activeEventTab === 'overview' ? 6 : 5} className="bg-purple-50 text-purple-800 text-xs font-bold uppercase tracking-wider p-2 px-4">Upcoming</td></tr>}
                        {upcomingEvents.map(renderEventRow)}
                        
                        {pastEvents.length > 0 && <tr><td colSpan={activeEventTab === 'overview' ? 6 : 5} className="bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider p-2 px-4 border-t border-slate-200">Past Events</td></tr>}
                        {pastEvents.map(renderEventRow)}

                        {viewEvents.length === 0 && <tr><td colSpan={activeEventTab === 'overview' ? 6 : 5} className="p-8 text-center text-slate-500">No events recorded yet.</td></tr>}
                      </tbody>
                    </table>
                </div>
              </div>
            )}
  
            {eventDisplayMode === 'timeline' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
                 <h3 className="font-bold text-slate-700 mb-6">Upcoming Events Timeline</h3>
                 <div className="relative border-l-2 border-purple-100 ml-3 space-y-8 pb-8">
                    {upcomingEvents.length > 0 ? upcomingEvents.map(ev => {
                      const company = getCompany(ev.companyId);
                      const displayDate = new Date(`${ev.eventDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  
                      return (
                        <div key={ev.id} className="relative pl-8">
                          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-purple-500"></div>
                          <div className="p-4 rounded-lg border bg-slate-50 border-slate-100 hover:shadow-md transition-shadow group flex items-start justify-between">
                            <div>
                              <div className="text-sm font-bold mb-1 text-purple-600">
                                  {displayDate} {ev.eventTime && <span className="text-slate-400 font-normal ml-1">@ {formatTime12Hour(ev.eventTime)}</span>}
                              </div>
                              <div className="font-medium text-slate-800 cursor-pointer transition-colors mb-2 flex items-center gap-1.5 hover:text-purple-600" onClick={() => openEventModal(ev)}>
                                {ev.title}
                              </div>
                              <div className="flex items-center gap-2">
                                {activeEventTab === 'overview' && company && (
                                  <div className="flex items-center gap-1">
                                    <CompanyLogo company={company} sizeClass="w-4 h-4" textClass="text-[8px]" />
                                    <span className="text-[10px] text-slate-500 font-medium">{company.name}</span>
                                    <span className="text-slate-300 px-1">•</span>
                                  </div>
                                )}
                                {ev.autoProject == 1 && (
                                  <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                    Prep Project: {ev.projectLeadUnit === 'now' ? 'Created Immediately' : `${ev.projectLeadTime} ${ev.projectLeadUnit} before`}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                               {ev.cost > 0 ? (
                                   <>
                                      <div className="font-bold text-slate-800 text-lg mb-1">{formatCurrency(ev.cost)}</div>
                                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                                        {ev.installments && ev.installments.length > 0 ? 'Multi-Payment' : 'Added to Expenses'}
                                      </span>
                                   </>
                               ) : (
                                   <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">No Cost</span>
                               )}
                            </div>
                          </div>
                        </div>
                      )
                    }) : (
                       <div className="p-8 text-slate-500 text-sm">No upcoming events planned. Click the + Event button above!</div>
                    )}
                 </div>

                 {pastEvents.length > 0 && (
                     <>
                        <h3 className="font-bold text-slate-400 mb-6 mt-12 pt-6 border-t border-slate-100">Past Events</h3>
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-8">
                            {pastEvents.map(ev => {
                                const company = getCompany(ev.companyId);
                                const displayDate = new Date(`${ev.eventDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
                                return (
                                <div key={ev.id} className="relative pl-8 opacity-60 hover:opacity-100 transition-opacity">
                                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-slate-400"></div>
                                    <div className="p-3 rounded-lg border bg-white border-slate-200 group flex items-start justify-between">
                                    <div>
                                        <div className="font-medium text-slate-600 cursor-pointer flex items-center gap-1.5" onClick={() => openEventModal(ev)}>
                                           {ev.title}
                                        </div>
                                        {activeEventTab === 'overview' && (
                                            <div className="text-xs text-slate-400 mt-1">{displayDate} • {company?.name}</div>
                                        )}
                                        {activeEventTab !== 'overview' && (
                                            <div className="text-xs text-slate-400 mt-1">{displayDate}</div>
                                        )}
                                    </div>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                     </>
                 )}
              </div>
            )}
          </div>
        </div>
      );
  }

  const SpreakerDashboard = () => {
    const activeShow = spreakerShows.find(c => c.id === activeSpreakerShowId);

    if (!activeShow) {
      return (
        <div className="p-4 sm:p-8 h-full flex flex-col items-center justify-center bg-slate-50/50">
          <Mic size={64} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-500">No Spreaker Podcasts Found</h2>
          <p className="text-slate-400 mt-2 text-center max-w-md">Select a show from the sidebar or add a new one to start tracking your podcast analytics.</p>
        </div>
      );
    }

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Mic className="text-[#ffc005]" size={28} />
               {activeShow.name} Dashboard
            </h2>
            <p className="text-slate-500 text-sm mt-1">Overview of your podcast performance and reach.</p>
          </div>
        </div>

        {/* 4 MAIN STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-[#ffc005]">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Play size={16} className="text-[#ffc005]" /> Total Plays
            </div>
            <div className="text-3xl font-bold text-slate-800">{activeShow.plays || '0'}</div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Download size={16} className="text-blue-500" /> Downloads
            </div>
            <div className="text-3xl font-bold text-slate-800">{activeShow.downloads || '0'}</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-red-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Heart size={16} className="text-red-500" /> Likes
            </div>
            <div className="text-3xl font-bold text-slate-800">{activeShow.likes || '0'}</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Users size={16} className="text-emerald-500" /> Followers
            </div>
            <div className="text-3xl font-bold text-slate-800">{activeShow.followers || '0'}</div>
          </div>
        </div>

        <div className="bg-[#ffc005]/10 p-6 rounded-xl border border-[#ffc005]/20 flex flex-col items-center justify-center text-center py-12">
            <Headphones size={48} className="text-[#ffc005]/60 mb-4" />
            <h3 className="font-bold text-slate-800 text-lg mb-2">Spreaker Sync Ready</h3>
            <p className="text-slate-600 max-w-md">
                Your database is configured to store Spreaker podcast analytics! To activate this feature, you will need to map your Spreaker Personal Access Token to the backend API.
            </p>
        </div>

      </div>
    );
  };

  const YoutubeDashboard = () => {
    const activeChannel = youtubeChannels.find(c => c.id === activeYoutubeChannelId);

    if (!activeChannel) {
      return (
        <div className="p-4 sm:p-8 h-full flex flex-col items-center justify-center bg-slate-50/50">
          <Youtube size={64} className="text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-500">No YouTube Channel Selected</h2>
          <p className="text-slate-400 mt-2 text-center max-w-md">Select a channel from the sidebar or add a new one to see your stats.</p>
        </div>
      );
    }

    let topVideos = [];
    try {
        if (activeChannel.topVideos) {
            topVideos = JSON.parse(activeChannel.topVideos);
        }
    } catch(e) {
        console.error("Could not parse top videos json", e);
    }

    return (
      <div className="p-4 sm:p-8 h-full flex flex-col w-full bg-slate-50/50 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Youtube className="text-red-600" size={28} />
               {activeChannel.name} Dashboard
            </h2>
            <p className="text-slate-500 text-sm mt-1">Overview of channel performance and estimated revenue.</p>
          </div>
        </div>

        {/* 4 MAIN STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <PlaySquare size={16} className="text-blue-500" /> Views {youtubeTimeFilter === 'lifetime' ? '(Lifetime)' : `(${youtubeTimeFilter} days)`}
            </div>
            <div className="text-3xl font-bold text-slate-800">{activeChannel.views}</div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Users size={16} className="text-emerald-500" /> Subscribers
            </div>
            <div className="text-3xl font-bold text-slate-800">{activeChannel.subs}</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-purple-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <Clock size={16} className="text-purple-500" /> Watch Time (hrs)
            </div>
            <div className="text-3xl font-bold text-slate-800">{activeChannel.watchTime}</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-amber-500">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
               <DollarSign size={16} className="text-amber-500" /> Est. Revenue
            </div>
            <div className="text-3xl font-bold text-slate-800">{activeChannel.revenue}</div>
          </div>
        </div>

        {/* REALTIME CARDS */}
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex-shrink-0">Realtime (48 hours)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Views</p>
              <p className="text-2xl font-bold text-slate-800">{activeChannel.realtimeViews}</p>
            </div>
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
              <Zap size={24} className="text-red-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Subscribers</p>
              <p className="text-2xl font-bold text-slate-800">{activeChannel.realtimeSubs}</p>
            </div>
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
              <UserCircle size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* TOP CONTENT TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-shrink-0 mb-8">
           <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <PlaySquare size={18} className="text-red-600" /> Top content in this period
              </h3>
           </div>
           
           {topVideos.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="w-full text-left min-w-[600px]">
                  <thead>
                     <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white">
                        <th className="p-4 w-12 text-center">#</th>
                        <th className="p-4">Content</th>
                        <th className="p-4 text-right">Avg. view duration</th>
                        <th className="p-4 text-right">Views</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                     {topVideos.map((video, idx) => (
                        <tr key={video.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="p-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                           <td className="p-4">
                              <div className="flex items-center gap-4">
                                 {video.thumbnail ? (
                                    <img src={video.thumbnail} alt={video.title} className="w-[120px] h-[68px] object-cover rounded-md shadow-sm border border-slate-200" />
                                 ) : (
                                    <div className="w-[120px] h-[68px] bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center">
                                        <PlaySquare size={24} className="text-slate-300" />
                                    </div>
                                 )}
                                 <div className="flex flex-col justify-center">
                                    <p className="text-sm font-bold text-slate-800 line-clamp-2 max-w-md group-hover:text-blue-600 transition-colors leading-snug">{video.title}</p>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">{new Date(video.publishedAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="p-4 text-right text-sm text-slate-600 font-medium">
                              {formatAVD(video.minutes, video.views)}
                           </td>
                           <td className="p-4 text-right text-sm text-slate-800 font-bold">
                              {video.views.toLocaleString()}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
           ) : (
             <div className="p-12 text-center flex flex-col items-center">
               <Youtube size={32} className="text-slate-300 mb-3" />
               <p className="text-slate-500 font-medium">Video list will populate here when real data is connected.</p>
               <p className="text-xs text-slate-400 mt-1">Make sure you hit the Sync button in the top right.</p>
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
            ) : currentApp === 'events' ? (
              <EventsDashboard />
            ) : currentApp === 'spreaker' ? (
              <SpreakerDashboard />
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

      {/* EVENT MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-t-purple-600">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <CalendarDays className="text-purple-600" size={20} />
                {editingEvent.id ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <form id="eventForm" onSubmit={handleSaveEvent} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
                  <input required type="text" value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., CES 2027" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <select required value={editingEvent.companyId} onChange={(e) => setEditingEvent({...editingEvent, companyId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50">
                    <option value="" disabled>Select a company</option>
                    {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input required type="date" value={editingEvent.eventDate} onChange={(e) => setEditingEvent({...editingEvent, eventDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                    <input type="time" value={editingEvent.eventTime} onChange={(e) => setEditingEvent({...editingEvent, eventTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="text-sm font-bold text-slate-800">Estimated Cost / Expenses</div>
                            <div className="text-[10px] text-slate-500">Auto-generates one-time expenses for your budget.</div>
                        </div>
                        <select 
                            value={paymentMode} 
                            onChange={(e) => {
                                setPaymentMode(e.target.value);
                                if (e.target.value === 'installments' && editingEvent.installments.length === 0) {
                                    setEditingEvent({...editingEvent, installments: [{amount: '', date: ''}]});
                                }
                            }}
                            className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-slate-50 text-slate-700 focus:outline-none"
                            disabled={!!editingEvent.expenseId}
                        >
                            <option value="single">Single Payment</option>
                            <option value="installments">Multiple Installments</option>
                        </select>
                    </div>

                    {paymentMode === 'single' ? (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Amount ($)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign size={14} className="text-slate-400" />
                                    </div>
                                    <input type="number" step="0.01" min="0" value={editingEvent.cost} onChange={(e) => setEditingEvent({...editingEvent, cost: e.target.value})} className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="0.00" disabled={!!editingEvent.expenseId} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Billing Date</label>
                                <input type="date" value={editingEvent.billingDate} onChange={(e) => setEditingEvent({...editingEvent, billingDate: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" disabled={!!editingEvent.expenseId} />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-in fade-in">
                            {editingEvent.installments.map((inst, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none"><DollarSign size={12} className="text-slate-400" /></div>
                                        <input type="number" required placeholder="Amount" value={inst.amount} onChange={(e) => {
                                            const newInsts = [...editingEvent.installments];
                                            newInsts[idx].amount = e.target.value;
                                            setEditingEvent({...editingEvent, installments: newInsts});
                                        }} className="w-full pl-6 pr-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500" disabled={!!editingEvent.expenseId} />
                                    </div>
                                    <input type="date" required value={inst.date} onChange={(e) => {
                                        const newInsts = [...editingEvent.installments];
                                        newInsts[idx].date = e.target.value;
                                        setEditingEvent({...editingEvent, installments: newInsts});
                                    }} className="flex-1 px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500" disabled={!!editingEvent.expenseId} />
                                    
                                    {!editingEvent.expenseId && (
                                        <button type="button" onClick={() => {
                                            const newInsts = editingEvent.installments.filter((_, i) => i !== idx);
                                            setEditingEvent({...editingEvent, installments: newInsts});
                                        }} className="p-1.5 text-slate-400 hover:text-red-500"><X size={14}/></button>
                                    )}
                                </div>
                            ))}
                            {!editingEvent.expenseId && (
                                <button type="button" onClick={() => setEditingEvent({...editingEvent, installments: [...editingEvent.installments, {amount: '', date: ''}]})} className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-2">
                                    <Plus size={12}/> Add Installment
                                </button>
                            )}
                        </div>
                    )}

                    {editingEvent.expenseId ? (
                        <p className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 size={10}/> Expenses have been mapped to your Budget.</p>
                    ) : (
                        <p className="text-[10px] text-slate-400 mt-2 italic">Note: Changing the cost after saving will not update the generated expenses.</p>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="text-sm font-bold text-slate-800">Auto-Generate Prep Project</div>
                            <div className="text-[10px] text-slate-500">Automatically creates a project for your team to start planning.</div>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => {
                                if (editingEvent.projectId) {
                                    alert("A project has already been generated for this event. You cannot turn this off.");
                                    return;
                                }
                                setEditingEvent({...editingEvent, autoProject: !editingEvent.autoProject});
                            }}
                            className={`${editingEvent.autoProject ? 'text-purple-600' : 'text-slate-300'} transition-colors`}
                        >
                            {editingEvent.autoProject ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                        </button>
                    </div>

                    {editingEvent.autoProject && !editingEvent.projectId && (
                        <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg border border-purple-100 animate-in fade-in slide-in-from-top-2">
                            <span className="text-sm font-medium text-purple-800 flex-shrink-0">Create</span>
                            {editingEvent.projectLeadUnit !== 'now' && (
                                <input type="number" min="1" value={editingEvent.projectLeadTime} onChange={(e) => setEditingEvent({...editingEvent, projectLeadTime: e.target.value})} className="w-16 px-2 py-1 text-sm border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            )}
                            <select value={editingEvent.projectLeadUnit} onChange={(e) => setEditingEvent({...editingEvent, projectLeadUnit: e.target.value})} className="flex-1 px-2 py-1 text-sm border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-purple-800">
                                <option value="now">Immediately</option>
                                <option value="days">Days before event</option>
                                <option value="weeks">Weeks before event</option>
                                <option value="months">Months before event</option>
                                <option value="years">Years before event</option>
                            </select>
                        </div>
                    )}
                    {editingEvent.projectId && (
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                             <p className="text-xs text-purple-700 font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Prep Project has been generated!</p>
                             <p className="text-[10px] text-purple-600 mt-0.5">Check your Projects dashboard to manage tasks for this event.</p>
                        </div>
                    )}
                </div>

              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              {editingEvent.id && (
                <button type="button" onClick={() => handleDeleteEvent(editingEvent.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
              )}
              <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancel</button>
              <button type="submit" form="eventForm" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">{editingEvent.id ? 'Save Changes' : 'Create Event'}</button>
            </div>
          </div>
        </div>
      )}


      {/* SPREAKER CHANNEL MODAL */}
      {isSpreakerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-slate-800">{editingSpreakerShow.id ? 'Edit Show' : 'Add New Show'}</h3>
              <button onClick={() => setIsSpreakerModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form id="spreakerForm" onSubmit={handleSaveSpreakerShow} className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Show Name (Internal Label)</label>
                  <input required type="text" value={editingSpreakerShow.name} onChange={(e) => setEditingSpreakerShow({...editingSpreakerShow, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffc005]" placeholder="e.g., My Podcast" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Developer Token / App Token</label>
                  <input required type="text" value={editingSpreakerShow.apiToken || ''} onChange={(e) => setEditingSpreakerShow({...editingSpreakerShow, apiToken: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffc005]" placeholder="Paste Spreaker API Token..." />
                  <p className="text-xs text-slate-500 mt-2">Generate this from your Spreaker Developer Portal.</p>
                </div>
              </div>
            </form>
            <div className="p-6 mt-2 flex justify-end gap-3 border-t border-slate-100 flex-shrink-0">
              {editingSpreakerShow.id && (
                <button type="button" onClick={() => handleDeleteSpreakerShow(editingSpreakerShow.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
              )}
              <button type="button" onClick={() => setIsSpreakerModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
              <button type="submit" form="spreakerForm" className="px-4 py-2 bg-[#ffc005] hover:bg-[#e6ad04] text-slate-900 rounded-lg font-bold">{editingSpreakerShow.id ? 'Save Changes' : 'Add Show'}</button>
            </div>
          </div>
        </div>
      )}


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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Channel Name (Internal Label)</label>
                  <input required type="text" value={editingYoutubeChannel.name} onChange={(e) => setEditingYoutubeChannel({...editingYoutubeChannel, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g., My Gaming Channel" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">OAuth Refresh Token</label>
                  <input required type="text" value={editingYoutubeChannel.refreshToken || ''} onChange={(e) => setEditingYoutubeChannel({...editingYoutubeChannel, refreshToken: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="1//04J8SdfMd..." />
                  <p className="text-xs text-slate-500 mt-2">Paste the Refresh Token generated from the Google OAuth Playground.</p>
                </div>
              </div>
            </form>
            <div className="p-6 mt-2 flex justify-end gap-3 border-t border-slate-100 flex-shrink-0">
              {editingYoutubeChannel.id && (
                <button type="button" onClick={() => handleDeleteYoutubeChannel(editingYoutubeChannel.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mr-auto">Delete</button>
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
                <div className={`flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 ${currentExpense.cycle === 'one-time' ? 'hidden' : ''}`}>
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

                <div className={`grid grid-cols-2 gap-4 transition-opacity ${!currentExpense.autoRenew && currentExpense.cycle !== 'one-time' ? 'opacity-50' : ''}`}>
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
                    <select required value={currentExpense.cycle} onChange={(e) => {
                        const newCycle = e.target.value;
                        setCurrentExpense({...currentExpense, cycle: newCycle, autoRenew: newCycle === 'one-time' ? false : currentExpense.autoRenew});
                    }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annually</option>
                      <option value="one-time">One-Time / Event</option>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date <span className="text-xs text-slate-400 font-normal">(Optional)</span></label>
                  <input type="text" value={currentExpense.renewalDate} onChange={(e) => setCurrentExpense({...currentExpense, renewalDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder={currentExpense.cycle === 'one-time' ? 'e.g., 2026-11-20' : 'e.g., 1st of month, Jan 15'} />
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
                <button onClick={() => setEditingTeamMember({ id: null, name: '', email: '', password: '', isAdmin: false, canViewProjects: true, canViewBudget: false, canViewDomains: false, canViewEvents: true })} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Plus size={18}/></button>
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
                        <div className="font-medium text-slate-700 flex items-center gap-2"><CalendarDays size={16} className="text-purple-500"/> Events App</div>
                        <input type="checkbox" className="w-5 h-5 accent-purple-600 rounded" checked={editingTeamMember.canViewEvents} onChange={(e) => setEditingTeamMember({...editingTeamMember, canViewEvents: e.target.checked})} />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                        <div className="font-medium text-slate-700 flex items-center gap-2"><Wallet size={16} className="text-emerald-500"/> Expenses App</div>
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