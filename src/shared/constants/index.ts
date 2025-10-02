
// shared/constants/index.ts
// Global constants and configuration

// ============================================
// Color Palettes
// ============================================

export const COLOR_PALETTES = {
  // Primary brand colors
  orange: ['#ff7a00', '#ff9d3d', '#ffb26b', '#ffc69a', '#ffe0c7'],
  
  // Alternative palettes
  blue: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
  green: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
  red: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
  
  // Neutral colors
  gray: ['#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'],
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// ============================================
// Chart Configuration
// ============================================

export const CHART_CONFIG = {
  // Default colors (using orange palette)
  defaultColors: COLOR_PALETTES.orange,
  
  // Chart dimensions
  defaultHeight: 256, // 64 * 4 = h-64 in Tailwind
  compactHeight: 112, // 28 * 4 = h-28 in Tailwind
  
  // Animation
  animationDuration: 300,
  
  // Grid
  gridStrokeDashArray: '3 3',
  
  // Pie chart
  pieInnerRadius: 50,
  pieOuterRadius: 80,
  piePaddingAngle: 4,
  
  // Line chart
  lineStrokeWidth: 2,
  
  // Bar chart
  barRadius: [6, 6, 0, 0] as [number, number, number, number],
} as const;

// ============================================
// KPI Configuration
// ============================================

export const KPI_CONFIG = {
  // Variants
  variants: {
    full: {
      padding: 'p-6',
      iconSize: 'h-6 w-6',
      iconBoxSize: 'h-12 w-12',
      valueSize: 'text-2xl',
      titleSize: 'text-sm',
      deltaSize: 'text-sm',
    },
    compact: {
      padding: 'p-3',
      iconSize: 'h-4 w-4',
      iconBoxSize: 'h-8 w-8',
      valueSize: 'text-xl',
      titleSize: 'text-xs',
      deltaSize: 'text-xs',
    },
  },
  
  // Grid columns defaults
  defaultColumns: {
    sm: 2,
    md: 2,
    lg: 4,
    xl: 4,
  },
  
  // Skeleton loading count
  skeletonCount: 4,
} as const;

// ============================================
// API Configuration
// ============================================

export const API_CONFIG = {
  // Base URLs - override in environment variables
  baseUrl: process.env.REACT_APP_API_URL || '/api',
  
  // Timeouts
  timeout: 30000, // 30 seconds
  
  // Retry
  maxRetries: 2,
  retryDelay: 1000, // 1 second
  
  // Cache
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  
  // Headers
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
} as const;

// ============================================
// Pagination
// ============================================

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  maxPagesShown: 5,
} as const;

// ============================================
// Date/Time Configuration
// ============================================

export const DATE_CONFIG = {
  // Formats
  formats: {
    short: 'MMM D',
    long: 'MMMM D, YYYY',
    time: 'h:mm A',
    datetime: 'MMM D, YYYY h:mm A',
  },
  
  // Common periods
  periods: {
    today: 0,
    yesterday: 1,
    last7Days: 7,
    last14Days: 14,
    last30Days: 30,
    last90Days: 90,
  },
} as const;

// ============================================
// Animation & Transitions
// ============================================

export const ANIMATION_CONFIG = {
  // Durations (in ms)
  fast: 150,
  normal: 300,
  slow: 500,
  
  // Easing functions
  easing: {
    default: 'ease-in-out',
    in: 'ease-in',
    out: 'ease-out',
    linear: 'linear',
  },
  
  // Tailwind transition classes
  transition: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },
} as const;

// ============================================
// Breakpoints (Tailwind defaults)
// ============================================

export const BREAKPOINTS = {
  sm: 640,   // Small devices
  md: 768,   // Medium devices
  lg: 1024,  // Large devices
  xl: 1280,  // Extra large devices
  '2xl': 1536, // 2X Extra large devices
} as const;

// ============================================
// Icon Configuration
// ============================================

export const ICON_CONFIG = {
  sizes: {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  },
  
  defaultSize: 'h-5 w-5',
} as const;

// ============================================
// Loading States
// ============================================

export const LOADING_CONFIG = {
  // Skeleton animation
  skeletonAnimation: 'animate-pulse',
  
  // Loading messages
  messages: {
    loading: 'Loading...',
    error: 'Error loading data',
    noData: 'No data available',
    retry: 'Click to retry',
  },
  
  // Spinner sizes
  spinnerSizes: {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  },
} as const;

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  timeout: 'Request timed out. Please try again.',
  unauthorized: 'You are not authorized to access this resource.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
  unknown: 'An unknown error occurred.',
  validation: 'Validation error. Please check your input.',
} as const;

// ============================================
// Success Messages
// ============================================

export const SUCCESS_MESSAGES = {
  saved: 'Successfully saved',
  updated: 'Successfully updated',
  deleted: 'Successfully deleted',
  created: 'Successfully created',
} as const;

// ============================================
// Validation Rules
// ============================================

export const VALIDATION_RULES = {
  // String length
  minLength: {
    name: 2,
    email: 5,
    password: 8,
  },
  
  maxLength: {
    name: 50,
    email: 100,
    description: 500,
  },
  
  // Patterns
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-()]+$/,
    url: /^https?:\/\/.+/,
  },
} as const;

// ============================================
// Feature Flags
// ============================================

export const FEATURE_FLAGS = {
  enableDarkMode: true,
  enableNotifications: true,
  enableExport: true,
  enableRealTimeUpdates: false,
  enableAdvancedFilters: true,
} as const;

// ============================================
// Local Storage Keys
// ============================================

export const STORAGE_KEYS = {
  theme: 'app_theme',
  language: 'app_language',
  preferences: 'user_preferences',
  recentSearches: 'recent_searches',
  dashboardLayout: 'dashboard_layout',
} as const;

// ============================================
// Routes (if using React Router)
// ============================================

export const ROUTES = {
  home: '/',
  overview: '/overview',
  summary: '/summary',
  analytics: '/analytics',
  reports: '/reports',
  settings: '/settings',
} as const;

// ============================================
// Z-Index Layers
// ============================================

export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
} as const;

// ============================================
// Export All
// ============================================

export const CONSTANTS = {
  COLOR_PALETTES,
  CHART_CONFIG,
  KPI_CONFIG,
  API_CONFIG,
  PAGINATION_CONFIG,
  DATE_CONFIG,
  ANIMATION_CONFIG,
  BREAKPOINTS,
  ICON_CONFIG,
  LOADING_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  FEATURE_FLAGS,
  STORAGE_KEYS,
  ROUTES,
  Z_INDEX,
} as const;