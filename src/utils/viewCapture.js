/**
 * View Capture Utility
 * Cross-platform view capture with web support using html2canvas
 */

import { Platform } from 'react-native';

/**
 * Capture a view/component as an image
 * Works on both native (iOS/Android) and web platforms
 * 
 * @param {Object} viewRef - Reference to the view to capture
 * @param {Object} options - Capture options
 * @returns {Promise<string>} - URI or data URL of the captured image
 */
export const captureView = async (viewRef, options = {}) => {
  const {
    format = 'png',
    quality = 1.0,
    width = null,
    height = null,
    result = 'tmpfile',
  } = options;

  if (Platform.OS === 'web') {
    // Web implementation using html2canvas
    try {
      // Dynamically import html2canvas only on web
      const html2canvas = (await import('html2canvas')).default;
      
      if (!viewRef || !viewRef.current) {
        throw new Error('Invalid view reference');
      }

      // Capture the DOM element
      const canvas = await html2canvas(viewRef.current, {
        backgroundColor: null,
        scale: quality * 2, // Higher scale for better quality
        width: width,
        height: height,
        useCORS: true,
        allowTaint: true,
      });

      // Convert to desired format
      const dataUrl = canvas.toDataURL(`image/${format}`, quality);
      
      if (result === 'base64') {
        // Return base64 string without data URL prefix
        return dataUrl.split(',')[1];
      }
      
      // Return data URL (default for web)
      return dataUrl;
    } catch (error) {
      console.error('Web view capture error:', error);
      throw new Error(`Failed to capture view on web: ${error.message}`);
    }
  } else {
    // Native implementation using react-native-view-shot
    try {
      const { captureRef } = require('react-native-view-shot');
      
      const uri = await captureRef(viewRef, {
        format,
        quality,
        width,
        height,
        result,
      });

      return uri;
    } catch (error) {
      console.error('Native view capture error:', error);
      throw new Error(`Failed to capture view on native: ${error.message}`);
    }
  }
};

/**
 * Download captured image (web only)
 * On native, use Sharing API instead
 * 
 * @param {string} dataUrl - Data URL of the image
 * @param {string} filename - Filename for download
 */
export const downloadImage = (dataUrl, filename = 'image.png') => {
  if (Platform.OS === 'web') {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.warn('downloadImage is only available on web. Use Sharing API on native.');
  }
};

/**
 * Convert data URL to Blob (web only)
 * Useful for uploading images
 * 
 * @param {string} dataUrl - Data URL of the image
 * @returns {Blob} - Blob object
 */
export const dataUrlToBlob = (dataUrl) => {
  if (Platform.OS !== 'web') {
    throw new Error('dataUrlToBlob is only available on web');
  }

  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

export default {
  captureView,
  downloadImage,
  dataUrlToBlob,
};

