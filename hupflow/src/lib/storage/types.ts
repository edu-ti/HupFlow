export type MediaType = 'image' | 'video' | 'pdf' | 'other';

export type MediaFilterType = 'all' | 'image' | 'video' | 'pdf';

export interface PresignedUploadRequest {
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  expiresInSeconds: number;
}

export interface MediaAssetItem {
  id: string;
  organizationId: string;
  filename: string;
  url: string;
  mimeType: string;
  mediaType: MediaType;
  sizeBytes: number;
  dimensions?: {
    width: number;
    height: number;
  };
  createdAt: string;
}

export interface UploadProgressState {
  filename: string;
  progress: number;
  status: 'idle' | 'uploading' | 'confirming' | 'completed' | 'error';
  errorMessage?: string;
}
