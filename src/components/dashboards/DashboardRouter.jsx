import React from 'react';

// Dashboards
import HomeDashboard from './HomeDashboard';
import DashboardView from './DashboardView';
import ArchivedProjectsView from './ArchivedProjectsView';
import ProjectView from './ProjectView';
import TeamCapacityView from './TeamCapacityView';
import TeamDirectoryView from './TeamDirectoryView';
import BudgetDashboard from './BudgetDashboard';
import DomainsDashboard from './DomainsDashboard';
import EventsDashboard from './EventsDashboard';
import SpreakerDashboard from './SpreakerDashboard';
import YoutubeDashboard from './YoutubeDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import ActivityLogView from './ActivityLogView';
import ShowsDashboard from './ShowsDashboard';
import SponsorshipsDashboard from './SponsorshipsDashboard';
import CRMDashboard from './CRMDashboard';
import PasswordsDashboard from './PasswordsDashboard';
import LedgerDashboard from './LedgerDashboard';
import KnowledgeBaseDashboard from './KnowledgeBaseDashboard';

export default function DashboardRouter({
  currentApp, activeTab, currentUser, tasks, projects, shows, payouts, wpLedgerData, youtubeChannels, 
  setCurrentApp, setActiveTab, openTaskModal, handleToggleTaskStatus, openShowModal, visibleTasks, 
  visibleProjects, companies, users, handleDeleteTask, handlePermanentDeleteProject, handleRestoreProject, 
  projectDisplayMode, handleDragStart, handleDrop, handleDragOver, handleReorderTasks, setIsProjectAttachmentsModalOpen, 
  expenses, activeBudgetTab, budgetDisplayMode, expenseSortConfig, setExpenseSortConfig, openExpenseModal, handleDeleteExpense, 
  activeDomainTab, domainDisplayMode, domainSortConfig, setDomainSortConfig, openDomainModal, events, sponsorships, 
  activeEventTab, eventDisplayMode, openEventModal, handleDeleteEvent, spreakerShows, activeSpreakerShowId, 
  spreakerTimeFilter, activeYoutubeChannelId, youtubeTimeFilter, analyticsProperties, activeAnalyticsId, 
  activeShowTab, showDisplayMode, handleDeleteShow, activeSponsorshipTab, openSponsorshipModal, handleDeleteSponsorship, 
  contacts, activeCRMTab, crmDisplayMode, openContactModal, handleDeleteContact, passwords, activePasswordTab, 
  openPasswordModal, handleDeletePassword, handleUpdateUser, setIsOnboardingModalOpen, visibleCompanies, activeTeamTab, 
  globalChecklist, handleGenerateOnboarding, handleGenerateOffboarding, setIsAvatarMakerModalOpen, teamDisplayMode, 
  openTeamModal, openPayoutModal, handleSyncLedger, isSyncingLedger, activityLogs, youtubeSection
}) {

  if (currentApp === 'home') {
    return <HomeDashboard currentUser={currentUser} tasks={tasks} projects={projects} shows={shows} payouts={payouts} wpLedgerData={wpLedgerData} youtubeChannels={youtubeChannels} setCurrentApp={setCurrentApp} setActiveTab={setActiveTab} openTaskModal={openTaskModal} handleToggleTaskStatus={handleToggleTaskStatus} openShowModal={openShowModal} />;
  }
  
  if (currentApp === 'knowledge') {
    return <KnowledgeBaseDashboard />;
  }
  
  if (currentApp === 'projects') {
    if (activeTab === 'mytasks') {
      return <DashboardView tasks={visibleTasks} currentUser={currentUser} projects={visibleProjects} companies={companies} users={users} handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask} />;
    }
    if (activeTab === 'capacity') {
      return <TeamCapacityView users={users} tasks={visibleTasks} projects={visibleProjects} />;
    }
    if (activeTab === 'archived') {
      return <ArchivedProjectsView projects={visibleProjects} companies={companies} handlePermanentDeleteProject={handlePermanentDeleteProject} handleRestoreProject={handleRestoreProject} />;
    }
    return <ProjectView projectId={activeTab} projects={visibleProjects} tasks={visibleTasks} companies={companies} users={users} projectDisplayMode={projectDisplayMode} handleToggleTaskStatus={handleToggleTaskStatus} openTaskModal={openTaskModal} handleDeleteTask={handleDeleteTask} handleDragStart={handleDragStart} handleDrop={handleDrop} handleDragOver={handleDragOver} handleReorderTasks={handleReorderTasks} setIsProjectAttachmentsModalOpen={setIsProjectAttachmentsModalOpen} />;
  }
  
  if (currentApp === 'budget') {
    return <BudgetDashboard expenses={expenses} activeBudgetTab={activeBudgetTab} budgetDisplayMode={budgetDisplayMode} expenseSortConfig={expenseSortConfig} setExpenseSortConfig={setExpenseSortConfig} openExpenseModal={openExpenseModal} handleDeleteExpense={handleDeleteExpense} companies={companies} />;
  }
  
  if (currentApp === 'domains') {
    return <DomainsDashboard expenses={expenses} activeDomainTab={activeDomainTab} domainDisplayMode={domainDisplayMode} domainSortConfig={domainSortConfig} setDomainSortConfig={setDomainSortConfig} openDomainModal={openDomainModal} handleDeleteExpense={handleDeleteExpense} companies={companies} />;
  }
  
  if (currentApp === 'events') {
    return <EventsDashboard events={events} sponsorships={sponsorships} activeEventTab={activeEventTab} eventDisplayMode={eventDisplayMode} openEventModal={openEventModal} handleDeleteEvent={handleDeleteEvent} companies={companies} />;
  }
  
  if (currentApp === 'spreaker') {
    return <SpreakerDashboard spreakerShows={spreakerShows} activeSpreakerShowId={activeSpreakerShowId} spreakerTimeFilter={spreakerTimeFilter} />;
  }
  
  if (currentApp === 'youtube') {
    if (youtubeSection === 'shows') {
        return <ShowsDashboard shows={shows} sponsorships={sponsorships} activeShowTab={activeShowTab} showDisplayMode={showDisplayMode} openShowModal={openShowModal} handleDeleteShow={handleDeleteShow} youtubeChannels={youtubeChannels} users={users} />;
    }
    return <YoutubeDashboard youtubeChannels={youtubeChannels} activeYoutubeChannelId={activeYoutubeChannelId} youtubeTimeFilter={youtubeTimeFilter} />;
  }
  
  if (currentApp === 'analytics') {
    return <AnalyticsDashboard analyticsProperties={analyticsProperties} activeAnalyticsId={activeAnalyticsId} />;
  }
  
  if (currentApp === 'sponsorships') {
    return <SponsorshipsDashboard sponsorships={sponsorships} activeSponsorshipTab={activeSponsorshipTab} openSponsorshipModal={openSponsorshipModal} handleDeleteSponsorship={handleDeleteSponsorship} companies={companies} currentUser={currentUser} />;
  }
  
  if (currentApp === 'crm') {
    return <CRMDashboard contacts={contacts} activeCRMTab={activeCRMTab} crmDisplayMode={crmDisplayMode} openContactModal={openContactModal} handleDeleteContact={handleDeleteContact} companies={companies} />;
  }
  
  if (currentApp === 'passwords') {
    return <PasswordsDashboard passwords={passwords} activePasswordTab={activePasswordTab} openPasswordModal={openPasswordModal} handleDeletePassword={handleDeletePassword} companies={companies} currentUser={currentUser} />;
  }
  
  if (currentApp === 'team') {
    return <TeamDirectoryView users={users} currentUser={currentUser} handleUpdateUser={handleUpdateUser} setIsOnboardingModalOpen={setIsOnboardingModalOpen} companies={companies} visibleCompanies={visibleCompanies} activeTeamTab={activeTeamTab} globalChecklist={globalChecklist} projects={visibleProjects} tasks={visibleTasks} setCurrentApp={setCurrentApp} setActiveTab={setActiveTab} handleGenerateOnboarding={handleGenerateOnboarding} handleGenerateOffboarding={handleGenerateOffboarding} setIsAvatarMakerModalOpen={setIsAvatarMakerModalOpen} teamDisplayMode={teamDisplayMode} openTeamModal={openTeamModal} shows={shows} youtubeChannels={youtubeChannels} />;
  }
  
  if (currentApp === 'ledger') {
    return <LedgerDashboard shows={shows} payouts={payouts} youtubeChannels={youtubeChannels} openPayoutModal={openPayoutModal} handleSyncLedger={handleSyncLedger} isSyncingLedger={isSyncingLedger} currentUser={currentUser} wpLedgerData={wpLedgerData} users={users} activeTab={activeTab} />;
  }

  // Fallback
  return <ActivityLogView activityLogs={activityLogs} users={users} activeActivityTab={activeActivityTab} tasks={visibleTasks} projects={visibleProjects} setCurrentApp={setCurrentApp} setActiveTab={setActiveTab} />;
}