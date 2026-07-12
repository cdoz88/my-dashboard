import React from 'react';
import { Menu, CheckCircle, Tv, Wallet } from 'lucide-react';

// Shared Components
import AuthScreen from './components/auth/AuthScreen';
import AdminLogin from './components/auth/AdminLogin';

// Layout Components
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import DashboardRouter from './components/dashboards/DashboardRouter';
import ModalsManager from './components/modals/ModalsManager';

// Context Provider
import { AppProvider, useAppContext } from './context/AppContext';

function MobileBottomNav({ appState }) {
  const {
    currentApp, activeTab, setCurrentApp, setActiveTab,
    setIsMobileMenuOpen, setYoutubeSection, setActiveShowTab,
    youtubeSection
  } = appState;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-40 px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <Menu size={20} />
        <span className="text-[10px] font-bold">Menu</span>
      </button>
      
      <button
        onClick={() => { setCurrentApp('projects'); setActiveTab('mytasks'); }}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentApp === 'projects' && activeTab === 'mytasks' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        <CheckCircle size={20} />
        <span className="text-[10px] font-bold">Tasks</span>
      </button>
      
      {/* FIXED: TV Icon now points to 'myshows' section */}
      <button
        onClick={() => { setCurrentApp('youtube'); setYoutubeSection('myshows'); setActiveShowTab('overview'); }}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentApp === 'youtube' && youtubeSection === 'myshows' ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        <Tv size={20} />
        <span className="text-[10px] font-bold">Shows</span>
      </button>
      
      <button
        onClick={() => { setCurrentApp('ledger'); setActiveTab('all'); }}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentApp === 'ledger' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
      >
        <Wallet size={20} />
        <span className="text-[10px] font-bold">Ledger</span>
      </button>
    </div>
  );
}

function AppContent() {
  const appState = useAppContext();

  if (appState.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appState.currentUser) {
    // Secret Admin Login Override
    if (window.location.pathname === '/admin-login') {
        return <AdminLogin setLoggedInUserId={appState.setLoggedInUserId} />;
    }

    return (
      <AuthScreen 
        users={appState.users} 
        setUsers={appState.setUsers} 
        setLoggedInUserId={appState.setLoggedInUserId} 
        sendToAPI={appState.sendToAPI} 
        setCurrentApp={appState.setCurrentApp} 
      />
    );
  }

  return (
    <>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden flex-col lg:flex-row">
        
        {appState.isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden" onClick={() => appState.setIsMobileMenuOpen(false)} />
        )}
        
        <div className={`fixed inset-y-0 left-0 z-40 transform ${appState.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out pb-16 lg:pb-0`}>
          <Sidebar {...appState} />
        </div>
        
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
          <TopBar {...appState} />
          
          <main className="flex-1 overflow-auto relative pb-16 lg:pb-0">
             <DashboardRouter {...appState} />
          </main>
          
        </div>

        <MobileBottomNav appState={appState} />

      </div>

      <ModalsManager {...appState} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}