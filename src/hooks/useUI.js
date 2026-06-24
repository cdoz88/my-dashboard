import { useState, useEffect } from 'react';

export function useUI() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncingLedger, setIsSyncingLedger] = useState(false);

  // --- BROWSER URL ROUTING INITIALIZATION ---
  const initialParams = new URLSearchParams(window.location.search);
  const initialApp = initialParams.get('app');
  const initialTab = initialParams.get('tab');

  // Core App State
  const [currentApp, setCurrentApp] = useState(() => {
      const app = initialApp || localStorage.getItem('fyt_currentApp') || 'home';
      if (app === 'shows') return 'youtube';
      if (app === 'domains' || app === 'analytics') return 'website';
      return app;
  }); 
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sub-Navigation States
  const [youtubeSection, setYoutubeSection] = useState(() => {
      if (initialApp === 'shows') return 'shows';
      return localStorage.getItem('fyt_youtubeSection') || 'stats';
  });
  
  const [websiteSection, setWebsiteSection] = useState(() => {
      if (initialApp === 'analytics' || localStorage.getItem('fyt_currentApp') === 'analytics') return 'analytics';
      return localStorage.getItem('fyt_websiteSection') || 'analytics';
  });

  // View States
  const [activeTab, setActiveTab] = useState(() => (initialApp === 'projects' || initialApp === 'home' || initialApp === 'ledger' || !initialApp) && initialTab ? initialTab : localStorage.getItem('fyt_activeTab') || 'mytasks'); 
  const [activeBudgetTab, setActiveBudgetTab] = useState(() => initialApp === 'budget' && initialTab ? initialTab : localStorage.getItem('fyt_activeBudgetTab') || 'overview'); 
  const [activeDomainTab, setActiveDomainTab] = useState(() => (initialApp === 'domains' || initialApp === 'website') && initialTab ? initialTab : localStorage.getItem('fyt_activeDomainTab') || 'overview');
  const [activeEventTab, setActiveEventTab] = useState(() => initialApp === 'events' && initialTab ? initialTab : localStorage.getItem('fyt_activeEventTab') || 'overview');
  const [activeShowTab, setActiveShowTab] = useState(() => (initialApp === 'shows' || initialApp === 'youtube') && initialTab ? initialTab : localStorage.getItem('fyt_activeShowTab') || 'overview');
  const [activeSponsorshipTab, setActiveSponsorshipTab] = useState(() => initialApp === 'sponsorships' && initialTab ? initialTab : localStorage.getItem('fyt_activeSponsorshipTab') || 'overview');
  const [activeTeamTab, setActiveTeamTab] = useState(() => initialApp === 'team' && initialTab ? initialTab : localStorage.getItem('fyt_activeTeamTab') || 'overview');
  const [activeActivityTab, setActiveActivityTab] = useState(() => initialApp === 'activity' && initialTab ? initialTab : localStorage.getItem('fyt_activeActivityTab') || 'overview');
  const [activeCRMTab, setActiveCRMTab] = useState(() => initialApp === 'crm' && initialTab ? initialTab : localStorage.getItem('fyt_activeCRMTab') || 'overview');
  const [activePasswordTab, setActivePasswordTab] = useState(() => initialApp === 'passwords' && initialTab ? initialTab : localStorage.getItem('fyt_activePasswordTab') || 'overview');

  // Display Modes
  const [projectDisplayMode, setProjectDisplayMode] = useState(() => localStorage.getItem('fyt_projectDisplayMode') || 'list');
  const [budgetDisplayMode, setBudgetDisplayMode] = useState(() => localStorage.getItem('fyt_budgetDisplayMode') || 'list'); 
  const [expenseSortConfig, setExpenseSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [domainDisplayMode, setDomainDisplayMode] = useState(() => localStorage.getItem('fyt_domainDisplayMode') || 'list'); 
  const [domainSortConfig, setDomainSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [eventDisplayMode, setEventDisplayMode] = useState(() => localStorage.getItem('fyt_eventDisplayMode') || 'timeline');
  const [showDisplayMode, setShowDisplayMode] = useState(() => localStorage.getItem('fyt_showDisplayMode') || 'calendar');
  const [teamDisplayMode, setTeamDisplayMode] = useState(() => localStorage.getItem('fyt_teamDisplayMode') || 'cards');
  const [crmDisplayMode, setCRMDisplayMode] = useState(() => localStorage.getItem('fyt_crmDisplayMode') || 'list');

  // Integration Active States & Filters
  const [activeYoutubeChannelId, setActiveYoutubeChannelId] = useState(null);
  const [youtubeTimeFilter, setYoutubeTimeFilter] = useState('28'); 
  const [activeSpreakerShowId, setActiveSpreakerShowId] = useState(null);
  const [spreakerTimeFilter, setSpreakerTimeFilter] = useState('30');
  const [activeAnalyticsId, setActiveAnalyticsId] = useState(null);
  const [analyticsTimeFilter, setAnalyticsTimeFilter] = useState('28');
  
  const [loggedInUserId, setLoggedInUserId] = useState(() => localStorage.getItem('loggedInUserId') || null);

  // --- BROWSER HISTORY SYNCING (URL Management) ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('sso_token') || urlParams.has('code') || urlParams.has('task')) return;

    let currentTab = activeTab;
    if (currentApp === 'budget') currentTab = activeBudgetTab;
    else if (currentApp === 'website') currentTab = websiteSection === 'analytics' ? (activeAnalyticsId || '') : activeDomainTab;
    else if (currentApp === 'events') currentTab = activeEventTab;
    else if (currentApp === 'youtube') currentTab = youtubeSection === 'shows' ? activeShowTab : (activeYoutubeChannelId || '');
    else if (currentApp === 'sponsorships') currentTab = activeSponsorshipTab;
    else if (currentApp === 'team') currentTab = activeTeamTab;
    else if (currentApp === 'activity') currentTab = activeActivityTab;
    else if (currentApp === 'crm') currentTab = activeCRMTab;
    else if (currentApp === 'passwords') currentTab = activePasswordTab;
    else if (currentApp === 'knowledge') currentTab = '';

    if (urlParams.get('app') !== currentApp || urlParams.get('tab') !== currentTab) {
        urlParams.set('app', currentApp);
        if (currentTab) urlParams.set('tab', currentTab);
        window.history.pushState({ app: currentApp, tab: currentTab }, '', `${window.location.pathname}?${urlParams.toString()}`);
    }

    localStorage.setItem('fyt_currentApp', currentApp);
    localStorage.setItem('fyt_youtubeSection', youtubeSection);
    localStorage.setItem('fyt_websiteSection', websiteSection);
    localStorage.setItem('fyt_activeTab', activeTab);
    localStorage.setItem('fyt_activeBudgetTab', activeBudgetTab);
    localStorage.setItem('fyt_activeDomainTab', activeDomainTab);
    localStorage.setItem('fyt_activeEventTab', activeEventTab);
    localStorage.setItem('fyt_activeShowTab', activeShowTab);
    localStorage.setItem('fyt_activeSponsorshipTab', activeSponsorshipTab);
    localStorage.setItem('fyt_activeTeamTab', activeTeamTab);
    localStorage.setItem('fyt_activeActivityTab', activeActivityTab);
    localStorage.setItem('fyt_activeCRMTab', activeCRMTab);
    localStorage.setItem('fyt_activePasswordTab', activePasswordTab);
  }, [currentApp, youtubeSection, websiteSection, activeTab, activeBudgetTab, activeDomainTab, activeEventTab, activeShowTab, activeSponsorshipTab, activeTeamTab, activeActivityTab, activeCRMTab, activePasswordTab, activeAnalyticsId, activeYoutubeChannelId]);

  // Handle Browser Back/Forward Buttons
  useEffect(() => {
    const handlePopState = (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const app = event.state?.app || urlParams.get('app');
        const tab = event.state?.tab || urlParams.get('tab');
        
        if (app) setCurrentApp(app);
        if (tab) {
            if (app === 'projects' || app === 'home' || app === 'ledger') setActiveTab(tab);
            else if (app === 'budget') setActiveBudgetTab(tab);
            else if (app === 'events') setActiveEventTab(tab);
            else if (app === 'sponsorships') setActiveSponsorshipTab(tab);
            else if (app === 'team') setActiveTeamTab(tab);
            else if (app === 'activity') setActiveActivityTab(tab);
            else if (app === 'crm') setActiveCRMTab(tab);
            else if (app === 'passwords') setActivePasswordTab(tab);
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save Display Modes to local storage
  useEffect(() => { localStorage.setItem('fyt_projectDisplayMode', projectDisplayMode); }, [projectDisplayMode]);
  useEffect(() => { localStorage.setItem('fyt_budgetDisplayMode', budgetDisplayMode); }, [budgetDisplayMode]);
  useEffect(() => { localStorage.setItem('fyt_domainDisplayMode', domainDisplayMode); }, [domainDisplayMode]);
  useEffect(() => { localStorage.setItem('fyt_eventDisplayMode', eventDisplayMode); }, [eventDisplayMode]);
  useEffect(() => { localStorage.setItem('fyt_showDisplayMode', showDisplayMode); }, [showDisplayMode]);
  useEffect(() => { localStorage.setItem('fyt_teamDisplayMode', teamDisplayMode); }, [teamDisplayMode]);
  useEffect(() => { localStorage.setItem('fyt_crmDisplayMode', crmDisplayMode); }, [crmDisplayMode]);

  return {
    isLoading, setIsLoading,
    isUploading, setIsUploading,
    isSyncingLedger, setIsSyncingLedger,
    currentApp, setCurrentApp,
    youtubeSection, setYoutubeSection,
    websiteSection, setWebsiteSection,
    isAppSwitcherOpen, setIsAppSwitcherOpen,
    isMobileMenuOpen, setIsMobileMenuOpen,
    activeTab, setActiveTab,
    activeBudgetTab, setActiveBudgetTab,
    activeDomainTab, setActiveDomainTab,
    activeEventTab, setActiveEventTab,
    activeShowTab, setActiveShowTab,
    activeSponsorshipTab, setActiveSponsorshipTab,
    activeTeamTab, setActiveTeamTab,
    activeActivityTab, setActiveActivityTab,
    activeCRMTab, setActiveCRMTab,
    activePasswordTab, setActivePasswordTab,
    projectDisplayMode, setProjectDisplayMode,
    budgetDisplayMode, setBudgetDisplayMode,
    expenseSortConfig, setExpenseSortConfig,
    domainDisplayMode, setDomainDisplayMode,
    domainSortConfig, setDomainSortConfig,
    eventDisplayMode, setEventDisplayMode,
    showDisplayMode, setShowDisplayMode,
    teamDisplayMode, setTeamDisplayMode,
    crmDisplayMode, setCRMDisplayMode,
    activeYoutubeChannelId, setActiveYoutubeChannelId,
    youtubeTimeFilter, setYoutubeTimeFilter,
    activeSpreakerShowId, setActiveSpreakerShowId,
    spreakerTimeFilter, setSpreakerTimeFilter,
    activeAnalyticsId, setActiveAnalyticsId,
    analyticsTimeFilter, setAnalyticsTimeFilter,
    loggedInUserId, setLoggedInUserId
  };
}