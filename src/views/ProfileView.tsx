import React from 'react';
import { User, Award, ShieldCheck, CheckCircle2, Star, Sparkles, BookOpen, Clock } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  const badges = [
    {
      title: 'Quick Reporter',
      desc: 'First 10 verified tickets reported with geotagged photographic proof within 15 minutes of occurrence.',
      earned: 'Sep 2026',
      icon: '⚡',
    },
    {
      title: 'Civic Champion',
      desc: 'Achieved 98%+ verification score from department HOD and maintenance inspections.',
      earned: 'Aug 2026',
      icon: '🏆',
    },
    {
      title: 'Consensus Builder',
      desc: 'Mobilized over 100+ student upvotes on critical campus safety and lab equipment tickets.',
      earned: 'Jul 2026',
      icon: '🤝',
    },
    {
      title: 'Lab Guardian',
      desc: 'Helped resolve 5 critical IT & Electrical laboratory incidents before university semester exams.',
      earned: 'Jun 2026',
      icon: '💻',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Profile Overview */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/20 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold font-display text-slate-900">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Active Citizen
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Level {user.level} Steward
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {user.department} • {user.semester} • Roll #{user.rollNo}
              </p>
              <p className="text-xs font-mono text-slate-400">
                Enrollment ID: {user.enrollment} · Vishwakarma Government Engineering College
              </p>
            </div>
          </div>

          {/* Trust Score Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center sm:text-right shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Citizen Trust Score
            </span>
            <span className="text-3xl font-extrabold font-display text-slate-900 tabular-nums">
              {user.trustScore}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold block mt-0.5">
              Verified High Authenticity
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-800">Level 4 Contributor Progress</span>
            <span className="font-mono text-blue-700">
              {user.currentXp} / {user.nextLevelXp} XP (
              {Math.round((user.currentXp / user.nextLevelXp) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-700 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(user.currentXp / user.nextLevelXp) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Next milestone: Campus Steward (Tier 5)</span>
            <span>{user.nextLevelXp - user.currentXp} XP needed</span>
          </div>
        </div>
      </div>

      {/* Badges and Honors */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Earned Civic Honors & Badges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-[10px] font-mono text-slate-400">{b.earned}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{b.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{b.desc}</p>
              </div>
              <div className="pt-2 text-[10px] font-semibold text-emerald-700 flex items-center gap-1 border-t border-slate-100">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified by Academic Dean</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
