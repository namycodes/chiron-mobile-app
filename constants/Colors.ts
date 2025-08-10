/**
 * Chiron Health App Color Palette
 * Professional medical app colors with accessibility in mind
 */

// Primary Colors - Medical/Health Theme
const primaryLight = '#ea4c89';
const primaryDark = '#A4CFDE'; // Lighter blue for dark mode
const secondaryLight = '#4CAF50'; // Health green
const secondaryDark = '#81C784'; // Lighter green for dark mode

// Accent Colors
const accentLight = '#FF6B6B'; // Emergency red
const accentDark = '#FF8A80'; // Lighter red for dark mode
const warningLight = '#FFA726'; // Warning orange
const warningDark = '#FFB74D'; // Lighter orange for dark mode

export const grayLightBorder = "#ddd"
export const grayMediumBorder = "#999"
export const grayDarkBorder = "#666"
export const Colors = {
  light: {
    // Base colors
    text: '#1A1A1A',
    textSecondary: '#666666',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F5F5F5',
    
    // Primary theme
    primary: primaryLight,
    primaryLight: '#5DADE2',
    primaryDark: '#1B4F72',
    secondary: secondaryLight,
    secondaryLight: '#A5D6A7',
    secondaryDark: '#388E3C',
    
    // Accent colors
    accent: accentLight,
    warning: warningLight,
    error: '#F44336',
    success: '#4CAF50',
    info: '#2196F3',
    
    // Navigation
    tint: primaryLight,
    tabIconDefault: '#9E9E9E',
    tabIconSelected: primaryLight,
    
    // UI Elements
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    shadow: '#000000',
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    
    // Status colors
    verified: '#4CAF50',
    pending: '#FF9800',
    cancelled: '#F44336',
    completed: '#2196F3',
  },
  dark: {
    // Base colors
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    surface: '#1E1E1E',
    surfaceSecondary: '#2D2D2D',
    
    // Primary theme
    primary: primaryDark,
    primaryLight: '#85C1E9',
    primaryDark: '#154360',
    secondary: secondaryDark,
    secondaryLight: '#C8E6C9',
    secondaryDark: '#2E7D32',
    
    // Accent colors
    accent: accentDark,
    warning: warningDark,
    error: '#EF5350',
    success: '#66BB6A',
    info: '#42A5F5',
    
    // Navigation
    tint: primaryDark,
    tabIconDefault: '#757575',
    tabIconSelected: primaryDark,
    
    // UI Elements
    border: '#373737',
    borderLight: '#2D2D2D',
    shadow: '#000000',
    disabled: '#616161',
    placeholder: '#757575',
    
    // Status colors
    verified: '#66BB6A',
    pending: '#FFB74D',
    cancelled: '#EF5350',
    completed: '#42A5F5',
  },
};

// Semantic color mapping for different user roles
export const RoleColors = {
  patient: {
    primary: '#2E86AB',
    secondary: '#A4CFDE',
    accent: '#E3F2FD',
  },
  health_personnel: {
    primary: '#4CAF50',
    secondary: '#81C784',
    accent: '#E8F5E8',
  },
  pharmacy: {
    primary: '#9C27B0',
    secondary: '#BA68C8',
    accent: '#F3E5F5',
  },
};
