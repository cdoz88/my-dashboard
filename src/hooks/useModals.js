import { useState } from 'react';

export function useModals() {
  const [isSpreakerModalOpen, setIsSpreakerModalOpen] = useState(false);
  const [editingSpreakerShow, setEditingSpreakerShow] = useState({ id: null, name: '' });
  
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [editingAnalyticsProperty, setEditingAnalyticsProperty] = useState({ id: null, name: '', propertyId: '' });
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '', description: '', dueDate: '', status: 'todo', projectId: '', files: [], comments: [], subscribers: [], assigneeId: '', tags: [], weight: 1, completedAt: null, completedBy: null });
  const [newCommentText, setNewCommentText] = useState('');
  
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({ id: null, name: '', amount: '', cycle: 'monthly', category: 'Tools', companyId: '', renewalDate: '', notes: '', autoRenew: true });
  
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState({ id: null, name: '', amount: '', cycle: 'annual', category: 'Domains', companyId: '', renewalDate: '', notes: '', autoRenew: true });
  
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState({ id: null, name: '', logoUrl: '', userIds: [] });
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState({ id: null, name: '', companyId: '', icon: 'FolderKanban', color: 'slate', isArchived: false, adminOnly: false });
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', title: '', venmo: '', password: '', avatarUrl: '', webhookUrl: '' });
  
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  
  const [isSwitchUserModalOpen, setIsSwitchUserModalOpen] = useState(false);
  
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [editingYoutubeChannel, setEditingYoutubeChannel] = useState({ id: null, name: '', color: 'red' });
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState({ id: null, title: '', companyId: '', eventDate: '', eventTime: '', cost: '', autoProject: false, projectLeadTime: 1, projectLeadUnit: 'months', billingDate: '', installments: [] });
  const [paymentMode, setPaymentMode] = useState('single');
  
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isProjectAttachmentsModalOpen, setIsProjectAttachmentsModalOpen] = useState(false);
  
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState({ id: null, channelId: '', title: '', showDate: '', showTime: '', isLive: true, studio: 'Studio 1', guestLink: '', notes: '', userIds: [], isRecurring: false, occurrences: 1, basePay: 0, payPerHour: 0, revShare: 100, paymentStartDate: '', paymentMethod: '', paymentAccount: '', playlistId: '', status: 'Active', editScope: 'episode' });
  
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [editingSponsorship, setEditingSponsorship] = useState({ id: null, companyId: '', name: '', logoUrl: '', startDate: '', endDate: '', amount: '', elements: [], showTitles: [], eventTitles: [], promoCode: '', contactName: '', contactEmail: '', paymentStatus: 'Pending', notes: '', files: [] });
  
  const [isAvatarMakerModalOpen, setIsAvatarMakerModalOpen] = useState(false);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState({ id: null, companyId: '', name: '', email: '', phone: '', organization: '', contactType: 'General', notes: '' });
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState({ id: null, companyId: '', platform: '', url: '', username: '', password: '', notes: '', sharedWith: [], category: 'Uncategorized' });
  
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [editingPayout, setEditingPayout] = useState({ id: null, showId: '', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: '', paymentAccount: '', notes: '', transactionType: 'Payment' });

  return {
    isSpreakerModalOpen, setIsSpreakerModalOpen,
    editingSpreakerShow, setEditingSpreakerShow,
    isAnalyticsModalOpen, setIsAnalyticsModalOpen,
    editingAnalyticsProperty, setEditingAnalyticsProperty,
    isTaskModalOpen, setIsTaskModalOpen,
    currentTask, setCurrentTask,
    newCommentText, setNewCommentText,
    isExpenseModalOpen, setIsExpenseModalOpen,
    currentExpense, setCurrentExpense,
    isDomainModalOpen, setIsDomainModalOpen,
    currentDomain, setCurrentDomain,
    isCompanyModalOpen, setIsCompanyModalOpen,
    editingCompany, setEditingCompany,
    isProjectModalOpen, setIsProjectModalOpen,
    editingProject, setEditingProject,
    isProfileModalOpen, setIsProfileModalOpen,
    profileForm, setProfileForm,
    isTeamModalOpen, setIsTeamModalOpen,
    editingTeamMember, setEditingTeamMember,
    isSwitchUserModalOpen, setIsSwitchUserModalOpen,
    isYoutubeModalOpen, setIsYoutubeModalOpen,
    editingYoutubeChannel, setEditingYoutubeChannel,
    isEventModalOpen, setIsEventModalOpen,
    editingEvent, setEditingEvent,
    paymentMode, setPaymentMode,
    isOnboardingModalOpen, setIsOnboardingModalOpen,
    isProjectAttachmentsModalOpen, setIsProjectAttachmentsModalOpen,
    isShowModalOpen, setIsShowModalOpen,
    editingShow, setEditingShow,
    isSponsorshipModalOpen, setIsSponsorshipModalOpen,
    editingSponsorship, setEditingSponsorship,
    isAvatarMakerModalOpen, setIsAvatarMakerModalOpen,
    isContactModalOpen, setIsContactModalOpen,
    editingContact, setEditingContact,
    isPasswordModalOpen, setIsPasswordModalOpen,
    editingPassword, setEditingPassword,
    isPayoutModalOpen, setIsPayoutModalOpen,
    editingPayout, setEditingPayout
  };
}