import React from 'react';
import { LayoutDashboard, AlertTriangle, Plus, BarChart3, User } from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeIssuesCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  activeIssuesCount = 24,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-1 flex items-center justify-around shadow-lg">
      {/* Home / Dashboard */}
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium transition-colors ${
          currentTab === 'dashboard' ? 'text-[#00236f] font-semibold' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </button>

      {/* Issues */}
      <button
        onClick={() => onSelectTab('issues')}
        className={`relative flex flex-col items-center py-1 px-2 text-[11px] font-medium transition-colors ${
          currentTab === 'issues' ? 'text-[#00236f] font-semibold' : 'text-slate-500'
        }`}
      >
        <div className="relative">
          <AlertTriangle className="w-5 h-5 mb-0.5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-600 rounded-full" />
        </div>
        <span>Issues</span>
      </button>

      {/* Center Plus Button */}
      <div className="flex flex-col items-center -mt-5">
        <button
          onClick={() => onSelectTab('raise')}
          className="w-12 h-12 rounded-full bg-[#00236f] hover:bg-[#1e3a8a] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="Raise an Issue"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Rankers */}
      <button
        onClick={() => onSelectTab('rankers')}
        className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium transition-colors ${
          currentTab === 'rankers' ? 'text-[#00236f] font-semibold' : 'text-slate-500'
        }`}
      >
        <BarChart3 className="w-5 h-5 mb-0.5" />
        <span>Rankers</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium transition-colors ${
          currentTab === 'profile' ? 'text-[#00236f] font-semibold' : 'text-slate-500'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
