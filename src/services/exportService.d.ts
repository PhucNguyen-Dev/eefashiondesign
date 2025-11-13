/**
 * Type definitions for exportService
 */

export interface ExportOptions {
  format?: 'png' | 'jpg' | 'svg' | 'pdf';
  quality?: number;
  width?: number | null;
  height?: number | null;
}

export interface CaptureOptions extends ExportOptions {
  result?: 'tmpfile' | 'base64' | 'data-uri';
}

export interface DesignElement {
  type: 'rect' | 'circle' | 'path' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  path?: string;
  color: string;
  fontSize?: number;
  text?: string;
}

export interface DesignData {
  width?: number;
  height?: number;
  elements?: DesignElement[];
}

export interface ShareOptions {
  dialogTitle?: string;
  message?: string;
  mimeType?: string;
}

declare class ExportService {
  /**
   * Capture view as image
   * Cross-platform: works on web (html2canvas) and native (react-native-view-shot)
   */
  captureView(viewRef: any, options?: CaptureOptions): Promise<string>;

  /**
   * Export as PNG
   */
  exportAsPNG(viewRef: any, fileName?: string, options?: ExportOptions): Promise<string>;

  /**
   * Export as JPG
   */
  exportAsJPG(viewRef: any, fileName?: string, options?: ExportOptions): Promise<string>;

  /**
   * Export as SVG
   */
  exportAsSVG(designData: DesignData, fileName?: string): Promise<string>;

  /**
   * Convert design data to SVG string
   */
  convertToSVG(designData: DesignData): string;

  /**
   * Export as PDF
   */
  exportAsPDF(viewRef: any, fileName?: string): Promise<string>;

  /**
   * Save file to device
   */
  saveToDevice(uri: string, fileName: string): Promise<string>;

  /**
   * Share file
   */
  shareFile(uri: string, options?: ShareOptions): Promise<void>;

  /**
   * Get export format options
   */
  getFormats(): string[];

  /**
   * Validate file size
   */
  validateFileSize(fileSize: number): boolean;

  /**
   * Cleanup temporary files
   */
  cleanupTempFiles(): Promise<void>;
}

declare const exportService: ExportService;
export default exportService;
