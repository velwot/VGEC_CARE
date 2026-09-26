import React, { useState } from 'react';
import { CheckSquare, ThumbsUp, CheckCircle2, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Issue, UserProfile } from '../types';

interface MyContributionsViewProps {
  user: UserProfile;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onNavigateRaise: () => void;
}

export const MyContributionsView: React.FC<MyContributionsViewProps> = ({
  user,
  issues,
  onSelectIssue,
  onNavigateRaise,
}) => {
  const [activeTab, setActiveTab] = useState<'reported' | 'supported'>('reported');

  const myReported = issues.filter(
    (it) => it.reportedBy.name.includes('Narayan') || it.id === 'VGEC-EC-104'
  );

  const mySupported = issues.filter((it) => it.isSupportedByCurrentUser || it.supportCount > 30);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>Student Civic Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            My Contributions
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mt-1">
            Track all campus tickets you have authored, supported, or commented on.
          </p>
        </div>

        <button
          onClick={onNavigateRaise}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-lg text-sm font-semibold shadow-xs self-start md:self-auto cursor-pointer"
        >
          <span>+ Raise New Issue</span>
        </button>
      </div>

      {/* 3 Metric Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Issues Authored
          </span>
          <span className="text-2xl font-extrabold font-display text-slate-900 mt-1 block">
            {user.issuesReportedCount}
          </span>
          <span className="text-xs text-slate-400">100% verified authentic</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Successfully Resolved
          </span>
          <span className="text-2xl font-extrabold font-display text-emerald-600 mt-1 block">
            {user.issuesResolvedCount}
          </span>
          <span className="text-xs text-emerald-700 font-medium">85% Department SLA met</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Peer Votes Cast
          </span>
          <span className="text-2xl font-extrabold font-display text-blue-700 mt-1 block">
            {user.upvotesCastCount}
          </span>
          <span className="text-xs text-slate-400">Supported student initiatives</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('reported')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'reported'
              ? 'bg-[#00236f] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Authored Tickets ({myReported.length})
        </button>
        <button
          onClick={() => setActiveTab('supported')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'supported'
              ? 'bg-[#00236f] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Supported Issues ({mySupported.length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {(activeTab === 'reported' ? myReported : mySupported).map((issue) => (
          <div
            key={issue.id}
            onClick={() => onSelectIssue(issue)}
            className="group bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-slate-700">#{issue.id}</span>
                  <span>·</span>
                  <span className="font-medium text-slate-500">{issue.category}</span>
                  <span>·</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    {issue.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate mt-0.5">
                  {issue.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>
                    {issue.block} · {issue.room}
                  </span>
                  <span>·</span>
                  <span>{issue.supportCount} student votes</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 shrink-0">
              <span>View Audit Trail</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
