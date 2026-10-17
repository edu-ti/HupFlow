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

// -------------------------------------------------------------------
// Test Execution Suite
// -------------------------------------------------------------------
function runMockupsUnitTests() {
  console.log('--- Running Feature 044 Dynamic Video & Device Mockups Unit Tests ---');

  // 1. Dimensions calculations
  const iphonePortrait = calculateDeviceDimensions('iphone_16_pro', 'portrait');
  if (iphonePortrait.outerWidth !== 380 || iphonePortrait.outerHeight !== 760) {
    throw new Error('iPhone portrait dimensions mismatch');
  }

  const iphoneLandscape = calculateDeviceDimensions('iphone_16_pro', 'landscape');
  if (iphoneLandscape.outerWidth !== 760 || iphoneLandscape.outerHeight !== 380) {
    throw new Error('iPhone landscape dimensions mismatch');
  }

  const ipadDim = calculateDeviceDimensions('ipad_pro', 'portrait');
  if (ipadDim.borderRadius !== 28) throw new Error('iPad border radius mismatch');

  const macbookDim = calculateDeviceDimensions('macbook_air', 'landscape');
  if (macbookDim.outerWidth !== 840) throw new Error('MacBook width mismatch');

  // 2. Color themes
  const colorsTitanium = getDeviceColors('natural_titanium');
  if (!colorsTitanium.bodyFill.startsWith('#')) throw new Error('Hex color mismatch in theme');

  // 3. SVG Generation
  const svg = generateDeviceSvgFrame('iphone_16_pro', 'portrait', 'titanium_black', 'https://example.com/ad.jpg');
  if (!svg.includes('viewBox="0 0 380 760"')) throw new Error('SVG viewBox mismatch');
  if (!svg.includes('rect x="135" y="20" width="110" height="30" rx="15"')) {
    throw new Error('Dynamic Island element missing in iPhone portrait SVG');
  }

  // 4. Portfolio Metrics
  const mockItem: DeviceMockupItem = {
    id: 'mock-01',
    organizationId: 'org-test',
    title: 'Ad Reels Black Friday',
    deviceType: 'iphone_16_pro',
    orientation: 'portrait',
    finishColor: 'titanium_black',
    shadowStyle: 'floating_3d',
    mediaType: 'video',
    mediaUrl: 'https://example.com/video.mp4',
    backgroundColorHex: '#09090b',
    perspectiveTiltX: 5,
    perspectiveTiltY: -8,
    tags: ['blackfriday', 'reels', 'mockup'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const metrics = summarizeMockupsPortfolio([mockItem, { ...mockItem, id: 'mock-02', deviceType: 'ipad_pro', mediaType: 'image' }]);
  if (metrics.totalMockups !== 2) throw new Error(`Expected 2 mockups, got ${metrics.totalMockups}`);
  if (metrics.iphoneCount !== 1) throw new Error('Expected 1 iPhone');
  if (metrics.ipadCount !== 1) throw new Error('Expected 1 iPad');
  if (metrics.videoMockupsCount !== 1) throw new Error('Expected 1 video mockup');

  console.log('✅ All Feature 044 Dynamic Device Mockups unit tests passed successfully!');
}

runMockupsUnitTests();
