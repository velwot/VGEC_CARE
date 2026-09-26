import React, { useState, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  ThumbsUp,
  MapPin,
  ChevronDown,
  Check,
  X,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Issue, IssueCategory, IssueStatus } from '../types';

interface CampusIssuesViewProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onUpvoteIssue: (issueId: string) => void;
}

export const CampusIssuesView: React.FC<CampusIssuesViewProps> = ({
  issues,
  onSelectIssue,
  onUpvoteIssue,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');
  const [sortBy, setSortBy] = useState<'most-supported' | 'newest' | 'priority'>('most-supported');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: 'All', label: 'All', count: 127 },
    { id: 'Infrastructure', label: 'Infrastructure', count: 38 },
    { id: 'Cleanliness', label: 'Cleanliness', count: 22 },
    { id: 'Water Supply', label: 'Water Supply', count: 19 },
    { id: 'Electricity', label: 'Electricity', count: 14 },
    { id: 'Wi-Fi & IT', label: 'Wi-Fi & IT', count: 12 },
    { id: 'Classroom', label: 'Classroom', count: 9 },
  ];

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === 'All' ||
        issue.category.toLowerCase().includes(selectedCategory.toLowerCase());

      // Status
      const matchesStatus =
        selectedStatus === 'All Statuses' ||
        issue.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [issues, searchQuery, selectedCategory, selectedStatus]);

  const sortedIssues = useMemo(() => {
    const list = [...filteredIssues];
    if (sortBy === 'most-supported') {
      list.sort((a, b) => b.supportCount - a.supportCount);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => a.id.localeCompare(b.id));
    }
    return list;
  }, [filteredIssues, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All Statuses');
    setSortBy('most-supported');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            In Progress
          </span>
        );
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
            Verified
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Under Review
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="text-emerald-600 font-bold">✓ VGEC GUJARAT CIVIC PORTAL</span>
            <span>·</span>
            <span>Real-time Public Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Campus Issues
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mt-1">
            See what students are reporting across the campus. Upvote issues to help student council
            and college administration prioritize.
          </p>
        </div>

        {/* Top Right Live Stats */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-bold text-slate-900">127</span> Live Issues
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs text-xs font-medium text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-slate-900">48</span> Resolved Today
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search issues by keyword, room, block, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200"
              >
                ESC to clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none hover:border-slate-300 cursor-pointer"
            >
              <option value="All Statuses">All Statuses (127)</option>
              <option value="In Progress">In Progress (31)</option>
              <option value="Verified">Verified (42)</option>
              <option value="Under Review">Under Review (30)</option>
              <option value="Resolved">Resolved (24)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none hover:border-slate-300 cursor-pointer"
            >
              <option value="most-supported">Sort: Most Supported ⇅</option>
              <option value="newest">Sort: Most Recent ⇅</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List view"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#00236f] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Criteria Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-slate-400 font-medium">Active criteria:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Sort: Most Supported
            <button
              onClick={() => setSortBy('most-supported')}
              className="hover:text-slate-900"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Campus: All Departments
            <button className="hover:text-slate-900">
              <X className="w-3 h-3" />
            </button>
          </span>
          <button
            onClick={resetFilters}
            className="text-blue-600 hover:text-blue-800 font-semibold underline ml-1 cursor-pointer"
          >
            Reset all
          </button>
        </div>
      </div>

      {/* Issues View: Grid vs List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedIssues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="group bg-white rounded-xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div>
                {/* Header strip */}
                <div className="p-3.5 pb-2.5 flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    #{issue.id}
                  </span>
                  {getStatusBadge(issue.status)}
                </div>

                {/* Photo with Overlay Badge */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden mx-3 rounded-lg border border-slate-200/60">
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Location Chip Badge on bottom left */}
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-slate-800 shadow-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>{issue.block}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 pt-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>{issue.category}</span>
                    <span>·</span>
                    <span>{issue.subcategory || 'General'}</span>
                  </div>

                  <h3 className="text-sm font-bold font-display text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {issue.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {issue.reportedBy.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    {issue.reportedBy.name}
                  </span>
                </div>

                {/* Upvote button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvoteIssue(issue.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    issue.isSupportedByCurrentUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{issue.supportCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="space-y-3">
          {sortedIssues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="group bg-white rounded-xl p-4 border border-slate-200/80 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-medium text-slate-500">#{issue.id}</span>
                    <span>·</span>
                    <span className="font-medium text-slate-600">{issue.category}</span>
                    <span>·</span>
                    <span className="text-slate-400">{issue.block}</span>
                    {getStatusBadge(issue.status)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{issue.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="text-xs text-slate-500">By {issue.reportedBy.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvoteIssue(issue.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    issue.isSupportedByCurrentUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Support ({issue.supportCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-200">
        <div>
          Showing <span className="font-bold text-slate-900">1 - 8</span> of{' '}
          <span className="font-bold text-slate-900">127</span> campus reports
        </div>

        <div className="flex items-center gap-1 self-center">
          <button
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white disabled:opacity-50 text-slate-700 hover:bg-slate-50"
          >
            ‹ Prev
          </button>
          <button className="px-3 py-1.5 rounded-md bg-[#00236f] text-white font-bold">
            1
          </button>
          <button className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
            2
          </button>
          <button className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
            3
          </button>
          <span className="px-2">...</span>
          <button className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
            16
          </button>
          <button className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
};
