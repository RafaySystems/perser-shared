import { type ClassValue, clsx } from 'clsx';
import type React from 'react';
import { twMerge } from 'tailwind-merge';
import { createCompatThemeBase } from '../../compat/theme-helpers';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const fallbackTheme = createCompatThemeBase('light');

/**
 * Convert MUI-like sx (object | function | array from combineSx) into a plain
 * React CSSProperties object. Arrays must be flattened — spreading them into
 * style={{...}} throws "Cannot set indexed properties on this object".
 */
function resolveOne(sx: unknown): React.CSSProperties | undefined {
  if (!sx) return undefined;

  if (typeof sx === 'function') {
    const value = (sx as (theme: unknown) => unknown)(fallbackTheme);
    return resolveOne(value);
  }

  if (Array.isArray(sx)) {
    return Object.assign({}, ...sx.map(resolveOne).filter(Boolean));
  }

  if (typeof sx === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(sx as Record<string, unknown>)) {
      if (typeof value === 'function') {
        // Nested theme callbacks e.g. backgroundColor: (theme) => ...
        const resolved = (value as (theme: unknown) => unknown)(fallbackTheme);
        if (resolved !== undefined && resolved !== null && typeof resolved !== 'object') {
          out[key] = resolved;
        } else if (resolved && typeof resolved === 'object' && !Array.isArray(resolved)) {
          out[key] = resolved;
        }
      } else if (value !== undefined) {
        out[key] = value;
      }
    }
    return out as React.CSSProperties;
  }

  return undefined;
}

export function toStyle(sx: unknown): React.CSSProperties | undefined {
  return resolveOne(sx);
}
