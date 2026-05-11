import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router';
import { LogOut, Home, Clock } from 'lucide-react';

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <nav className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0A0F1E]/80 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-[#00C9B1] rounded flex items-center justify-center font-bold text-[#0A0F1E]">CE</div>
        <span className="font-heading text-xl font-bold tracking-tight">ClauseEase</span>
        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-[#00C9B1] uppercase tracking-widest">Architect v1.0</span>
      </div>
      <div className="flex items-center space-x-6 text-sm font-medium text-white/60 uppercase tracking-wider">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `transition-colors ${
              isActive ? 'text-[#00C9B1]' : 'hover:text-white'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `transition-colors ${
              isActive ? 'text-[#00C9B1]' : 'hover:text-white'
            }`
          }
        >
          History
        </NavLink>
        
        <div className="flex items-center space-x-4 ml-4">
          {user && <span className="text-white/40 text-[10px] font-mono tracking-widest lowercase">{user.email}</span>}
          <button
            onClick={logout}
            className="w-8 h-8 rounded-full flex justify-center items-center bg-gradient-to-br from-[#00C9B1] to-blue-500 border border-white/20 hover:opacity-80 transition-opacity"
            title="Log out"
          >
            <LogOut className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
