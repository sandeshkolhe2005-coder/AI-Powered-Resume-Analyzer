import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  BarChart3, 
  UploadCloud, 
  FileText, 
  Target, 
  Sparkles, 
  MessageSquare, 
  FileEdit, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { resumes, currentResume, selectResume, logout, user } = useStore();
  const [collapsed, setCollapsed] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: BarChart3 },
    { name: 'Upload Resume', to: '/upload', icon: UploadCloud },
    { name: 'Resume Analysis', to: '/analysis', icon: FileText, disabled: !currentResume },
    { name: 'Job Matcher', to: '/matcher', icon: Target, disabled: !currentResume },
    { name: 'AI Advice / Chat', to: '/chat', icon: MessageSquare, disabled: !currentResume },
    { name: 'Cover Letter', to: '/cover-letter', icon: FileEdit, disabled: !currentResume },
    { name: 'Interview prep', to: '/interview', icon: Sparkles, disabled: !currentResume },
  ];

  return (
    <div 
      className={`bg-bgSurface border-r border-borderSubtle h-screen flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-borderSubtle flex items-center justify-between">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accentPrimary to-accentViolet flex items-center justify-center font-bold text-white shadow-lg">
              R
            </div>
            <span className="font-bold text-textPrimary text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-accentPrimary to-accentViolet">
              ATS ANALYZER
            </span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accentPrimary to-accentViolet flex items-center justify-center font-bold text-white mx-auto">
            R
          </div>
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-textSecondary hover:text-textPrimary p-1.5 rounded-lg bg-bgSurfaceHover hover:bg-borderSubtle transition-all hidden md:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-textSecondary/40 cursor-not-allowed select-none group"
                title="Please upload or select a resume first"
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium transition-opacity duration-200">
                    {item.name}
                  </span>
                )}
              </div>
            );
          }
          
          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-accentPrimary/20 to-accentViolet/20 border-l-4 border-accentPrimary'
                    : 'text-textSecondary hover:text-textPrimary hover:bg-bgSurfaceHover'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium transition-opacity duration-200">
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Selected Resume Context Box */}
        {!collapsed && resumes.length > 0 && (
          <div className="mt-8 pt-6 border-t border-borderSubtle">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider px-3 block mb-3">
              Active Resume Context
            </span>
            <div className="space-y-1">
              {resumes.map((res) => (
                <button
                  key={res.id}
                  onClick={() => selectResume(res)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all truncate flex items-center justify-between ${
                    currentResume?.id === res.id
                      ? 'bg-borderSubtle text-accentPrimary font-semibold'
                      : 'text-textSecondary hover:bg-bgSurfaceHover hover:text-textPrimary'
                  }`}
                >
                  <span className="truncate pr-2">{res.filename}</span>
                  {currentResume?.id === res.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accentPrimary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer Profile / Logout */}
      <div className="p-4 border-t border-borderSubtle">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-bgSurfaceHover flex items-center justify-center text-xs font-bold text-accentPrimary border border-borderSubtle">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-textPrimary truncate">{user?.email}</p>
                <p className="text-[10px] text-textSecondary">Developer Profile</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-textSecondary hover:text-brandDanger hover:bg-brandDanger/10 transition-all font-medium text-sm"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="mx-auto flex items-center justify-center p-2 rounded-xl text-textSecondary hover:text-brandDanger hover:bg-brandDanger/10 transition-all"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
