import type { ThemeColors, ThemeType } from '../types';

export const THEME_CONFIGS: Record<ThemeType, ThemeColors> = {
  sakura: {
    name: '春櫻魔法樹',
    subtitle: 'Spring Sakura Tree',
    icon: '🌸',
    background: '#160d16',
    potColor: '#2b1d28',
    potRimColor: '#d8829d',
    groundColor: '#f7edf0',
    trunkColor: '#4a2c2a',
    foliagePrimary: '#f472b6',    // 櫻花粉
    foliageSecondary: '#fbcfe8',  // 粉白花苞
    foliageAccent: '#ec4899',     // 濃艷桃紅
    darkModulePrimary: '#f472b6',
    darkModuleSecondary: '#fbcfe8',
    darkModuleTertiary: '#ec4899',
    lightModuleColor: '#f7edf0',
    finderPatternColor: '#3a202c',
    finderAccentColor: '#f472b6',
    accentColor: '#f472b6',
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
    groundColor: '#e6f4ea',
    trunkColor: '#3d2b1f',
    foliagePrimary: '#15803d',    // 翠綠松針
    foliageSecondary: '#16a34a',  // 嫩綠新芽
    foliageAccent: '#22c55e',     // 晶亮綠光
    darkModulePrimary: '#15803d',
    darkModuleSecondary: '#16a34a',
    darkModuleTertiary: '#22c55e',
    lightModuleColor: '#e6f4ea',
    finderPatternColor: '#172e21',
    finderAccentColor: '#22c55e',
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
    groundColor: '#faebd7',
    trunkColor: '#45200e',
    foliagePrimary: '#dc2626',    // 楓紅
    foliageSecondary: '#ea580c',  // 橙金
    foliageAccent: '#f59e0b',     // 金黃葉尖
    darkModulePrimary: '#dc2626',
    darkModuleSecondary: '#ea580c',
    darkModuleTertiary: '#f59e0b',
    lightModuleColor: '#faebd7',
    finderPatternColor: '#3b1807',
    finderAccentColor: '#f59e0b',
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
    groundColor: '#eef6fc',
    trunkColor: '#2a3b4c',
    foliagePrimary: '#93c5fd',    // 冰晶淡藍
    foliageSecondary: '#ffffff',  // 純白積雪
    foliageAccent: '#38bdf8',     // 晶瑩藍光
    darkModulePrimary: '#93c5fd',
    darkModuleSecondary: '#ffffff',
    darkModuleTertiary: '#38bdf8',
    lightModuleColor: '#eef6fc',
    finderPatternColor: '#14253a',
    finderAccentColor: '#38bdf8',
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
    groundColor: '#1a1230',
    trunkColor: '#331b54',
    foliagePrimary: '#9d4edd',    // 艷麗紫晶
    foliageSecondary: '#c77dff',  // 晶亮粉紫
    foliageAccent: '#e0aaff',     // 耀眼晶尖
    darkModulePrimary: '#9d4edd',
    darkModuleSecondary: '#6a0dad',
    darkModuleTertiary: '#c77dff',
    lightModuleColor: '#1a142e',
    finderPatternColor: '#251340',
    finderAccentColor: '#c084fc',
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
    groundColor: '#e9e5d9',
    trunkColor: '#2e3a2f',
    foliagePrimary: '#2d5a27',    // 墨綠苔玉
    foliageSecondary: '#1c3d18',  // 深邃苔色
    foliageAccent: '#3c4039',     // 河卵石
    darkModulePrimary: '#2d5a27',
    darkModuleSecondary: '#1c3d18',
    darkModuleTertiary: '#3c4039',
    lightModuleColor: '#dfd9c8',
    finderPatternColor: '#2b2d2f',
    finderAccentColor: '#4ade80',
    accentColor: '#22c55e',
    ambientLightColor: '#f7fafc',
    directionalLightColor: '#fffaf0',
    particleColors: ['#22c55e', '#16a34a', '#86efac'],
  },
};

export function getThemeConfig(theme: ThemeType): ThemeColors {
  return THEME_CONFIGS[theme] || THEME_CONFIGS.sakura;
}
