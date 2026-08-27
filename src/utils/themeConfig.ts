import type { ThemeColors, ThemeType, ZenSubTheme, CrystalSubTheme } from '../types';

export const ZEN_THEMES: Record<ZenSubTheme, ThemeColors> = {
  moss: {
    name: '翠微苔玉 (Classic Moss)',
    description: '細緻白砂耙紋與圓潤深綠苔玉球，最純正的日式侘寂禪境。',
    background: '#0d130e',
    groundColor: '#e9e5d9',
    groundSpecular: '#f8f6f0',
    darkModulePrimary: '#2d5a27',      // 濃綠苔玉
    darkModuleSecondary: '#1c3d18',    // 深墨綠苔玉
    darkModuleTertiary: '#3c4039',     // 河卵石
    lightModuleColor: '#dfd9c8',
    finderPatternColor: '#2b2d2f',     // 古樸青石塔
    finderAccentColor: '#4f7d43',
    accentColor: '#38a169',
    ambientLightColor: '#f7fafc',
    directionalLightColor: '#fffaf0',
    particleColors: ['#38a169', '#48bb78', '#276749', '#68d391'],
  },
  'autumn-moss': {
    name: '秋楓幽境 (Autumn Zen)',
    description: '夕陽映照下的金黃與焦糖色苔蘚，伴隨隨風輕拂的落楓。',
    background: '#160e0a',
    groundColor: '#e8dcce',
    groundSpecular: '#faf5ee',
    darkModulePrimary: '#b45309',      // 焦糖秋苔
    darkModuleSecondary: '#78350f',    // 赭石深色
    darkModuleTertiary: '#451a03',
    lightModuleColor: '#dfcfbe',
    finderPatternColor: '#3c2415',
    finderAccentColor: '#d97706',
    accentColor: '#f59e0b',
    ambientLightColor: '#fffbeb',
    directionalLightColor: '#ffedd5',
    particleColors: ['#f59e0b', '#d97706', '#b45309', '#ef4444'],
  },
  'sakura-moss': {
    name: '落櫻禪院 (Sakura Moss)',
    description: '春櫻紛飛飄落在青綠苔石間，淡雅清新的春日禪意。',
    background: '#140f14',
    groundColor: '#f4ede9',
    groundSpecular: '#fff8f6',
    darkModulePrimary: '#385e34',      // 青翠苔石
    darkModuleSecondary: '#c06c84',    // 櫻花粉石
    darkModuleTertiary: '#284225',
    lightModuleColor: '#ebdcd7',
    finderPatternColor: '#2f2b30',
    finderAccentColor: '#f472b6',
    accentColor: '#ec4899',
    ambientLightColor: '#fdf2f8',
    directionalLightColor: '#fff1f2',
    particleColors: ['#fbcfe8', '#f472b6', '#fda4af', '#f9a8d4'],
  },
};

export const CRYSTAL_THEMES: Record<CrystalSubTheme, ThemeColors> = {
  amethyst: {
    name: '紫微晶簇 (Amethyst Geode)',
    description: '深邃高貴的紫水晶多面稜柱，散發神祕魔力的幾何礦脈。',
    background: '#0a0614',
    groundColor: '#120e20',
    groundSpecular: '#2a1f44',
    darkModulePrimary: '#9d4edd',      // 艷麗紫晶
    darkModuleSecondary: '#6a0dad',    // 深沉紫晶
    darkModuleTertiary: '#c77dff',     // 耀眼晶尖
    lightModuleColor: '#1a142e',
    finderPatternColor: '#e0aaff',
    finderAccentColor: '#7b2cbf',
    accentColor: '#a855f7',
    ambientLightColor: '#e9d5ff',
    directionalLightColor: '#f3e8ff',
    particleColors: ['#c77dff', '#e0aaff', '#9d4edd', '#ffffff'],
  },
  emerald: {
    name: '祖母綠原礦 (Emerald Matrix)',
    description: '晶瑩透亮的翠綠寶石礦柱，如同地底深處沉睡的生命脈動。',
    background: '#04110d',
    groundColor: '#0a1c16',
    groundSpecular: '#13392c',
    darkModulePrimary: '#10b981',      // 璀璨翡翠
    darkModuleSecondary: '#047857',    // 深邃碧玉
    darkModuleTertiary: '#34d399',     // 晶亮薄荷
    lightModuleColor: '#0f2921',
    finderPatternColor: '#6ee7b7',
    finderAccentColor: '#059669',
    accentColor: '#10b981',
    ambientLightColor: '#d1fae5',
    directionalLightColor: '#ecfdf5',
    particleColors: ['#34d399', '#6ee7b7', '#a7f3d0', '#ffffff'],
  },
  sapphire: {
    name: '星海藍寶 (Sapphire Star)',
    description: '如深海與銀河般純粹的湛藍晶石，銳利冷冽的現代科技感。',
    background: '#040b17',
    groundColor: '#09152a',
    groundSpecular: '#14294d',
    darkModulePrimary: '#3b82f6',      // 藍寶石
    darkModuleSecondary: '#1d4ed8',    // 皇家深藍
    darkModuleTertiary: '#60a5fa',     // 晶亮天藍
    lightModuleColor: '#0e1f3d',
    finderPatternColor: '#93c5fd',
    finderAccentColor: '#2563eb',
    accentColor: '#3b82f6',
    ambientLightColor: '#dbeafe',
    directionalLightColor: '#eff6ff',
    particleColors: ['#60a5fa', '#93c5fd', '#bfdbfe', '#ffffff'],
  },
  ruby: {
    name: '赤炎紅晶 (Crimson Ruby)',
    description: '熾熱奪目的紅寶石結晶，充滿能量與熱情的燃燒幾何體。',
    background: '#150608',
    groundColor: '#220b0e',
    groundSpecular: '#3e151a',
    darkModulePrimary: '#f43f5e',      // 緋紅寶石
    darkModuleSecondary: '#be123c',    // 深濃石榴紅
    darkModuleTertiary: '#fb7185',     // 晶亮粉紅
    lightModuleColor: '#2f1015',
    finderPatternColor: '#fda4af',
    finderAccentColor: '#e11d48',
    accentColor: '#f43f5e',
    ambientLightColor: '#ffe4e6',
    directionalLightColor: '#fff1f2',
    particleColors: ['#fb7185', '#fda4af', '#f43f5e', '#ffffff'],
  },
  celestial: {
    name: '幻彩星雲 (Celestial Nebula)',
    description: '極光色系的青藍與洋紅幻彩晶石，未來主義的星際基質。',
    background: '#070a14',
    groundColor: '#0e1526',
    groundSpecular: '#1e2c4a',
    darkModulePrimary: '#06b6d4',      // 青藍光芒
    darkModuleSecondary: '#8b5cf6',    // 幻影紫
    darkModuleTertiary: '#ec4899',     // 霓虹桃紅
    lightModuleColor: '#162038',
    finderPatternColor: '#67e8f9',
    finderAccentColor: '#a855f7',
    accentColor: '#06b6d4',
    ambientLightColor: '#cffafe',
    directionalLightColor: '#e0f2fe',
    particleColors: ['#67e8f9', '#c084fc', '#f472b6', '#ffffff'],
  },
};

export function getThemeConfig(
  theme: ThemeType,
  zenSub: ZenSubTheme = 'moss',
  crystalSub: CrystalSubTheme = 'amethyst'
): ThemeColors {
  if (theme === 'zen') {
    return ZEN_THEMES[zenSub] || ZEN_THEMES.moss;
  }
  return CRYSTAL_THEMES[crystalSub] || CRYSTAL_THEMES.amethyst;
}
