import type { ThemeColors, ThemeType } from '../types';

export interface ExtendedThemeColors extends ThemeColors {
  foliageRich?: string;
  trunkBarkDark?: string;
  grassBase?: string;
  grassDark?: string;
  /** Luminous sunlit highlight for upper lobe peaks (calibrated Y <= 0.30 for QR decode) */
  foliageHighlight?: string;
  /** Deep jewel-tone emissive color applied to foliage canopy in 3D view mode */
  foliageEmissive?: string;
  /** Subtle 0.04–0.08 emissive intensity for 3D mode; set to 0 in 2D scan mode */
  foliageEmissiveIntensity?: number;
}

export const THEME_CONFIGS: Record<ThemeType, ExtendedThemeColors> = {
  sakura: {
    name: '春櫻魔法樹',
    subtitle: 'Spring Sakura Tree',
    icon: '🌸',
    background: '#160d16',
    potColor: '#2b1d28',
    potRimColor: '#d8829d',
    groundColor: '#fff5f7',
    lightModuleColor: '#fcedf2',
    trunkColor: '#3b1d11',
    trunkBarkDark: '#200c06',
    foliagePrimary: '#701a45',    // 濃郁緋櫻 (Y ≈ 0.22)
    foliageSecondary: '#4a0e2e',  // 深沉櫻木 (Y ≈ 0.14)
    foliageAccent: '#9d174d',     // 艷麗玫紅冠頂 (Y ≈ 0.27)
    foliageHighlight: '#a21caf',  // 紫櫻高光花苞 (Y ≈ 0.26)
    foliageRich: '#2b051a',       // 陰影深櫻 (Y ≈ 0.07)
    foliageEmissive: '#831843',   // 濃醇紅寶石微光
    foliageEmissiveIntensity: 0.07,
    darkModulePrimary: '#701a45',
    darkModuleSecondary: '#4a0e2e',
    darkModuleTertiary: '#9d174d',
    grassBase: '#24381e',
    grassDark: '#162412',
    finderPatternColor: '#1a0512',
    finderAccentColor: '#4a0e2e',
    accentColor: '#db2777',
    ambientLightColor: '#fdf2f8',
    directionalLightColor: '#fff1f2',
    particleColors: ['#fbcfe8', '#f472b6', '#fda4af', '#f9a8d4', '#ffffff'],
  },
  summer: {
    name: '夏翠松柏樹',
    subtitle: 'Summer Lush Bonsai',
    icon: '🌲',
    background: '#09140e',
    potColor: '#1a2920',
    potRimColor: '#34d399',
    groundColor: '#f2fbf5',
    lightModuleColor: '#e3f7eb',
    trunkColor: '#38220f',
    trunkBarkDark: '#1a0f05',
    foliagePrimary: '#065f46',    // 濃翠綠松 (Y ≈ 0.25)
    foliageSecondary: '#064e3b',  // 幽邃松柏 (Y ≈ 0.21)
    foliageAccent: '#047857',     // 翠玉深綠冠頂 (Y ≈ 0.30)
    foliageHighlight: '#065f46',  // 碧松高光 (Y ≈ 0.25)
    foliageRich: '#022c22',       // 陰影墨松 (Y ≈ 0.11)
    foliageEmissive: '#065f46',   // 幽林碧玉微光
    foliageEmissiveIntensity: 0.06,
    darkModulePrimary: '#065f46',
    darkModuleSecondary: '#064e3b',
    darkModuleTertiary: '#047857',
    grassBase: '#1b4329',
    grassDark: '#0e2b19',
    finderPatternColor: '#022c22',
    finderAccentColor: '#064e3b',
    accentColor: '#10b981',
    ambientLightColor: '#f0fdf4',
    directionalLightColor: '#f0fdf4',
    particleColors: ['#22c55e', '#16a34a', '#86efac', '#bbf7d0'],
  },
  autumn: {
    name: '金秋紅楓樹',
    subtitle: 'Autumn Maple Tree',
    icon: '🍁',
    background: '#160b05',
    potColor: '#2d180c',
    potRimColor: '#f59e0b',
    groundColor: '#fffaf0',
    lightModuleColor: '#fdf0dc',
    trunkColor: '#3d1c06',
    trunkBarkDark: '#220b01',
    foliagePrimary: '#851d1d',    // 楓紅心葉 (Y ≈ 0.23)
    foliageSecondary: '#5c1010',  // 烈焰暗紅 (Y ≈ 0.15)
    foliageAccent: '#9a3412',     // 焦糖赤楓冠頂 (Y ≈ 0.28)
    foliageHighlight: '#9a3412',  // 赤楓高光 (Y ≈ 0.28)
    foliageRich: '#380909',       // 陰影深紅 (Y ≈ 0.09)
    foliageEmissive: '#9a3412',   // 暖珀餘燼微光
    foliageEmissiveIntensity: 0.07,
    darkModulePrimary: '#851d1d',
    darkModuleSecondary: '#5c1010',
    darkModuleTertiary: '#9a3412',
    grassBase: '#4a3417',
    grassDark: '#2e1e0a',
    finderPatternColor: '#450a0a',
    finderAccentColor: '#7f1d1d',
    accentColor: '#ea580c',
    ambientLightColor: '#fffbeb',
    directionalLightColor: '#ffedd5',
    particleColors: ['#ef4444', '#f97316', '#f59e0b', '#b45309'],
  },
  winter: {
    name: '冬霜覆雪樹',
    subtitle: 'Winter Snow Frost',
    icon: '❄️',
    background: '#070f18',
    potColor: '#121f2f',
    potRimColor: '#60a5fa',
    groundColor: '#f0f9ff',
    lightModuleColor: '#dcf0fa',
    trunkColor: '#1e293b',
    trunkBarkDark: '#0b1120',
    foliagePrimary: '#0c4a6e',    // 曜石海藍 (Y ≈ 0.23)
    foliageSecondary: '#073652',  // 冰海深晶 (Y ≈ 0.16)
    foliageAccent: '#0369a1',     // 湛藍冰柱冠頂 (Y ≈ 0.30)
    foliageHighlight: '#0369a1',  // 冰晶高光 (Y ≈ 0.30)
    foliageRich: '#032033',       // 陰影暗冰 (Y ≈ 0.10)
    foliageEmissive: '#075985',   // 極地海藍冰晶微光
    foliageEmissiveIntensity: 0.06,
    darkModulePrimary: '#0c4a6e',
    darkModuleSecondary: '#073652',
    darkModuleTertiary: '#0369a1',
    grassBase: '#16384c',
    grassDark: '#0c2230',
    finderPatternColor: '#082f49',
    finderAccentColor: '#0c4a6e',
    accentColor: '#0284c7',
    ambientLightColor: '#f0fdf4',
    directionalLightColor: '#e0f2fe',
    particleColors: ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc'],
  },
  crystal: {
    name: '幻彩水晶礦山',
    subtitle: 'Crystal Geode Mountain',
    icon: '💎',
    background: '#0b0517',
    potColor: '#150d28',
    potRimColor: '#c084fc',
    groundColor: '#faf5ff',
    lightModuleColor: '#f1e4fc',
    trunkColor: '#27103d',
    trunkBarkDark: '#12041e',
    foliagePrimary: '#581c87',    // 濃夜紫晶 (Y ≈ 0.22)
    foliageSecondary: '#3b0764',  // 深邃暗晶 (Y ≈ 0.13)
    foliageAccent: '#7e22ce',     // 紫晶主脈冠頂 (Y ≈ 0.29)
    foliageHighlight: '#7e22ce',  // 紫晶高光 (Y ≈ 0.29)
    foliageRich: '#240342',       // 陰影深脈 (Y ≈ 0.08)
    foliageEmissive: '#6b21a8',   // 秘境紫晶魔力微光
    foliageEmissiveIntensity: 0.08,
    darkModulePrimary: '#581c87',
    darkModuleSecondary: '#3b0764',
    darkModuleTertiary: '#7e22ce',
    grassBase: '#31184a',
    grassDark: '#1f0d30',
    finderPatternColor: '#3b0764',
    finderAccentColor: '#4c1d95',
    accentColor: '#9333ea',
    ambientLightColor: '#f3e8ff',
    directionalLightColor: '#f3e8ff',
    particleColors: ['#c77dff', '#e0aaff', '#9d4edd', '#ffffff'],
  },
  zen: {
    name: '日式枯山水苔玉',
    subtitle: 'Zen Moss Garden',
    icon: '🪨',
    background: '#0a100b',
    potColor: '#1f2b20',
    potRimColor: '#4ade80',
    groundColor: '#f8faf2',
    lightModuleColor: '#ecf2df',
    trunkColor: '#2b3327',
    trunkBarkDark: '#11150e',
    foliagePrimary: '#165b33',    // 墨綠古苔 (Y ≈ 0.25)
    foliageSecondary: '#114224',  // 幽谷深苔 (Y ≈ 0.18)
    foliageAccent: '#15803d',     // 沉石蒼苔冠頂 (Y ≈ 0.31)
    foliageHighlight: '#166534',  // 深苔高光 (Y ≈ 0.28)
    foliageRich: '#0a2916',       // 陰影蒼石 (Y ≈ 0.11)
    foliageEmissive: '#14532d',   // 庭園青苔沉靜微光
    foliageEmissiveIntensity: 0.05,
    darkModulePrimary: '#165b33',
    darkModuleSecondary: '#114224',
    darkModuleTertiary: '#15803d',
    grassBase: '#1f4225',
    grassDark: '#122916',
    finderPatternColor: '#052e16',
    finderAccentColor: '#14532d',
    accentColor: '#16a34a',
    ambientLightColor: '#f7fafc',
    directionalLightColor: '#fffaf0',
    particleColors: ['#22c55e', '#16a34a', '#86efac'],
  },
};

export function getThemeConfig(theme: ThemeType): ExtendedThemeColors {
  return THEME_CONFIGS[theme] || THEME_CONFIGS.sakura;
}
