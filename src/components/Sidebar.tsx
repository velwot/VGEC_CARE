import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  PlusCircle,
  Package,
  BarChart3,
  CheckSquare,
  User,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { CampusLogo } from './CampusLogo';

export type NavTab =
  | 'dashboard'
  | 'issues'
  | 'raise'
  | 'lost-found'
  | 'rankers'
  | 'contributions'
  | 'profile';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeIssueCount?: number;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeIssueCount = 24,
  isAdminMode,
  onToggleAdminMode,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'issues' as NavTab,
      label: 'Campus Issues',
      icon: AlertTriangle,
      badge: `${activeIssueCount} Active`,
      badgeColor: 'bg-rose-100 text-rose-700 border border-rose-200',
    },
    {
      id: 'raise' as NavTab,
      label: 'Raise Issue',
      icon: PlusCircle,
    },
    {
      id: 'lost-found' as NavTab,
      label: 'Lost & Found',
      icon: Package,
    },
    {
      id: 'rankers' as NavTab,
      label: 'Rankers',
      icon: BarChart3,
    },
    {
      id: 'contributions' as NavTab,
      label: 'My Contributions',
      icon: CheckSquare,
    },
    {
      id: 'profile' as NavTab,
      label: 'Profile',
      icon: User,
    },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 flex flex-col justify-between h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col pt-5 px-4 pb-2">
          {/* Logo */}
          <div className="px-2 pb-2">
            <CampusLogo size="md" subtitleText="VGEC Chandkheda" />
            <p className="mt-2 text-xs italic text-slate-500 font-sans tracking-tight">
              &ldquo;Report. Support. Improve. Repeat.&rdquo;
            </p>
          </div>

          {/* Admin badge if active */}
          {isAdminMode && (
            <div className="mx-2 my-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-800">
              <span className="flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                Admin Mode Active
              </span>
              <button
                onClick={onToggleAdminMode}
                className="text-[11px] font-semibold underline hover:text-amber-900"
              >
                Exit
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#1e3a8a] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          {/* Switch to Admin */}
          <button
            onClick={onToggleAdminMode}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              {isAdminMode ? 'Switch to Student' : 'Switch to Admin'}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
          </button>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-600">Campus: Normal Ops</span>
          </div>
        </div>
      </aside>
    </>
  );
};
