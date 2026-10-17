export type DeviceType = 'iphone_16_pro' | 'ipad_pro' | 'macbook_air' | 'apple_watch';

export type DeviceOrientation = 'portrait' | 'landscape';

export type MockupTheme = 'titanium_black' | 'natural_titanium' | 'silver' | 'midnight';

export type ShadowStyle = 'none' | 'soft' | 'floating_3d';

export type MediaType = 'image' | 'video';

export interface DeviceDimensions {
  outerWidth: number;
  outerHeight: number;
  screenWidth: number;
  screenHeight: number;
  borderRadius: number;
  screenBorderRadius: number;
  aspectRatio: string;
}

export interface DeviceMockupItem {
  id: string;
  organizationId: string;
  title: string;
  deviceType: DeviceType;
  orientation: DeviceOrientation;
  finishColor: MockupTheme;
  shadowStyle: ShadowStyle;
  mediaType: MediaType;
  mediaUrl: string;
  backgroundColorHex: string;
  perspectiveTiltX: number;
  perspectiveTiltY: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMockupInput {
  title: string;
  deviceType: DeviceType;
  orientation?: DeviceOrientation;
  finishColor?: MockupTheme;
  shadowStyle?: ShadowStyle;
  mediaType?: MediaType;
  mediaUrl: string;
  backgroundColorHex?: string;
  perspectiveTiltX?: number;
  perspectiveTiltY?: number;
  tags?: string[];
}

export interface MockupSummaryMetrics {
  totalMockups: number;
  iphoneCount: number;
  ipadCount: number;
  macbookCount: number;
  videoMockupsCount: number;
}
