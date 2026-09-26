import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SearchModal } from './components/SearchModal';
import { DashboardView } from './views/DashboardView';
import { CampusIssuesView } from './views/CampusIssuesView';
import { IssueDetailView } from './views/IssueDetailView';
import { RaiseIssueView } from './views/RaiseIssueView';
import { LostAndFoundView } from './views/LostAndFoundView';
import { RankersView } from './views/RankersView';
import { MyContributionsView } from './views/MyContributionsView';
import { ProfileView } from './views/ProfileView';
import { initialIssues, initialUserProfile } from './data/mockData';
import { Issue, UserProfile } from './types';
import {
  fetchIssues,
  fetchUserProfile,
  createIssue as apiCreateIssue,
  toggleUpvote as apiToggleUpvote,
  addComment as apiAddComment,
  updateIssueStatus as apiUpdateStatus,
} from './services/api';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [xpAwardModal, setXpAwardModal] = useState<{ show: boolean; points: number; title: string }>({
    show: false,
    points: 25,
    title: '',
  });

  // Load live data from Express/SQLite backend on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [loadedIssues, loadedUser] = await Promise.all([
          fetchIssues(),
          fetchUserProfile(),
        ]);
        if (loadedIssues && loadedIssues.length > 0) {
          setIssues(loadedIssues);
        }
        if (loadedUser) {
          setUser(loadedUser);
        }
      } catch (err) {
        console.error('Failed to load initial data from backend:', err);
      }
    }
    loadBackendData();
  }, []);

  // Upvote an issue (+1 or toggle) with backend SQLite persistence
  const handleUpvoteIssue = async (issueId: string) => {
    // Optimistic UI update
    setIssues((prevIssues) =>
      prevIssues.map((issue) => {
        if (issue.id === issueId) {
          const isCurrentlySupported = issue.isSupportedByCurrentUser;
          const newCount = isCurrentlySupported
            ? Math.max(0, issue.supportCount - 1)
            : issue.supportCount + 1;
          const updated = {
            ...issue,
            supportCount: newCount,
            isSupportedByCurrentUser: !isCurrentlySupported,
          };
          if (selectedIssue && selectedIssue.id === issueId) {
            setSelectedIssue(updated);
          }
          return updated;
        }
        return issue;
      })
    );

    setUser((prev) => ({
      ...prev,
      upvotesCastCount: prev.upvotesCastCount + 1,
    }));

    try {
      const result = await apiToggleUpvote(issueId);
      setIssues((prevIssues) =>
        prevIssues.map((issue) => {
          if (issue.id === issueId) {
            const updated = {
              ...issue,
              supportCount: result.supportCount,
              isSupportedByCurrentUser: result.isSupported,
            };
            if (selectedIssue && selectedIssue.id === issueId) {
              setSelectedIssue(updated);
            }
            return updated;
          }
          return issue;
        })
      );
    } catch (err) {
      console.error('Failed to persist upvote to SQLite:', err);
    }
  };

  // Add comment with backend SQLite persistence
  const handleAddComment = async (issueId: string, commentText: string) => {
    const tempComment = {
      id: `c-${Date.now()}`,
      authorName: user.name,
      authorRole: `${user.department} • ${user.semester}`,
      authorAvatar: user.avatar,
      timeAgo: 'Just now',
      content: commentText,
    };

    setIssues((prevIssues) =>
      prevIssues.map((issue) => {
        if (issue.id === issueId) {
          const updated = {
            ...issue,
            commentCount: issue.commentCount + 1,
            comments: [tempComment, ...issue.comments],
          };
          if (selectedIssue && selectedIssue.id === issueId) {
            setSelectedIssue(updated);
          }
          return updated;
        }
        return issue;
      })
    );

    try {
      const persistedComment = await apiAddComment(issueId, commentText);
      setIssues((prevIssues) =>
        prevIssues.map((issue) => {
          if (issue.id === issueId) {
            const updated = {
              ...issue,
              comments: [persistedComment, ...issue.comments.filter((c) => c.id !== tempComment.id)],
            };
            if (selectedIssue && selectedIssue.id === issueId) {
              setSelectedIssue(updated);
            }
            return updated;
          }
          return issue;
        })
      );
    } catch (err) {
      console.error('Failed to persist comment to SQLite:', err);
    }
  };

  // Submit new issue with backend SQLite persistence
  const handleCreateIssue = async (issueData: Partial<Issue>) => {
    setLoading(true);
    try {
      const createdIssue = await apiCreateIssue(issueData);

      setIssues((prev) => [createdIssue, ...prev]);

      // Award +25 XP
      setUser((prev) => ({
        ...prev,
        currentXp: prev.currentXp + 25,
        issuesReportedCount: prev.issuesReportedCount + 1,
      }));

      // Trigger XP Award modal
      setXpAwardModal({
        show: true,
        points: 25,
        title: createdIssue.title,
      });

      // Select the newly raised issue and switch to detail view
      setSelectedIssue(createdIssue);
      setCurrentTab('issues');
    } catch (err) {
      console.error('Failed to persist new issue to SQLite:', err);
      // Fallback local creation
      const localId = `VGEC-${issueData.block?.replace(/\s+/g, '').substring(0, 3).toUpperCase() || 'GEN'}-${Math.floor(100 + Math.random() * 900)}`;
      const fallbackIssue: Issue = {
        id: localId,
        title: issueData.title || 'Untitled Issue',
        category: issueData.category || 'Infrastructure',
        subcategory: 'General Campus Maintenance',
        status: 'Under Review',
        priority: issueData.priority || 'Medium-High',
        block: issueData.block || 'Block A',
        room: issueData.room || 'General Area',
        description: issueData.description || '',
        image: issueData.image || '',
        imageCaption: issueData.imageCaption,
        reportedBy: {
          name: user.name,
          role: `${user.semester} ${user.department.split(' ')[0]}`,
          enrollment: user.enrollment,
          avatar: user.avatar,
        },
        reportedAt: 'Just now',
        relativeTime: 'Just now',
        supportCount: 1,
        isSupportedByCurrentUser: true,
        commentCount: 0,
        slaTargetHours: 24,
        slaElapsedHours: 0,
        departmentScope: `${issueData.category} Cell`,
        resolutionTrail: [
          {
            stepNumber: 1,
            title: 'Issue Raised',
            timestamp: 'Just now',
            desc: `Submitted with diagnostic photo evidence by ${user.name}.`,
            status: 'completed',
          },
        ],
        comments: [],
      };
      setIssues([fallbackIssue, ...issues]);
      setSelectedIssue(fallbackIssue);
      setCurrentTab('issues');
    } finally {
      setLoading(false);
    }
  };

  // Admin update status with backend SQLite persistence
  const handleUpdateStatus = async (issueId: string, newStatus: any) => {
    try {
      const updated = await apiUpdateStatus(issueId, newStatus);
      setIssues((prev) => prev.map((it) => (it.id === issueId ? updated : it)));
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(updated);
      }
    } catch (err) {
      console.error('Failed to update status in SQLite:', err);
      setIssues((prev) =>
        prev.map((it) => {
          if (it.id === issueId) {
            const up = { ...it, status: newStatus };
            if (selectedIssue && selectedIssue.id === issueId) {
              setSelectedIssue(up);
            }
            return up;
          }
          return it;
        })
      );
    }
  };

  const handleTabChange = (tab: NavTab) => {
    setSelectedIssue(null);
    setCurrentTab(tab);
  };

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setCurrentTab('issues');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        activeIssueCount={issues.filter((i) => i.status !== 'Resolved').length}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopNavbar
          user={user}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenRaiseIssue={() => {
            setSelectedIssue(null);
            setCurrentTab('raise');
          }}
          onOpenProfile={() => {
            setSelectedIssue(null);
            setCurrentTab('profile');
          }}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Viewport Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {selectedIssue ? (
            <IssueDetailView
              issue={selectedIssue}
              user={user}
              onBack={() => setSelectedIssue(null)}
              onUpvote={handleUpvoteIssue}
              onAddComment={handleAddComment}
              isAdminMode={isAdminMode}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : currentTab === 'dashboard' ? (
            <DashboardView
              issues={issues}
              user={user}
              onSelectIssue={handleSelectIssue}
              onNavigateTab={handleTabChange}
              onUpvoteIssue={handleUpvoteIssue}
            />
          ) : currentTab === 'issues' ? (
            <CampusIssuesView
              issues={issues}
              onSelectIssue={handleSelectIssue}
              onUpvoteIssue={handleUpvoteIssue}
            />
          ) : currentTab === 'raise' ? (
            <RaiseIssueView
              user={user}
              onCancel={() => setCurrentTab('dashboard')}
              onSubmit={handleCreateIssue}
            />
          ) : currentTab === 'lost-found' ? (
            <LostAndFoundView />
          ) : currentTab === 'rankers' ? (
            <RankersView user={user} />
          ) : currentTab === 'contributions' ? (
            <MyContributionsView
              user={user}
              issues={issues}
              onSelectIssue={handleSelectIssue}
              onNavigateRaise={() => setCurrentTab('raise')}
            />
          ) : currentTab === 'profile' ? (
            <ProfileView user={user} />
          ) : null}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Image 12) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        activeIssuesCount={issues.filter((i) => i.status !== 'Resolved').length}
      />

      {/* Global Command Palette / Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        issues={issues}
        onSelectIssue={handleSelectIssue}
      />

      {/* Celebratory Karma XP Modal upon Submitting an Issue */}
      {xpAwardModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-blue-100 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-700 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                Ticket Authenticated
              </span>
              <h3 className="text-xl font-extrabold font-display text-slate-900">
                +{xpAwardModal.points} Karma XP Awarded!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your report <strong>"{xpAwardModal.title}"</strong> has been logged to the VGEC
                Civic Ledger.
              </p>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-700 space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span>Narayan Patel</span>
                <span className="text-blue-700">{user.currentXp} XP Total</span>
              </div>
              <p className="text-[11px] text-slate-500 text-left">
                {user.nextLevelXp - user.currentXp} XP to Level 5: Campus Steward
              </p>
            </div>

            <button
              onClick={() => setXpAwardModal({ show: false, points: 25, title: '' })}
              className="w-full py-2.5 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              Continue to Issue Audit Trail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
