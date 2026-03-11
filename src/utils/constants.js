export const API_URL = 'https://api.fytsolutions.com/api.php';

export const colorStyles = {
  blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500', hex: '#3b82f6' },
  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', hex: '#10b981' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', bar: 'bg-purple-500', hex: '#a855f7' },
  rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500', hex: '#f43f5e' },
  amber: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500', hex: '#f59e0b' },
  slate: { text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', bar: 'bg-slate-500', hex: '#64748b' },
};

export const availableColors = Object.keys(colorStyles);

export const tagStyles = {
  'Urgent': 'bg-red-100 text-red-700 border-red-200',
  'On Hold': 'bg-orange-100 text-orange-700 border-orange-200',
  'Need Info': 'bg-blue-100 text-blue-700 border-blue-200',
  'See Notes': 'bg-slate-100 text-slate-700 border-slate-200',
  'Needs Review': 'bg-purple-100 text-purple-700 border-purple-200',
  'Ready': 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

export const availableTags = Object.keys(tagStyles);

export const expenseCategories = ['Company Expense', 'Website', 'Tools', 'Domains', 'Social Media', 'Merchandise', 'Personnel', 'Other'];

// Define the available icons for the Project Modal
export const availableIcons = [
  'Building2', 'Globe', 'Smartphone', 'Megaphone', 'ShoppingCart', 
  'Rocket', 'Code', 'Monitor', 'Heart', 'Star', 'Briefcase', 'FolderKanban',
  'Users', 'Settings', 'Mail', 'Camera', 'Box', 'PenTool', 'Database', 'Cloud', 
  'FileText', 'Zap', 'Compass', 'MapPin', 'Coffee', 'Music', 'ImageIcon', 
  'FileVideo', 'Shield', 'Target', 'Award', 'Crown', 'Upload', 'RefreshCw',
  'CalendarDays', 'Ticket', 'Mic', 'Headphones'
];