import { useState, useEffect } from 'react';
import { API_URL } from '../utils/constants';
import { formatCurrency, parseCSVToExpenses, parseCSVToPasswords, generateOnboardingData, generateOffboardingData } from '../utils/helpers';

export function useData({
  isLoading, setIsLoading, isUploading, setIsUploading, currentApp, setCurrentApp, activeTab, setActiveTab,
  activeBudgetTab, activeDomainTab, activeEventTab, activeShowTab, activeSponsorshipTab, activeTeamTab,
  activeActivityTab, activeCRMTab, activePasswordTab, loggedInUserId, setLoggedInUserId,
  activeYoutubeChannelId, setActiveYoutubeChannelId, activeSpreakerShowId, setActiveSpreakerShowId,
  activeAnalyticsId, setActiveAnalyticsId,
  isTaskModalOpen, setIsTaskModalOpen, currentTask, setCurrentTask, newCommentText, setNewCommentText,
  isExpenseModalOpen, setIsExpenseModalOpen, currentExpense, setCurrentExpense,
  isDomainModalOpen, setIsDomainModalOpen, currentDomain, setCurrentDomain,
  isEventModalOpen, setIsEventModalOpen, editingEvent, setEditingEvent, paymentMode, setPaymentMode,
  isShowModalOpen, setIsShowModalOpen, editingShow, setEditingShow,
  isSponsorshipModalOpen, setIsSponsorshipModalOpen, editingSponsorship, setEditingSponsorship,
  isContactModalOpen, setIsContactModalOpen, editingContact, setEditingContact,
  isPasswordModalOpen, setIsPasswordModalOpen, editingPassword, setEditingPassword,
  isCompanyModalOpen, setIsCompanyModalOpen, editingCompany, setEditingCompany,
  isProjectModalOpen, setIsProjectModalOpen, editingProject, setEditingProject,
  isProfileModalOpen, setIsProfileModalOpen, profileForm, setProfileForm,
  isTeamModalOpen, setIsTeamModalOpen, editingTeamMember, setEditingTeamMember,
  isPayoutModalOpen, setIsPayoutModalOpen, editingPayout, setEditingPayout
}) {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [events, setEvents] = useState([]);
  const [shows, setShows] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [globalChecklist, setGlobalChecklist] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [wpLedgerData, setWpLedgerData] = useState([]);
  const [youtubeChannels, setYoutubeChannels] = useState([]);
  const [spreakerShows, setSpreakerShows] = useState([]);
  const [analyticsProperties, setAnalyticsProperties] = useState([]);

  const currentUser = users.find(u => u.id === loggedInUserId);
  const visibleCompanies = companies.filter(c => currentUser?.isAdmin || (c.userIds && c.userIds.includes(currentUser?.id)));
  const visibleProjects = currentUser?.isAdmin ? projects : projects.filter(p => !p.adminOnly);
  const visibleTasks = currentUser?.isAdmin ? tasks : tasks.filter(t => visibleProjects.some(p => p.id === t.projectId));
  const canViewPasswordsApp = currentUser?.isAdmin || passwords.some(p => (p.sharedWith || []).includes(currentUser?.id));

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

  const fetchData = () => {
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
               canViewShows: u.canViewShows == 1 || u.canViewShows === true || u.canViewShows === undefined,
               canViewSponsorships: u.canViewSponsorships == 1 || u.canViewSponsorships === true || u.canViewSponsorships === undefined,
               canViewCRM: u.canViewCRM == 1 || u.canViewCRM === true || u.canViewCRM === undefined,
               phone: u.phone || '', title: u.title || '', venmo: u.venmo || '', webhookUrl: u.webhookUrl || '', managerId: u.managerId || '', responsibilities: u.responsibilities || '', wpUserId: u.wpUserId || ''
           })));
        }
        
        if (data.settings && data.settings.globalOnboardingChecklist) {
            try { setGlobalChecklist(JSON.parse(data.settings.globalOnboardingChecklist)); } catch(e) {}
        } else {
            const localSaved = localStorage.getItem('globalOnboardingChecklist');
            if (localSaved) {
                try { setGlobalChecklist(JSON.parse(localSaved)); } catch(e) {}
                fetch(`${API_URL}?action=save_setting`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key_name: 'globalOnboardingChecklist', setting_value: localSaved }) });
            }
        }

        if(data.companies) setCompanies(data.companies);
        if(data.projects) setProjects(data.projects.map(p => ({ ...p, isArchived: p.isArchived == 1 || p.isArchived === true, adminOnly: p.adminOnly == 1 || p.adminOnly === true })));
        if(data.tasks) setTasks(data.tasks.map(t => ({ ...t, tags: Array.isArray(t.tags) ? t.tags.map(tag => tag === 'See Notes' ? 'See Comments' : tag) : [], subscribers: Array.isArray(t.subscribers) ? t.subscribers : [], overdueLogged: t.overdueLogged == 1 || t.overdueLogged === true, sortOrder: parseInt(t.sortOrder) || 0 })));
        if(data.expenses) setExpenses(data.expenses);
        if(data.events) setEvents(data.events);
        if(data.shows) setShows(data.shows.map(s => ({ ...s, isLive: s.isLive == 1 || s.isLive === true })));
        if(data.sponsorships) setSponsorships(data.sponsorships);
        if(data.contacts) setContacts(data.contacts);
        if(data.passwords) setPasswords(data.passwords);
        if(data.payouts) setPayouts(data.payouts);
        if(data.activity_logs) setActivityLogs(Array.isArray(data.activity_logs) ? data.activity_logs : []); else setActivityLogs([]);
        
        if(data.youtube_channels) {
            setYoutubeChannels(data.youtube_channels);
            if(data.youtube_channels.length > 0 && !activeYoutubeChannelId) setActiveYoutubeChannelId(data.youtube_channels[0].id);
        }
        if(data.spreaker_shows) {
            setSpreakerShows(data.spreaker_shows);
            if(data.spreaker_shows.length > 0 && !activeSpreakerShowId) setActiveSpreakerShowId(data.spreaker_shows[0].id);
        }
        if(data.analytics_properties) {
            setAnalyticsProperties(data.analytics_properties);
            if(data.analytics_properties.length > 0 && !activeAnalyticsId) setActiveAnalyticsId(data.analytics_properties[0].id);
        }

        setIsLoading(false);
      })
      .catch(err => { console.error("Failed to connect to API:", err); setIsLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
     if (currentUser) {
         fetch(`https://admin.fsan.com/wp-json/fsan/v1/ledger?t=${Date.now()}`)
             .then(res => res.json())
             .then(data => { if (Array.isArray(data)) setWpLedgerData(data); })
             .catch(err => console.error("Error syncing WP Ledger Data:", err));
     }
  }, [currentUser]);

  useEffect(() => {
    if (tasks.length > 0 && currentUser?.isAdmin) {
        let tasksUpdated = false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatedTasks = tasks.map(task => {
            if (task.status !== 'done' && !task.overdueLogged && task.dueDate && task.dueDate.trim() !== '' && task.dueDate !== '0000-00-00') {
                const [year, month, day] = task.dueDate.split('-');
                if (year && month && day) {
                    const dueDateObj = new Date(year, month - 1, day);
                    if (dueDateObj < today) {
                        const missedDateStr = new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        const newLog = { id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 5), userId: 'system', actionCategory: 'Tasks', actionType: 'Task Overdue', description: `The task "${task.title}" missed its due date (${missedDateStr}).`, timestamp: new Date().toISOString() };
                        
                        sendToAPI('save_log', newLog);
                        setActivityLogs(prev => [newLog, ...(Array.isArray(prev) ? prev : [])]);
                        
                        const updatedTask = { ...task, overdueLogged: true };
                        sendToAPI('save_task', { ...updatedTask, notifyOverdue: true, actorId: 'system' });
                        
                        tasksUpdated = true;
                        return updatedTask;
                    }
                }
            }
            return task;
        });

        if (tasksUpdated) setTasks(updatedTasks);
    }
  }, [tasks, currentUser]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskIdParam = urlParams.get('task');
    if (taskIdParam && tasks.length > 0 && projects.length > 0 && !isTaskModalOpen) {
        const targetTask = tasks.find(t => t.id === taskIdParam);
        if (targetTask) {
            const targetProject = projects.find(p => p.id === targetTask.projectId);
            if (targetProject) {
                setCurrentApp('projects');
                setActiveTab(targetProject.id);
                openTaskModal(targetTask);
                const newParams = new URLSearchParams();
                newParams.set('app', 'projects');
                newParams.set('tab', targetProject.id);
                window.history.replaceState({ app: 'projects', tab: targetProject.id }, '', `${window.location.pathname}?${newParams.toString()}`);
            }
        }
    }
  }, [tasks, projects, isTaskModalOpen]);

  const handleScanBusinessCard = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsUploading(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
          try {
              const base64Data = reader.result.split(',')[1];
              const mimeType = file.type || 'image/jpeg';
              const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
              
              if (!GEMINI_API_KEY) {
                  alert("API Key is missing! Please add VITE_GEMINI_API_KEY to your Vercel Environment Variables.");
                  setIsUploading(false); return;
              }

              const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      contents: [{ parts: [ { text: "Analyze this business card. Extract the contact info and return it strictly as a JSON object with these exact keys: 'name', 'organization', 'email', 'phone'. Do not include markdown formatting or any other text. If a piece of information is missing, leave the string empty." }, { inlineData: { mimeType: mimeType, data: base64Data } } ] }],
                      generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
                  })
              });

              const data = await response.json();
              if (data.error) {
                  alert("Google AI Error: " + data.error.message);
              } else if (data.candidates && data.candidates[0].content.parts[0].text) {
                  let text = data.candidates[0].content.parts[0].text;
                  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                  const parsed = JSON.parse(text);

                  setEditingContact({
                      id: null, companyId: activeCRMTab !== 'overview' ? activeCRMTab : (companies[0]?.id || ''),
                      name: parsed.name || '', email: parsed.email || '', phone: parsed.phone || '', organization: parsed.organization || '', contactType: 'Lead', notes: 'Imported via Business Card Scanner'
                  });
                  setIsContactModalOpen(true);
              } else { alert("Failed to read the card data. Please try again."); }
          } catch (err) { alert("Scanner error. Check your browser console."); console.error(err); } finally { setIsUploading(false); e.target.value = null; }
      };
      reader.readAsDataURL(file);
  };

  const logActivity = (category, type, description) => {
    const newLog = { id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 5), userId: currentUser?.id || 'system', actionCategory: category, actionType: type, description: description, timestamp: new Date().toISOString() };
    setActivityLogs(prev => [newLog, ...(Array.isArray(prev) ? prev : [])]);
    sendToAPI('save_log', newLog);
  };

  const handleSaveGlobalChecklist = (newList) => {
    setGlobalChecklist(newList);
    sendToAPI('save_setting', { key_name: 'globalOnboardingChecklist', setting_value: JSON.stringify(newList) });
  };

  const handleGenerateOnboarding = (user) => {
    if (!globalChecklist || globalChecklist.length === 0) { alert("Your onboarding template is empty. Add tasks to it first via the Team Directory!"); return; }
    const { newProject, newTasks } = generateOnboardingData(user, globalChecklist, companies, currentUser);
    sendToAPI('save_project', newProject);
    logActivity('Projects', 'New Project Created', `Created onboarding project for "${user.name}"`);
    newTasks.forEach(t => {
        const notifyAssignee = t.assigneeId && t.assigneeId !== currentUser.id;
        sendToAPI('save_task', { ...t, notifyAssignee, actorId: currentUser.id });
        logActivity('Tasks', 'Task Added', `Created task "${t.title}"`);
    });
    setProjects(prev => [...prev, newProject]);
    setTasks(prev => [...prev, ...newTasks]);
  };

  const handleGenerateOffboarding = (user) => {
    if (!globalChecklist || globalChecklist.length === 0) { alert("Your onboarding template is empty. Add tasks to it first via the Team Directory!"); return; }
    const { newProject, newTasks } = generateOffboardingData(user, globalChecklist, companies, currentUser);
    sendToAPI('save_project', newProject);
    logActivity('Projects', 'New Project Created', `Created offboarding project for "${user.name}"`);
    newTasks.forEach(t => {
        const notifyAssignee = t.assigneeId && t.assigneeId !== currentUser.id;
        sendToAPI('save_task', { ...t, notifyAssignee, actorId: currentUser.id });
        logActivity('Tasks', 'Task Added', `Created task "${t.title}"`);
    });
    setProjects(prev => [...prev, newProject]);
    setTasks(prev => [...prev, ...newTasks]);
  };

  const handleReorderTasks = (reorderedTasks) => {
    setTasks(prev => { const map = new Map(reorderedTasks.map(t => [t.id, t])); return prev.map(t => map.has(t.id) ? map.get(t.id) : t); });
    reorderedTasks.forEach(t => sendToAPI('save_task', t));
  };

  const handleImportCSV = (e, companyId, type = 'expenses') => {
    const file = e.target.files[0];
    if (!file || !companyId) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      if (type === 'passwords') {
          const newPws = parseCSVToPasswords(text, companyId);
          setPasswords(prev => [...prev, ...newPws]);
          for (const pw of newPws) { await sendToAPI('save_password', pw); }
          alert(`Successfully imported ${newPws.length} passwords from the CSV!`);
      } else {
          const isDomain = type === 'domains';
          const newExpenses = parseCSVToExpenses(text, companyId, isDomain);
          setExpenses(prev => [...prev, ...newExpenses]);
          for (const expenseData of newExpenses) { await sendToAPI('save_expense', expenseData); }
          alert(`Successfully imported ${newExpenses.length} items from the CSV!`);
      }
      e.target.value = null; 
    };
    reader.readAsText(file);
  };

  const openPayoutModal = (payout = null) => {
    if (payout) setEditingPayout({ ...payout });
    else setEditingPayout({ id: null, showId: '', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: '', paymentAccount: '', notes: '', transactionType: 'Payment' });
    setIsPayoutModalOpen(true);
  };

  const handleSavePayout = (e) => {
    e.preventDefault();
    if (!editingPayout.showId) { alert("Please select a target."); return; }
    const payoutData = editingPayout.id ? editingPayout : { ...editingPayout, id: 'pay_' + Date.now(), timestamp: new Date().toISOString() };
    if (!editingPayout.id) logActivity('Payouts', 'Payment Logged', `Logged transaction of ${formatCurrency(payoutData.amount)} for target ID ${payoutData.showId}`);
    if (editingPayout.id) setPayouts(payouts.map(p => p.id === payoutData.id ? payoutData : p)); else setPayouts([payoutData, ...payouts]);
    setIsPayoutModalOpen(false);
    sendToAPI('save_payout', payoutData);
  };

  const openTaskModal = (task = null, projectId = '', status = 'todo') => {
    if (task) setCurrentTask({ ...task, files: task.files || [], comments: task.comments || [], description: task.description || '', tags: task.tags || [], subscribers: task.subscribers || [], weight: task.weight || 1, completedAt: task.completedAt || null, completedBy: task.completedBy || null });
    else setCurrentTask({ title: '', description: '', dueDate: '', status, projectId, files: [], comments: [], subscribers: [], assigneeId: currentUser?.id, tags: [], weight: 1, completedAt: null, completedBy: null });
    setNewCommentText('');
    setIsTaskModalOpen(true);
  };

  const handleToggleSubscribe = (task) => {
    const isSubbed = (task.subscribers || []).includes(currentUser.id);
    const updatedSubs = isSubbed ? (task.subscribers || []).filter(id => id !== currentUser.id) : [...(task.subscribers || []), currentUser.id];
    const updatedTask = { ...task, subscribers: updatedSubs };
    setCurrentTask(updatedTask);
    if (task.id) {
        setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
        sendToAPI('save_task', { ...updatedTask, actorId: currentUser.id });
    }
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    const isNew = !currentTask.id;
    const oldTask = isNew ? null : tasks.find(t => t.id === currentTask.id);
    const assigneeChanged = !isNew && oldTask && oldTask.assigneeId !== currentTask.assigneeId;
    const notifyAssignee = (isNew && currentTask.assigneeId && currentTask.assigneeId !== currentUser.id) || (assigneeChanged && currentTask.assigneeId !== currentUser.id);
    let notifyStatus = false;
    if (!isNew && oldTask && oldTask.status !== currentTask.status) notifyStatus = true;
    const taskData = currentTask.id ? currentTask : { ...currentTask, id: 't' + Date.now(), projectId: currentTask.projectId || activeTab };
    if (oldTask && oldTask.dueDate !== taskData.dueDate) taskData.overdueLogged = false;
    if (isNew) logActivity('Tasks', 'Task Added', `Created task "${taskData.title}"`);
    else if (oldTask) {
        if (oldTask.status !== taskData.status) logActivity('Tasks', 'Task Status Update', `Changed status of "${taskData.title}" to ${taskData.status}`);
        if (JSON.stringify(oldTask.tags) !== JSON.stringify(taskData.tags)) logActivity('Tasks', 'Task Tag Changes', `Updated tags for "${taskData.title}"`);
    }
    if (currentTask.id) setTasks(tasks.map(t => t.id === taskData.id ? taskData : t)); else setTasks([...tasks, taskData]);
    setIsTaskModalOpen(false);
    sendToAPI('save_task', { ...taskData, notifyAssignee, notifyStatus, newStatus: taskData.status, actorId: currentUser.id });
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (taskToDelete) logActivity('Tasks', 'Task Deleted', `Deleted task "${taskToDelete.title}"`);
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
    sendToAPI('save_task', { ...updatedTask, notifyStatus: true, newStatus, actorId: currentUser.id });
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newComment = { id: 'c' + Date.now(), text: newCommentText.trim(), userId: currentUser.id, timestamp: new Date().toISOString() };
    const updatedTask = { ...currentTask, comments: [...(currentTask.comments || []), newComment] };
    logActivity('Tasks', 'Comment Added', `Added a comment to "${currentTask.title}":\n"${newCommentText.trim()}"`);
    const mentionedUsers = users.filter(u => newCommentText.toLowerCase().includes('@' + u.name.split(' ')[0].toLowerCase()) || newCommentText.toLowerCase().includes('@' + u.name.toLowerCase()));
    const mentionedUserIds = mentionedUsers.map(u => u.id);
    setCurrentTask(updatedTask);
    setNewCommentText('');
    if (updatedTask.id) {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        sendToAPI('save_task', { ...updatedTask, notifyComment: true, commenterName: currentUser.name, commentText: newComment.text, mentionedUserIds, actorId: currentUser.id });
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
    if (currentExpense.id) setExpenses(expenses.map(exp => exp.id === expenseData.id ? expenseData : exp)); else setExpenses([...expenses, expenseData]);
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
    const isNew = !currentDomain.id;
    const domainData = currentDomain.id ? currentDomain : { ...currentDomain, id: 'e' + Date.now() };
    if (isNew) logActivity('Domains', 'Domain Added', `Added domain "${domainData.name}"`); else logActivity('Domains', 'Domain Edited', `Updated domain "${domainData.name}"`);
    if (currentDomain.id) setExpenses(expenses.map(exp => exp.id === domainData.id ? domainData : exp)); else setExpenses([...expenses, domainData]);
    setIsDomainModalOpen(false);
    sendToAPI('save_expense', domainData);
  };

  const handleDeleteExpense = (expenseId) => {
    const item = expenses.find(e => e.id === expenseId);
    if (item && item.category === 'Domains') logActivity('Domains', 'Domain Deleted', `Deleted domain "${item.name}"`);
    setExpenses(expenses.filter(e => e.id !== expenseId));
    setIsExpenseModalOpen(false); setIsDomainModalOpen(false);
    sendToAPI('delete_expense', { id: expenseId });
  };

  const openEventModal = (ev = null) => {
    if (ev) { setEditingEvent({ ...ev, autoProject: ev.autoProject == 1 || ev.autoProject === true, installments: ev.installments || [] }); setPaymentMode(ev.installments && ev.installments.length > 0 ? 'installments' : 'single'); } 
    else { setEditingEvent({ id: null, title: '', companyId: companies[0]?.id || '', eventDate: '', eventTime: '', cost: '', autoProject: false, projectLeadTime: 1, projectLeadUnit: 'months', billingDate: '', installments: [] }); setPaymentMode('single'); }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    let finalCost = editingEvent.cost;
    if (paymentMode === 'installments') finalCost = editingEvent.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
    const isNew = !editingEvent.id;
    const eventData = editingEvent.id ? { ...editingEvent, cost: finalCost, installments: paymentMode === 'installments' ? editingEvent.installments : [] } : { ...editingEvent, id: 'ev' + Date.now(), cost: finalCost, installments: paymentMode === 'installments' ? editingEvent.installments : [] };
    if (isNew) logActivity('Events', 'Event Added', `Added event "${eventData.title}"`);
    if (editingEvent.id) setEvents(events.map(ev => ev.id === eventData.id ? eventData : ev)); else setEvents([...events, eventData]);
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

  const openShowModal = (show = null, scope = 'episode') => {
    if (show) {
        const dayOfWeek = new Date(`${show.showDate}T12:00:00`).getDay();
        setEditingShow({ ...show, userIds: show.userIds || [], editScope: scope, originalTitle: show.title, originalShowTime: show.showTime, originalDayOfWeek: dayOfWeek, revShare: show.revShare ?? 100 });
    } else { setEditingShow({ id: null, channelId: activeShowTab !== 'overview' ? activeShowTab : (youtubeChannels[0]?.id || ''), title: '', showDate: '', showTime: '', isLive: true, studio: 'Studio 1', guestLink: '', notes: '', userIds: [], isRecurring: false, occurrences: 1, basePay: 0, payPerHour: 0, revShare: 100, paymentStartDate: '', paymentMethod: '', paymentAccount: '', playlistId: '', status: 'Active', editScope: 'episode' }); }
    setIsShowModalOpen(true);
  };

  const handleArchiveSeries = (showToArchive) => {
    if (!window.confirm(`Are you sure you want to end/archive this series? It will be removed from the Schedule but remain on the Payout Ledger.`)) return;
    const episodesToArchive = shows.filter(s => { if (s.title !== showToArchive.originalTitle) return false; if (s.showTime !== showToArchive.originalShowTime) return false; const sDay = new Date(`${s.showDate}T12:00:00`).getDay(); if (sDay !== showToArchive.originalDayOfWeek) return false; return true; });
    const updatedEpisodes = episodesToArchive.map(ep => ({ ...ep, status: 'Archived' }));
    const nonSeriesShows = shows.filter(s => !episodesToArchive.some(ep => ep.id === s.id));
    setShows([...nonSeriesShows, ...updatedEpisodes]);
    sendToAPI('save_shows_batch', { shows: updatedEpisodes });
    logActivity('Shows', 'Series Archived', `Archived series "${showToArchive.originalTitle}"`);
    setIsShowModalOpen(false);
  };

  const handleSaveShow = (e) => {
    e.preventDefault();
    if (!editingShow.channelId) { alert("Please select a YouTube channel."); return; }
    const isNew = !editingShow.id;
    if (isNew && editingShow.isRecurring) {
        const newShows = [];
        const baseDate = new Date(`${editingShow.showDate}T12:00:00`); 
        const numOccurrences = parseInt(editingShow.occurrences) === 0 ? 260 : (parseInt(editingShow.occurrences) || 1);
        for (let i = 0; i < numOccurrences; i++) {
            const iterDate = new Date(baseDate);
            iterDate.setDate(iterDate.getDate() + (i * 7));
            const formattedDate = `${iterDate.getFullYear()}-${String(iterDate.getMonth() + 1).padStart(2, '0')}-${String(iterDate.getDate()).padStart(2, '0')}`;
            const showData = { ...editingShow, id: 'show_' + Date.now() + '_' + i, showDate: formattedDate };
            delete showData.isRecurring; delete showData.occurrences; delete showData.editScope; delete showData.originalTitle; delete showData.originalShowTime; delete showData.originalDayOfWeek;
            newShows.push(showData);
        }
        logActivity('Shows', 'Show Scheduled', `Scheduled "${editingShow.title}" for ${numOccurrences} consecutive weeks`);
        setShows(prev => [...prev, ...newShows]);
        sendToAPI('save_shows_batch', { shows: newShows });
    } else if (!isNew && editingShow.editScope === 'series') {
        const episodesToUpdate = shows.filter(s => { if (s.title !== editingShow.originalTitle) return false; if (s.showTime !== editingShow.originalShowTime) return false; const sDay = new Date(`${s.showDate}T12:00:00`).getDay(); if (sDay !== editingShow.originalDayOfWeek) return false; return true; });
        const updatedEpisodes = episodesToUpdate.map(ep => ({ ...ep, channelId: editingShow.channelId, title: editingShow.title, showTime: editingShow.showTime, isLive: editingShow.isLive, studio: editingShow.studio, guestLink: editingShow.guestLink, notes: editingShow.notes, userIds: editingShow.userIds, basePay: editingShow.basePay, payPerHour: editingShow.payPerHour, revShare: editingShow.revShare, paymentStartDate: editingShow.paymentStartDate, paymentMethod: editingShow.paymentMethod, paymentAccount: editingShow.paymentAccount, playlistId: editingShow.playlistId }));
        const nonSeriesShows = shows.filter(s => !episodesToUpdate.some(ep => ep.id === s.id));
        setShows([...nonSeriesShows, ...updatedEpisodes]);
        sendToAPI('save_shows_batch', { shows: updatedEpisodes });
        logActivity('Shows', 'Series Updated', `Bulk updated series "${editingShow.title}"`);
    } else {
        const showData = editingShow.id ? editingShow : { ...editingShow, id: 'show_' + Date.now() };
        delete showData.isRecurring; delete showData.occurrences; delete showData.editScope; delete showData.originalTitle; delete showData.originalShowTime; delete showData.originalDayOfWeek;
        if (isNew) logActivity('Shows', 'Show Scheduled', `Scheduled "${showData.title}"`);
        if (editingShow.id) setShows(shows.map(s => s.id === showData.id ? showData : s)); else setShows([...shows, showData]);
        sendToAPI('save_show', showData);
    }
    setIsShowModalOpen(false);
  };

  const handleDeleteShow = (id) => {
    const show = shows.find(s => s.id === id);
    if (show) logActivity('Shows', 'Show Deleted', `Deleted single episode of "${show.title}"`);
    setShows(shows.filter(s => s.id !== id));
    setIsShowModalOpen(false);
    sendToAPI('delete_show', { id });
  };

  const openSponsorshipModal = (sponsorship = null) => {
    if (sponsorship) setEditingSponsorship({ ...sponsorship, elements: sponsorship.elements || [], showTitles: sponsorship.showTitles || [], eventTitles: sponsorship.eventTitles || [], files: sponsorship.files || [] });
    else setEditingSponsorship({ id: null, companyId: activeSponsorshipTab !== 'overview' ? activeSponsorshipTab : (companies[0]?.id || ''), name: '', logoUrl: '', startDate: '', endDate: '', amount: '', elements: [], showTitles: [], eventTitles: [], promoCode: '', contactName: '', contactEmail: '', paymentStatus: 'Pending', notes: '', files: [] });
    setIsSponsorshipModalOpen(true);
  };

  const handleSaveSponsorship = (e) => {
    e.preventDefault();
    if (!editingSponsorship.companyId) { alert("Please select a company."); return; }
    const spData = editingSponsorship.id ? editingSponsorship : { ...editingSponsorship, id: 'spn_' + Date.now() };
    if (!editingSponsorship.id) logActivity('Sponsorships', 'Sponsorship Added', `Added sponsorship "${spData.name}"`);
    if (editingSponsorship.id) setSponsorships(sponsorships.map(s => s.id === spData.id ? spData : s)); else setSponsorships([...sponsorships, spData]);
    setIsSponsorshipModalOpen(false);
    sendToAPI('save_sponsorship', spData);
  };

  const handleDeleteSponsorship = (id) => {
    const sp = sponsorships.find(s => s.id === id);
    if (sp) logActivity('Sponsorships', 'Sponsorship Deleted', `Deleted sponsorship "${sp.name}"`);
    setSponsorships(sponsorships.filter(s => s.id !== id));
    setIsSponsorshipModalOpen(false);
    sendToAPI('delete_sponsorship', { id });
  };

  const handleSponsorshipAssetUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    const uploadedFiles = [];
    for (const file of files) { const url = await uploadFileToServer(file); if (url) uploadedFiles.push({ name: file.name, url: url }); }
    setEditingSponsorship({ ...editingSponsorship, files: [...(editingSponsorship.files || []), ...uploadedFiles] });
    setIsUploading(false);
    e.target.value = null; 
  };
  const removeSponsorshipAsset = (indexToRemove) => setEditingSponsorship({ ...editingSponsorship, files: editingSponsorship.files.filter((_, i) => i !== indexToRemove) });

  const openContactModal = (contact = null) => {
    if (contact) setEditingContact({ ...contact });
    else setEditingContact({ id: null, companyId: activeCRMTab !== 'overview' ? activeCRMTab : (companies[0]?.id || ''), name: '', email: '', phone: '', organization: '', contactType: 'General', notes: '' });
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!editingContact.companyId) { alert("Please select a company owner."); return; }
    const ctData = editingContact.id ? editingContact : { ...editingContact, id: 'ct_' + Date.now() };
    if (!editingContact.id) logActivity('CRM', 'Contact Added', `Added contact "${ctData.name}"`);
    if (editingContact.id) setContacts(contacts.map(c => c.id === ctData.id ? ctData : c)); else setContacts([...contacts, ctData]);
    setIsContactModalOpen(false);
    sendToAPI('save_contact', ctData);
  };

  const handleDeleteContact = (id) => {
    const ct = contacts.find(c => c.id === id);
    if (ct) logActivity('CRM', 'Contact Deleted', `Deleted contact "${ct.name}"`);
    setContacts(contacts.filter(c => c.id !== id));
    setIsContactModalOpen(false);
    sendToAPI('delete_contact', { id });
  };

  const openPasswordModal = (password = null) => {
    if (password) setEditingPassword({ ...password, sharedWith: password.sharedWith || [], category: password.category || 'Uncategorized' });
    else setEditingPassword({ id: null, companyId: activePasswordTab !== 'overview' ? activePasswordTab : (companies[0]?.id || ''), platform: '', url: '', username: '', password: '', notes: '', sharedWith: [], category: 'Uncategorized' });
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!editingPassword.companyId) { alert("Please select a company owner."); return; }
    const pwData = editingPassword.id ? editingPassword : { ...editingPassword, id: 'pw_' + Date.now() };
    if (!editingPassword.id) logActivity('Passwords', 'Password Added', `Added password for "${pwData.platform}"`);
    if (editingPassword.id) setPasswords(passwords.map(p => p.id === pwData.id ? pwData : p)); else setPasswords([...passwords, pwData]);
    setIsPasswordModalOpen(false);
    sendToAPI('save_password', pwData);
  };

  const handleDeletePassword = (id) => {
    const pw = passwords.find(p => p.id === id);
    if (pw) logActivity('Passwords', 'Password Deleted', `Deleted password for "${pw.platform}"`);
    setPasswords(passwords.filter(p => p.id !== id));
    setIsPasswordModalOpen(false);
    sendToAPI('delete_password', { id });
  };

  const openTeamModal = (userToEdit = null) => {
    if (userToEdit) setEditingTeamMember({ ...userToEdit, companyIds: companies.filter(c => c.userIds?.includes(userToEdit.id)).map(c => c.id), wpUserId: userToEdit.wpUserId || '' });
    else setEditingTeamMember({ id: null, name: '', email: '', phone: '', title: '', venmo: '', webhookUrl: '', isAdmin: false, canViewProjects: true, canViewBudget: false, canViewDomains: false, canViewEvents: true, canViewSpreaker: false, canViewYoutube: false, canViewShows: false, canViewSponsorships: false, canViewCRM: false, companyIds: activeTeamTab !== 'overview' ? [activeTeamTab] : [], generateOnboarding: true, managerId: '', responsibilities: '', wpUserId: '' });
    setIsTeamModalOpen(true);
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
    const isNew = !editingCompany.id;
    const companyData = editingCompany.id ? editingCompany : { ...editingCompany, id: 'c' + Date.now() };
    if (isNew) logActivity('Companies', 'Company Added', `Added company "${companyData.name}"`);

    const oldUserIds = editingCompany.id ? companies.find(c => c.id === editingCompany.id)?.userIds || [] : [];
    const newUserIds = editingCompany.userIds || [];
    const newlyAddedUserIds = newUserIds.filter(id => !oldUserIds.includes(id) && id !== currentUser.id);
    
    if (editingCompany.id) setCompanies(companies.map(c => c.id === companyData.id ? companyData : c));
    else setCompanies([...companies, companyData]);
    
    setIsCompanyModalOpen(false);
    sendToAPI('save_company', { ...companyData, notifyNewUsers: newlyAddedUserIds });
  };

  const handleDeleteCompany = (companyId) => {
    const comp = companies.find(c => c.id === companyId);
    if (comp) logActivity('Companies', 'Company Deleted', `Deleted company "${comp.name}"`);
    setCompanies(companies.filter(c => c.id !== companyId));
    setProjects(projects.filter(p => p.companyId !== companyId));
    setExpenses(expenses.filter(e => e.companyId !== companyId));
    if (activeBudgetTab === companyId) setActiveBudgetTab('overview');
    if (activeDomainTab === companyId) setActiveDomainTab('overview');
    if (activeEventTab === companyId) setActiveEventTab('overview');
    if (activeSponsorshipTab === companyId) setActiveSponsorshipTab('overview');
    if (activeCRMTab === companyId) setActiveCRMTab('overview');
    if (activePasswordTab === companyId) setActivePasswordTab('overview');
    setIsCompanyModalOpen(false);
    sendToAPI('delete_company', { id: companyId });
  };

  const openProjectModal = (companyId = '', projectToEdit = null) => {
    if (projectToEdit) setEditingProject({ ...projectToEdit, isArchived: projectToEdit.isArchived == 1 || projectToEdit.isArchived === true, adminOnly: projectToEdit.adminOnly == 1 || projectToEdit.adminOnly === true });
    else setEditingProject({ id: null, name: '', companyId: companyId || companies[0]?.id || '', icon: 'FolderKanban', color: 'slate', isArchived: false, adminOnly: false });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!editingProject.name.trim() || !editingProject.companyId) return;
    const isNew = !editingProject.id;
    const projectData = editingProject.id ? editingProject : { ...editingProject, id: 'p' + Date.now() };
    if (isNew) logActivity('Projects', 'New Project Created', `Created project "${projectData.name}"`);
    if (editingProject.id) setProjects(projects.map(p => p.id === projectData.id ? projectData : p));
    else { setProjects([...projects, projectData]); setActiveTab(projectData.id); }
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

  const openProfileModal = () => {
    if(currentUser) {
      setProfileForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone || '', title: currentUser.title || '', venmo: currentUser.venmo || '', avatarUrl: currentUser.avatarUrl, webhookUrl: currentUser.webhookUrl || '' });
      setIsProfileModalOpen(true);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...currentUser, name: profileForm.name, email: profileForm.email, phone: profileForm.phone, title: profileForm.title, venmo: profileForm.venmo, avatarUrl: profileForm.avatarUrl, webhookUrl: profileForm.webhookUrl };
    const localUser = { ...updatedUser };
    if (users.find(u => u.id === currentUser.id)) setUsers(users.map(u => u.id === currentUser.id ? localUser : u));
    else setUsers([...users, localUser]);
    setIsProfileModalOpen(false);
    sendToAPI('save_user', updatedUser);
  };

  const handleSaveTeamMember = (e) => {
    e.preventDefault();
    const isNew = !editingTeamMember.id;
    const generateOnboarding = editingTeamMember.generateOnboarding !== false;
    const userToSave = { ...editingTeamMember };
    if (!userToSave.id) userToSave.id = 'u' + Date.now();
    delete userToSave.generateOnboarding; 
    const localUser = { ...userToSave };
    if (isNew) logActivity('Team', 'New Member Added', `Added "${userToSave.name}" to the team directory.`);

    if (users.find(u => u.id === userToSave.id)) setUsers(users.map(u => u.id === userToSave.id ? localUser : u));
    else setUsers([...users, localUser]);

    const oldCompanyIds = !isNew && users.find(u => u.id === userToSave.id) ? companies.filter(c => c.userIds?.includes(userToSave.id)).map(c => c.id) : [];
    const newCompanyIds = editingTeamMember.companyIds || [];
    const newlyAddedCompanyIds = newCompanyIds.filter(id => !oldCompanyIds.includes(id));
    const notifyNewCompanies = newlyAddedCompanyIds.map(id => companies.find(c => c.id === id)?.name).filter(Boolean);

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

    sendToAPI('save_user', { ...userToSave, notifyNewCompanies });
    if (isNew && generateOnboarding) handleGenerateOnboarding(userToSave);
    setEditingTeamMember(null);
    setIsTeamModalOpen(false);
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
  const handleSponsorshipLogoUpload = async (e) => {
    if (e.target.files[0]) { setIsUploading(true); const url = await uploadFileToServer(e.target.files[0]); if (url) setEditingSponsorship({ ...editingSponsorship, logoUrl: url }); setIsUploading(false); }
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
     const task = visibleTasks.find(t => t.id === taskId);
     if(task && task.status !== newStatus) {
        logActivity('Tasks', 'Task Status Update', `Changed status of "${task.title}" to ${newStatus}`);
        const updatedTask = { ...task, status: newStatus, completedAt: newStatus === 'done' ? new Date().toISOString() : null, completedBy: newStatus === 'done' ? currentUser.id : null };
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
        const notifyStatus = task.assigneeId && task.assigneeId !== currentUser.id;
        sendToAPI('save_task', { ...updatedTask, notifyStatus, newStatus, actorId: currentUser.id });
     }
  };
  const handleDragOver = (e) => e.preventDefault();

  return {
    users, setUsers, companies, setCompanies, projects, setProjects, tasks, setTasks,
    expenses, setExpenses, events, setEvents, shows, setShows, sponsorships, setSponsorships,
    contacts, setContacts, passwords, setPasswords, payouts, setPayouts,
    globalChecklist, setGlobalChecklist, activityLogs, setActivityLogs, wpLedgerData, setWpLedgerData,
    youtubeChannels, setYoutubeChannels, spreakerShows, setSpreakerShows, analyticsProperties, setAnalyticsProperties,
    currentUser, visibleCompanies, visibleProjects, visibleTasks, canViewPasswordsApp,
    sendToAPI, uploadFileToServer, fetchData, handleScanBusinessCard, logActivity, handleSaveGlobalChecklist,
    handleGenerateOnboarding, handleGenerateOffboarding, handleReorderTasks, handleImportCSV,
    openPayoutModal, handleSavePayout, openTaskModal, handleToggleSubscribe, handleSaveTask, handleDeleteTask,
    handleToggleTaskStatus, handleAddComment, openExpenseModal, handleSaveExpense, handleDeleteExpense,
    openDomainModal, handleSaveDomain, openEventModal, handleSaveEvent, handleDeleteEvent, openShowModal,
    handleArchiveSeries, handleSaveShow, handleDeleteShow, openSponsorshipModal, handleSaveSponsorship,
    handleDeleteSponsorship, handleSponsorshipAssetUpload, removeSponsorshipAsset, openContactModal,
    handleSaveContact, handleDeleteContact, openPasswordModal, handleSavePassword, handleDeletePassword,
    openTeamModal, openCompanyModal, toggleCompanyUser, handleSaveCompany, handleDeleteCompany,
    openProjectModal, handleSaveProject, handleArchiveProject, handleRestoreProject, handlePermanentDeleteProject,
    openProfileModal, handleSaveProfile, handleSaveTeamMember, handleDeleteUser, handleUpdateUser,
    handleCompanyLogoUpload, handleProfileImageUpload, handleTeamMemberImageUpload, handleSponsorshipLogoUpload,
    handleFileUpload, removeFile, handleDragStart, handleDrop, handleDragOver
  };
}