/**
 * Type definitions for DesignStudioScreen
 */

export type ToolName = 'pen' | 'brush' | 'eraser' | 'shape' | 'text' | 'ruler' | 'move' | 'zoom';

export type ShapeName = 'circle' | 'rect' | 'triangle' | 'line';

export interface Tool {
  name: ToolName;
  icon: JSX.Element;
}

export interface Shape {
  name: ShapeName;
  icon: JSX.Element;
}

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingPath {
  points: DrawingPoint[];
  color: string;
  width: number;
}

export interface Layer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

export type ElementType = 'circle' | 'rect' | 'triangle' | 'text';

export interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  size?: number;
  width?: number;
  height?: number;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  rotation?: number;
  text?: string;
  fontSize?: number;
}

export interface DesignData {
  designElements: DesignElement[];
  paths: DrawingPath[];
  layers: Layer[];
  activeLayer: string;
  selectedFabric: string | null;
  selectedPattern: string | null;
}

export type CanvasMode = '2D' | '3D';

// Component Props
export interface DrawingToolProps {
  icon: JSX.Element;
  name: ToolName;
  isActive: boolean;
  onPress: (name: ToolName) => void;
}

export interface LayerItemProps {
  layer: Layer;
  index: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface DesignElementProps {
  element: DesignElement;
  onUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onDelete: (id: string) => void;
}

export interface DesignStudioScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
}
