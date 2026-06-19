import React from 'react';

// Shared Components
import AuthScreen from './components/auth/AuthScreen';

// Layout Components
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import DashboardRouter from './components/dashboards/DashboardRouter';
import ModalsManager from './components/modals/ModalsManager';

// Custom Hooks
import { useAppLogic } from './hooks/useAppLogic';

export default function App() {
  const appState = useAppLogic();

  if (appState.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appState.currentUser) {
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
      </div>

      <ModalsManager {...appState} />
    </>
  );
}