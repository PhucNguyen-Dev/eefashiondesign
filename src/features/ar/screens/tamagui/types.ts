/**
 * Type definitions for ARViewScreen
 */

export type ARMode = 'preview' | 'measure' | 'tryon';

export type CameraType = 'back' | 'front' | 'user' | 'environment';

export interface Garment {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ARFeature {
  id: string;
  name: string;
  icon: string;
}

export interface CapturedImage {
  uri: string;
  width?: number;
  height?: number;
  base64?: string;
}

export interface MediaAsset {
  id: string;
  uri: string;
  filename: string;
  creationTime: number;
  width: number;
  height: number;
}

export interface ARViewScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
}

export interface CameraPermissionResponse {
  status: 'granted' | 'denied' | 'undetermined';
}

export interface ImagePickerResult {
  canceled: boolean;
  assets?: Array<{
    uri: string;
    width: number;
    height: number;
    type?: string;
  }>;
}
