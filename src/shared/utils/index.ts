// shared/utils/index.ts
// Shared utility functions

import { KPIData, ChartData, ListData } from '../types';

// ============================================
// Data Validation
// ============================================

/**
 * Validates KPI data structure
 */
export function isValidKPIData(data: any): data is KPIData[] {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return false;
  
  return data.every(item => 
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.value === 'string' &&
    typeof item.icon === 'string'
  );
}

/**
 * Validates Chart data structure
 */
export function isValidChartData(data: any): data is ChartData {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.labels) || data.labels.length === 0) return false;
  if (!Array.isArray(data.datasets) || data.datasets.length === 0) return false;
  
  return data.datasets.every((ds: any) => 
    Array.isArray(ds.data) && ds.data.length > 0
  );
}

/**
 * Validates List data structure
 */
export function isValidListData(data: any): data is ListData {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return false;
  
  return data.every(item => 
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.value === 'number'
  );
}

// ============================================
// Data Transformation
// ============================================

/**
 * Transforms backend KPI response to frontend format
 */
export function transformKPIResponse(response: any): KPIData[] {
  if (!Array.isArray(response)) {
    console.error('Invalid KPI response format');
    return [];
  }
  
  return response.map(item => ({
    id: item.id || '',
    title: item.title || 'Unknown',
    value: item.value || '0',
    delta: item.delta || '',
    up: item.up ?? true,
    icon: item.icon || 'alert_triangle',
  }));
}

/**
 * Transforms backend chart response to frontend format
 */
export function transformChartResponse(response: any): ChartData {
  return {
    id: response.id || 'chart',
    title: response.title || 'Chart',
    labels: response.labels || [],
    datasets: response.datasets || [],
  };
}

/**
 * Transforms backend list response to frontend format
 */
export function transformListResponse(response: any): ListData {
  if (!Array.isArray(response)) {
    console.error('Invalid list response format');
    return [];
  }
  
  return response.map(item => ({
    id: item.id || '',
    name: item.name || 'Unknown',
    subtitle: item.subtitle || '',
    value: Number(item.value) || 0,
    unit: item.unit || '',
  }));
}

// ============================================
// Formatting
// ============================================

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number with thousand separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Formats a percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a date
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// ============================================
// Color Utilities
// ============================================

/**
 * Gets color for trend (positive/negative)
 */
export function getTrendColor(isPositive: boolean, isDarkMode: boolean = false): string {
  if (isPositive) {
    return isDarkMode ? 'text-green-400' : 'text-green-600';
  }
  return isDarkMode ? 'text-red-400' : 'text-red-600';
}

/**
 * Gets background color variant
 */
export function getBgColorVariant(variant: string): string {
  const colors: Record<string, string> = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-cyan-500',
  };
  
  return colors[variant] || colors.primary;
}

// ============================================
// Array Utilities
// ============================================

/**
 * Groups array items by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sorts array by a numeric key
 */
export function sortByValue<T extends { value: number }>(
  array: T[], 
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...array].sort((a, b) => 
    order === 'asc' ? a.value - b.value : b.value - a.value
  );
}

/**
 * Gets top N items from array
 */
export function getTopN<T>(array: T[], n: number): T[] {
  return array.slice(0, n);
}

// ============================================
// Chart Utilities
// ============================================

/**
 * Calculates percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Generates chart labels for date range
 */
export function generateDateLabels(days: number, format: 'D' | 'MMM D' = 'D'): string[] {
  const labels: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    if (format === 'D') {
      labels.push(`D${days - i}`);
    } else {
      labels.push(formatDate(date, 'short'));
    }
  }
  
  return labels;
}

/**
 * Aggregates data by time period
 */
export function aggregateByPeriod(
  data: Array<{ date: string; value: number }>,
  period: 'day' | 'week' | 'month'
): Array<{ label: string; value: number }> {
  // Group by period
  const grouped = data.reduce((acc, item) => {
    const date = new Date(item.date);
    let key: string;
    
    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const week = Math.floor(date.getDate() / 7) + 1;
        key = `Week ${week}`;
        break;
      case 'month':
        key = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
        break;
    }
    
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += item.value;
    
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}

// ============================================
// Error Handling
// ============================================

/**
 * Extracts error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unknown error occurred';
}

/**
 * Checks if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('network') || 
         message.includes('fetch') || 
         message.includes('connection');
}

// ============================================
// Local Storage Utilities
// ============================================

/**
 * Safely gets item from localStorage
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return defaultValue;
  }
}

/**
 * Safely sets item to localStorage
 */
export function setToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
    return false;
  }
}

/**
 * Removes item from localStorage
 */
export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
    return false;
  }
}

// ============================================
// Debounce & Throttle
// ============================================

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}