/**
 * MUI-shaped theme helpers for the Tailwind/shadcn compat layer.
 * No @mui/* dependency — enough for dashboards toolbars/panels that still
 * call theme.breakpoints / theme.containerQueries / theme.spacing.
 */

export const BREAKPOINT_VALUES = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINT_VALUES;

function resolveValue(values: Record<string, number>, key: string | number): number {
  return typeof key === 'number' ? key : values[key];
}

export function createSpacing() {
  return (...args: Array<number | string>): string => {
    if (args.length === 0) return '0px';
    return args
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        return `${arg * 8}px`;
      })
      .join(' ');
  };
}

export function createBreakpoints(values: Record<string, number> = BREAKPOINT_VALUES) {
  const unit = 'px';
  const step = 5;
  const keys = Object.keys(values);
  const up = (key: string | number): string => {
    return `@media (min-width:${resolveValue(values, key)}${unit})`;
  };
  const down = (key: string | number): string => {
    return `@media (max-width:${resolveValue(values, key) - step / 100}${unit})`;
  };
  return {
    values,
    keys,
    up,
    down,
    between: (start: string | number, end: string | number): string =>
      `@media (min-width:${resolveValue(values, start)}${unit}) and (max-width:${resolveValue(values, end) - step / 100}${unit})`,
    only: (key: string): string => {
      const idx = keys.indexOf(key);
      if (idx + 1 < keys.length) {
        return `@media (min-width:${values[key]}${unit}) and (max-width:${values[keys[idx + 1]] - step / 100}${unit})`;
      }
      return up(key);
    },
  };
}

export function createContainerQueries(values: Record<string, number> = BREAKPOINT_VALUES) {
  const unit = 'px';
  const step = 5;
  const make = (name?: string) => {
    const prefix = name ? `@container ${name}` : '@container';
    const up = (key: string | number): string => `${prefix} (min-width:${resolveValue(values, key)}${unit})`;
    const down = (key: string | number): string =>
      `${prefix} (max-width:${resolveValue(values, key) - step / 100}${unit})`;
    const between = (start: string | number, end: string | number): string =>
      `${prefix} (min-width:${resolveValue(values, start)}${unit}) and (max-width:${resolveValue(values, end) - step / 100}${unit})`;
    return { up, down, between, values };
  };
  const cq = ((name?: string) => make(typeof name === 'string' ? name : undefined)) as ReturnType<typeof make> &
    ((name?: string) => ReturnType<typeof make>);
  return Object.assign(cq, make());
}

export function createBasePalette(mode: 'light' | 'dark' = 'light') {
  const dark = mode === 'dark';
  return {
    mode,
    text: dark
      ? { primary: 'rgba(255, 255, 255, 0.9)', secondary: 'rgba(255, 255, 255, 0.6)' }
      : { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.54)' },
    common: { white: '#ffffff', black: '#000000' },
    // Prefer CSS vars so host shadcn themes control chrome; fallbacks for non-Tailwind hosts.
    divider: 'hsl(var(--border) / 1)',
    // Transparent defaults so host apps (e.g. dark DSX console) keep their chrome.
    background: dark
      ? { default: 'transparent', paper: 'hsl(var(--card))', lighter: 'hsl(var(--muted))' }
      : { default: 'transparent', paper: 'hsl(var(--card))', lighter: 'hsl(var(--muted))' },
    primary: { main: dark ? '#60a5fa' : '#1976d2' },
    secondary: { main: '#9c27b0' },
    error: { main: '#d32f2f' },
    warning: { main: '#ed6c02' },
    info: { main: '#0288d1' },
    success: { main: '#2e7d32' },
    action: {
      hoverOpacity: 0.08,
      active: dark ? 'rgba(255, 255, 255, 0.54)' : 'rgba(0, 0, 0, 0.54)',
      disabled: dark ? 'rgba(255, 255, 255, 0.26)' : 'rgba(0, 0, 0, 0.26)',
    },
    grey: dark
      ? {
          50: '#18181b',
          100: '#27272a',
          300: '#52525b',
          500: '#a1a1aa',
          600: '#d4d4d8',
          700: '#e4e4e7',
        }
      : {
          50: '#fafafa',
          100: '#f5f5f5',
          300: '#e0e0e0',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
        },
    designSystem: { grey: {} as Record<string, string> },
  };
}

/** Theme object used by createTheme() and by toStyle() for sx callbacks. */
export function createCompatThemeBase(mode: 'light' | 'dark' = 'light') {
  return {
    spacing: createSpacing(),
    breakpoints: createBreakpoints(),
    containerQueries: createContainerQueries(),
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      body1: { fontSize: '1rem', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' },
      body2: { fontSize: '0.875rem', lineHeight: 1.43, fontFamily: 'Inter, sans-serif' },
    },
    palette: createBasePalette(mode),
    shadows: ['none', '0 1px 2px rgba(0,0,0,0.08)'],
  };
}
