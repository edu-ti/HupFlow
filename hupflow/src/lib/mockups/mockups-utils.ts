import {
  DeviceType,
  DeviceOrientation,
  MockupTheme,
  DeviceDimensions,
  DeviceMockupItem,
  MockupSummaryMetrics,
} from './types';

export function calculateDeviceDimensions(
  deviceType: DeviceType,
  orientation: DeviceOrientation = 'portrait'
): DeviceDimensions {
  switch (deviceType) {
    case 'iphone_16_pro':
      return orientation === 'portrait'
        ? {
            outerWidth: 380,
            outerHeight: 760,
            screenWidth: 364,
            screenHeight: 744,
            borderRadius: 50,
            screenBorderRadius: 44,
            aspectRatio: '9:19.5',
          }
        : {
            outerWidth: 760,
            outerHeight: 380,
            screenWidth: 744,
            screenHeight: 364,
            borderRadius: 50,
            screenBorderRadius: 44,
            aspectRatio: '19.5:9',
          };

    case 'ipad_pro':
      return orientation === 'portrait'
        ? {
            outerWidth: 540,
            outerHeight: 720,
            screenWidth: 516,
            screenHeight: 696,
            borderRadius: 28,
            screenBorderRadius: 22,
            aspectRatio: '3:4',
          }
        : {
            outerWidth: 720,
            outerHeight: 540,
            screenWidth: 696,
            screenHeight: 516,
            borderRadius: 28,
            screenBorderRadius: 22,
            aspectRatio: '4:3',
          };

    case 'macbook_air':
      return {
        outerWidth: 840,
        outerHeight: 520,
        screenWidth: 760,
        screenHeight: 475,
        borderRadius: 16,
        screenBorderRadius: 10,
        aspectRatio: '16:10',
      };

    case 'apple_watch':
    default:
      return {
        outerWidth: 320,
        outerHeight: 390,
        screenWidth: 280,
        screenHeight: 350,
        borderRadius: 60,
        screenBorderRadius: 50,
        aspectRatio: '4:5',
      };
  }
}

export function getDeviceColors(theme: MockupTheme) {
  switch (theme) {
    case 'natural_titanium':
      return {
        bodyFill: '#7d7a76',
        borderStroke: '#98948e',
        innerBezel: '#121212',
        accentGlow: 'rgba(215, 211, 204, 0.25)',
      };
    case 'silver':
      return {
        bodyFill: '#d8dadb',
        borderStroke: '#e5e7eb',
        innerBezel: '#141416',
        accentGlow: 'rgba(255, 255, 255, 0.35)',
      };
    case 'midnight':
      return {
        bodyFill: '#1a202c',
        borderStroke: '#2d3748',
        innerBezel: '#0a0d14',
        accentGlow: 'rgba(59, 130, 246, 0.2)',
      };
    case 'titanium_black':
    default:
      return {
        bodyFill: '#1f2022',
        borderStroke: '#333538',
        innerBezel: '#0a0a0a',
        accentGlow: 'rgba(255, 255, 255, 0.12)',
      };
  }
}

export function generateDeviceSvgFrame(
  deviceType: DeviceType,
  orientation: DeviceOrientation = 'portrait',
  theme: MockupTheme = 'titanium_black',
  mediaUrl: string = 'https://picsum.photos/800/1600'
): string {
  const dim = calculateDeviceDimensions(deviceType, orientation);
  const colors = getDeviceColors(theme);
  const screenX = (dim.outerWidth - dim.screenWidth) / 2;
  const screenY = (dim.outerHeight - dim.screenHeight) / 2;

  const dynamicIsland =
    deviceType === 'iphone_16_pro' && orientation === 'portrait'
      ? `<rect x="${dim.outerWidth / 2 - 55}" y="${screenY + 12}" width="110" height="30" rx="15" fill="#000000" />`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim.outerWidth} ${dim.outerHeight}" width="${dim.outerWidth}" height="${dim.outerHeight}">
  <defs>
    <clipPath id="screenClip">
      <rect x="${screenX}" y="${screenY}" width="${dim.screenWidth}" height="${dim.screenHeight}" rx="${dim.screenBorderRadius}" />
    </clipPath>
    <linearGradient id="glossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Device Outer Body Shell -->
  <rect x="2" y="2" width="${dim.outerWidth - 4}" height="${dim.outerHeight - 4}" rx="${dim.borderRadius}" fill="${colors.bodyFill}" stroke="${colors.borderStroke}" stroke-width="3" />

  <!-- Inner Bezel -->
  <rect x="${screenX - 2}" y="${screenY - 2}" width="${dim.screenWidth + 4}" height="${dim.screenHeight + 4}" rx="${dim.screenBorderRadius + 2}" fill="${colors.innerBezel}" />

  <!-- Screen Content Area -->
  <g clip-path="url(#screenClip)">
    <image href="${mediaUrl}" x="${screenX}" y="${screenY}" width="${dim.screenWidth}" height="${dim.screenHeight}" preserveAspectRatio="xMidYMid slice" />
    <!-- Glass Reflection Gradient -->
    <rect x="${screenX}" y="${screenY}" width="${dim.screenWidth}" height="${dim.screenHeight}" fill="url(#glossGrad)" pointer-events="none" />
  </g>

  <!-- Hardware Details (Dynamic Island / Camera) -->
  ${dynamicIsland}
</svg>`;
}

export function summarizeMockupsPortfolio(mockups: DeviceMockupItem[]): MockupSummaryMetrics {
  const totalMockups = mockups.length;
  const iphoneCount = mockups.filter(m => m.deviceType === 'iphone_16_pro').length;
  const ipadCount = mockups.filter(m => m.deviceType === 'ipad_pro').length;
  const macbookCount = mockups.filter(m => m.deviceType === 'macbook_air').length;
  const videoMockupsCount = mockups.filter(m => m.mediaType === 'video').length;

  return {
    totalMockups,
    iphoneCount,
    ipadCount,
    macbookCount,
    videoMockupsCount,
  };
}
