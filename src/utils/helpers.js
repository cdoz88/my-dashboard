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