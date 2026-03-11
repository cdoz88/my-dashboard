import React, { useState, useEffect } from 'react';
import { Menu, X, UserCircle } from 'lucide-react';

// Utils
import { API_URL } from './utils/constants';

// Shared Components
import AuthScreen from './components/auth/AuthScreen';

// Layout Components
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';

// Dashboards
import DashboardView from './components/dashboards/DashboardView';
import ArchivedProjectsView from './components/dashboards/ArchivedProjectsView';
import ProjectView from './components/dashboards/ProjectView';
import TeamCapacityView from './components/dashboards/TeamCapacityView';
import TeamDirectoryView from './components/dashboards/TeamDirectoryView';
import BudgetDashboard from './components/dashboards/BudgetDashboard';
import DomainsDashboard from './components/dashboards/DomainsDashboard';
import EventsDashboard from './components/dashboards/EventsDashboard';
import SpreakerDashboard from './components/dashboards/SpreakerDashboard';
import YoutubeDashboard from './components/dashboards/YoutubeDashboard';
import ActivityLogView from './components/dashboards/ActivityLogView';

// Modals
import TaskModal from './components/modals/TaskModal';
import ExpenseModal from './components/modals/ExpenseModal';
import DomainModal from './components/modals/DomainModal';
import EventModal from './components/modals/EventModal';
import CompanyModal from './components/modals/CompanyModal';
import ProjectModal from './components/modals/ProjectModal';
import ProfileModal from './components/modals/ProfileModal';
import SpreakerModal from './components/modals/SpreakerModal';
import YoutubeModal from './components/modals/YoutubeModal';
import TeamModal from './components/modals/TeamModal';
import SwitchUserModal from './components/modals/SwitchUserModal';
import OnboardingModal from './components/modals/OnboardingModal';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

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
  const [globalChecklist, setGlobalChecklist] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  
  // YouTube & Spreaker State
  const [youtubeChannels, setYoutubeChannels] = useState([]);
  const [activeYoutubeChannelId, setActiveYoutubeChannelId] = useState(null);
  const [youtubeTimeFilter, setYoutubeTimeFilter] = useState('28'); 
  const [spreakerShows, setSpreakerShows] = useState([]);
  const [activeSpreakerShowId, setActiveSpreakerShowId] = useState(null);
  const [spreakerTimeFilter, setSpreakerTimeFilter] = useState('30');
  
  // Modal states
  const [isSpreakerModalOpen, setIsSpreakerModalOpen] = useState(false);
  const [editingSpreakerShow, setEditingSpreakerShow] = useState({ id: null, name: '' });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '', description: '', dueDate: '', status: 'todo', projectId: '', files: [], comments: [], assigneeId: '', tags: [], weight: 1, completedAt: null, completedBy: null });
  const [newCommentText, setNewCommentText] = useState('');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({ id: null, name: '', amount: '', cycle: 'monthly', category: 'Tools', companyId: '', renewalDate: '', notes: '', autoRenew: true });
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState({ id: null, name: '', amount: '', cycle: 'annual', category: 'Domains', companyId: '', renewalDate: '', notes: '', autoRenew: true });
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState({ id: null, name: '', logoUrl: '', userIds: [] });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState({ id: null, name: '', companyId: '', icon: 'FolderKanban', color: 'slate', isArchived: false });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', title: '', venmo: '', password: '', avatarUrl: '' });
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [isSwitchUserModalOpen, setIsSwitchUserModalOpen] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(() => localStorage.getItem('loggedInUserId') || null);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [editingYoutubeChannel, setEditingYoutubeChannel] = useState({ id: null, name: '' });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState({ id: null, title: '', companyId: '', eventDate: '', eventTime: '', cost: '', autoProject: false, projectLeadTime: 1, projectLeadUnit: 'months', billingDate: '', installments: [] });
  const [paymentMode, setPaymentMode] = useState('single');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // View States
  const [activeTab, setActiveTab] = useState('mytasks'); 
  const [projectDisplayMode, setProjectDisplayMode] = useState('list');
  const [activeBudgetTab, setActiveBudgetTab] = useState('overview'); 
  const [budgetDisplayMode, setBudgetDisplayMode] = useState('list'); 
  const [expenseSortConfig, setExpenseSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [activeDomainTab, setActiveDomainTab] = useState('overview');
  const [domainDisplayMode, setDomainDisplayMode] = useState('list'); 
  const [domainSortConfig, setDomainSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [activeEventTab, setActiveEventTab] = useState('overview');
  const [eventDisplayMode, setEventDisplayMode] = useState('timeline');
  const [activeTeamTab, setActiveTeamTab] = useState('overview');
  const [activeActivityTab, setActiveActivityTab] = useState('overview');

  const currentUser = users.find(u => u.id === loggedInUserId);
  const visibleCompanies = companies.filter(c => currentUser?.isAdmin || (c.userIds && c.userIds.includes(currentUser?.id)));

  useEffect(() => {
    if (currentUser) localStorage.setItem('loggedInUserId', currentUser.id);
    else localStorage.removeItem('loggedInUserId');
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentApp === 'budget' && !currentUser.isAdmin && !currentUser.canViewBudget) setCurrentApp('projects');
      if (currentApp === 'domains' && !currentUser.isAdmin && !currentUser.canViewDomains) setCurrentApp('projects');
      if (currentApp === 'events' && !currentUser.isAdmin && !currentUser.canViewEvents) setCurrentApp('projects');
      if (currentApp === 'spreaker' && !currentUser.isAdmin && !currentUser.canViewSpreaker) setCurrentApp('projects');
      if (currentApp === 'youtube' && !currentUser.isAdmin && !currentUser.canViewYoutube) setCurrentApp('projects');
      if (currentApp === 'activity' && !currentUser.isAdmin) setCurrentApp('projects');
    }
  }, [currentUser, currentApp]);

  useEffect(() => {
    fetch(`${API_URL}?action=get_all`)
      .then(res => res.json())
      .then(data => {
        if(data.users) {
           setUsers(data.users.map(u => ({
               ...u,
               isAdmin: u.isAdmin == 1 || u.isAdmin === true,
               canViewProjects: u.canViewProjects == 1 || u.canViewProjects === true,
               canViewBudget: u.canViewBudget == 1 || u.canViewBudget === true,
               canViewDomains: u.canViewDomains == 1 || u.canViewDomains === true,
               canViewEvents: u.canViewEvents == 1 || u.canViewEvents === true || u.canViewEvents === undefined, 
               canViewSpreaker: u.canViewSpreaker == 1 || u.canViewSpreaker === true || u.canViewSpreaker === undefined, 
               canViewYoutube: u.canViewYoutube == 1 || u.canViewYoutube === true || u.canViewYoutube === undefined,
               phone: u.phone || '',
               title: u.title || '',
               venmo: u.venmo || '',
           })));
        }
        
        if (data.settings && data.settings.globalOnboardingChecklist) {
            try { setGlobalChecklist(JSON.parse(data.settings.globalOnboardingChecklist)); } catch(e) {}
        } else {
            const localSaved = localStorage.getItem('globalOnboardingChecklist');
            if (localSaved) {
                try { setGlobalChecklist(JSON.parse(localSaved)); } catch(e) {}
                fetch(`${API_URL}?action=save_setting`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key_name: 'globalOnboardingChecklist', setting_value: localSaved }) });
            } else {
                setGlobalChecklist([{ id: '1', text: 'Company Email Address' }, { id: '2', text: 'Add to Google Chat' }]);
            }
        }

        if(data.companies) setCompanies(data.companies);
        if(data.projects) setProjects(data.projects);
        if(data.tasks) setTasks(data.tasks.map(t => ({ ...t, tags: Array.isArray(t.tags) ? t.tags.map(tag => tag === 'See Notes' ? 'See Comments' : tag) : [] })));
        if(data.expenses) setExpenses(data.expenses);
        if(data.events) setEvents(data.events);
        
        // Failsafe state injector
        if(data.activity_logs) setActivityLogs(Array.isArray(data.activity_logs) ? data.activity_logs : []);
        else setActivityLogs([]);
        
        if(data.youtube_channels) {
            setYoutubeChannels(data.youtube_channels);
            if(data.youtube_channels.length > 0 && !activeYoutubeChannelId) setActiveYoutubeChannelId(data.youtube_channels[0].id);
        }
        if(data.spreaker_shows) {
            setSpreakerShows(data.spreaker_shows);
            if(data.spreaker_shows.length > 0 && !activeSpreakerShowId) setActiveSpreakerShowId(data.spreaker_shows[0].id);
        }
        setIsLoading(false);
      })
      .catch(err => { console.error("Failed to connect to API:", err); setIsLoading(false); });
  }, []);

  const sendToAPI = async (action, data) => {
    try { await fetch(`${API_URL}?action=${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
    catch (err) { console.error(`Error with ${action}:`, err); }
  };

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_URL}?action=upload_file`, { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) return data.url;
      alert('Upload failed: ' + data.error);
      return null;
    } catch (err) { alert('Upload error: Server could not be reached.'); return null; }
  };

  // --- LOGGING ENGINE ---
  const logActivity = (category, type, description) => {
    const newLog = {
      id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 5),
      userId: currentUser?.id || 'system',
      actionCategory: category,
      actionType: type,
      description: description,
      timestamp: new Date().toISOString()
    };
    // Safe prev injector to guarantee array formatting
    setActivityLogs(prev => [newLog, ...(Array.isArray(prev) ? prev : [])]);
    sendToAPI('save_log', newLog);
  };

  const handleSaveGlobalChecklist = (newList) => {
    setGlobalChecklist(newList);
    sendToAPI('save_setting', { key_name: 'globalOnboardingChecklist', setting_value: JSON.stringify(newList) });
  };

  useEffect(() => {
     if (events.length > 0 && currentUser?.isAdmin) {
         events.forEach(event => {
             let updatedEvent = null;
             
             if (!event.expenseId) {
                 const isInstallments = event.installments && event.installments.length > 0;
                 const hasCost = parseFloat(event.cost) > 0;
                 if (isInstallments) {
                     const newIds = [];
                     let tempExpenses = [];
                     event.installments.forEach((inst, idx) => {
                         const newExpenseId = 'e' + Date.now() + idx + Math.random().toString(36).substr(2, 5);
                         newIds.push(newExpenseId);
                         const newExpense = { id: newExpenseId, companyId: event.companyId, name: `Event: ${event.title} (Installment ${idx + 1})`, category: 'Company Expense', amount: inst.amount, cycle: 'one-time', renewalDate: inst.date, notes: `Auto-generated installment for event ${event.title}`, autoRenew: false };
                         sendToAPI('save_expense', newExpense);
                         tempExpenses.push(newExpense);
                     });
                     setExpenses(prev => [...prev, ...tempExpenses]);
                     updatedEvent = { ...event, expenseId: newIds.join(',') };
                 } else if (hasCost) {
                     const newExpenseId = 'e' + Date.now() + Math.random().toString(36).substr(2, 5);
                     const newExpense = { id: newExpenseId, companyId: event.companyId, name: `Event: ${event.title}`, category: 'Company Expense', amount: event.cost, cycle: 'one-time', renewalDate: event.billingDate || event.eventDate, notes: `Auto-generated for event ${event.title}`, autoRenew: false };
                     sendToAPI('save_expense', newExpense);
                     setExpenses(prev => [...prev, newExpense]);
                     updatedEvent = { ...event, expenseId: newExpenseId };
                 }
             }

             if ((event.autoProject == 1 || event.autoProject === true) && !event.projectId && event.eventDate) {
                 const eventDateObj = new Date(`${event.eventDate}T12:00:00`); 
                 let triggerDate = new Date(eventDateObj);
                 if (event.projectLeadUnit === 'now') {
                     triggerDate = new Date(0);
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
                     const newProject = { id: newProjectId, companyId: event.companyId, name: `${event.title} (Event Prep)`, icon: 'CalendarDays', color: 'purple' };
                     sendToAPI('save_project', newProject);
                     setProjects(prev => [...prev, newProject]);
                     updatedEvent = { ...(updatedEvent || event), projectId: newProjectId };
                 }
             }

             if (updatedEvent) {
                 sendToAPI('save_event', updatedEvent);
                 setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
             }
         });
     }
  }, [events, currentUser]); 

  // --- OAUTH CALLBACK LISTENER ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDesc = urlParams.get('error_description');
    
    const pendingYtName = localStorage.getItem('pendingYtName');
    const pendingSpAuth = localStorage.getItem('pendingSpAuth');
    const redirectUri = window.location.protocol + "//" + window.location.host + window.location.pathname;

    if (error && (pendingYtName || pendingSpAuth)) {
        alert("Authorization failed: " + (errorDesc ? errorDesc.replace(/\+/g, ' ') : error));
        localStorage.removeItem('pendingYtName');
        localStorage.removeItem('pendingYtId');
        localStorage.removeItem('pendingSpAuth');
        window.history.replaceState({path: redirectUri}, '', redirectUri);
        return;
    }

    if (code && pendingYtName) {
        setIsLoading(true);
        const pendingYtId = localStorage.getItem('pendingYtId');
        window.history.replaceState({path: redirectUri}, '', redirectUri);

        fetch(`${API_URL}?action=exchange_youtube_code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirect_uri: redirectUri, name: pendingYtName, id: pendingYtId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) { alert('Failed to connect YouTube: ' + data.error); } 
            else {
                setCurrentApp('youtube');
                fetch(`${API_URL}?action=get_all`).then(r => r.json()).then(freshData => {
                    if(freshData.youtube_channels) {
                        setYoutubeChannels(freshData.youtube_channels);
                        if (pendingYtId) setActiveYoutubeChannelId(pendingYtId);
                        else if (freshData.youtube_channels.length > 0) setActiveYoutubeChannelId(freshData.youtube_channels[freshData.youtube_channels.length - 1].id);
                    }
                });
            }
            localStorage.removeItem('pendingYtName');
            localStorage.removeItem('pendingYtId');
            setIsLoading(false);
        })
        .catch(err => {
            alert("Server error during YouTube connection.");
            localStorage.removeItem('pendingYtName');
            localStorage.removeItem('pendingYtId');
            setIsLoading(false);
        });

    } else if (code && pendingSpAuth) {
        setIsLoading(true);
        window.history.replaceState({path: redirectUri}, '', redirectUri);

        fetch(`${API_URL}?action=exchange_spreaker_code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirect_uri: redirectUri })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert('Failed to connect Spreaker: ' + data.error);
                setIsLoading(false);
            } else {
                setCurrentApp('spreaker');
                fetch(`${API_URL}?action=sync_spreaker&days=30`)
                .then(() => fetch(`${API_URL}?action=get_all`))
                .then(r => r.json())
                .then(freshData => {
                    if(freshData.spreaker_shows) {
                        setSpreakerShows(freshData.spreaker_shows);
                        if (freshData.spreaker_shows.length > 0) setActiveSpreakerShowId(freshData.spreaker_shows[0].id);
                    }
                    setIsLoading(false);
                });
            }
            localStorage.removeItem('pendingSpAuth');
        })
        .catch(err => {
            alert("Server error during Spreaker connection.");
            localStorage.removeItem('pendingSpAuth');
            setIsLoading(false);
        });
    }
  }, []); 

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
    } catch (err) { alert("An error occurred during sync. Check your server connection."); }
    setIsLoading(false);
  };

  const handleYoutubeFilterChange = (e) => { setYoutubeTimeFilter(e.target.value); handleSyncYoutube(e.target.value); };
  const handleSyncYoutube = async (overrideDays = null) => {
    const daysToSync = typeof overrideDays === 'string' ? overrideDays : youtubeTimeFilter;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=sync_youtube&days=${daysToSync}`);
      const data = await response.json();
      if (data.error) {
        let errorMsg = "YouTube Sync Failed: " + data.error;
        if (data.details && data.details.length > 0) errorMsg += "\n\nDetails:\n" + data.details.join("\n");
        alert(errorMsg);
      } else {
        const refresh = await fetch(`${API_URL}?action=get_all`);
        const freshData = await refresh.json();
        if(freshData.youtube_channels) {
            setYoutubeChannels(freshData.youtube_channels);
            if(freshData.youtube_channels.length > 0 && !activeYoutubeChannelId) setActiveYoutubeChannelId(freshData.youtube_channels[0].id);
        }
      }
    } catch (err) { alert("An error occurred during sync. Check your server connection."); }
    setIsLoading(false);
  };

  const handleSpreakerFilterChange = (e) => { setSpreakerTimeFilter(e.target.value); handleSyncSpreaker(e.target.value); };
  const handleSyncSpreaker = async (overrideDays = null) => {
    const daysToSync = typeof overrideDays === 'string' ? overrideDays : spreakerTimeFilter;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=sync_spreaker&days=${daysToSync}`);
      const data = await response.json();
      if (data.error) {
        let errorMsg = "Spreaker Sync Failed: " + data.error;
        if (data.details && data.details.length > 0) errorMsg += "\n\nDetails:\n" + data.details.join("\n");
        alert(errorMsg);
      } else {
        const refresh = await fetch(`${API_URL}?action=get_all`);
        const freshData = await refresh.json();
        if(freshData.spreaker_shows) {
            setSpreakerShows(freshData.spreaker_shows);
            if(freshData.spreaker_shows.length > 0 && !activeSpreakerShowId) setActiveSpreakerShowId(freshData.spreaker_shows[0].id);
        }
      }
    } catch (err) { alert("An error occurred during sync. Check your server connection."); }
    setIsLoading(false);
  };

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

        let amount = 0, cycle = 'monthly', autoRenew = true;
        const col1Str = (cols[1] || '').toLowerCase(), col2Str = (cols[2] || '').toLowerCase(), notesStr = (cols[7] || cols[6] || '').toLowerCase();
        if (col1Str.includes('ar off') || col2Str.includes('ar off') || notesStr.includes('ar off')) autoRenew = false;
        
        const monthlyStr = col1Str.replace(/[^0-9.]/g, ''), annualStr = col2Str.replace(/[^0-9.]/g, '');
        if (monthlyStr && parseFloat(monthlyStr) > 0) { amount = parseFloat(monthlyStr); cycle = 'monthly'; } 
        else if (annualStr && parseFloat(annualStr) > 0) { amount = parseFloat(annualStr); cycle = 'annual'; } 
        else if (autoRenew) continue; 
        else amount = 0; 

        const renewalDate = cols[4] || '';
        const notes = cols[7] || cols[6] || '';
        let category = isDomain ? 'Domains' : 'Other';
        if (!isDomain) {
           if (name.toLowerCase().includes('.com') || name.toLowerCase().includes('.network')) category = 'Domains';
           else if (amount > 1000) category = 'Company Expense';
           else if (cols[1] && cols[2]) category = 'Website';
           else category = 'Tools';
        }
        const expenseData = { id: 'e' + Date.now() + Math.random().toString(36).substr(2, 5), companyId, name, amount, cycle, category, renewalDate, notes, autoRenew };
        setExpenses(prev => [...prev, expenseData]);
        await sendToAPI('save_expense', expenseData);
        importedCount++;
      }
      alert(`Successfully imported ${importedCount} items from the CSV!`);
      e.target.value = null; 
    };
    reader.readAsText(file);
  };

  const openTaskModal = (task = null, projectId = '', status = 'todo') => {
    if (task) setCurrentTask({ ...task, files: task.files || [], comments: task.comments || [], description: task.description || '', tags: task.tags || [], weight: task.weight || 1, completedAt: task.completedAt || null, completedBy: task.completedBy || null });
    else setCurrentTask({ title: '', description: '', dueDate: '', status, projectId, files: [], comments: [], assigneeId: currentUser?.id, tags: [], weight: 1, completedAt: null, completedBy: null });
    setNewCommentText('');
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    const isNew = !currentTask.id;
    const taskData = currentTask.id ? currentTask : { ...currentTask, id: 't' + Date.now(), projectId: currentTask.projectId || activeTab };
    
    if (isNew) {
        logActivity('Tasks', 'Task Added', `Created task "${taskData.title}"`);
    } else {
        const oldTask = tasks.find(t => t.id === taskData.id);
        if (oldTask) {
            if (oldTask.status !== taskData.status) {
                logActivity('Tasks', 'Task Status Update', `Changed status of "${taskData.title}" to ${taskData.status}`);
            }
            if (JSON.stringify(oldTask.tags) !== JSON.stringify(taskData.tags)) {
                logActivity('Tasks', 'Task Tag Changes', `Updated tags for "${taskData.title}"`);
            }
        }
    }

    if (currentTask.id) setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    else setTasks([...tasks, taskData]);
    setIsTaskModalOpen(false);
    sendToAPI('save_task', taskData);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setIsTaskModalOpen(false);
    sendToAPI('delete_task', { id: taskId });
  };

  const handleToggleTaskStatus = (task) => {
    const isNowDone = task.status !== 'done';
    const newStatus = isNowDone ? 'done' : 'todo';
    const updatedTask = { ...task, status: newStatus, completedAt: isNowDone ? new Date().toISOString() : null, completedBy: isNowDone ? currentUser.id : null };
    logActivity('Tasks', 'Task Status Update', `Changed status of "${task.title}" to ${newStatus}`);
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    sendToAPI('save_task', updatedTask);
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newComment = { id: 'c' + Date.now(), text: newCommentText.trim(), userId: currentUser.id, timestamp: new Date().toISOString() };
    const updatedTask = { ...currentTask, comments: [...(currentTask.comments || []), newComment] };
    
    logActivity('Tasks', 'Comment Added', `Added a comment to "${currentTask.title}"`);
    setCurrentTask(updatedTask);
    setNewCommentText('');
    if (updatedTask.id) {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        sendToAPI('save_task', updatedTask);
    }
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
    setIsExpenseModalOpen(false);
    setIsDomainModalOpen(false);
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
    if (paymentMode === 'installments') {
        finalCost = editingEvent.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
    }
    const isNew = !editingEvent.id;
    const eventData = editingEvent.id 
        ? { ...editingEvent, cost: finalCost, installments: paymentMode === 'installments' ? editingEvent.installments : [] } 
        : { ...editingEvent, id: 'ev' + Date.now(), cost: finalCost, installments: paymentMode === 'installments' ? editingEvent.installments : [] };
    
    if (isNew) logActivity('Events', 'Event Added', `Added event "${eventData.title}"`);

    if (editingEvent.id) setEvents(events.map(ev => ev.id === eventData.id ? eventData : ev));
    else setEvents([...events, eventData]);
    setIsEventModalOpen(false);
    sendToAPI('save_event', eventData);
  };

  const handleDeleteEvent = (eventId) => {
    const ev = events.find(e => e.id === eventId);
    if (ev) logActivity('Events', 'Event Deleted', `Deleted event "${ev.title}"`);

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
    if (editingCompany.userIds.includes(userId)) setEditingCompany({ ...editingCompany, userIds: editingCompany.userIds.filter(id => id !== userId) });
    else setEditingCompany({ ...editingCompany, userIds: [...editingCompany.userIds, userId] });
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
    if (projectToEdit) setEditingProject({ ...projectToEdit, isArchived: projectToEdit.isArchived == 1 || projectToEdit.isArchived === true });
    else setEditingProject({ id: null, name: '', companyId: companyId || companies[0]?.id || '', icon: 'FolderKanban', color: 'slate', isArchived: false });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!editingProject.name.trim() || !editingProject.companyId) return;
    const isNew = !editingProject.id;
    const projectData = editingProject.id ? editingProject : { ...editingProject, id: 'p' + Date.now() };
    
    if (isNew) logActivity('Projects', 'New Project Created', `Created project "${projectData.name}"`);

    if (editingProject.id) setProjects(projects.map(p => p.id === projectData.id ? projectData : p));
    else {
      setProjects([...projects, projectData]);
      setActiveTab(projectData.id);
    }
    setIsProjectModalOpen(false);
    sendToAPI('save_project', projectData);
  };

  const handleArchiveProject = (project) => {
     const updated = { ...project, isArchived: true };
     setProjects(projects.map(p => p.id === project.id ? updated : p));
     logActivity('Projects', 'Project Archived', `Archived project "${project.name}"`);
     sendToAPI('save_project', updated);
     if (activeTab === project.id) setActiveTab('mytasks');
     setIsProjectModalOpen(false);
  };

  const handleRestoreProject = (project) => {
     const updated = { ...project, isArchived: false };
     setProjects(projects.map(p => p.id === project.id ? updated : p));
     sendToAPI('save_project', updated);
     setIsProjectModalOpen(false);
  };

  const handlePermanentDeleteProject = (projectId) => {
     const proj = projects.find(p => p.id === projectId);
     tasks.filter(t => t.projectId === projectId).forEach(t => sendToAPI('delete_task', { id: t.id }));
     setTasks(tasks.filter(t => t.projectId !== projectId));
     setProjects(projects.filter(p => p.id !== projectId));
     
     if (proj) logActivity('Projects', 'Project Deleted', `Permanently deleted project "${proj.name}"`);

     if (activeTab === projectId) setActiveTab('mytasks');
     setIsProjectModalOpen(false);
     sendToAPI('delete_project', { id: projectId });
  };

  const openYoutubeModal = (channel = null) => {
    if (channel) setEditingYoutubeChannel({ ...channel });
    else setEditingYoutubeChannel({ id: null, name: '' });
    setIsYoutubeModalOpen(true);
  };

  const handleSaveYoutubeChannel = (e) => {
    e.preventDefault();
    if (!editingYoutubeChannel.name.trim()) { alert("Please provide a Channel Name."); return; }
    
    const redirectUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const clientId = '985277958318-3ubsghnc9fj8010949mhskta84g2mds4.apps.googleusercontent.com';
    const scope = encodeURIComponent('https://www.googleapis.com/auth/yt-analytics-monetary.readonly https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly');
    
    localStorage.setItem('pendingYtName', editingYoutubeChannel.name);
    if (editingYoutubeChannel.id) {
        localStorage.setItem('pendingYtId', editingYoutubeChannel.id);
    } else {
        localStorage.removeItem('pendingYtId');
    }
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    setIsYoutubeModalOpen(false);
    window.location.href = authUrl;
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
    if (show) setEditingSpreakerShow({ ...show });
    else setEditingSpreakerShow({ id: null, name: '' });
    setIsSpreakerModalOpen(true);
  };

  const handleSaveSpreakerShow = (e) => {
    e.preventDefault();
    
    const redirectUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const clientId = '29162'; 
    
    localStorage.setItem('pendingSpAuth', 'true');

    const authUrl = `https://www.spreaker.com/oauth2/authorize?client_id=${clientId}&response_type=code&state=spreaker&scope=basic&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    setIsSpreakerModalOpen(false);
    window.location.href = authUrl; 
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
      setProfileForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone || '', title: currentUser.title || '', venmo: currentUser.venmo || '', password: '', avatarUrl: currentUser.avatarUrl });
      setIsProfileModalOpen(true);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...currentUser, name: profileForm.name, email: profileForm.email, phone: profileForm.phone, title: profileForm.title, venmo: profileForm.venmo, password: profileForm.password, avatarUrl: profileForm.avatarUrl };
    const localUser = { ...updatedUser };
    delete localUser.password;
    if (users.find(u => u.id === currentUser.id)) setUsers(users.map(u => u.id === currentUser.id ? localUser : u));
    else setUsers([...users, localUser]);
    setIsProfileModalOpen(false);
    sendToAPI('save_user', updatedUser);
  };

  const handleSaveTeamMember = (e) => {
    e.preventDefault();
    const isNew = !editingTeamMember.id;
    const userToSave = { ...editingTeamMember };
    if (!userToSave.id) userToSave.id = 'u' + Date.now();
    const localUser = { ...userToSave };
    delete localUser.password; 

    if (isNew) {
        logActivity('Team', 'New Member Added', `Added "${userToSave.name}" to the team directory.`);
    }

    if (users.find(u => u.id === userToSave.id)) setUsers(users.map(u => u.id === userToSave.id ? localUser : u));
    else setUsers([...users, localUser]);

    if (editingTeamMember.companyIds !== undefined) {
        const newCompanies = companies.map(c => {
           const hasUser = editingTeamMember.companyIds.includes(c.id);
           const userIds = c.userIds || [];
           if (hasUser && !userIds.includes(userToSave.id)) return { ...c, userIds: [...userIds, userToSave.id] };
           if (!hasUser && userIds.includes(userToSave.id)) return { ...c, userIds: userIds.filter(id => id !== userToSave.id) };
           return c;
        });
        setCompanies(newCompanies);
    }

    sendToAPI('save_user', userToSave);
    setEditingTeamMember(null);
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;
    if (!window.confirm(`Are you sure you want to completely remove ${userToDelete.name} from the workspace?`)) return;

    logActivity('Team', 'Team Member Removed', `Removed team member "${userToDelete.name}" from the directory.`);
    
    setUsers(users.filter(u => u.id !== userId));
    setIsTeamModalOpen(false);
    sendToAPI('delete_user', { id: userId });
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    sendToAPI('save_user', updatedUser);
  };

  const handleCompanyLogoUpload = async (e) => {
    if (e.target.files[0]) { setIsUploading(true); const url = await uploadFileToServer(e.target.files[0]); if (url) setEditingCompany({ ...editingCompany, logoUrl: url }); setIsUploading(false); }
  };
  const handleProfileImageUpload = async (e) => {
    if (e.target.files[0]) { setIsUploading(true); const url = await uploadFileToServer(e.target.files[0]); if (url) setProfileForm({ ...profileForm, avatarUrl: url }); setIsUploading(false); }
  };
  const handleTeamMemberImageUpload = async (e) => {
    if (e.target.files[0]) { setIsUploading(true); const url = await uploadFileToServer(e.target.files[0]); if (url) setEditingTeamMember({ ...editingTeamMember, avatarUrl: url }); setIsUploading(false); }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    const uploadedFiles = [];
    for (const file of files) { const url = await uploadFileToServer(file); if (url) uploadedFiles.push({ name: file.name, url: url }); }
    setCurrentTask({ ...currentTask, files: [...(currentTask.files || []), ...uploadedFiles] });
    setIsUploading(false);
    e.target.value = null; 
  };
  const removeFile = (indexToRemove) => setCurrentTask({ ...currentTask, files: currentTask.files.filter((_, i) => i !== indexToRemove) });

  const handleDragStart = (e, taskId) => e.dataTransfer.setData('taskId', taskId);
  const handleDrop = (e, newStatus) => {
     const taskId = e.dataTransfer.getData('taskId');
     const task = tasks.find(t => t.id === taskId);
     if(task && task.status !== newStatus) {
        logActivity('Tasks', 'Task Status Update', `Changed status of "${task.title}" to ${newStatus}`);
        const updatedTask = { ...task, status: newStatus, completedAt: newStatus === 'done' ? new Date().toISOString() : null, completedBy: newStatus === 'done' ? currentUser.id : null };
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
        sendToAPI('save_task', updatedTask);
     }
  };
  const handleDragOver = (e) => e.preventDefault();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen users={users} setUsers={setUsers} setLoggedInUserId={setLoggedInUserId} sendToAPI={sendToAPI} />;
  }

  return (
    <>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden flex-col lg:flex-row">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        <div className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out pb-16 lg:pb-0`}>
          <Sidebar 
             currentApp={currentApp} setCurrentApp={setCurrentApp} activeTab={activeTab} setActiveTab={setActiveTab}
             isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} currentUser={currentUser}
             users={users} companies={companies} visibleCompanies={visibleCompanies} projects={projects} tasks={tasks} events={events}
             youtubeChannels={youtubeChannels} spreakerShows={spreakerShows} activeBudgetTab={activeBudgetTab} setActiveBudgetTab={setActiveBudgetTab}
             activeDomainTab={activeDomainTab} setActiveDomainTab={setActiveDomainTab} activeEventTab={activeEventTab} setActiveEventTab={setActiveEventTab}
             activeYoutubeChannelId={activeYoutubeChannelId} setActiveYoutubeChannelId={setActiveYoutubeChannelId}
             activeSpreakerShowId={activeSpreakerShowId} setActiveSpreakerShowId={setActiveSpreakerShowId}
             openCompanyModal={openCompanyModal} openProjectModal={openProjectModal} openYoutubeModal={openYoutubeModal} openSpreakerModal={openSpreakerModal}
             openProfileModal={openProfileModal} setIsTeamModalOpen={setIsTeamModalOpen} setIsSwitchUserModalOpen={setIsSwitchUserModalOpen}
             activeTeamTab={activeTeamTab} setActiveTeamTab={setActiveTeamTab} activeActivityTab={activeActivityTab} setActiveActivityTab={setActiveActivityTab}
          />
        </div>
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
          <TopBar 
             currentApp={currentApp} setCurrentApp={setCurrentApp} isAppSwitcherOpen={isAppSwitcherOpen} setIsAppSwitcherOpen={setIsAppSwitcherOpen}
             isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} currentUser={currentUser} activeTab={activeTab}
             activeBudgetTab={activeBudgetTab} activeDomainTab={activeDomainTab} activeEventTab={activeEventTab}
             projectDisplayMode={projectDisplayMode} setProjectDisplayMode={setProjectDisplayMode}
             budgetDisplayMode={budgetDisplayMode} setBudgetDisplayMode={setBudgetDisplayMode}
             domainDisplayMode={domainDisplayMode} setDomainDisplayMode={setDomainDisplayMode}
             eventDisplayMode={eventDisplayMode} setEventDisplayMode={setEventDisplayMode}
             youtubeTimeFilter={youtubeTimeFilter} handleYoutubeFilterChange={handleYoutubeFilterChange} handleSyncYoutube={handleSyncYoutube}
             spreakerTimeFilter={spreakerTimeFilter} handleSpreakerFilterChange={handleSpreakerFilterChange} handleSyncSpreaker={handleSyncSpreaker}
             openTaskModal={openTaskModal} openExpenseModal={openExpenseModal} openDomainModal={openDomainModal} openEventModal={openEventModal}
             handleImportCSV={handleImportCSV} handleSyncGoDaddy={handleSyncGoDaddy}
          />
          <main className="flex-1 overflow-auto relative pb-16 lg:pb-0">
            {currentApp === 'projects' ? (
              activeTab === 'mytasks' ? <DashboardView tasks={tasks} currentUser={currentUser} projects={projects} companies={companies} users={users} handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask} /> : 
              activeTab === 'capacity' ? <TeamCapacityView users={users} tasks={tasks} projects={projects} /> : 
              activeTab === 'archived' ? <ArchivedProjectsView projects={projects} companies={companies} handlePermanentDeleteProject={handlePermanentDeleteProject} handleRestoreProject={handleRestoreProject} /> :
              <ProjectView projectId={activeTab} projects={projects} tasks={tasks} companies={companies} users={users} projectDisplayMode={projectDisplayMode} handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask} handleDragStart={handleDragStart} handleDrop={handleDrop} handleDragOver={handleDragOver} />
            ) : currentApp === 'budget' ? (
              <BudgetDashboard expenses={expenses} activeBudgetTab={activeBudgetTab} budgetDisplayMode={budgetDisplayMode} expenseSortConfig={expenseSortConfig} setExpenseSortConfig={setExpenseSortConfig} openExpenseModal={openExpenseModal} handleDeleteExpense={handleDeleteExpense} companies={companies} />
            ) : currentApp === 'domains' ? (
              <DomainsDashboard expenses={expenses} activeDomainTab={activeDomainTab} domainDisplayMode={domainDisplayMode} domainSortConfig={domainSortConfig} setDomainSortConfig={setDomainSortConfig} openDomainModal={openDomainModal} handleDeleteExpense={handleDeleteExpense} companies={companies} />
            ) : currentApp === 'events' ? (
              <EventsDashboard events={events} activeEventTab={activeEventTab} eventDisplayMode={eventDisplayMode} openEventModal={openEventModal} handleDeleteEvent={handleDeleteEvent} companies={companies} />
            ) : currentApp === 'spreaker' ? (
              <SpreakerDashboard spreakerShows={spreakerShows} activeSpreakerShowId={activeSpreakerShowId} spreakerTimeFilter={spreakerTimeFilter} />
            ) : currentApp === 'team' ? (
              <TeamDirectoryView users={users} currentUser={currentUser} handleUpdateUser={handleUpdateUser} setIsOnboardingModalOpen={setIsOnboardingModalOpen} companies={companies} visibleCompanies={visibleCompanies} activeTeamTab={activeTeamTab} globalChecklist={globalChecklist} />
            ) : currentApp === 'activity' ? (
              <ActivityLogView activityLogs={activityLogs} users={users} activeActivityTab={activeActivityTab} />
            ) : (
              <YoutubeDashboard youtubeChannels={youtubeChannels} activeYoutubeChannelId={activeYoutubeChannelId} youtubeTimeFilter={youtubeTimeFilter} />
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

      {isTaskModalOpen && <TaskModal currentTask={currentTask} setCurrentTask={setCurrentTask} handleSaveTask={handleSaveTask} handleDeleteTask={handleDeleteTask} setIsTaskModalOpen={setIsTaskModalOpen} users={users} isUploading={isUploading} handleFileUpload={handleFileUpload} removeFile={removeFile} newCommentText={newCommentText} setNewCommentText={setNewCommentText} handleAddComment={handleAddComment} currentUser={currentUser} />}
      {isExpenseModalOpen && <ExpenseModal currentExpense={currentExpense} setCurrentExpense={setCurrentExpense} handleSaveExpense={handleSaveExpense} handleDeleteExpense={handleDeleteExpense} setIsExpenseModalOpen={setIsExpenseModalOpen} visibleCompanies={visibleCompanies} />}
      {isDomainModalOpen && <DomainModal currentDomain={currentDomain} setCurrentDomain={setCurrentDomain} handleSaveDomain={handleSaveDomain} handleDeleteExpense={handleDeleteExpense} setIsDomainModalOpen={setIsDomainModalOpen} visibleCompanies={visibleCompanies} />}
      {isEventModalOpen && <EventModal editingEvent={editingEvent} setEditingEvent={setEditingEvent} paymentMode={paymentMode} setPaymentMode={setPaymentMode} handleSaveEvent={handleSaveEvent} handleDeleteEvent={handleDeleteEvent} setIsEventModalOpen={setIsEventModalOpen} visibleCompanies={visibleCompanies} />}
      {isCompanyModalOpen && <CompanyModal editingCompany={editingCompany} setEditingCompany={setEditingCompany} handleSaveCompany={handleSaveCompany} handleDeleteCompany={handleDeleteCompany} setIsCompanyModalOpen={setIsCompanyModalOpen} users={users} toggleCompanyUser={toggleCompanyUser} handleCompanyLogoUpload={handleCompanyLogoUpload} isUploading={isUploading} />}
      {isProjectModalOpen && <ProjectModal editingProject={editingProject} setEditingProject={setEditingProject} handleSaveProject={handleSaveProject} handleArchiveProject={handleArchiveProject} handlePermanentDeleteProject={handlePermanentDeleteProject} setIsProjectModalOpen={setIsProjectModalOpen} visibleCompanies={visibleCompanies} />}
      {isProfileModalOpen && <ProfileModal profileForm={profileForm} setProfileForm={setProfileForm} handleSaveProfile={handleSaveProfile} handleProfileImageUpload={handleProfileImageUpload} isUploading={isUploading} setIsProfileModalOpen={setIsProfileModalOpen} setLoggedInUserId={setLoggedInUserId} />}
      {isTeamModalOpen && <TeamModal users={users} companies={companies} editingTeamMember={editingTeamMember} setEditingTeamMember={setEditingTeamMember} handleSaveTeamMember={handleSaveTeamMember} handleDeleteUser={handleDeleteUser} handleTeamMemberImageUpload={handleTeamMemberImageUpload} isUploading={isUploading} setIsTeamModalOpen={setIsTeamModalOpen} currentUser={currentUser} />}
      {isSwitchUserModalOpen && <SwitchUserModal users={users} loggedInUserId={loggedInUserId} setLoggedInUserId={setLoggedInUserId} setIsSwitchUserModalOpen={setIsSwitchUserModalOpen} />}
      {isYoutubeModalOpen && <YoutubeModal editingYoutubeChannel={editingYoutubeChannel} setEditingYoutubeChannel={setEditingYoutubeChannel} handleSaveYoutubeChannel={handleSaveYoutubeChannel} handleDeleteYoutubeChannel={handleDeleteYoutubeChannel} setIsYoutubeModalOpen={setIsYoutubeModalOpen} />}
      {isSpreakerModalOpen && <SpreakerModal editingSpreakerShow={editingSpreakerShow} handleSaveSpreakerShow={handleSaveSpreakerShow} handleDeleteSpreakerShow={handleDeleteSpreakerShow} setIsSpreakerModalOpen={setIsSpreakerModalOpen} />}
      {isOnboardingModalOpen && <OnboardingModal setIsOnboardingModalOpen={setIsOnboardingModalOpen} globalChecklist={globalChecklist} handleSaveGlobalChecklist={handleSaveGlobalChecklist} />}
    </>
  );
}