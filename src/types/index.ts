export type ThemeType = 'zen' | 'crystal';

export type CameraMode = 'orbit' | 'scan';

export type ZenSubTheme = 'moss' | 'autumn-moss' | 'sakura-moss';
export type CrystalSubTheme = 'amethyst' | 'emerald' | 'sapphire' | 'ruby' | 'celestial';

export interface QRMatrixData {
  size: number;
  matrix: boolean[][];
  /** Checks whether coordinate (r, c) is part of the 3 corner finder patterns (7x7 zones) */
  isFinderPattern: (r: number, c: number) => boolean;
  /** Checks whether coordinate is the center anchor (the 3x3 core) of a finder pattern */
  isFinderCenter: (r: number, c: number) => boolean;
  /** Total count of dark modules */
  darkCount: number;
}

export interface AppSettings {
  text: string;
  theme: ThemeType;
  zenSubTheme: ZenSubTheme;
  crystalSubTheme: CrystalSubTheme;
  elevation: number;       // 0.2 ~ 1.5 height scaling
  blockDensity: number;    // block size ratio 0.7 ~ 1.0
  autoRotate: boolean;
  particlesEnabled: boolean;
  contrastBoost: boolean;  // Extra high contrast lighting for scanning
  cameraMode: CameraMode;
}

export interface ThemeColors {
  name: string;
  description: string;
  background: string;
  groundColor: string;
  groundSpecular: string;
  darkModulePrimary: string;
  darkModuleSecondary: string;
  darkModuleTertiary: string;
  lightModuleColor: string;
  finderPatternColor: string;
  finderAccentColor: string;
  accentColor: string;
  ambientLightColor: string;
  directionalLightColor: string;
  particleColors: string[];
}
