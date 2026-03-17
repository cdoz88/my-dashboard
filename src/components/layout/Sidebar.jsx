import React from 'react';
import { 
  CheckCircle, Users, Archive, Plus, Pencil, PieChart, 
  Globe, Youtube, Mic, CalendarDays, UserCircle, Shield, UserCog, Contact, Activity, LayoutDashboard, Tv, Award, BookUser
} from 'lucide-react';
import { colorStyles } from '../../utils/constants';
import { calculateProjectProgress } from '../../utils/helpers';
import DynamicIcon from '../shared/DynamicIcon';
import CompanyLogo from '../shared/CompanyLogo';

export default function Sidebar({
  currentApp, setCurrentApp, activeTab, setActiveTab,
  isMobileMenuOpen, setIsMobileMenuOpen, currentUser,
  users, companies, visibleCompanies, projects, tasks, events,
  youtubeChannels, spreakerShows, activeBudgetTab, setActiveBudgetTab,
  activeDomainTab, setActiveDomainTab, activeEventTab, setActiveEventTab,
  activeYoutubeChannelId, setActiveYoutubeChannelId,
  activeSpreakerShowId, setActiveSpreakerShowId,
  openCompanyModal, openProjectModal, openYoutubeModal, openSpreakerModal,
  openProfileModal, setIsTeamModalOpen, setIsSwitchUserModalOpen,
  activeTeamTab, setActiveTeamTab, activeActivityTab, setActiveActivityTab,
  activeShowTab, setActiveShowTab, activeSponsorshipTab, setActiveSponsorshipTab,
  activeCRMTab, setActiveCRMTab
}) {

  const getCompany = (id) => companies.find(c => c.id === id);

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shadow-xl flex-shrink-0">
      <div className="p-5 border-b border-slate-700 flex justify-center items-center lg:hidden">
        <h1 className="text-xl font-bold text-white flex items-center gap-2 capitalize">{currentApp} Menu</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        {currentApp === 'projects' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Global</p>
              <div className="space-y-1">
                <button onClick={() => { setActiveTab('mytasks'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'mytasks' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                  <CheckCircle size={18} /> My Tasks
                </button>
                <button onClick={() => { setActiveTab('capacity'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'capacity' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                  <Users size={18} /> Team Capacity
                </button>
                <button onClick={() => { setActiveTab('archived'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'archived' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                  <Archive size={18} /> Archived
                </button>
              </div>
            </div>

            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Companies</p>
                {currentUser?.isAdmin && <button onClick={() => openCompanyModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Company"><Plus size={16} /></button>}
              </div>
              
              {visibleCompanies.map(company => (
                <div key={company.id} className="mb-4">
                  <div className="flex items-center justify-between mb-1 px-1 group/company">
                    <div className="flex items-center gap-2 text-slate-400 truncate pr-2">
                      <CompanyLogo company={company} />
                      <span className="font-medium text-sm text-slate-200 truncate">{company.name}</span>
                    </div>
                    {currentUser?.isAdmin && (
                      <div className="flex items-center flex-shrink-0 opacity-0 group-hover/company:opacity-100 transition-opacity">
                        <button onClick={() => openCompanyModal(company)} className="text-slate-500 hover:text-white p-1" title="Edit Company"><Pencil size={12} /></button>
                        <button onClick={() => openProjectModal(company.id)} className="text-slate-500 hover:text-white p-1 ml-0.5" title="Add Project"><Plus size={14} /></button>
                      </div>
                    )}
                  </div>
                  <div className="pl-4 flex flex-col gap-0.5">
                    {projects.filter(p => p.companyId === company.id && !p.isArchived).map(project => (
                      <div key={project.id} className="flex items-center justify-between group/project">
                        <button onClick={() => { setActiveTab(project.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors overflow-hidden ${activeTab === project.id ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                          <DynamicIcon name={project.icon} size={14} className={`flex-shrink-0 ${activeTab === project.id ? colorStyles[project.color]?.text : ''}`} />
                          <div className="flex-1 flex flex-col items-start overflow-hidden w-full">
                             <span className="truncate w-full text-left">{project.name}</span>
                             <div className="w-full bg-slate-700/50 h-1 mt-1 rounded-full overflow-hidden">
                               <div className={`h-full ${colorStyles[project.color]?.bar} transition-all duration-500`} style={{ width: `${calculateProjectProgress(project.id, tasks)}%` }} />
                             </div>
                          </div>
                        </button>
                        {currentUser?.isAdmin && <button onClick={(e) => { e.stopPropagation(); openProjectModal('', project); }} className="text-slate-500 hover:text-white opacity-0 group-hover/project:opacity-100 transition-all p-1.5 flex-shrink-0" title="Edit Project"><Pencil size={12} /></button>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {currentApp === 'sponsorships' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Network</p>
              <button onClick={() => { setActiveSponsorshipTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSponsorshipTab === 'overview' ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}>
                <Award size={18} /> All Sponsorships
              </button>
            </div>
            
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>
              </div>
              <div className="flex flex-col gap-1">
                {visibleCompanies.map(company => (
                  <div key={company.id} className="flex items-center justify-between group/company">
                    <button onClick={() => { setActiveSponsorshipTab(company.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeSponsorshipTab === company.id ? 'bg-slate-800 text-amber-400 font-bold' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                      <CompanyLogo company={company} sizeClass="w-5 h-5" />
                      <span className="truncate">{company.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {currentApp === 'crm' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Network</p>
              <button onClick={() => { setActiveCRMTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeCRMTab === 'overview' ? 'bg-sky-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}>
                <BookUser size={18} /> All Contacts
              </button>
            </div>
            
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company Owner</p>
              </div>
              <div className="flex flex-col gap-1">
                {visibleCompanies.map(company => (
                  <div key={company.id} className="flex items-center justify-between group/company">
                    <button onClick={() => { setActiveCRMTab(company.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeCRMTab === company.id ? 'bg-slate-800 text-sky-400 font-bold' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                      <CompanyLogo company={company} sizeClass="w-5 h-5" />
                      <span className="truncate">{company.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {currentApp === 'team' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Directory</p>
              <button onClick={() => { setActiveTeamTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTeamTab === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                <Contact size={18} /> All Members
              </button>
            </div>
            
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>
              </div>
              <div className="flex flex-col gap-1">
                {visibleCompanies.map(company => (
                  <div key={company.id} className="flex items-center justify-between group/company">
                    <button onClick={() => { setActiveTeamTab(company.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeTeamTab === company.id ? 'bg-slate-800 text-indigo-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                      <CompanyLogo company={company} sizeClass="w-5 h-5" />
                      <span className="truncate">{company.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {currentApp === 'budget' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Finance</p>
              <button onClick={() => { setActiveBudgetTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeBudgetTab === 'overview' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                <PieChart size={18} /> All Expenses
              </button>
            </div>
            
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>
                {currentUser?.isAdmin && <button onClick={() => openCompanyModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Company"><Plus size={16} /></button>}
              </div>
              <div className="flex flex-col gap-1">
                {visibleCompanies.map(company => (
                  <div key={company.id} className="flex items-center justify-between group/company">
                    <button onClick={() => { setActiveBudgetTab(company.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeBudgetTab === company.id ? 'bg-slate-800 text-emerald-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                      <CompanyLogo company={company} sizeClass="w-5 h-5" />
                      <span className="truncate">{company.name}</span>
                    </button>
                    {currentUser?.isAdmin && (
                      <div className="flex items-center flex-shrink-0 opacity-0 group-hover/company:opacity-100 transition-opacity ml-1">
                        <button onClick={(e) => { e.stopPropagation(); openCompanyModal(company); }} className="text-slate-500 hover:text-white p-1" title="Edit Company"><Pencil size={12} /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {currentApp === 'domains' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Portfolio</p>
              <button onClick={() => { setActiveDomainTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeDomainTab === 'overview' ? 'bg-teal-500 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                <Globe size={18} /> All Domains
              </button>
            </div>
            
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>
                {currentUser?.isAdmin && <button onClick={() => openCompanyModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Company"><Plus size={16} /></button>}
              </div>
              <div className="flex flex-col gap-1">
                {visibleCompanies.map(company => (
                  <div key={company.id} className="flex items-center justify-between group/company">
                    <button onClick={() => { setActiveDomainTab(company.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeDomainTab === company.id ? 'bg-slate-800 text-teal-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                      <CompanyLogo company={company} sizeClass="w-5 h-5" />
                      <span className="truncate">{company.name}</span>
                    </button>
                    {currentUser?.isAdmin && (
                      <div className="flex items-center flex-shrink-0 opacity-0 group-hover/company:opacity-100 transition-opacity ml-1">
                        <button onClick={(e) => { e.stopPropagation(); openCompanyModal(company); }} className="text-slate-500 hover:text-white p-1" title="Edit Company"><Pencil size={12} /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {currentApp === 'youtube' && (
          <>
            <div className="px-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Channels</p>
                {currentUser?.isAdmin && <button onClick={() => openYoutubeModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Channel"><Plus size={16} /></button>}
              </div>
              <div className="flex flex-col gap-1">
                {youtubeChannels.length > 0 ? youtubeChannels.map(channel => (
                  <div key={channel.id} className="flex items-center justify-between group/channel">
                    <button onClick={() => { setActiveYoutubeChannelId(channel.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm overflow-hidden ${activeYoutubeChannelId === channel.id ? 'bg-slate-800 text-red-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                      <Youtube size={16} className={`flex-shrink-0 ${activeYoutubeChannelId === channel.id ? 'text-red-500' : 'text-slate-500'}`} />
                      <span className="truncate">{channel.name}</span>
                    </button>
                    {currentUser?.isAdmin && <div className="flex items-center flex-shrink-0 opacity-0 group-hover/channel:opacity-100 transition-opacity ml-1"><button onClick={(e) => { e.stopPropagation(); openYoutubeModal(channel); }} className="text-slate-500 hover:text-white p-1" title="Edit Channel"><Pencil size={12} /></button></div>}
                  </div>
                )) : ( <div className="text-xs text-slate-500 p-3 text-center italic">No channels added yet.</div> )}
              </div>
            </div>
          </>
        )}

        {currentApp === 'shows' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Schedule</p>
              <button onClick={() => { setActiveShowTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeShowTab === 'overview' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                <CalendarDays size={18} /> All Shows
              </button>
            </div>
            
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Channel</p>
              </div>
              <div className="flex flex-col gap-1">
                {youtubeChannels.map(channel => (
                  <div key={channel.id} className="flex items-center justify-between group/channel">
                    <button onClick={() => { setActiveShowTab(channel.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm overflow-hidden ${activeShowTab === channel.id ? 'bg-slate-800 text-red-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                      <Youtube size={16} className={`flex-shrink-0 ${activeShowTab === channel.id ? 'text-red-500' : 'text-slate-500'}`} />
                      <span className="truncate">{channel.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {currentApp === 'spreaker' && (
          <>
            <div className="px-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Podcasts</p>
                {currentUser?.isAdmin && <button onClick={() => openSpreakerModal()} className="text-slate-400 hover:text-white transition-colors p-1" title="Add Show"><Plus size={16} /></button>}
              </div>
              <div className="flex flex-col gap-1">
                {spreakerShows.length > 0 ? spreakerShows.map(show => (
                  <div key={show.id} className="flex items-center justify-between group/show">
                    <button onClick={() => { setActiveSpreakerShowId(show.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm overflow-hidden ${activeSpreakerShowId === show.id ? 'bg-slate-800 text-[#ffc005] font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                      <Mic size={16} className={`flex-shrink-0 ${activeSpreakerShowId === show.id ? 'text-[#ffc005]' : 'text-slate-500'}`} />
                      <span className="truncate">{show.name}</span>
                    </button>
                    {currentUser?.isAdmin && <div className="flex items-center flex-shrink-0 opacity-0 group-hover/show:opacity-100 transition-opacity ml-1"><button onClick={(e) => { e.stopPropagation(); openSpreakerModal(show); }} className="text-slate-500 hover:text-white p-1" title="Edit Show"><Pencil size={12} /></button></div>}
                  </div>
                )) : ( <div className="text-xs text-slate-500 p-3 text-center italic">No podcasts added yet.</div> )}
              </div>
            </div>
          </>
        )}
        
        {currentApp === 'events' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Planning</p>
              <button onClick={() => { setActiveEventTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeEventTab === 'overview' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                <CalendarDays size={18} /> All Events
              </button>
            </div>
            
            <div className="px-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Company</p>
              </div>
              <div className="flex flex-col gap-1">
                {visibleCompanies.filter(c => events.some(e => e.companyId === c.id)).map(company => (
                  <div key={company.id} className="flex items-center justify-between group/company">
                    <button onClick={() => { setActiveEventTab(company.id); setIsMobileMenuOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${activeEventTab === company.id ? 'bg-slate-800 text-purple-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}>
                      <CompanyLogo company={company} sizeClass="w-5 h-5" />
                      <span className="truncate">{company.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {currentApp === 'activity' && (
          <>
            <div className="px-4 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Filters</p>
              <div className="space-y-1">
                <button onClick={() => { setActiveActivityTab('overview'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeActivityTab === 'overview' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                  <Activity size={18} /> All Activity
                </button>
                <button onClick={() => { setActiveActivityTab('projects'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeActivityTab === 'projects' ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-300 hover:text-blue-400'}`}>
                  <LayoutDashboard size={18} /> Projects
                </button>
                <button onClick={() => { setActiveActivityTab('tasks'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeActivityTab === 'tasks' ? 'bg-slate-800 text-emerald-400' : 'hover:bg-slate-800 text-slate-300 hover:text-emerald-400'}`}>
                  <CheckCircle size={18} /> Tasks
                </button>
                <button onClick={() => { setActiveActivityTab('team'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeActivityTab === 'team' ? 'bg-slate-800 text-indigo-400' : 'hover:bg-slate-800 text-slate-300 hover:text-indigo-400'}`}>
                  <Users size={18} /> Team
                </button>
                <button onClick={() => { setActiveActivityTab('events'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeActivityTab === 'events' ? 'bg-slate-800 text-purple-400' : 'hover:bg-slate-800 text-slate-300 hover:text-purple-400'}`}>
                  <CalendarDays size={18} /> Events
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <button onClick={openProfileModal} className="flex-1 flex items-center gap-3 px-2 py-2 rounded-lg transition-colors hover:bg-slate-800 text-slate-300 hover:text-white group overflow-hidden">
          {currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-600 flex-shrink-0 bg-white" /> : <UserCircle size={28} className="text-slate-500 group-hover:text-slate-400 flex-shrink-0" />}
          <div className="flex flex-col items-start truncate text-left pr-2">
            <span className="font-bold text-sm truncate w-full flex items-center gap-1.5 text-slate-200 group-hover:text-white transition-colors">{(currentUser?.name || 'User').split(' ')[0]}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 truncate w-full ${currentUser?.isAdmin ? 'text-amber-500' : 'text-blue-400'}`}>{currentUser?.isAdmin ? 'Workspace Admin' : 'Team Member'}</span>
          </div>
        </button>

        <div className="flex items-center gap-1">
          {currentUser?.isAdmin && (
             <>
               <button onClick={() => setIsTeamModalOpen(true)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Manage Team Permissions"><Users size={16} /></button>
               <button onClick={() => setIsSwitchUserModalOpen(true)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Switch User (Test Mode)"><UserCog size={16} /></button>
             </>
          )}
        </div>
      </div>
    </div>
  );
}