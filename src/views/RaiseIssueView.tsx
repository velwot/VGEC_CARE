import React, { useState } from 'react';
import {
  ArrowLeft,
  Camera,
  UploadCloud,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Sparkles,
  Shield,
  Building,
  MapPin,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Issue, IssueCategory, UserProfile } from '../types';
import { imgProjector } from '../data/mockData';

interface RaiseIssueViewProps {
  user: UserProfile;
  onCancel: () => void;
  onSubmit: (newIssue: Partial<Issue>) => void;
}

export const RaiseIssueView: React.FC<RaiseIssueViewProps> = ({
  user,
  onCancel,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Infrastructure');
  const [block, setBlock] = useState('Block A');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string; preview: string }>>([
    {
      name: 'room_204_projector.jpg',
      size: '1.8 MB',
      preview: imgProjector,
    },
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  const blocks = [
    'Block A',
    'Block B',
    'Block C',
    'Block D',
    'ICT Department',
    'Central Library',
    'Mechanical Block',
    'Canteen',
    'Admin Block',
  ];

  const categories: IssueCategory[] = [
    'Infrastructure',
    'Water Supply',
    'Cleanliness',
    'Electricity',
    'Wi-Fi & IT',
    'Classroom',
    'Washroom',
    'Lab Equipment',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFileObj = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        preview: URL.createObjectURL(file),
      };
      setAttachedFiles([...attachedFiles, newFileObj]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) {
      setErrorMsg('Please enter a descriptive title (at least 5 characters).');
      return;
    }
    if (!room.trim()) {
      setErrorMsg('Please specify the room number or specific landmark.');
      return;
    }
    if (description.trim().length < 15) {
      setErrorMsg('Please provide a detailed description (at least 15 characters).');
      return;
    }

    const newIssueData: Partial<Issue> = {
      title: title.trim(),
      category,
      block,
      room: room.trim(),
      description: description.trim(),
      image: attachedFiles[0]?.preview || imgProjector,
      imageCaption: `Photo evidence submitted by ${user.name} for ${title.trim()}`,
      priority: 'Medium-High',
      status: 'Under Review',
    };

    onSubmit(newIssueData);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onCancel}
            className="text-slate-600 hover:text-blue-700 font-medium"
          >
            Portal
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <button
            onClick={onCancel}
            className="text-slate-600 hover:text-blue-700 font-medium"
          >
            Campus Issues
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="font-semibold text-slate-900">New Ticket</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-slate-700">
            Average First Review: ~3.4 hours
          </span>
        </div>
      </div>

      {/* Header with Title and Reward Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL TICKET SUBMISSION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Raise a Campus Issue
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mt-1">
            Submit a genuine issue with clear location and photo evidence to help the student
            council and maintenance department resolve it quickly.
          </p>
        </div>

        {/* Civic Reward Badge */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 shadow-2xs self-start md:self-auto">
          <div className="w-8 h-8 rounded-lg bg-[#00236f] text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Civic Reward
            </span>
            <span className="text-sm font-extrabold font-display text-blue-900">
              +25 Karma XP
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form and Sidebar Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Progressive Form Sections */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Issue Essentials */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#00236f] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Issue Essentials
                </h3>
              </div>
              <span className="text-xs text-rose-600 font-semibold">* Required details</span>
            </div>

            {/* Issue Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <span className="font-mono text-slate-400">{title.length} / 80</span>
              </div>
              <input
                type="text"
                maxLength={80}
                placeholder="e.g. Projector not working in Room 204"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <p className="text-[11px] text-slate-400">
                Keep it brief and descriptive (minimum 10 characters)
              </p>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Location on Campus */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#00236f] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="text-base font-bold font-display text-slate-900">
                Location on Campus <span className="text-rose-500 text-sm">*</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Building / Block */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Building / Block <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    {blocks.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specific Room / Landmark */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Specific Room / Landmark <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Room 204, 2nd floor, opposite stairs"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    required
                  />
                  <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Detailed Description */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#00236f] text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h3 className="text-base font-bold font-display text-slate-900">
                Detailed Description <span className="text-rose-500 text-sm">*</span>
              </h3>
            </div>

            <div className="space-y-1.5">
              <textarea
                rows={4}
                placeholder="Describe the problem clearly... What is happening? How does it affect students or lectures? Any safety concerns?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg p-3.5 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Include details like time noticed, error codes, or safety risks.</span>
                <span>Min 20 characters</span>
              </div>
            </div>
          </div>

          {/* Step 4: Upload Photos (Recommended) */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#00236f] text-white flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Upload Photos (Recommended)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">JPG, PNG up to 10MB</span>
            </div>

            {/* Dropzone */}
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Drop photos here or <span className="text-blue-600 underline">click to browse</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                High resolution evidence significantly accelerates ticket verification by campus
                supervisors.
              </p>
            </label>

            {/* Attached Evidence List */}
            {attachedFiles.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Attached Evidence ({attachedFiles.length} file)
                </span>
                {attachedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={file.preview}
                        alt="attachment"
                        className="w-10 h-10 rounded object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block truncate max-w-xs">
                          {file.name}
                        </span>
                        <span className="text-slate-500">
                          {file.size} •{' '}
                          <span className="text-emerald-600 font-medium">100% Ready</span>
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Civic Responsibility Notice */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Civic Responsibility Notice</span>
              <p className="text-amber-800/90 mt-0.5">
                Please provide accurate information. Duplicate, prank, or misleading reports may
                result in account suspension and loss of student XP.
              </p>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <span>Submit Issue (+25 XP)</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): User Verification & Context Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Reporting As */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Reporting As
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Student Verified
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/20"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-sm font-bold font-display text-slate-900">{user.name}</h4>
                <p className="text-xs text-slate-500">
                  {user.department} • {user.semester} • Roll #{user.rollNo}
                </p>
              </div>
            </div>

            {/* Trust Score Sparkline */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Trust Score
                </span>
                <span className="text-base font-extrabold font-display text-slate-900 tabular-nums">
                  {user.trustScore}%
                </span>
              </div>
              {/* Sparkline curve SVG */}
              <div className="w-20 h-8 flex items-center">
                <svg viewBox="0 0 80 28" className="w-full h-full text-emerald-500 stroke-current fill-none">
                  <path
                    d="M 2 24 Q 25 18 45 8 T 78 4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card: Resolution Timeline */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Resolution Timeline
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex gap-2.5 items-start">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                <div>
                  <strong className="text-slate-900 block">1. Instant Logging</strong>
                  <span className="text-slate-500 text-[11px]">
                    Automated ticket assigned to VGEC Estates
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0"></span>
                <div>
                  <strong className="text-slate-900 block">2. Supervisor Verification</strong>
                  <span className="text-slate-500 text-[11px]">
                    Department HOD & Student Representative notification
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0"></span>
                <div>
                  <strong className="text-slate-900 block">3. Work Order Execution</strong>
                  <span className="text-slate-500 text-[11px]">
                    Technician deployment with verified audit photo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Nearby Reports (Block A) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Nearby Reports</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{block}</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Check if your problem is already in progress to avoid duplicate submissions.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 block truncate max-w-[170px]">
                    Room 201 AC leaking
                  </span>
                  <span className="text-[10px] text-slate-400">Reported 2h ago</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  In Progress
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 block truncate max-w-[170px]">
                    2nd Floor Water Cooler filter
                  </span>
                  <span className="text-[10px] text-slate-400">Reported 1d ago</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Assigned
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
