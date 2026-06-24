import React from 'react';
import { 
  LayoutDashboard, Wallet, Youtube, CalendarDays, Mic, Globe, 
  ChevronsUpDown, ListTodo, CalendarClock, Plus, Clock, ChevronDown, 
  RefreshCw, Upload, Kanban, Contact, Activity, Tv, Award, Network, LayoutGrid, BookUser, LayoutPanelTop, Lock, Camera, Calculator, Home, BarChart3, BookOpen
} from 'lucide-react';

export default function TopBar({
  currentApp, setCurrentApp, isAppSwitcherOpen, setIsAppSwitcherOpen,
  isMobileMenuOpen, setIsMobileMenuOpen, currentUser, activeTab, setActiveTab,
  activeBudgetTab, activeDomainTab, activeEventTab,
  youtubeSection, setYoutubeSection, websiteSection, setWebsiteSection,
  projectDisplayMode, setProjectDisplayMode,
  budgetDisplayMode, setBudgetDisplayMode,
  domainDisplayMode, setDomainDisplayMode,
  eventDisplayMode, setEventDisplayMode,
  youtubeTimeFilter, handleYoutubeFilterChange, handleSyncYoutube,
  spreakerTimeFilter, handleSpreakerFilterChange, handleSyncSpreaker,
  openTaskModal, openExpenseModal, openDomainModal, openEventModal,
  handleImportCSV, handleSyncGoDaddy,
  showDisplayMode, setShowDisplayMode, openShowModal,
  openSponsorshipModal, openTeamModal, teamDisplayMode, setTeamDisplayMode,
  crmDisplayMode, setCRMDisplayMode, openContactModal, openPasswordModal, canViewPasswordsApp, activePasswordTab,
  handleScanBusinessCard, isUploading,
  analyticsTimeFilter, handleAnalyticsFilterChange, handleSyncAnalytics, openAnalyticsModal
}) {
  const isProjectView = currentApp === 'projects' && activeTab !== 'mytasks' && activeTab !== 'capacity' && activeTab !== 'archived';
  const isBudgetView = currentApp === 'budget';
  const isWebsiteDomainsView = currentApp === 'website' && websiteSection === 'domains';
  const isWebsiteAnalyticsView = currentApp === 'website' && websiteSection === 'analytics';
  const isYoutubeStatsView = currentApp === 'youtube' && youtubeSection === 'stats';
  const isYoutubeShowsView = currentApp === 'youtube' && youtubeSection === 'shows';
  const isEventView = currentApp === 'events';
  const isSpreakerView = currentApp === 'spreaker';
  const isSponsorshipsView = currentApp === 'sponsorships';
  const isTeamView = currentApp === 'team';
  const isCRMView = currentApp === 'crm';
  const isPasswordsView = currentApp === 'passwords';
  const isKnowledgeView = currentApp === 'knowledge';

  const getHeaderColor = () => {
    if (currentApp === 'projects' || currentApp === 'knowledge') return 'bg-blue-600';
    if (currentApp === 'budget' || currentApp === 'ledger') return 'bg-emerald-600';
    if (currentApp === 'youtube' || currentApp === 'events' === 'shows') return 'bg-red-600';
    if (currentApp === 'events') return 'bg-purple-600';
    if (currentApp === 'spreaker') return 'bg-[#ffc005]';
    if (currentApp === 'team') return 'bg-indigo-600';
    if (currentApp === 'activity' || currentApp === 'home' || currentApp === 'passwords') return 'bg-slate-800';
    if (currentApp === 'sponsorships') return 'bg-amber-500';
    if (currentApp === 'crm') return 'bg-sky-500';
    if (currentApp === 'website') return websiteSection === 'analytics' ? 'bg-orange-500' : 'bg-teal-500';
    return 'bg-slate-800';
  };

  const getHoverColor = () => {
    if (currentApp === 'projects' || currentApp === 'knowledge') return 'hover:bg-blue-700';
    if (currentApp === 'budget' || currentApp === 'ledger') return 'hover:bg-emerald-700';
    if (currentApp === 'youtube') return 'hover:bg-red-700';
    if (currentApp === 'events') return 'hover:bg-purple-700';
    if (currentApp === 'spreaker') return 'hover:bg-[#e6ad04]';
    if (currentApp === 'sponsorships') return 'hover:bg-amber-400';
    if (currentApp === 'crm') return 'hover:bg-sky-400';
    if (currentApp === 'team') return 'hover:bg-indigo-700';
    if (currentApp === 'activity' || currentApp === 'home' || currentApp === 'passwords') return 'hover:bg-slate-900';
    if (currentApp === 'website') return websiteSection === 'analytics' ? 'hover:bg-orange-600' : 'hover:bg-teal-600';
    return 'hover:bg-slate-700';
  };

  return (
    <header className={`${getHeaderColor()} ${currentApp === 'spreaker' || currentApp === 'sponsorships' || currentApp === 'crm' ? 'text-slate-900' : 'text-white'} h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-md z-40 w-full transition-colors duration-300`}>
      <div className="relative">
        <button onClick={() => setIsAppSwitcherOpen(!isAppSwitcherOpen)} className={`flex items-center gap-2 font-bold text-xl tracking-tight px-2 py-1.5 -ml-2 rounded-lg transition-colors ${getHoverColor()}`}>
          {currentApp === 'projects' ? <LayoutDashboard size={24} className={currentApp === 'spreaker' || currentApp === 'sponsorships' || currentApp === 'crm' ? "text-slate-900/70" : "text-white/70"} /> : currentApp === 'knowledge' ? <BookOpen size={24} className="text-white/70" /> : currentApp === 'budget' ? <Wallet size={24} className={currentApp === 'spreaker' || currentApp === 'sponsorships' || currentApp === 'crm' ? "text-slate-900/70" : "text-white/70"} /> : currentApp === 'youtube' ? <Youtube size={24} className={currentApp === 'spreaker' || currentApp === 'sponsorships' || currentApp === 'crm' ? "text-slate-900/70" : "text-white/70"} /> : currentApp === 'sponsorships' ? <Award size={24} className="text-slate-900/70" /> : currentApp === 'crm' ? <BookUser size={24} className="text-slate-900/70" /> : currentApp === 'events' ? <CalendarDays size={24} className={currentApp === 'spreaker' || currentApp === 'sponsorships' || currentApp === 'crm' ? "text-slate-900/70" : "text-white/70"} /> : currentApp === 'spreaker' ? <Mic size={24} className="text-slate-900/70" /> : currentApp === 'team' ? <Contact size={24} className={currentApp === 'spreaker' || currentApp === 'sponsorships' || currentApp === 'crm' ? "text-slate-900/70" : "text-white/70"} /> : currentApp === 'passwords' ? <Lock size={24} className="text-white/70" /> : currentApp === 'activity' ? <Activity size={24} className="text-white/70" /> : currentApp === 'ledger' ? <Calculator size={24} className="text-white/70" /> : currentApp === 'home' ? <Home size={24} className="text-white/70" /> : <Globe size={24} className={currentApp === 'spreaker' || currentApp === 'sponsorships' || currentApp === 'crm' ? "text-slate-900/70" : "text-white/70"} />}
          <span className="capitalize">{currentApp === 'budget' ? 'Expenses' : currentApp === 'knowledge' ? 'Knowledge Base' : currentApp === 'youtube' ? 'YouTube' : currentApp === 'spreaker' ? 'Spreaker Studio' : currentApp === 'team' ? 'Team Directory' : currentApp === 'crm' ? 'CRM' : currentApp === 'passwords' ? 'Password Vault' : currentApp === 'ledger' ? 'Creator Ledger' : currentApp === 'home' ? 'Home Dashboard' : currentApp === 'website' ? 'Website' : currentApp}</span>
          <ChevronsUpDown size={18} className={`${currentApp === 'spreaker' || currentApp === 'sponsorships' || currentApp === 'crm' ? 'text-slate-900/60' : 'text-white/60'} ml-1`} />
        </button>
        {isAppSwitcherOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsAppSwitcherOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-y-auto overflow-x-hidden max-h-[80vh] z-50 py-1">
              
              <button onClick={() => { setCurrentApp('home'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-slate-100 ${currentApp === 'home' ? 'bg-slate-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50'}`}>
                 <div className={`p-1.5 rounded-md ${currentApp === 'home' ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'}`}><Home size={18} /></div>Home Dashboard
              </button>

              <button onClick={() => { setCurrentApp('knowledge'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-slate-100 ${currentApp === 'knowledge' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                 <div className={`p-1.5 rounded-md ${currentApp === 'knowledge' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}><BookOpen size={18} /></div>Knowledge Base
              </button>

              {(currentUser.isAdmin || currentUser.canViewProjects) && <button onClick={() => { setCurrentApp('projects'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'projects' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'projects' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}><LayoutDashboard size={18} /></div>Projects</button>}
              <button onClick={() => { setCurrentApp('team'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'team' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'team' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}><Contact size={18} /></div>Team Directory</button>
              {(currentUser.isAdmin || currentUser.canViewEvents) && <button onClick={() => { setCurrentApp('events'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'events' ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'events' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}><CalendarDays size={18} /></div>Events</button>}
              {(currentUser.isAdmin || currentUser.canViewBudget) && <button onClick={() => { setCurrentApp('budget'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'budget' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'budget' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}><Wallet size={18} /></div>Expenses</button>}
              
              {(currentUser.isAdmin || currentUser.canViewLedger) && <button onClick={() => { setCurrentApp('ledger'); setActiveTab('all'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-slate-100 ${currentApp === 'ledger' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'ledger' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}><Calculator size={18} /></div>Creator Ledger</button>}
              
              {(currentUser.isAdmin || currentUser.canViewDomains) && (
                <button onClick={() => { setCurrentApp('website'); setWebsiteSection(currentUser.isAdmin ? 'analytics' : 'domains'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'website' ? (websiteSection === 'analytics' ? 'bg-orange-50 text-orange-700' : 'bg-teal-50 text-teal-700') : 'text-slate-700 hover:bg-slate-50'}`}>
                  <div className={`p-1.5 rounded-md ${currentApp === 'website' ? (websiteSection === 'analytics' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600') : 'bg-slate-100 text-slate-500'}`}><Globe size={18} /></div>Website
                </button>
              )}

              {(currentUser.isAdmin || currentUser.canViewYoutube || currentUser.canViewShows) && <button onClick={() => { setCurrentApp('youtube'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'youtube' ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}><Youtube size={18} /></div>YouTube</button>}
              {(currentUser.isAdmin || currentUser.canViewSponsorships) && <button onClick={() => { setCurrentApp('sponsorships'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'sponsorships' ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'sponsorships' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}><Award size={18} /></div>Sponsorships</button>}
              {(currentUser.isAdmin || currentUser.canViewCRM) && <button onClick={() => { setCurrentApp('crm'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'crm' ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'crm' ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'}`}><BookUser size={18} /></div>CRM</button>}
              {canViewPasswordsApp && <button onClick={() => { setCurrentApp('passwords'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-t border-slate-100 ${currentApp === 'passwords' ? 'bg-slate-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'passwords' ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'}`}><Lock size={18} /></div>Password Vault</button>}
              
              {(currentUser.isAdmin) && <button onClick={() => { setCurrentApp('activity'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-t border-slate-100 ${currentApp === 'activity' ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'activity' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'}`}><Activity size={18} /></div>Activity Log</button>}
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {isTeamView && (
           <>
             <div className="flex bg-indigo-700/50 rounded-lg p-1 border border-indigo-500/50 mr-2">
                <button onClick={() => setTeamDisplayMode('cards')} className={`p-1.5 rounded-md transition-colors ${teamDisplayMode === 'cards' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-100 hover:text-white hover:bg-indigo-500/50'}`} title="Roster View"><LayoutGrid size={16} /></button>
                <button onClick={() => setTeamDisplayMode('org')} className={`p-1.5 rounded-md transition-colors ${teamDisplayMode === 'org' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-100 hover:text-white hover:bg-indigo-500/50'}`} title="Org Chart View"><Network size={16} /></button>
             </div>
             {currentUser?.isAdmin && (
                 <button onClick={() => openTeamModal()} className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
                   <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Member</span>
                 </button>
             )}
           </>
        )}
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
        {isYoutubeShowsView && (
           <>
             <div className="flex bg-red-700/50 rounded-lg p-1 border border-red-500/50 mr-2">
                <button onClick={() => setShowDisplayMode('list')} className={`p-1.5 rounded-md transition-colors ${showDisplayMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-red-100 hover:text-white hover:bg-red-500/50'}`} title="Unique Shows Master List"><ListTodo size={16} /></button>
                <button onClick={() => setShowDisplayMode('timeline')} className={`p-1.5 rounded-md transition-colors ${showDisplayMode === 'timeline' ? 'bg-white text-red-600 shadow-sm' : 'text-red-100 hover:text-white hover:bg-red-500/50'}`} title="Timeline View (All Instances)"><Clock size={16} /></button>
                <button onClick={() => setShowDisplayMode('calendar')} className={`p-1.5 rounded-md transition-colors ${showDisplayMode === 'calendar' ? 'bg-white text-red-600 shadow-sm' : 'text-red-100 hover:text-white hover:bg-red-500/50'}`} title="Weekly Calendar"><CalendarClock size={16} /></button>
             </div>
             <button onClick={() => openShowModal()} className="bg-white text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
               <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Show</span>
             </button>
           </>
        )}
        {isSponsorshipsView && (
             <button onClick={() => openSponsorshipModal()} className="bg-slate-900 text-amber-500 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
               <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Sponsor</span>
             </button>
        )}
        {isCRMView && (
           <>
             <label className={`${isUploading ? 'opacity-50 cursor-wait bg-slate-100' : 'cursor-pointer hover:bg-slate-200 bg-white'} text-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors border border-slate-200 mr-1`} title="Upload or snap a photo of a business card">
                 {isUploading ? <RefreshCw size={18} className="animate-spin text-sky-500" strokeWidth={2.5} /> : <Camera size={18} strokeWidth={2.5} className="text-sky-500" />} 
                 <span className="hidden md:inline">{isUploading ? 'Scanning...' : 'Scan Card'}</span>
                 <input type="file" accept="image/*" capture="environment" className="hidden" disabled={isUploading} onChange={handleScanBusinessCard} />
             </label>
             <div className="flex bg-sky-700/50 rounded-lg p-1 border border-sky-500/50 mr-2">
                <button onClick={() => setCRMDisplayMode('list')} className={`p-1.5 rounded-md transition-colors ${crmDisplayMode === 'list' ? 'bg-white text-sky-600 shadow-sm' : 'text-sky-100 hover:text-white hover:bg-sky-500/50'}`} title="Table View"><ListTodo size={16} /></button>
                <button onClick={() => setCRMDisplayMode('cards')} className={`p-1.5 rounded-md transition-colors ${crmDisplayMode === 'cards' ? 'bg-white text-sky-600 shadow-sm' : 'text-sky-100 hover:text-white hover:bg-sky-500/50'}`} title="Card View"><LayoutPanelTop size={16} /></button>
             </div>
             <button onClick={() => openContactModal()} className="bg-slate-900 text-sky-400 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
               <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Contact</span>
             </button>
           </>
        )}
        {isPasswordsView && currentUser?.isAdmin && (
           <>
             <label className={`bg-slate-700 hover:bg-slate-600 cursor-pointer text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors`} title="Import Passwords from CSV">
               <Upload size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">CSV</span>
               <input type="file" accept=".csv" className="hidden" onClick={(e) => { if(activePasswordTab === 'overview') { e.preventDefault(); alert("Please select a specific company to import these passwords into."); } }} onChange={(e) => handleImportCSV(e, activePasswordTab, 'passwords')} />
             </label>
             <button onClick={() => openPasswordModal()} className="bg-white text-slate-800 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
               <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Password</span>
             </button>
           </>
        )}
        
        {isWebsiteAnalyticsView && currentUser?.isAdmin && (
           <>
             <div className="relative flex items-center bg-orange-700/50 rounded-lg border border-orange-500/50 px-3 py-1.5 hover:bg-orange-700 transition-colors cursor-pointer mr-3">
               <Clock size={16} className="text-orange-200 mr-2" />
               <select value={analyticsTimeFilter} onChange={handleAnalyticsFilterChange} className="bg-transparent text-white text-sm font-bold focus:outline-none cursor-pointer appearance-none pr-6">
                 <option value="7" className="text-slate-800 font-medium">Last 7 days</option>
                 <option value="28" className="text-slate-800 font-medium">Last 28 days</option>
                 <option value="90" className="text-slate-800 font-medium">Last 90 days</option>
                 <option value="365" className="text-slate-800 font-medium">Last 365 days</option>
               </select>
               <ChevronDown size={14} className="text-orange-200 absolute right-3 pointer-events-none" />
             </div>
             <button onClick={() => handleSyncAnalytics()} className="bg-white text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors" title="Sync with Google Analytics">
               <RefreshCw size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Sync</span>
             </button>
           </>
        )}

        {isYoutubeStatsView && (
           <>
             <div className="relative flex items-center bg-red-700/50 rounded-lg border border-red-500/50 px-3 py-1.5 hover:bg-red-700 transition-colors cursor-pointer">
               <Clock size={16} className="text-red-200 mr-2" />
               <select value={youtubeTimeFilter} onChange={handleYoutubeFilterChange} className="bg-transparent text-white text-sm font-bold focus:outline-none cursor-pointer appearance-none pr-6">
                 <option value="7" className="text-slate-800 font-medium">Last 7 days</option>
                 <option value="28" className="text-slate-800 font-medium">Last 28 days</option>
                 <option value="90" className="text-slate-800 font-medium">Last 90 days</option>
                 <option value="365" className="text-slate-800 font-medium">Last 365 days</option>
                 <option value="lifetime" className="text-slate-800 font-medium">Lifetime</option>
               </select>
               <ChevronDown size={14} className="text-red-200 absolute right-3 pointer-events-none" />
             </div>
             {currentUser?.isAdmin && (
               <button onClick={() => handleSyncYoutube()} className="bg-white text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors" title="Sync with Google API">
                 <RefreshCw size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Sync</span>
               </button>
             )}
           </>
        )}
        {isSpreakerView && currentUser?.isAdmin && (
           <>
             <div className="relative flex items-center bg-slate-900/10 rounded-lg border border-slate-900/20 px-3 py-1.5 hover:bg-slate-900/20 transition-colors cursor-pointer mr-3">
               <Clock size={16} className="text-slate-900 mr-2" />
               <select value={spreakerTimeFilter} onChange={handleSpreakerFilterChange} className="bg-transparent text-slate-900 text-sm font-bold focus:outline-none cursor-pointer appearance-none pr-6">
                 <option value="1" className="text-slate-800 font-medium">Today (so far)</option>
                 <option value="2" className="text-slate-800 font-medium">Yesterday</option>
                 <option value="7" className="text-slate-800 font-medium">Last 7 days</option>
                 <option value="30" className="text-slate-800 font-medium">Last 30 days</option>
                 <option value="365" className="text-slate-800 font-medium">Last 12 months</option>
                 <option value="lifetime" className="text-slate-800 font-medium">All Time</option>
               </select>
               <ChevronDown size={14} className="text-slate-900 absolute right-3 pointer-events-none" />
             </div>
             <button onClick={() => handleSyncSpreaker()} className="bg-slate-900 text-[#ffc005] hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors" title="Sync with Spreaker API">
               <RefreshCw size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Sync</span>
             </button>
           </>
        )}
        {isProjectView && (
           <>
             <div className="flex bg-blue-700/50 rounded-lg p-1 border border-blue-500/50">
                <button onClick={() => setProjectDisplayMode('list')} className={`p-1.5 rounded-md transition-colors ${projectDisplayMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-500/50'}`}><ListTodo size={16} /></button>
                <button onClick={() => setProjectDisplayMode('kanban')} className={`p-1.5 rounded-md transition-colors ${projectDisplayMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-100 hover:text-white hover:bg-blue-500/50'}`}><Kanban size={16} /></button>
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
               <input type="file" accept=".csv" className="hidden" disabled={activeBudgetTab === 'overview'} onClick={(e) => { if(activeBudgetTab === 'overview') { e.preventDefault(); alert("Please select a specific company from the left sidebar before importing."); } }} onChange={(e) => handleImportCSV(e, activeBudgetTab, 'expenses')} />
             </label>
             <button onClick={() => openExpenseModal(null, activeBudgetTab === 'overview' ? '' : activeBudgetTab)} className="bg-white text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
               <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Expense</span>
             </button>
           </>
        )}
        {isWebsiteDomainsView && (
           <>
             <div className="flex bg-teal-700/50 rounded-lg p-1 border border-teal-500/50">
                <button onClick={() => setDomainDisplayMode('list')} className={`p-1.5 rounded-md transition-colors ${domainDisplayMode === 'list' ? 'bg-white text-teal-600 shadow-sm' : 'text-teal-100 hover:text-white hover:bg-teal-500/50'}`}><ListTodo size={16} /></button>
                <button onClick={() => setDomainDisplayMode('timeline')} className={`p-1.5 rounded-md transition-colors ${domainDisplayMode === 'timeline' ? 'bg-white text-teal-600 shadow-sm' : 'text-teal-100 hover:text-white hover:bg-teal-500/50'}`}><CalendarClock size={16} /></button>
             </div>
             {activeDomainTab !== 'overview' && (
               <button onClick={() => handleSyncGoDaddy(activeDomainTab)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors" title="Sync with GoDaddy API">
                 <RefreshCw size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Sync</span>
               </button>
             )}
             <label className={`${activeDomainTab === 'overview' ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-700 hover:bg-teal-800 cursor-pointer'} text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors`} title="Import Domains from CSV">
               <Upload size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">CSV</span>
               <input type="file" accept=".csv" className="hidden" disabled={activeDomainTab === 'overview'} onClick={(e) => { if(activeDomainTab === 'overview') { e.preventDefault(); alert("Please select a specific company from the left sidebar before importing."); } }} onChange={(e) => handleImportCSV(e, activeDomainTab, 'domains')} />
             </label>
             <button onClick={() => openDomainModal(null, activeDomainTab === 'overview' ? '' : activeDomainTab)} className="bg-white text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
               <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Add</span>
             </button>
           </>
        )}
      </div>
    </header>
  );
}