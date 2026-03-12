export const isOverdue = (dateStr, status) => {
  if (status === 'done' || !dateStr) return false;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return dateStr < todayStr;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${month}-${day}-${year.slice(2)}`;
};

export const formatExpenseDate = (dateStr, cycle) => {
  if (cycle !== 'one-time') return dateStr || '--';
  if (!dateStr) return '--';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return dateStr;
};

export const formatTime12Hour = (time24) => {
  if (!time24) return '';
  let [hours, minutes] = time24.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${minutes} ${ampm}`;
};

export const calculateProjectProgress = (projectId, tasks) => {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  const totalWeight = projectTasks.reduce((sum, t) => sum + (Number(t.weight) || 1), 0);
  const completedWeight = projectTasks.filter(t => t.status === 'done').reduce((sum, t) => sum + (Number(t.weight) || 1), 0);
  return Math.round((completedWeight / totalWeight) * 100);
};

export const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

export const parseNextDate = (cycle, dateStr) => {
  if (!dateStr) return new Date(9999, 11, 31);
  const today = new Date();
  if (cycle === 'monthly') {
    const match = dateStr.match(/(\d+)/);
    if (match) {
      let nextDate = new Date(today.getFullYear(), today.getMonth(), parseInt(match[1]));
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

export const formatAVD = (minutes, views) => {
  if (!views || views === 0 || !minutes) return '0:00';
  const avgMin = Number(minutes) / Number(views);
  const m = Math.floor(avgMin);
  const s = Math.floor((avgMin - m) * 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// --- NEW DATA EXTRACTORS ---

export const parseCSVToExpenses = (text, companyId, isDomain) => {
  const lines = text.split('\n');
  const newExpenses = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Regex safely splits CSV columns while ignoring commas inside quotes
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
    
    newExpenses.push({ 
      id: 'e' + Date.now() + Math.random().toString(36).substr(2, 5) + i, 
      companyId, name, amount, cycle, category, renewalDate, notes, autoRenew 
    });
  }
  return newExpenses;
};

export const generateOnboardingData = (user, globalChecklist, companies, currentUser) => {
  const newProjId = 'p' + Date.now() + Math.random().toString(36).substr(2, 5);
  const firstCompanyId = user.companyIds?.[0] || companies[0]?.id || '';
  
  const newProject = {
      id: newProjId,
      name: `Onboarding: ${user.name}`,
      companyId: firstCompanyId,
      icon: 'Star',
      color: 'indigo',
      isArchived: false,
      adminOnly: true
  };

  const newTasks = globalChecklist.map((item, idx) => {
      let assignedTo = user.id;
      if (item.assigneeType === 'admin') assignedTo = currentUser.id;
      if (item.assigneeType === 'none') assignedTo = '';

      let desc = item.description;
      if (desc === undefined) desc = `Welcome to the team, ${user.name.split(' ')[0]}! Please complete this task.`;

      return {
          id: 't' + Date.now() + idx + Math.random().toString(36).substr(2, 5),
          projectId: newProjId,
          title: item.text,
          description: desc,
          status: 'todo',
          dueDate: '',
          assigneeId: assignedTo,
          weight: 1,
          tags: [], 
          files: item.files || [], 
          comments: [],
          sortOrder: idx
      };
  });

  return { newProject, newTasks };
};