import React from 'react';
import { 
  LayoutDashboard, Wallet, Youtube, CalendarDays, Mic, Globe, 
  ChevronsUpDown, ListTodo, CalendarClock, Plus, Clock, ChevronDown, 
  RefreshCw, Upload, Kanban 
} from 'lucide-react';

export default function TopBar({
  currentApp, setCurrentApp, isAppSwitcherOpen, setIsAppSwitcherOpen,
  isMobileMenuOpen, setIsMobileMenuOpen, currentUser, activeTab,
  activeBudgetTab, activeDomainTab, activeEventTab,
  projectDisplayMode, setProjectDisplayMode,
  budgetDisplayMode, setBudgetDisplayMode,
  domainDisplayMode, setDomainDisplayMode,
  eventDisplayMode, setEventDisplayMode,
  youtubeTimeFilter, handleYoutubeFilterChange, handleSyncYoutube,
  spreakerTimeFilter, handleSpreakerFilterChange, handleSyncSpreaker,
  openTaskModal, openExpenseModal, openDomainModal, openEventModal,
  handleImportCSV, handleSyncGoDaddy
}) {
  const isProjectView = currentApp === 'projects' && activeTab !== 'mytasks' && activeTab !== 'capacity' && activeTab !== 'archived';
  const isBudgetView = currentApp === 'budget';
  const isDomainView = currentApp === 'domains';
  const isYoutubeView = currentApp === 'youtube';
  const isEventView = currentApp === 'events';
  const isSpreakerView = currentApp === 'spreaker';

  return (
    <header className={`${currentApp === 'projects' ? 'bg-blue-600' : currentApp === 'budget' ? 'bg-emerald-600' : currentApp === 'youtube' ? 'bg-red-600' : currentApp === 'events' ? 'bg-purple-600' : currentApp === 'spreaker' ? 'bg-[#ffc005]' : 'bg-teal-500'} ${currentApp === 'spreaker' ? 'text-slate-900' : 'text-white'} h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-md z-40 w-full transition-colors duration-300`}>
      <div className="relative">
        <button onClick={() => setIsAppSwitcherOpen(!isAppSwitcherOpen)} className={`flex items-center gap-2 font-bold text-xl tracking-tight px-2 py-1.5 -ml-2 rounded-lg transition-colors ${currentApp === 'projects' ? 'hover:bg-blue-700' : currentApp === 'budget' ? 'hover:bg-emerald-700' : currentApp === 'youtube' ? 'hover:bg-red-700' : currentApp === 'events' ? 'hover:bg-purple-700' : currentApp === 'spreaker' ? 'hover:bg-[#e6ad04]' : 'hover:bg-teal-600'}`}>
          {currentApp === 'projects' ? <LayoutDashboard size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} /> : currentApp === 'budget' ? <Wallet size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} /> : currentApp === 'youtube' ? <Youtube size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} /> : currentApp === 'events' ? <CalendarDays size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} /> : currentApp === 'spreaker' ? <Mic size={24} className="text-slate-900/70" /> : <Globe size={24} className={currentApp === 'spreaker' ? "text-slate-900/70" : "text-white/70"} />}
          <span className="capitalize">{currentApp === 'budget' ? 'Expenses' : currentApp === 'youtube' ? 'YouTube Studio' : currentApp === 'spreaker' ? 'Spreaker Studio' : currentApp}</span>
          <ChevronsUpDown size={18} className={`${currentApp === 'spreaker' ? 'text-slate-900/60' : 'text-white/60'} ml-1`} />
        </button>
        {isAppSwitcherOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsAppSwitcherOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1">
              {(currentUser.isAdmin || currentUser.canViewProjects) && <button onClick={() => { setCurrentApp('projects'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'projects' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'projects' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}><LayoutDashboard size={18} /></div>Projects</button>}
              {(currentUser.isAdmin || currentUser.canViewEvents) && <button onClick={() => { setCurrentApp('events'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'events' ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'events' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}><CalendarDays size={18} /></div>Events</button>}
              {(currentUser.isAdmin || currentUser.canViewBudget) && <button onClick={() => { setCurrentApp('budget'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'budget' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'budget' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}><Wallet size={18} /></div>Expenses</button>}
              {(currentUser.isAdmin || currentUser.canViewDomains) && <button onClick={() => { setCurrentApp('domains'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'domains' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'domains' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}><Globe size={18} /></div>Domains</button>}
              {(currentUser.isAdmin || currentUser.canViewProjects) && <button onClick={() => { setCurrentApp('youtube'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'youtube' ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}><Youtube size={18} /></div>YouTube</button>}
              {(currentUser.isAdmin || currentUser.canViewSpreaker) && <button onClick={() => { setCurrentApp('spreaker'); setIsAppSwitcherOpen(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${currentApp === 'spreaker' ? 'bg-[#ffc005]/10 text-[#d9a304]' : 'text-slate-700 hover:bg-slate-50'}`}><div className={`p-1.5 rounded-md ${currentApp === 'spreaker' ? 'bg-[#ffc005]/20 text-[#d9a304]' : 'bg-slate-100 text-slate-500'}`}><Mic size={18} /></div>Spreaker</button>}
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
               <input type="file" accept=".csv" className="hidden" disabled={activeBudgetTab === 'overview'} onClick={(e) => { if(activeBudgetTab === 'overview') { e.preventDefault(); alert("Please select a specific company from the left sidebar before importing."); } }} onChange={(e) => handleImportCSV(e, activeBudgetTab, false)} />
             </label>
             <button onClick={() => openExpenseModal(null, activeBudgetTab === 'overview' ? '' : activeBudgetTab)} className="bg-white text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors">
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
               <button onClick={() => handleSyncGoDaddy(activeDomainTab)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors" title="Sync with GoDaddy API">
                 <RefreshCw size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Sync</span>
               </button>
             )}
             <label className={`${activeDomainTab === 'overview' ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-700 hover:bg-teal-800 cursor-pointer'} text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors`} title="Import Domains from CSV">
               <Upload size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">CSV</span>
               <input type="file" accept=".csv" className="hidden" disabled={activeDomainTab === 'overview'} onClick={(e) => { if(activeDomainTab === 'overview') { e.preventDefault(); alert("Please select a specific company from the left sidebar before importing."); } }} onChange={(e) => handleImportCSV(e, activeDomainTab, true)} />
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