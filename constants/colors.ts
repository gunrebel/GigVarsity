import { useThemeStore } from '@/store/themeStore';

export const lightPalette = {
  primary: '#4F46E5',
  secondary: '#7C3AED',
  accent: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  background: '#F9FAFB',
  card: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

export const darkPalette = {
  primary: '#6366F1', // slightly lighter for dark mode
  secondary: '#8B5CF6',
  accent: '#FBBF24',
  success: '#34D399',
  danger: '#F87171',
  background: '#111827', // dark background
  card: '#1F2937', // slightly lighter dark card
  textPrimary: '#FFFFFF', // pure white
  textSecondary: '#9CA3AF', // light gray
  border: '#374151', // dark border
};

export const palette = lightPalette; // default fallback

export function useThemePalette() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return isDarkMode ? darkPalette : lightPalette;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
