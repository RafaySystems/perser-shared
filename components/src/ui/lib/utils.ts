import { type ClassValue, clsx } from 'clsx';
import type React from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function toStyle(sx: unknown): React.CSSProperties | undefined {
  if (!sx) return undefined;
  const fallbackTheme = {
    spacing: (n: number): string => `${n * 8}px`,
    shape: { borderRadius: 4 },
    palette: {
      mode: 'light',
      text: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.54)' },
      common: { white: '#ffffff', black: '#000000' },
      background: { default: '#ffffff', paper: '#ffffff', lighter: '#f3f4f6' },
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
      error: { main: '#d32f2f' },
      warning: { main: '#ed6c02' },
      info: { main: '#0288d1' },
      success: { main: '#2e7d32' },
      action: {
        hoverOpacity: 0.08,
        active: 'rgba(0, 0, 0, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.26)',
      },
      grey: { 50: '#fafafa', 100: '#f5f5f5', 300: '#e0e0e0', 500: '#9e9e9e', 600: '#757575', 700: '#616161' },
      designSystem: { grey: {} },
    },
    shadows: ['none', '0 1px 2px rgba(0,0,0,0.08)'],
    typography: {
      body1: { fontSize: '1rem', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' },
      body2: { fontSize: '0.875rem', lineHeight: 1.43, fontFamily: 'Inter, sans-serif' },
    },
  };
  if (typeof sx === 'function') {
    const value = (sx as (theme: unknown) => unknown)(fallbackTheme);
    if (typeof value === 'object' && value !== null) return value as React.CSSProperties;
    return undefined;
  }
  if (typeof sx === 'object') return sx as React.CSSProperties;
  return undefined;
}
