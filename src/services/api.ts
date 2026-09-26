import { Issue, UserProfile, LostItem, Comment } from '../types';
import { initialIssues, initialUserProfile, mockLostItems } from '../data/mockData';

const BASE_URL = '/api';

export async function fetchIssues(filters?: {
  search?: string;
  category?: string;
  status?: string;
  sort?: string;
}): Promise<Issue[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sort) params.append('sort', filters.sort);

    const res = await fetch(`${BASE_URL}/issues?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchIssues fallback:', err);
    return initialIssues;
  }
}

export async function fetchIssueById(id: string): Promise<Issue> {
  const res = await fetch(`${BASE_URL}/issues/${id}`);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

export async function createIssue(data: Partial<Issue>): Promise<Issue> {
  const res = await fetch(`${BASE_URL}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `HTTP error ${res.status}`);
  }
  return await res.json();
}

export async function toggleUpvote(
  issueId: string
): Promise<{ issueId: string; isSupported: boolean; supportCount: number }> {
  const res = await fetch(`${BASE_URL}/issues/${issueId}/upvote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

export async function addComment(issueId: string, content: string): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/issues/${issueId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

export async function updateIssueStatus(
  issueId: string,
  status: string,
  techAssigned?: string
): Promise<Issue> {
  const res = await fetch(`${BASE_URL}/issues/${issueId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, techAssigned }),
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

export async function fetchUserProfile(): Promise<UserProfile> {
  try {
    const res = await fetch(`${BASE_URL}/user`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      name: data.name,
      enrollment: data.enrollment,
      department: data.department,
      semester: data.semester,
      rollNo: data.rollNo,
      avatar: data.avatar,
      level: data.level,
      currentXp: data.currentXp,
      nextLevelXp: data.nextLevelXp,
      trustScore: data.trustScore,
      activeCitizenTitle: data.activeCitizenTitle,
      recentHonor: data.recentHonor,
      issuesReportedCount: data.issuesReportedCount,
      issuesResolvedCount: data.issuesResolvedCount,
      upvotesCastCount: data.upvotesCastCount,
    };
  } catch (err) {
    console.warn('API fetchUserProfile fallback:', err);
    return initialUserProfile;
  }
}

export async function fetchStats(): Promise<{
  issuesRaised: number;
  resolvedCount: number;
  votesCast: number;
  activeInQueue: number;
  resolvedRatePercent: number;
}> {
  try {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      issuesRaised: 127,
      resolvedCount: 61,
      votesCast: 2846,
      activeInQueue: 24,
      resolvedRatePercent: 48,
    };
  }
}

export async function fetchLostItems(): Promise<LostItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/lost-and-found`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return mockLostItems;
  }
}

export async function claimLostItem(id: string): Promise<LostItem> {
  const res = await fetch(`${BASE_URL}/lost-and-found/${id}/claim`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}
