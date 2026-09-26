import React, { useState } from 'react';
import {
  ArrowLeft,
  ThumbsUp,
  Star,
  Share2,
  MapPin,
  Clock,
  ShieldCheck,
  Shield,
  AlertTriangle,
  Send,
  MessageSquare,
  Building,
  User,
  Wrench,
  Mail,
  Phone,
  CheckCircle2,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Issue, Comment, UserProfile } from '../types';

interface IssueDetailViewProps {
  issue: Issue;
  user: UserProfile;
  onBack: () => void;
  onUpvote: (issueId: string) => void;
  onAddComment: (issueId: string, commentText: string) => void;
  isAdminMode: boolean;
  onUpdateStatus?: (issueId: string, newStatus: any) => void;
}

export const IssueDetailView: React.FC<IssueDetailViewProps> = ({
  issue,
  user,
  onBack,
  onUpvote,
  onAddComment,
  isAdminMode,
  onUpdateStatus,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(issue.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Breadcrumb & Status Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-slate-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Campus Issues</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span>{issue.category}</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="font-mono font-semibold text-slate-900">#{issue.id}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Verified Campus Record
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500 font-mono">
            SLA Target: {issue.slaTargetHours || 48}h ({issue.slaElapsedHours || 32}h elapsed)
          </span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        {/* Badges strip */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            {issue.status}
          </span>

          {/* Subcategory */}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            {issue.category} • {issue.subcategory || 'Campus Asset'}
          </span>

          {/* Priority */}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            {issue.priority || 'Medium-High'} Priority
          </span>
        </div>

        {/* Title and Top Actions */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 leading-tight">
              {issue.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Reported by <strong className="text-slate-900">{issue.reportedBy.name}</strong>
                {issue.reportedBy.enrollment && (
                  <span className="text-slate-400 text-xs">({issue.reportedBy.enrollment})</span>
                )}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {issue.relativeTime} ({issue.reportedAt})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {issue.block}, {issue.room}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onUpvote(issue.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold shadow-xs transition-all cursor-pointer ${
                issue.isSupportedByCurrentUser
                  ? 'bg-blue-800 text-white ring-2 ring-blue-300'
                  : 'bg-[#00236f] hover:bg-[#1e3a8a] text-white active:scale-98'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Support Issue ({issue.supportCount})</span>
            </button>

            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${
                isFollowing
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Star className={`w-4 h-4 ${isFollowing ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">
                {isFollowing ? 'Following' : 'Follow Updates'}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors relative"
              title="Share issue link"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Quick Control Panel if Admin Mode */}
      {isAdminMode && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-semibold">
            <Wrench className="w-4 h-4 text-amber-700" />
            <span>Admin Workflow Action Bar: Advance ticket status or assign workforce</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateStatus?.(issue.id, 'Verified')}
              className="px-2.5 py-1 bg-white border border-amber-300 rounded hover:bg-amber-100 font-medium"
            >
              Mark Verified
            </button>
            <button
              onClick={() => onUpdateStatus?.(issue.id, 'In Progress')}
              className="px-2.5 py-1 bg-white border border-amber-300 rounded hover:bg-amber-100 font-medium"
            >
              Set In Progress
            </button>
            <button
              onClick={() => onUpdateStatus?.(issue.id, 'Resolved')}
              className="px-2.5 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-semibold"
            >
              Resolve Ticket
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Evidence & Incident Report vs Right Resolution Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Campus Evidence Attachment */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span>📷</span> Campus Evidence Attachment
              </span>
              <span className="font-mono text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                Geo-tagged: VGEC {issue.block}
              </span>
            </div>

            <div className="relative bg-slate-900 flex items-center justify-center max-h-[460px] overflow-hidden">
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full object-cover max-h-[460px]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {issue.imageCaption ||
                    `${issue.title} photo evidence logged at ${issue.room}.`}
                </span>
              </span>
              <span className="font-mono text-[11px] text-slate-400 shrink-0">
                IMG_0891.JPG
              </span>
            </div>
          </div>

          {/* Card: Detailed Incident Report */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Detailed Incident Report
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {issue.description}
            </p>

            {/* 4 Spec Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              {/* Box 1 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Location
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {issue.block} • {issue.room}
                </p>
                <span className="text-[10px] text-slate-500">2nd Floor North</span>
              </div>

              {/* Box 2 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Department
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {issue.departmentScope || 'Computer Eng.'}
                </p>
                <span className="text-[10px] text-slate-500">Admin Zone 1</span>
              </div>

              {/* Box 3 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Equipment
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1 truncate">
                  {issue.equipment || 'Ceiling AV Unit'}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">Asset #VGEC-AV-884</span>
              </div>

              {/* Box 4 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Urgency
                </span>
                <p className="text-xs font-bold text-rose-600 mt-1">
                  {issue.priority || 'Medium-High'}
                </p>
                <span className="text-[10px] text-slate-500">Affects 180+ Pupils</span>
              </div>
            </div>
          </div>

          {/* Card: Community Discussion */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold font-display text-slate-900">
                  Community Discussion
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {issue.comments.length} Contributions
              </span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  NS
                </div>
                <div className="flex-1">
                  <textarea
                    rows={3}
                    placeholder="Share further updates, lecture rescheduling impact, or confirm if you saw technician on-site..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Info className="w-3 h-3 text-slate-400" />
                      Posting as Narayan S. (Student • Sem 6)
                    </span>
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <span>Post Comment</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-3 divide-y divide-slate-100">
              {issue.comments.map((comment) => (
                <div key={comment.id} className="pt-3 flex gap-3 text-xs sm:text-sm">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {comment.authorName.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{comment.authorName}</span>
                        <span className="text-[11px] text-blue-700 font-medium">
                          {comment.authorRole}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{comment.timeAgo}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Moderation Disclaimer */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <span>🛡️ Moderated under VGEC Academic Code of Conduct</span>
              <button
                onClick={() => alert('Report flagged for administrative review.')}
                className="hover:text-slate-600 underline cursor-pointer"
              >
                Report inappropriate content
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Official Estate Update */}
          {issue.officialUpdate ? (
            <div className="rounded-xl overflow-hidden shadow-2xs border border-blue-900/30">
              <div className="bg-gradient-to-r from-[#00236f] to-[#1e3a8a] text-white p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-blue-200">
                  <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5 text-blue-300" />
                    OFFICIAL ESTATE UPDATE
                  </span>
                  <span className="font-mono">{issue.officialUpdate.timestamp}</span>
                </div>
                <h4 className="text-base font-bold font-display text-white">
                  {issue.officialUpdate.title}
                </h4>
                <p className="text-xs text-blue-100/90 leading-relaxed italic">
                  {issue.officialUpdate.body}
                </p>

                {/* Sub info */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] border-t border-white/20">
                  <div className="bg-white/10 p-2 rounded">
                    <span className="text-blue-300 block">Assigned Tech:</span>
                    <span className="font-semibold">{issue.officialUpdate.assignedTech}</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded">
                    <span className="text-blue-300 block">Work Order:</span>
                    <span className="font-semibold font-mono">
                      {issue.officialUpdate.workOrder}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 text-xs text-slate-500">
              <span className="font-bold text-slate-900 block mb-1">Estate Dispatch</span>
              Technician team scheduled for inspection round.
            </div>
          )}

          {/* Card: Civic Resolution Trail */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold font-display text-slate-900">
                Civic Resolution Trail
              </h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Step 4 of 5 Active
              </span>
            </div>

            {/* Vertical Milestones */}
            <div className="space-y-4 relative pl-3 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {issue.resolutionTrail.map((step) => {
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';
                return (
                  <div key={step.stepNumber} className="relative flex gap-3 text-xs">
                    {/* Glyph */}
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="text-[10px] font-bold">{step.stepNumber}</span>
                      )}
                    </div>

                    {/* Step details */}
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold ${
                            isActive ? 'text-amber-800' : 'text-slate-900'
                          }`}
                        >
                          {step.title}
                        </span>
                        {step.timestamp && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {step.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Auto-escalation Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Auto-escalates to Principal in 16 hours if stalled</span>
              </span>
              <button
                onClick={() => alert('VGEC Escalation Policy: All unaddressed critical tickets trigger SMS to Principal Office after 48h.')}
                className="text-blue-700 font-semibold hover:underline cursor-pointer"
              >
                View SLA
              </button>
            </div>
          </div>

          {/* Card: Responsible Custodians */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Responsible Custodians
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    PP
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Prof. R. K. Patel</span>
                    <span className="text-[11px] text-slate-500">
                      Faculty Chair, Infrastructure
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:rkpatel@vgec.ac.in"
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded"
                  title="Send email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                    EM
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Estate Maintenance Cell
                    </span>
                    <span className="text-[11px] text-slate-500">Central Workshop Depot</span>
                  </div>
                </div>
                <a
                  href="tel:+917923293866"
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded"
                  title="Call maintenance depot"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
