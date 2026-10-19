import {
  DeviceType,
  DeviceOrientation,
  MockupTheme,
  DeviceDimensions,
  DeviceMockupItem,
  MockupSummaryMetrics,
} from './types';
import {
  calculateDeviceDimensions,
  getDeviceColors,
  generateDeviceSvgFrame,
  summarizeMockupsPortfolio,
} from './mockups-utils';

export {
  calculateDeviceDimensions,
  getDeviceColors,
  generateDeviceSvgFrame,
  summarizeMockupsPortfolio,
};

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

if (typeof process !== 'undefined' && process.argv[1]?.includes('mockups.test')) {
  runMockupsUnitTests();
}
