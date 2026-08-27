import type { ThemeColors, ThemeType } from '../types';

export const THEME_CONFIGS: Record<ThemeType, ThemeColors> = {
  sakura: {
    name: '春櫻魔法樹',
    subtitle: 'Spring Sakura Tree',
    icon: '🌸',
    background: '#160d16',
    potColor: '#2b1d28',
    potRimColor: '#d8829d',
    groundColor: '#fff5f7',
    trunkColor: '#4a2c2a',
    foliagePrimary: '#4a0e2e',    // 深沉櫻桃黑
    foliageSecondary: '#701a45',  // 濃郁緋櫻
    foliageAccent: '#9d174d',     // 艷麗玫紅
    darkModulePrimary: '#4a0e2e',
    darkModuleSecondary: '#701a45',
    darkModuleTertiary: '#9d174d',
    lightModuleColor: '#fff5f7',
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
    background: '#0a1610',
    potColor: '#1a2920',
    potRimColor: '#34d399',
    groundColor: '#f0fdf4',
    trunkColor: '#3d2b1f',
    foliagePrimary: '#064e3b',    // 幽邃松柏
    foliageSecondary: '#065f46',  // 濃翠綠松
    foliageAccent: '#047857',     // 翠玉深綠
    darkModulePrimary: '#064e3b',
    darkModuleSecondary: '#065f46',
    darkModuleTertiary: '#047857',
    lightModuleColor: '#f0fdf4',
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
    background: '#180e08',
    potColor: '#2d180c',
    potRimColor: '#f59e0b',
    groundColor: '#fffbeb',
    trunkColor: '#45200e',
    foliagePrimary: '#7f1d1d',    // 深紅楓心
    foliageSecondary: '#991b1b',  // 烈焰深紅
    foliageAccent: '#b45309',     // 焦糖橙褐
    darkModulePrimary: '#7f1d1d',
    darkModuleSecondary: '#991b1b',
    darkModuleTertiary: '#b45309',
    lightModuleColor: '#fffbeb',
    finderPatternColor: '#450a0a',
    finderAccentColor: '#7f1d1d',
    accentColor: '#f97316',
    ambientLightColor: '#fffbeb',
    directionalLightColor: '#ffedd5',
    particleColors: ['#ef4444', '#f97316', '#f59e0b', '#b45309'],
  },
  winter: {
    name: '冬霜覆雪樹',
    subtitle: 'Winter Snow Frost',
    icon: '❄️',
    background: '#08101a',
    potColor: '#121f2f',
    potRimColor: '#60a5fa',
    groundColor: '#f0f9ff',
    trunkColor: '#2a3b4c',
    foliagePrimary: '#0c4a6e',    // 曜石海藍
    foliageSecondary: '#075985',  // 深海冰晶
    foliageAccent: '#0369a1',     // 湛藍冰柱
    darkModulePrimary: '#0c4a6e',
    darkModuleSecondary: '#075985',
    darkModuleTertiary: '#0369a1',
    lightModuleColor: '#f0f9ff',
    finderPatternColor: '#082f49',
    finderAccentColor: '#0c4a6e',
    accentColor: '#38bdf8',
    ambientLightColor: '#f0f9ff',
    directionalLightColor: '#e0f2fe',
    particleColors: ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc'],
  },
  crystal: {
    name: '幻彩水晶礦山',
    subtitle: 'Crystal Geode Mountain',
    icon: '💎',
    background: '#0a0614',
    potColor: '#150d28',
    potRimColor: '#c084fc',
    groundColor: '#faf5ff',
    trunkColor: '#331b54',
    foliagePrimary: '#4c1d95',    // 深邃暗晶
    foliageSecondary: '#581c87',  // 濃夜紫晶
    foliageAccent: '#6b21a8',     // 紫晶主脈
    darkModulePrimary: '#4c1d95',
    darkModuleSecondary: '#581c87',
    darkModuleTertiary: '#6b21a8',
    lightModuleColor: '#faf5ff',
    finderPatternColor: '#3b0764',
    finderAccentColor: '#4c1d95',
    accentColor: '#a855f7',
    ambientLightColor: '#f3e8ff',
    directionalLightColor: '#f3e8ff',
    particleColors: ['#c77dff', '#e0aaff', '#9d4edd', '#ffffff'],
  },
  zen: {
    name: '日式枯山水苔玉',
    subtitle: 'Zen Moss Garden',
    icon: '🪨',
    background: '#0d130e',
    potColor: '#1f2b20',
    potRimColor: '#4ade80',
    groundColor: '#f7fee7',
    trunkColor: '#2e3a2f',
    foliagePrimary: '#14532d',    // 幽谷深苔
    foliageSecondary: '#064e3b',  // 墨綠古苔
    foliageAccent: '#1c3d18',     // 沉石蒼苔
    darkModulePrimary: '#14532d',
    darkModuleSecondary: '#064e3b',
    darkModuleTertiary: '#1c3d18',
    lightModuleColor: '#f7fee7',
    finderPatternColor: '#052e16',
    finderAccentColor: '#14532d',
    accentColor: '#22c55e',
    ambientLightColor: '#f7fafc',
    directionalLightColor: '#fffaf0',
    particleColors: ['#22c55e', '#16a34a', '#86efac'],
  },
};

export function getThemeConfig(theme: ThemeType): ThemeColors {
  return THEME_CONFIGS[theme] || THEME_CONFIGS.sakura;
}
