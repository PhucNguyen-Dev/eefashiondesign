declare module 'react-native-svg' {
  import { Component, ReactNode } from 'react';
  import { ViewProps } from 'react-native';

  export interface SvgProps extends ViewProps {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
    style?: any;
    children?: ReactNode;
  }

  export interface CircleProps {
    cx?: number | string;
    cy?: number | string;
    r?: number | string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
  }

  export interface LineProps {
    x1?: number | string;
    y1?: number | string;
    x2?: number | string;
    y2?: number | string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string;
  }

  export interface PathProps {
    d?: string;
    fill?: string;
    fillOpacity?: number | string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'miter' | 'round' | 'bevel';
  }

  export interface RectProps {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
  }

  export interface PolygonProps {
    points?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
  }

  export interface TextProps {
    x?: number | string;
    y?: number | string;
    fill?: string;
    fontSize?: number | string;
    fontWeight?: string;
    textAnchor?: string;
    children?: ReactNode;
  }

  export interface GProps {
    transform?: string;
    children?: ReactNode;
  }

  export interface DefsProps {
    children?: ReactNode;
  }

  export interface PatternProps {
    id?: string;
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    patternUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
    patternContentUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
    children?: ReactNode;
  }

  export default class Svg extends Component<SvgProps> {}
  export class Circle extends Component<CircleProps> {}
  export class Line extends Component<LineProps> {}
  export class Path extends Component<PathProps> {}
  export class Rect extends Component<RectProps> {}
  export class Polygon extends Component<PolygonProps> {}
  export class Text extends Component<TextProps> {}
  export class G extends Component<GProps> {}
  export class Defs extends Component<DefsProps> {}
  export class Pattern extends Component<PatternProps> {}
}
