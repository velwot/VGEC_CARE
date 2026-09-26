import React, { useState } from 'react';
import {
  TrendingUp,
  FileText,
  CheckCircle2,
  ThumbsUp,
  AlertCircle,
  Camera,
  Users,
  ClipboardCheck,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Flame,
  MessageSquare,
  MapPin,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
  ChevronDown,
  Volume2,
} from 'lucide-react';
import { Issue, UserProfile } from '../types';
import { NavTab } from '../components/Sidebar';

interface DashboardViewProps {
  issues: Issue[];
  user: UserProfile;
  onSelectIssue: (issue: Issue) => void;
  onNavigateTab: (tab: NavTab) => void;
  onUpvoteIssue: (issueId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  issues,
  user,
  onSelectIssue,
  onNavigateTab,
  onUpvoteIssue,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'upvoted' | 'recent'>('upvoted');

  const filterTabs = [
    { id: 'All', label: 'All (24)' },
    { id: 'Trending', label: '🔥 Trending' },
    { id: 'Infrastructure', label: 'Infrastructure' },
    { id: 'Water', label: 'Water' },
    { id: 'Wi-Fi', label: 'Wi-Fi' },
    { id: 'Cleanliness', label: 'Cleanliness' },
    { id: 'Lab Equipment', label: 'Lab Equipment' },
  ];

  const filteredIssues = issues.filter((issue) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Trending') return issue.supportCount > 25;
    if (selectedFilter === 'Water') return issue.category === 'Water Supply';
    if (selectedFilter === 'Wi-Fi') return issue.category === 'Wi-Fi & IT';
    return issue.category.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'upvoted') return b.supportCount - a.supportCount;
    return 0;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 border border-amber-300/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            IN PROGRESS
          </span>
        );
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            VERIFIED
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            UNDER REVIEW
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            RESOLVED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Hero Banner: VGEC Campus Governance Portal */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001f5c] via-[#002b7f] to-[#1e3a8a] text-white p-6 sm:p-8 shadow-sm border border-blue-900/40">
        {/* Subtle decorative geometry */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-24 top-6 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-400/30 text-[11px] font-semibold tracking-wider text-blue-200 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              VGEC Campus Governance Portal
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white text-balance leading-tight">
              Make our campus better, together.
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
              Report campus problems, support important issues with peer consensus, and track
              them transparently until resolution.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('raise')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
            >
              <span>+ Raise an Issue</span>
            </button>
            <button
              onClick={() => onNavigateTab('issues')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/15 text-white font-medium text-sm border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Browse Trending Issues</span>
            </button>
          </div>
        </div>

        {/* Notice Banner Strip */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-100">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-bold">📢 NOTICE:</span>
            <span>
              Civil maintenance ongoing at Block D washrooms. ETA completion: Friday.
            </span>
          </div>
          <span className="text-blue-300 font-mono text-[11px] shrink-0">
            Updated 45m ago
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Issues Raised */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Issues Raised</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-slate-900 tabular-nums">
              127
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              ↑ +12 this mo
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Across all 8 departments</p>
        </div>

        {/* Card 2: Resolved */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Resolved</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-slate-900 tabular-nums">
              61
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              48% Rate
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full w-[48%]" />
          </div>
        </div>

        {/* Card 3: Student Support */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Student Support</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-slate-900 tabular-nums">
              2,846
            </span>
            <span className="text-xs font-medium text-slate-500">votes cast</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">High democratic validation</p>
        </div>

        {/* Card 4: Active Issues */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Active Issues</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-rose-600 tabular-nums">
              24
            </span>
            <span className="text-xs font-medium text-slate-500">In Queue</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Under review or active work</p>
        </div>
      </div>

      {/* CampusCare Civic Lifecycle Track */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900">
              CampusCare Civic Lifecycle
            </h2>
            <p className="text-xs text-slate-500">
              How student reports transform into verified administrative action at VGEC
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Real-time SLA Tracking</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 relative">
          {/* Step 1: Report */}
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-200/60 relative group hover:bg-blue-50/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-[#00236f] text-white flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <Camera className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-900 tracking-wide">
              REPORT
            </span>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Submit geotagged photo & issue
            </p>
          </div>

          {/* Step 2: Support */}
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-200/60 relative group hover:bg-blue-50/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-[#00236f] text-white flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <Users className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-900 tracking-wide">
              SUPPORT
            </span>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Peers upvote to validate urgency
            </p>
          </div>

          {/* Step 3: Verify */}
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-200/60 relative group hover:bg-blue-50/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-[#00236f] text-white flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <ClipboardCheck className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-900 tracking-wide">
              VERIFY
            </span>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              HOD / Facility admin inspects
            </p>
          </div>

          {/* Step 4: Act */}
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-200/60 relative group hover:bg-blue-50/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-[#00236f] text-white flex items-center justify-center text-[10px] font-bold">
                4
              </span>
              <Wrench className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-900 tracking-wide">
              ACT
            </span>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Dispatched to maintenance crew
            </p>
          </div>

          {/* Step 5: Resolve */}
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-200/60 relative group hover:bg-blue-50/40 transition-colors col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                5
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-900 tracking-wide">
              RESOLVE
            </span>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Public closure & photo audit
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Live Feed (Col 1-8) & Right Profile Widgets (Col 9-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">
                Campus Issues – Live Feed
              </h2>
              <p className="text-xs text-slate-500">Real-time student submissions & repair statuses</p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'upvoted' | 'recent')}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none hover:border-slate-300 cursor-pointer"
              >
                <option value="upvoted">Most Upvoted</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1e3a8a] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Issues Feed List */}
          <div className="space-y-3">
            {sortedIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="group bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                {/* Content Left */}
                <div className="flex-1 space-y-2">
                  {/* Meta strip */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      #{issue.id}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-medium text-slate-600">{issue.category}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400">{issue.relativeTime}</span>
                    <span className="ml-auto sm:ml-2">{getStatusBadge(issue.status)}</span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {issue.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  {/* Location & Reporter */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {issue.block} · {issue.room}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span>Reported by {issue.reportedBy.name}</span>
                  </div>

                  {/* Footer Action Strip */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                    {/* Support Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvoteIssue(issue.id);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                        issue.isSupportedByCurrentUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Support ({issue.supportCount})</span>
                    </button>

                    {/* Comments */}
                    <span className="flex items-center gap-1 text-slate-500">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{issue.commentCount} comments</span>
                    </span>

                    {/* Assigned Tech / Status Note */}
                    {issue.techAssigned && (
                      <span className="ml-auto text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 truncate">
                        {issue.techAssigned}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Right */}
                {issue.image && (
                  <div className="w-full sm:w-28 sm:h-24 h-40 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                    <img
                      src={issue.image}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-4 space-y-4">
          {/* Widget 1: Student Civic Profile */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Student Civic Profile
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Citizen
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/20 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">{user.name}</h3>
                <p className="text-xs text-slate-500">
                  {user.semester} • {user.department}
                </p>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-700 font-semibold">Level {user.level} Contributor</span>
                <span className="font-mono text-blue-700 tabular-nums">
                  {user.currentXp} / {user.nextLevelXp} XP
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(user.currentXp / user.nextLevelXp) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {user.nextLevelXp - user.currentXp} XP to Level 5: Campus Steward
              </p>
            </div>

            {/* Recent Honor Badge */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs">
              <span className="font-semibold text-blue-900 block text-[11px] uppercase tracking-wide">
                Recent Honor
              </span>
              <p className="text-slate-700 font-medium mt-0.5">{user.recentHonor}</p>
            </div>
          </div>

          {/* Widget 2: High Priority Alert */}
          <div className="bg-rose-50/40 rounded-xl p-5 border border-rose-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold tracking-wider uppercase">
              <AlertCircle className="w-4 h-4" />
              <span>High Priority Alert</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Fire safety inspection scheduled across all blocks this week.
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please ensure fire exits and hallway corridors remain unobstructed during class
              transitions.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-rose-200/50">
              <span>By Safety Committee</span>
              <button
                onClick={() => alert('Fire Safety Circular 2026: Campus emergency pathways must remain clear. Inspecting team visits Block A & B on Wednesday.')}
                className="text-rose-700 font-semibold hover:underline cursor-pointer"
              >
                Read Circular →
              </button>
            </div>
          </div>

          {/* Widget 3: Mini Navigation Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('lost-found')}
              className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                Lost & Found
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">14 items claimed</p>
            </button>

            <button
              onClick={() => onNavigateTab('rankers')}
              className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                Top Rankers
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">View leaderboards</p>
            </button>
          </div>

          {/* Widget 4: VGEC Administrative SLA */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>VGEC Administrative SLA</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified campus issues receive formal departmental acknowledgment within 24
              operational hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
