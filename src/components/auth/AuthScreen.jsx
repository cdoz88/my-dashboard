import React, { useEffect, useState } from 'react';
import { LayoutDashboard, LogIn, RefreshCw } from 'lucide-react';
import { API_URL } from '../../utils/constants';

export default function AuthScreen({ users, setUsers, setLoggedInUserId, sendToAPI, setCurrentApp }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('sso_token');

    if (token) {
      setIsAuthenticating(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      
      fetch(`${API_URL}?action=sso_login`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ token }) 
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
            alert(data.error);
            setIsAuthenticating(false);
        } else {
            setLoggedInUserId(data.user.id);
            if (setCurrentApp) setCurrentApp('home');
            setUsers(prevUsers => {
                if (prevUsers.find(u => u.id === data.user.id)) return prevUsers.map(u => u.id === data.user.id ? data.user : u);
                return [...prevUsers, data.user];
            });
        }
      })
      .catch(err => {
          alert("Could not connect to the authentication server.");
          setIsAuthenticating(false);
      });
    }
  }, []);

  const handleWordPressLogin = () => {
     const origin = encodeURIComponent(window.location.origin);
     const returnUrl = encodeURIComponent(`https://admin.fsan.com/wp-admin/admin-ajax.php?action=fsan_generate_sso_token&client_url=${origin}`);
     window.location.href = `https://admin.fsan.com/login?redirect_to=${returnUrl}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-600/20">
          <LayoutDashboard size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Control Room</h1>
        <p className="text-slate-500 mb-8">
            Sign in with your FSAN WordPress account to securely access the workspace.
        </p>
        
        <button 
            onClick={handleWordPressLogin} 
            disabled={isAuthenticating}
            className="w-full py-4 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-3 text-lg"
        >
            {isAuthenticating ? <><RefreshCw size={24} className="animate-spin" /> Authenticating...</> : <><LogIn size={24} /> Login with WordPress</>}
        </button>
      </div>
    </div>
  );
}