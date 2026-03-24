export const COLORS = {
  // Brand
  blue: '#2563EB',
  blueDark: '#1E40AF',
  green: '#58CC02',
  greenDark: '#46A302',
  yellow: '#FFD700',
  orange: '#FF9600',
  red: '#FF4B4B',

  // Basics
  white: '#FFFFFF',
  black: '#000000',
  gray: '#E2E8F0',
  grayDark: '#64748B',
  text: '#000000',
  textSecondary: '#475569',
  bg: '#FFFFFF',
  bgSurface: '#F1F5F9',
  paper: '#FDFCF8',
  paperDark: '#F7F5EE', // For depth
  comicShadow: 'rgba(0,0,0,0.8)',
  accent: '#7C3AED', // Premium purple

  // UI Helpers (Fixing Lints)
  textMuted: '#64748B',
  error: '#FF4B4B',
  success: '#58CC02',
  inputBg: '#F8FAFC',
  border: '#E2E8F0',
  blueLight: '#DBEAFE',
  yellowLight: '#FEF9C3',
  background: '#FFFFFF',

  // Super Premium Action Colors
  zap: '#FACC15',
  pow: '#EF4444',
  boom: '#7C3AED',
  glow: 'rgba(255, 255, 255, 0.4)',
  gloss: 'rgba(255, 255, 255, 0.15)',
};

export const LAYOUT = {
  maxWidth: 1400, // Increased from 800 for fluid desktop feel
  fullWidth: '100%',
  padding: 24,
  mobilePadding: 16,
  desktopPadding: 40,
  borderRadius: 16,
  borderWidth: 1,
};

// Subtle, modern shadow configurations inspired by polished apps
export const SHADOWS = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const STYLES = {
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9', // Subtle gray border
    borderRadius: 16,
    ...SHADOWS.md,
  },
  cardSubtle: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
  },
  buttonShadow: {
    position: 'absolute' as 'absolute',
    borderRadius: 16,
    borderWidth: 0, // No aggressive borders on buttons by default
    backgroundColor: 'transparent',
  },
  premiumShadow: {
    ...SHADOWS.md,
  },
  eliteShadow: {
    ...SHADOWS.lg,
  }
};
