import React, { useEffect, useState, useRef } from 'react';
import { Search, X, MapPin, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { Issue } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  issues,
  onSelectIssue,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredIssues = query.trim()
    ? issues.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase()) ||
          item.block.toLowerCase().includes(query.toLowerCase()) ||
          item.room.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
    : issues.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Verified':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by keyword, department, room (e.g. 'Projector', 'Block A', '204')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto divide-y divide-slate-100 flex-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {query.trim() ? `Search Results (${filteredIssues.length})` : 'Recent Campus Issues'}
          </div>

          {filteredIssues.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-medium">No matching campus issues found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for "projector", "water cooler", or "Wi-Fi"
              </p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => {
                  onSelectIssue(issue);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-blue-50/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                    <img
                      src={issue.image}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-medium text-slate-500">
                        #{issue.id}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-700">
                      {issue.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {issue.block} · {issue.room}
                      </span>
                      <span>·</span>
                      <span>{issue.category}</span>
                      <span>·</span>
                      <span>{issue.supportCount} supports</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-slate-400 group-hover:text-blue-600">
                  <span className="text-xs font-medium hidden sm:inline-block">View</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[10px]">
                ESC
              </kbd>{' '}
              Close
            </span>
          </div>
          <span className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Real-time VGEC Civic Registry
          </span>
        </div>
      </div>
    </div>
  );
};
