export type IssueCategory =
  | 'Infrastructure'
  | 'Water Supply'
  | 'Cleanliness'
  | 'Electricity'
  | 'Wi-Fi & IT'
  | 'Classroom'
  | 'Washroom'
  | 'Lab Equipment';

export type IssueStatus = 'In Progress' | 'Verified' | 'Under Review' | 'Resolved';

export type IssuePriority = 'Low' | 'Medium' | 'Medium-High' | 'High' | 'Critical';

export interface Comment {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  timeAgo: string;
  content: string;
}

export interface ResolutionStep {
  stepNumber: number;
  title: string;
  timestamp?: string;
  desc: string;
  status: 'completed' | 'active' | 'pending';
}

export interface OfficialUpdate {
  title: string;
  timestamp: string;
  body: string;
  assignedTech: string;
  workOrder: string;
}

export interface Custodian {
  name: string;
  role: string;
  contactType: 'email' | 'phone';
  contactVal: string;
}

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  subcategory?: string;
  status: IssueStatus;
  priority: IssuePriority;
  block: string;
  room: string;
  description: string;
  image: string;
  imageCaption?: string;
  reportedBy: {
    name: string;
    role: string;
    enrollment?: string;
    avatar?: string;
  };
  reportedAt: string;
  relativeTime: string;
  supportCount: number;
  isSupportedByCurrentUser?: boolean;
  commentCount: number;
  techAssigned?: string;
  workOrderNumber?: string;
  auditNote?: string;
  slaTargetHours?: number;
  slaElapsedHours?: number;
  equipment?: string;
  departmentScope?: string;
  officialUpdate?: OfficialUpdate;
  resolutionTrail: ResolutionStep[];
  custodians?: Custodian[];
  comments: Comment[];
}

export interface UserProfile {
  name: string;
  enrollment: string;
  department: string;
  semester: string;
  rollNo: string;
  avatar: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  trustScore: number;
  activeCitizenTitle: string;
  recentHonor: string;
  issuesReportedCount: number;
  issuesResolvedCount: number;
  upvotesCastCount: number;
}

export interface LostItem {
  id: string;
  title: string;
  category: string;
  locationFound: string;
  foundDate: string;
  status: 'Claimed' | 'Open' | 'In Custody';
  custodyOffice: string;
  image: string;
}
