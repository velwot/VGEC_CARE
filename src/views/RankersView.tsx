import React from 'react';
import { Award, Trophy, Medal, Star, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { mockLeaderboard } from '../data/mockData';
import { UserProfile } from '../types';

interface RankersViewProps {
  user: UserProfile;
}

export const RankersView: React.FC<RankersViewProps> = ({ user }) => {
  const departmentRankings = [
    { name: 'Computer Engineering', solvedCount: 142, rate: '92%', activeReps: 18 },
    { name: 'Electronics & Communication', solvedCount: 128, rate: '89%', activeReps: 15 },
    { name: 'Information Technology', solvedCount: 110, rate: '87%', activeReps: 12 },
    { name: 'Mechanical Engineering', solvedCount: 96, rate: '84%', activeReps: 11 },
    { name: 'Civil Engineering', solvedCount: 88, rate: '81%', activeReps: 9 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Civic Engagement Honor Roll</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Top Campus Rankers
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mt-1">
            Recognizing VGEC students who contribute verified reports, mobilize peer support,
            and assist in rapid campus infrastructure improvements.
          </p>
        </div>

        {/* Current User Standing Badge */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl shadow-2xs self-start md:self-auto">
          <div className="w-9 h-9 rounded-full bg-[#00236f] text-white flex items-center justify-center font-bold text-sm">
            #4
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Your Rank</span>
            <span className="text-xs font-bold text-slate-900">
              {user.name} ({user.currentXp} XP)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Student Leaderboard Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-slate-900">
              Student Steward Leaderboard
            </h3>
            <span className="text-xs text-slate-400">Current Semester Standings</span>
          </div>

          <div className="divide-y divide-slate-100">
            {mockLeaderboard.map((student) => {
              const isTop3 = student.rank <= 3;
              return (
                <div
                  key={student.rank}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                    student.isCurrentUser
                      ? 'bg-blue-50/60 font-semibold'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        student.rank === 1
                          ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-200'
                          : student.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : student.rank === 3
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {student.rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {student.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {student.badge}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-normal">
                        {student.department} · {student.semester}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden sm:block">
                      <span className="text-xs font-bold text-emerald-700 block">
                        {student.resolvedRate}
                      </span>
                      <span className="text-[10px] text-slate-400">Resolution Rate</span>
                    </div>

                    <div>
                      <span className="text-sm font-extrabold font-display text-blue-700 tabular-nums block">
                        {student.points} XP
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {student.verifiedCount} verified
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Department Standings (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
              <Medal className="w-4 h-4 text-blue-600" />
              Department Civic Standings
            </h3>

            <div className="space-y-3">
              {departmentRankings.map((dept, index) => (
                <div
                  key={dept.name}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono text-[10px]">0{index + 1}</span>
                      {dept.name}
                    </span>
                    <span className="font-semibold text-emerald-700">{dept.rate} Solved</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{dept.solvedCount} issues addressed</span>
                    <span>{dept.activeReps} student reps</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
