import React, { useState } from 'react';
import { Search, Plus, Bell, Menu, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface TopNavbarProps {
  user: UserProfile;
  onOpenSearch: () => void;
  onOpenRaiseIssue: () => void;
  onOpenProfile: () => void;
  onToggleMobileMenu: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  onOpenSearch,
  onOpenRaiseIssue,
  onOpenProfile,
  onToggleMobileMenu,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Technician Assigned',
      desc: 'Work order #WO-891 assigned to Projector in Room 204.',
      time: '15m ago',
      type: 'update',
    },
    {
      id: 2,
      title: 'Issue Upvoted',
      desc: '12 new students supported your Water Cooler ticket.',
      time: '1h ago',
      type: 'vote',
    },
    {
      id: 3,
      title: 'Fire Safety Inspection',
      desc: 'Annual inspection across Block A, B, C scheduled this week.',
      time: '3h ago',
      type: 'alert',
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      {/* Left zone: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar Trigger */}
        <button
          onClick={onOpenSearch}
          className="w-full max-w-md flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 border border-slate-200 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="truncate">Global issue search...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
            <span className="text-xs text-slate-300">/</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
              /
            </kbd>
          </div>
        </button>
      </div>

      {/* Right zone: Raise Issue CTA, Notifications, User profile */}
      <div className="flex items-center gap-3">
        {/* Raise Issue CTA button */}
        <button
          onClick={onOpenRaiseIssue}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#00236f] hover:bg-[#1e3a8a] active:bg-[#00174a] rounded-lg shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Issue</span>
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-2xs">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900 uppercase tracking-wide">
                    Campus Alerts & Updates
                  </span>
                  <span className="px-1.5 py-0.2 text-[10px] font-medium bg-rose-100 text-rose-700 rounded-full">
                    3 New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 hover:bg-slate-50 transition-colors flex gap-3 text-left cursor-pointer"
                    onClick={() => setShowNotifications(false)}
                  >
                    <div className="mt-0.5">
                      {item.type === 'update' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <span className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">
                  Mark all as read
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all text-left group"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-blue-200"
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
              {user.name.split(' ')[0]}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
              <span>Lvl {user.level}</span>
              <span className="text-slate-300">·</span>
              <span className="text-blue-600">{user.currentXp} XP</span>
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
