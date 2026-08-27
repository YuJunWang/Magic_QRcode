export type ThemeType = 'sakura' | 'summer' | 'autumn' | 'winter' | 'crystal' | 'zen';

export type CameraMode = 'orbit' | 'scan';

export interface QRMatrixData {
  size: number;
  matrix: boolean[][];
  isFinderPattern: (r: number, c: number) => boolean;
  isFinderCenter: (r: number, c: number) => boolean;
  darkCount: number;
}

export interface AppSettings {
  text: string;
  theme: ThemeType;
  autoRotate: boolean;
  particlesEnabled: boolean;
  cameraMode: CameraMode;
}

export interface ThemeColors {
  name: string;
  subtitle: string;
  icon: string;
  background: string;
  potColor: string;
  potRimColor: string;
  groundColor: string;
  trunkColor: string;
  foliagePrimary: string;
  foliageSecondary: string;
  foliageAccent: string;
  // Aliases for legacy/crystal/zen compatibility
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
