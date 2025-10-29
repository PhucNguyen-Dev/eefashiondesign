import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { captureView as captureViewUtil } from '../utils/viewCapture';
import { Alert, Platform } from 'react-native';
import { EXPORT } from '../config/constants';
import errorHandler from './errorHandler';

/**
 * Export Service for exporting designs
 */
class ExportService {
  /**
   * Capture view as image
   * Cross-platform: works on web (html2canvas) and native (react-native-view-shot)
   */
  async captureView(viewRef, options = {}) {
    const {
      format = 'png',
      quality = 1.0,
      width = null,
      height = null,
    } = options;

    try {
      const uri = await captureViewUtil(viewRef, {
        format,
        quality,
        width,
        height,
        result: 'tmpfile',
      });

      return uri;
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to capture design',
      });
      throw error;
    }
  }

  /**
   * Export as PNG
   */
  async exportAsPNG(viewRef, fileName = 'design.png', options = {}) {
    try {
      const uri = await this.captureView(viewRef, {
        format: 'png',
        quality: options.quality || 1.0,
        ...options,
      });

      const fileUri = await this.saveToDevice(uri, fileName);
      return fileUri;
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to export as PNG',
      });
      throw error;
    }
  }

  /**
   * Export as JPG
   */
  async exportAsJPG(viewRef, fileName = 'design.jpg', options = {}) {
    try {
      const uri = await this.captureView(viewRef, {
        format: 'jpg',
        quality: options.quality || 0.9,
        ...options,
      });

      const fileUri = await this.saveToDevice(uri, fileName);
      return fileUri;
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to export as JPG',
      });
      throw error;
    }
  }

  /**
   * Export as SVG (placeholder - requires additional implementation)
   */
  async exportAsSVG(designData, fileName = 'design.svg') {
    try {
      // Convert design data to SVG format
      const svgContent = this.convertToSVG(designData);

      // Save SVG file
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, svgContent);

      return fileUri;
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to export as SVG',
      });
      throw error;
    }
  }

  /**
   * Convert design data to SVG string
   */
  convertToSVG(designData) {
    const { width = 800, height = 1000, elements = [] } = designData;

    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
`;

    elements.forEach((element) => {
      switch (element.type) {
        case 'rect':
          svgContent += `  <rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" fill="${element.color}" />\n`;
          break;
        case 'circle':
          svgContent += `  <circle cx="${element.x}" cy="${element.y}" r="${element.radius}" fill="${element.color}" />\n`;
          break;
        case 'path':
          svgContent += `  <path d="${element.path}" fill="${element.color}" />\n`;
          break;
        case 'text':
          svgContent += `  <text x="${element.x}" y="${element.y}" font-size="${element.fontSize}" fill="${element.color}">${element.text}</text>\n`;
          break;
      }
    });

    svgContent += '</svg>';
    return svgContent;
  }

  /**
   * Export as PDF (placeholder - requires additional library)
   */
  async exportAsPDF(viewRef, fileName = 'design.pdf') {
    try {
      // First capture as high-quality PNG
      const pngUri = await this.captureView(viewRef, {
        format: 'png',
        quality: 1.0,
      });

      // In a real implementation, you would convert the PNG to PDF
      // For now, we'll just use the PNG and rename it
      // You might want to use react-native-html-to-pdf or similar library

      Alert.alert(
        'PDF Export',
        'PDF export requires additional setup. Currently saving as high-quality PNG instead.',
        [{ text: 'OK' }]
      );

      return await this.saveToDevice(pngUri, fileName.replace('.pdf', '.png'));
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to export as PDF',
      });
      throw error;
    }
  }

  /**
   * Save file to device
   * On web: triggers download
   * On native: saves to file system
   */
  async saveToDevice(sourceUri, fileName) {
    try {
      if (Platform.OS === 'web') {
        // On web, sourceUri is a data URL, trigger download
        const { downloadImage } = require('../utils/viewCapture');
        downloadImage(sourceUri, fileName);
        return sourceUri; // Return the data URL
      } else {
        // On native, copy to file system
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.copyAsync({
          from: sourceUri,
          to: fileUri,
        });
        return fileUri;
      }
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to save file to device',
      });
      throw error;
    }
  }

  /**
   * Share file
   */
  async shareFile(fileUri, message = 'Check out my design!') {
    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return false;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: this.getMimeType(fileUri),
        dialogTitle: message,
        UTI: this.getUTI(fileUri),
      });

      return true;
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to share file',
      });
      return false;
    }
  }

  /**
   * Get MIME type from file URI
   */
  getMimeType(fileUri) {
    const extension = fileUri.split('.').pop().toLowerCase();
    const mimeTypes = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
    };

    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Get UTI (Uniform Type Identifier) for iOS
   */
  getUTI(fileUri) {
    const extension = fileUri.split('.').pop().toLowerCase();
    const utis = {
      png: 'public.png',
      jpg: 'public.jpeg',
      jpeg: 'public.jpeg',
      svg: 'public.svg-image',
      pdf: 'com.adobe.pdf',
    };

    return utis[extension] || 'public.data';
  }

  /**
   * Delete file
   */
  async deleteFile(fileUri) {
    try {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(fileUri) {
    try {
      const info = await FileSystem.getInfoAsync(fileUri);
      return info;
    } catch (error) {
      console.error('Failed to get file info:', error);
      return null;
    }
  }

  /**
   * Export design with metadata
   */
  async exportWithMetadata(viewRef, designData, options = {}) {
    const {
      format = 'png',
      includeMetadata = true,
      fileName = `design_${Date.now()}`,
    } = options;

    try {
      // Export the visual design
      let fileUri;
      const fullFileName = `${fileName}.${format}`;

      switch (format.toLowerCase()) {
        case 'png':
          fileUri = await this.exportAsPNG(viewRef, fullFileName, options);
          break;
        case 'jpg':
        case 'jpeg':
          fileUri = await this.exportAsJPG(viewRef, fullFileName, options);
          break;
        case 'svg':
          fileUri = await this.exportAsSVG(designData, fullFileName);
          break;
        case 'pdf':
          fileUri = await this.exportAsPDF(viewRef, fullFileName);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      // Save metadata if requested
      if (includeMetadata) {
        const metadataUri = await this.saveMetadata(designData, fileName);
        return { fileUri, metadataUri };
      }

      return { fileUri };
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: `Failed to export design as ${format}`,
      });
      throw error;
    }
  }

  /**
   * Save design metadata
   */
  async saveMetadata(designData, fileName) {
    try {
      const metadata = {
        name: designData.name,
        createdAt: designData.createdAt,
        modifiedAt: new Date().toISOString(),
        version: designData.version || '1.0',
        elements: designData.elements?.length || 0,
        layers: designData.layers?.length || 0,
        dimensions: {
          width: designData.width,
          height: designData.height,
        },
        ...designData.metadata,
      };

      const metadataUri = `${FileSystem.documentDirectory}${fileName}_metadata.json`;
      await FileSystem.writeAsStringAsync(
        metadataUri,
        JSON.stringify(metadata, null, 2)
      );

      return metadataUri;
    } catch (error) {
      console.error('Failed to save metadata:', error);
      return null;
    }
  }

  /**
   * Batch export multiple designs
   */
  async batchExport(exports, onProgress = null) {
    const results = [];
    const total = exports.length;

    for (let i = 0; i < total; i++) {
      try {
        const result = await this.exportWithMetadata(
          exports[i].viewRef,
          exports[i].designData,
          exports[i].options
        );
        results.push({ success: true, ...result });

        if (onProgress) {
          onProgress(i + 1, total);
        }
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  }
}

// Create singleton instance
const exportService = new ExportService();

export default exportService;
