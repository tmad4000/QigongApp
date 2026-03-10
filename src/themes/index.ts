export type DesignVariant = 'jacob-original' | 'zen-flow' | 'zen-flow-light' | 'ember' | 'serenity';

export interface Theme {
  name: string;
  description: string;
  bg: string;
  bgSecondary: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentText: string;
  badge: string;
  badgeText: string;
  headerBg: string;
  headerText: string;
  fontFamily?: string;
}

export const themes: Record<DesignVariant, Theme> = {
  // Jacob's original wireframe: clean, minimal, light
  'jacob-original': {
    name: 'Qigong App',
    description: 'Clean & minimal',
    bg: '#FFFFFF',
    bgSecondary: '#F5F5F5',
    card: '#F0F0F0',
    cardBorder: '#E0E0E0',
    text: '#1A1A1A',
    textSecondary: '#555555',
    textMuted: '#999999',
    accent: '#333333',
    accentText: '#FFFFFF',
    badge: '#E8E8E8',
    badgeText: '#666666',
    headerBg: '#FFFFFF',
    headerText: '#1A1A1A',
  },

  // Calm-inspired: dark, atmospheric, nature imagery
  'zen-flow': {
    name: 'Qi Flow',
    description: 'Calm & atmospheric',
    bg: '#0D1117',
    bgSecondary: '#161B22',
    card: '#1C2333',
    cardBorder: '#2D3748',
    text: '#E6EDF3',
    textSecondary: '#8B949E',
    textMuted: '#484F58',
    accent: '#6EC6A7',
    accentText: '#0D1117',
    badge: 'rgba(110, 198, 167, 0.15)',
    badgeText: '#6EC6A7',
    headerBg: 'transparent',
    headerText: '#E6EDF3',
  },

  // Calm-inspired light: misty, warm, nature
  'zen-flow-light': {
    name: 'Qi Flow',
    description: 'Calm & light',
    bg: '#F7F5F0',
    bgSecondary: '#EFECE5',
    card: '#FFFFFF',
    cardBorder: '#E2DDD4',
    text: '#2C3A2E',
    textSecondary: '#5E6E60',
    textMuted: '#9AA89C',
    accent: '#4A8E6F',
    accentText: '#FFFFFF',
    badge: 'rgba(74, 142, 111, 0.12)',
    badgeText: '#4A8E6F',
    headerBg: 'transparent',
    headerText: '#2C3A2E',
  },

  // Breathwrk-inspired: bold, colorful, energetic
  ember: {
    name: 'Qi',
    description: 'Bold & energetic',
    bg: '#FFF8F0',
    bgSecondary: '#FFF0E0',
    card: '#FFFFFF',
    cardBorder: '#FFE0C0',
    text: '#2D1B00',
    textSecondary: '#8B6914',
    textMuted: '#C4A05A',
    accent: '#FF6B35',
    accentText: '#FFFFFF',
    badge: '#FFF0E0',
    badgeText: '#FF6B35',
    headerBg: '#FF6B35',
    headerText: '#FFFFFF',
  },

  // Serenity: clean, modern, spacious
  serenity: {
    name: 'Serenity',
    description: 'Clean & modern',
    bg: '#F2F4F7',
    bgSecondary: '#FFFFFF',
    card: '#FFFFFF',
    cardBorder: 'transparent',
    text: '#101828',
    textSecondary: '#475467',
    textMuted: '#98A2B3',
    accent: '#101828',
    accentText: '#FFFFFF',
    badge: '#F2F4F7',
    badgeText: '#344054',
    headerBg: '#FFFFFF',
    headerText: '#101828',
  },
};
