export type DlqErrorCategory =
  | 'AUTH_EXPIRED'
  | 'MEDIA_INVALID'
  | 'RATE_LIMITED'
  | 'CONTENT_REJECTED'
  | 'NETWORK_TIMEOUT'
  | 'UNKNOWN';

export type DlqStatus = 'pending' | 'retrying' | 'resolved' | 'dismissed';

export interface DlqDiagnosisResult {
  category: DlqErrorCategory;
  label: string;
  recommendedAction: string;
  canRetry: boolean;
}

export interface DlqIncident {
  id: string;
  organizationId: string;
  postId: string;
  channelId: string;
  provider: string; // instagram | threads | linkedin | x
  accountName: string;
  errorCategory: DlqErrorCategory;
  rawErrorMessage: string;
  recommendedAction: string;
  retryCount: number;
  lastRetryAt?: string | null;
  status: DlqStatus;
  createdAt: string;
  updatedAt: string;
  postContent?: string;
}

export interface DlqCounts {
  pending: number;
  retrying: number;
  resolved: number;
  dismissed: number;
  total: number;
}

export interface DlqListResponse {
  incidents: DlqIncident[];
  counts: DlqCounts;
}

export interface RetryIncidentInput {
  incidentId: string;
  updatedContent?: string;
}

export interface DismissIncidentInput {
  incidentId: string;
}
