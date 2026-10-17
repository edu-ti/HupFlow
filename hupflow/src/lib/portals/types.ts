export type PortalDeliverableStatus =
  | 'pending_review'
  | 'approved'
  | 'changes_requested';

export type PortalSocialChannel = 'instagram' | 'linkedin' | 'x' | 'threads' | 'tiktok';

export interface PortalDeliverable {
  id: string;
  title: string;
  caption: string;
  channel: PortalSocialChannel;
  scheduledDate: string;
  mediaType: 'carousel' | 'single_image' | 'short_video';
  slideCount?: number;
  coverUrl?: string | null;
  status: PortalDeliverableStatus;
  reviewedBy?: string | null;
  reviewedAt?: number | null;
  feedbackNote?: string | null;
}

export interface ClientPortal {
  id: string;
  organizationId: string;
  clientName: string;
  projectTitle: string;
  token: string;
  brandColor: string;
  logoUrl?: string | null;
  welcomeMessage?: string | null;
  accessPin?: string | null;
  hideHupflowBranding: boolean;
  isActive: boolean;
  deliverables: PortalDeliverable[];
  totalViews: number;
  createdAt: number;
  updatedAt: number;
}

export interface PortalStats {
  totalPortals: number;
  totalDeliverables: number;
  approvedCount: number;
  pendingCount: number;
  changesRequestedCount: number;
  approvalRate: number;
}

export interface PortalReviewInput {
  deliverableId: string;
  decision: 'approved' | 'changes_requested';
  reviewerName: string;
  feedbackNote?: string | null;
}

export interface PublicPortalView {
  id: string;
  clientName: string;
  projectTitle: string;
  token: string;
  brandColor: string;
  logoUrl?: string | null;
  welcomeMessage?: string | null;
  requiresPin: boolean;
  hideHupflowBranding: boolean;
  deliverables: PortalDeliverable[];
  metrics: {
    total: number;
    approved: number;
    pending: number;
    changesRequested: number;
    approvalRate: number;
  };
}
