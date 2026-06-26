import React from 'react';

// Import all 20 Modals here instead of App.jsx
import TaskModal from './TaskModal';
import ExpenseModal from './ExpenseModal';
import DomainModal from './DomainModal';
import EventModal from './EventModal';
import CompanyModal from './CompanyModal';
import ProjectModal from './ProjectModal';
import ProfileModal from './ProfileModal';
import SpreakerModal from './SpreakerModal';
import YoutubeModal from './YoutubeModal';
import AnalyticsModal from './AnalyticsModal';
import TeamModal from './TeamModal';
import SwitchUserModal from './SwitchUserModal';
import OnboardingModal from './OnboardingModal';
import ProjectAttachmentsModal from './ProjectAttachmentsModal';
import ShowModal from './ShowModal';
import SponsorshipModal from './SponsorshipModal';
import AvatarMakerModal from './AvatarMakerModal';
import ContactModal from './ContactModal';
import PasswordModal from './PasswordModal';
import PayoutModal from './PayoutModal';

export default function ModalsManager({
  // 1. Task Modal Props
  isTaskModalOpen, currentTask, setCurrentTask, handleSaveTask, handleDeleteTask, setIsTaskModalOpen, users, isUploading, handleFileUpload, removeFile, newCommentText, setNewCommentText, handleAddComment, currentUser, handleToggleSubscribe,
  // 2. Expense & Domain Modal Props
  isExpenseModalOpen, currentExpense, setCurrentExpense, handleSaveExpense, handleDeleteExpense, setIsExpenseModalOpen, visibleCompanies,
  isDomainModalOpen, currentDomain, setCurrentDomain, handleSaveDomain, setIsDomainModalOpen,
  // 3. Event Modal Props
  isEventModalOpen, editingEvent, setEditingEvent, paymentMode, setPaymentMode, handleSaveEvent, handleDeleteEvent, setIsEventModalOpen, sponsorships, openSponsorshipModal,
  // 4. Show & Sponsorship Modal Props
  isShowModalOpen, editingShow, setEditingShow, handleSaveShow, handleDeleteShow, handleArchiveSeries, setIsShowModalOpen, youtubeChannels,
  isSponsorshipModalOpen, editingSponsorship, setEditingSponsorship, handleSaveSponsorship, handleDeleteSponsorship, setIsSponsorshipModalOpen, handleSponsorshipLogoUpload, shows, events, handleSponsorshipAssetUpload, removeSponsorshipAsset,
  // 5. CRM & Password Modal Props
  isContactModalOpen, editingContact, setEditingContact, handleSaveContact, handleDeleteContact, setIsContactModalOpen,
  isPasswordModalOpen, editingPassword, setEditingPassword, handleSavePassword, handleDeletePassword, setIsPasswordModalOpen,
  // 6. Company & Project Modal Props
  isCompanyModalOpen, editingCompany, setEditingCompany, handleSaveCompany, handleDeleteCompany, setIsCompanyModalOpen, toggleCompanyUser, handleCompanyLogoUpload,
  isProjectModalOpen, editingProject, setEditingProject, handleSaveProject, handleArchiveProject, handlePermanentDeleteProject, setIsProjectModalOpen,
  // 7. Profile & Team Modal Props
  isProfileModalOpen, profileForm, setProfileForm, handleSaveProfile, handleProfileImageUpload, setIsProfileModalOpen, setLoggedInUserId,
  isTeamModalOpen, companies, editingTeamMember, setEditingTeamMember, handleSaveTeamMember, handleDeleteUser, handleTeamMemberImageUpload, setIsTeamModalOpen,
  isSwitchUserModalOpen, loggedInUserId, setIsSwitchUserModalOpen,
  // 8. Integration Modal Props
  isYoutubeModalOpen, editingYoutubeChannel, setEditingYoutubeChannel, handleSaveYoutubeChannel, handleUpdateYoutubeChannel, handleDeleteYoutubeChannel, setIsYoutubeModalOpen,
  isSpreakerModalOpen, editingSpreakerShow, handleSaveSpreakerShow, handleDeleteSpreakerShow, setIsSpreakerModalOpen,
  isAnalyticsModalOpen, editingAnalyticsProperty, setEditingAnalyticsProperty, handleSaveAnalyticsProperty, handleDeleteAnalyticsProperty, setIsAnalyticsModalOpen,
  // 9. Misc Modal Props
  isOnboardingModalOpen, setIsOnboardingModalOpen, globalChecklist, handleSaveGlobalChecklist, uploadFileToServer,
  isProjectAttachmentsModalOpen, activeProject, tasks, setIsProjectAttachmentsModalOpen,
  isAvatarMakerModalOpen, setIsAvatarMakerModalOpen,
  isPayoutModalOpen, editingPayout, setEditingPayout, handleSavePayout, setIsPayoutModalOpen, wpLedgerData
}) {

  return (
    <>
      {isTaskModalOpen && (
        <TaskModal 
          currentTask={currentTask} 
          setCurrentTask={setCurrentTask} 
          handleSaveTask={handleSaveTask} 
          handleDeleteTask={handleDeleteTask} 
          setIsTaskModalOpen={setIsTaskModalOpen} 
          users={users} 
          isUploading={isUploading} 
          handleFileUpload={handleFileUpload} 
          removeFile={removeFile} 
          newCommentText={newCommentText} 
          setNewCommentText={setNewCommentText} 
          handleAddComment={handleAddComment} 
          currentUser={currentUser} 
          handleToggleSubscribe={handleToggleSubscribe} 
        />
      )}

      {isExpenseModalOpen && (
        <ExpenseModal 
          currentExpense={currentExpense} 
          setCurrentExpense={setCurrentExpense} 
          handleSaveExpense={handleSaveExpense} 
          handleDeleteExpense={handleDeleteExpense} 
          setIsExpenseModalOpen={setIsExpenseModalOpen} 
          visibleCompanies={visibleCompanies} 
        />
      )}

      {isDomainModalOpen && (
        <DomainModal 
          currentDomain={currentDomain} 
          setCurrentDomain={setCurrentDomain} 
          handleSaveDomain={handleSaveDomain} 
          handleDeleteExpense={handleDeleteExpense} 
          setIsDomainModalOpen={setIsDomainModalOpen} 
          visibleCompanies={visibleCompanies} 
        />
      )}

      {isEventModalOpen && (
        <EventModal 
          editingEvent={editingEvent} 
          setEditingEvent={setEditingEvent} 
          paymentMode={paymentMode} 
          setPaymentMode={setPaymentMode} 
          handleSaveEvent={handleSaveEvent} 
          handleDeleteEvent={handleDeleteEvent} 
          setIsEventModalOpen={setIsEventModalOpen} 
          visibleCompanies={visibleCompanies} 
          sponsorships={sponsorships} 
          openSponsorshipModal={openSponsorshipModal} 
        />
      )}

      {isShowModalOpen && (
        <ShowModal 
          editingShow={editingShow} 
          setEditingShow={setEditingShow} 
          handleSaveShow={handleSaveShow} 
          handleDeleteShow={handleDeleteShow} 
          handleArchiveSeries={handleArchiveSeries} 
          setIsShowModalOpen={setIsShowModalOpen} 
          youtubeChannels={youtubeChannels} 
          users={users} 
          sponsorships={sponsorships} 
          openSponsorshipModal={openSponsorshipModal} 
          currentUser={currentUser} 
        />
      )}

      {isSponsorshipModalOpen && (
        <SponsorshipModal 
          editingSponsorship={editingSponsorship} 
          setEditingSponsorship={setEditingSponsorship} 
          handleSaveSponsorship={handleSaveSponsorship} 
          handleDeleteSponsorship={handleDeleteSponsorship} 
          setIsSponsorshipModalOpen={setIsSponsorshipModalOpen} 
          visibleCompanies={visibleCompanies} 
          isUploading={isUploading} 
          handleSponsorshipLogoUpload={handleSponsorshipLogoUpload} 
          shows={shows} 
          events={events} 
          currentUser={currentUser} 
          handleSponsorshipAssetUpload={handleSponsorshipAssetUpload} 
          removeSponsorshipAsset={removeSponsorshipAsset} 
        />
      )}

      {isContactModalOpen && (
        <ContactModal 
          editingContact={editingContact} 
          setEditingContact={setEditingContact} 
          handleSaveContact={handleSaveContact} 
          handleDeleteContact={handleDeleteContact} 
          setIsContactModalOpen={setIsContactModalOpen} 
          visibleCompanies={visibleCompanies} 
        />
      )}

      {isPasswordModalOpen && (
        <PasswordModal 
          editingPassword={editingPassword} 
          setEditingPassword={setEditingPassword} 
          handleSavePassword={handleSavePassword} 
          handleDeletePassword={handleDeletePassword} 
          setIsPasswordModalOpen={setIsPasswordModalOpen} 
          visibleCompanies={visibleCompanies} 
          users={users} 
          currentUser={currentUser} 
        />
      )}

      {isCompanyModalOpen && (
        <CompanyModal 
          editingCompany={editingCompany} 
          setEditingCompany={setEditingCompany} 
          handleSaveCompany={handleSaveCompany} 
          handleDeleteCompany={handleDeleteCompany} 
          setIsCompanyModalOpen={setIsCompanyModalOpen} 
          users={users} 
          toggleCompanyUser={toggleCompanyUser} 
          handleCompanyLogoUpload={handleCompanyLogoUpload} 
          isUploading={isUploading} 
        />
      )}

      {isProjectModalOpen && (
        <ProjectModal 
          editingProject={editingProject} 
          setEditingProject={setEditingProject} 
          handleSaveProject={handleSaveProject} 
          handleArchiveProject={handleArchiveProject} 
          handlePermanentDeleteProject={handlePermanentDeleteProject} 
          setIsProjectModalOpen={setIsProjectModalOpen} 
          visibleCompanies={visibleCompanies} 
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal 
          profileForm={profileForm} 
          setProfileForm={setProfileForm} 
          handleSaveProfile={handleSaveProfile} 
          handleProfileImageUpload={handleProfileImageUpload} 
          isUploading={isUploading} 
          setIsProfileModalOpen={setIsProfileModalOpen} 
          setLoggedInUserId={setLoggedInUserId} 
        />
      )}

      {isTeamModalOpen && (
        <TeamModal 
          users={users} 
          companies={companies} 
          editingTeamMember={editingTeamMember} 
          setEditingTeamMember={setEditingTeamMember} 
          handleSaveTeamMember={handleSaveTeamMember} 
          handleDeleteUser={handleDeleteUser} 
          handleTeamMemberImageUpload={handleTeamMemberImageUpload} 
          isUploading={isUploading} 
          setIsTeamModalOpen={setIsTeamModalOpen} 
          currentUser={currentUser} 
        />
      )}

      {isSwitchUserModalOpen && (
        <SwitchUserModal 
          users={users} 
          loggedInUserId={loggedInUserId} 
          setLoggedInUserId={setLoggedInUserId} 
          setIsSwitchUserModalOpen={setIsSwitchUserModalOpen} 
        />
      )}

      {isYoutubeModalOpen && (
        <YoutubeModal 
          editingYoutubeChannel={editingYoutubeChannel} 
          setEditingYoutubeChannel={setEditingYoutubeChannel} 
          handleSaveYoutubeChannel={handleSaveYoutubeChannel} 
          handleUpdateYoutubeChannel={handleUpdateYoutubeChannel} 
          handleDeleteYoutubeChannel={handleDeleteYoutubeChannel} 
          setIsYoutubeModalOpen={setIsYoutubeModalOpen} 
        />
      )}

      {isSpreakerModalOpen && (
        <SpreakerModal 
          editingSpreakerShow={editingSpreakerShow} 
          handleSaveSpreakerShow={handleSaveSpreakerShow} 
          handleDeleteSpreakerShow={handleDeleteSpreakerShow} 
          setIsSpreakerModalOpen={setIsSpreakerModalOpen} 
        />
      )}

      {isAnalyticsModalOpen && (
        <AnalyticsModal 
          editingAnalyticsProperty={editingAnalyticsProperty} 
          setEditingAnalyticsProperty={setEditingAnalyticsProperty} 
          handleSaveAnalyticsProperty={handleSaveAnalyticsProperty} 
          handleDeleteAnalyticsProperty={handleDeleteAnalyticsProperty} 
          setIsAnalyticsModalOpen={setIsAnalyticsModalOpen} 
        />
      )}

      {isOnboardingModalOpen && (
        <OnboardingModal 
          setIsOnboardingModalOpen={setIsOnboardingModalOpen} 
          globalChecklist={globalChecklist} 
          handleSaveGlobalChecklist={handleSaveGlobalChecklist} 
          uploadFileToServer={uploadFileToServer} 
        />
      )}

      {isProjectAttachmentsModalOpen && (
        <ProjectAttachmentsModal 
          project={activeProject} 
          tasks={tasks} 
          setIsProjectAttachmentsModalOpen={setIsProjectAttachmentsModalOpen} 
        />
      )}

      {isAvatarMakerModalOpen && (
        <AvatarMakerModal 
          setIsAvatarMakerModalOpen={setIsAvatarMakerModalOpen} 
        />
      )}

      {isPayoutModalOpen && (
        <PayoutModal 
          editingPayout={editingPayout} 
          setEditingPayout={setEditingPayout} 
          handleSavePayout={handleSavePayout} 
          setIsPayoutModalOpen={setIsPayoutModalOpen} 
          shows={shows} 
          wpLedgerData={wpLedgerData} 
          currentUser={currentUser} 
        />
      )}
    </>
  );
}