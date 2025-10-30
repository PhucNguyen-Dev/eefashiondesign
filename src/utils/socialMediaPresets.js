/**
 * Social Media Export Presets
 * Optimized dimensions for popular platforms
 */

export const SOCIAL_MEDIA_PRESETS = {
  INSTAGRAM_SQUARE: {
    name: 'Instagram Square',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    format: 'png',
    quality: 0.95,
    description: 'Perfect for Instagram feed posts',
  },
  INSTAGRAM_PORTRAIT: {
    name: 'Instagram Portrait',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    format: 'png',
    quality: 0.95,
    description: 'Optimized for Instagram portrait posts',
  },
  INSTAGRAM_STORY: {
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    format: 'png',
    quality: 0.95,
    description: 'Perfect for Instagram and Facebook stories',
  },
  FACEBOOK_POST: {
    name: 'Facebook Post',
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    format: 'png',
    quality: 0.9,
    description: 'Optimized for Facebook feed posts',
  },
  TWITTER_POST: {
    name: 'Twitter Post',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    format: 'png',
    quality: 0.9,
    description: 'Perfect for Twitter posts',
  },
  PINTEREST_PIN: {
    name: 'Pinterest Pin',
    width: 1000,
    height: 1500,
    aspectRatio: '2:3',
    format: 'png',
    quality: 0.95,
    description: 'Optimized for Pinterest pins',
  },
  LINKEDIN_POST: {
    name: 'LinkedIn Post',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    format: 'png',
    quality: 0.9,
    description: 'Perfect for LinkedIn posts',
  },
  TIKTOK: {
    name: 'TikTok',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    format: 'png',
    quality: 0.95,
    description: 'Optimized for TikTok videos',
  },
  YOUTUBE_THUMBNAIL: {
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    format: 'png',
    quality: 0.95,
    description: 'Perfect for YouTube video thumbnails',
  },
  ETSY_LISTING: {
    name: 'Etsy Listing',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    format: 'png',
    quality: 0.95,
    description: 'Optimized for Etsy product listings',
  },
  SHOPIFY_PRODUCT: {
    name: 'Shopify Product',
    width: 2048,
    height: 2048,
    aspectRatio: '1:1',
    format: 'png',
    quality: 0.95,
    description: 'Perfect for Shopify product images',
  },
  HD_WALLPAPER: {
    name: 'HD Wallpaper',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    format: 'png',
    quality: 1.0,
    description: 'Full HD wallpaper',
  },
  PRINT_4X6: {
    name: 'Print 4x6"',
    width: 1800,
    height: 1200,
    aspectRatio: '3:2',
    format: 'png',
    quality: 1.0,
    description: 'Standard 4x6 inch print at 300 DPI',
  },
  PRINT_8X10: {
    name: 'Print 8x10"',
    width: 3000,
    height: 2400,
    aspectRatio: '5:4',
    format: 'png',
    quality: 1.0,
    description: 'Standard 8x10 inch print at 300 DPI',
  },
};

/**
 * Get preset by platform name
 */
export const getPresetByPlatform = (platform) => {
  const platformKey = platform.toUpperCase().replace(/ /g, '_');
  return SOCIAL_MEDIA_PRESETS[platformKey] || null;
};

/**
 * Get all presets as array
 */
export const getAllPresets = () => {
  return Object.entries(SOCIAL_MEDIA_PRESETS).map(([key, value]) => ({
    id: key,
    ...value,
  }));
};

/**
 * Get presets by category
 */
export const getPresetsByCategory = () => {
  return {
    social: [
      SOCIAL_MEDIA_PRESETS.INSTAGRAM_SQUARE,
      SOCIAL_MEDIA_PRESETS.INSTAGRAM_PORTRAIT,
      SOCIAL_MEDIA_PRESETS.INSTAGRAM_STORY,
      SOCIAL_MEDIA_PRESETS.FACEBOOK_POST,
      SOCIAL_MEDIA_PRESETS.TWITTER_POST,
      SOCIAL_MEDIA_PRESETS.PINTEREST_PIN,
      SOCIAL_MEDIA_PRESETS.LINKEDIN_POST,
      SOCIAL_MEDIA_PRESETS.TIKTOK,
      SOCIAL_MEDIA_PRESETS.YOUTUBE_THUMBNAIL,
    ],
    ecommerce: [
      SOCIAL_MEDIA_PRESETS.ETSY_LISTING,
      SOCIAL_MEDIA_PRESETS.SHOPIFY_PRODUCT,
    ],
    print: [
      SOCIAL_MEDIA_PRESETS.PRINT_4X6,
      SOCIAL_MEDIA_PRESETS.PRINT_8X10,
    ],
    other: [
      SOCIAL_MEDIA_PRESETS.HD_WALLPAPER,
    ],
  };
};

/**
 * Calculate dimensions maintaining aspect ratio
 */
export const calculateDimensions = (originalWidth, originalHeight, preset) => {
  const targetRatio = preset.width / preset.height;
  const currentRatio = originalWidth / originalHeight;

  let width, height;

  if (currentRatio > targetRatio) {
    // Original is wider
    height = preset.height;
    width = Math.round(height * currentRatio);
  } else {
    // Original is taller or same
    width = preset.width;
    height = Math.round(width / currentRatio);
  }

  return { width, height };
};

/**
 * Get filename for export
 */
export const getExportFilename = (designName, preset, format) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const safeName = designName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const presetName = preset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${safeName}_${presetName}_${timestamp}.${format}`;
};

export default {
  SOCIAL_MEDIA_PRESETS,
  getPresetByPlatform,
  getAllPresets,
  getPresetsByCategory,
  calculateDimensions,
  getExportFilename,
};
