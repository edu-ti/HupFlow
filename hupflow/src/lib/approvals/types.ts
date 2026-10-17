import { OrgRole } from '@/lib/auth/types';

export type PostApprovalStatus = 'draft' | 'in_review' | 'approved' | 'rejected';

export type ApprovalAction = 'submit' | 'approve' | 'reject' | 'reset';

export interface ApprovalTransitionResult {
  success: boolean;
  error?: string;
  fromStatus: PostApprovalStatus;
  toStatus: PostApprovalStatus;
}

export interface ApprovalHistoryEntry {
  id: string;
  postId: string;
  organizationId: string;
  action: ApprovalAction;
  fromStatus: PostApprovalStatus;
  toStatus: PostApprovalStatus;
  actorId?: string | null;
  actorName?: string | null;
  feedback?: string | null;
  createdAt: string;
}

export interface PostWithApproval {
  id: string;
  organizationId: string;
  content: string;
  mediaIds: string[];
  status: string; // draft | scheduled | publishing | published | failed
  approvalStatus: PostApprovalStatus;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  authorId?: string | null;
  authorName?: string | null;
  authorEmail?: string | null;
  submittedById?: string | null;
  approvedById?: string | null;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  channels: {
    id: string;
    provider: string;
    accountName: string;
  }[];
}

export interface ApprovalCounts {
  all: number;
  inReview: number;
  approved: number;
  rejected: number;
  draft: number;
}

export interface ApprovalActionPayload {
  postId: string;
  action: ApprovalAction;
  feedback?: string;
}
