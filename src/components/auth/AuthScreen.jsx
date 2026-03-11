import React, { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { API_URL } from '../../utils/constants';

export default function AuthScreen({ users, setUsers, setLoggedInUserId, sendToAPI }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (!name.trim() || !email.trim() || !password.trim()) return;
      const isFirstUser = users.length === 0;
      const newUser = { 
        id: 'u' + Date.now(), 
        name, 
        email: email.toLowerCase(), 
        password, 
        isAdmin: isFirstUser, 
        canViewProjects: true, 
        canViewBudget: isFirstUser, 
        canViewDomains: isFirstUser, 
        canViewEvents: isFirstUser, 
        canViewSpreaker: isFirstUser, 
        avatarUrl: '' 
      };
      const localUser = { ...newUser };
      delete localUser.password;
      setUsers([...users, localUser]);
      setLoggedInUserId(localUser.id);
      await sendToAPI('save_user', newUser);
    } else {
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!existingUser) { setIsRegistering(true); return; }
      try {
        const response = await fetch(`${API_URL}?action=login`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ email: email.toLowerCase(), password }) 
        });
        const data = await response.json();
        if (data.error) alert(data.error);
        else {
          setLoggedInUserId(data.user.id);
          setUsers(prevUsers => {
            if (prevUsers.find(u => u.id === data.user.id)) return prevUsers.map(u => u.id === data.user.id ? data.user : u);
            return [...prevUsers, data.user];
          });
        }
      } catch (err) { alert("Could not connect to the authentication server."); }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-600/20">
          <LayoutDashboard size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 text-center mb-2">Control Room</h1>
        <p className="text-slate-500 text-center mb-8">{isRegistering ? "It looks like you're new! Let's get you set up." : "Enter your credentials to sign in."}</p>
        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="John Doe" />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="you@company.com" disabled={isRegistering && email !== ''} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-md transition-colors mt-4">{isRegistering ? 'Create Account' : 'Sign In'}</button>
        </form>
        {isRegistering && <button onClick={() => setIsRegistering(false)} className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700 font-medium">Back to Sign In</button>}
      </div>
    </div>
  );
}