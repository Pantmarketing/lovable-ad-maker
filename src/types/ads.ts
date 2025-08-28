export type AdSize = `${number}x${number}`;

export interface Palette {
  primary: string;
  secondary: string;
  bg: string;
  textOnPrimary: '#fff' | '#111';
}

export interface GlobalConfig {
  sizes: AdSize[];
  palettes: Palette[];
  headline: string;
  headlineImage?: string; // dataURL
  headlineMarginBottom: number;
  buttonLines: string[]; // um por linha
  alignments: {
    title: 'left' | 'center' | 'right';
    buttons: 'left' | 'center' | 'right';
    logo: 'left' | 'center' | 'right';
  };
  clickTag: string;
  mode: 'datas' | 'limite';
}

export interface CardOverrides {
  title?: {
    fontSize?: number;
    fontWeight?: number;
    fontFamily?: string;
    marginBottom?: number;
  };
  buttons?: {
    texts?: string[];
    fontSizes?: number[];
    autoAdjust?: boolean;
    fontFamily?: string;
    fontWeight?: number;
    height?: number;
    spacing?: number;
    radius?: number;
    textAlign?: 'left' | 'center' | 'right';
    leftArrow?: string;
    rightArrow?: string; // dataURL
  };
  logo?: { src?: string; align?: 'left' | 'center' | 'right' };
}

export interface PreviewCardModel {
  id: string;
  size: AdSize;
  palette: Palette;
  overrides: CardOverrides;
  html?: string; // último HTML gerado
}

