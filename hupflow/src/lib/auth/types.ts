export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  activeOrganizationId?: string | null;
}

export interface AuthContext {
  user: AuthUser;
  session: AuthSession;
  organizationId: string;
  organizationRole: OrgRole;
  isDevFallback?: boolean;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  role: OrgRole;
  isActive: boolean;
}

export interface OrganizationMemberSummary {
  id: string;
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  role: OrgRole;
  joinedAt: string;
}

export interface InvitationSummary {
  id: string;
  email: string;
  role: OrgRole;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: string;
  createdAt: string;
  inviteLink?: string;
}

export interface CreateInvitationRequest {
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface UpdateMemberRoleRequest {
  role: 'admin' | 'member' | 'viewer';
}

export interface AuthErrorResponse {
  error: string;
  code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'ORGANIZATION_NOT_FOUND' | 'INSUFFICIENT_PERMISSIONS';
}
