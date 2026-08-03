import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Alert as UiAlert } from '../ui/alert';
import { Button as UiButton } from '../ui/button';
import { Dialog as UiDialog, DialogActions as UiDialogActions, DialogContent as UiDialogContent, DialogTitle as UiDialogTitle } from '../ui/dialog';
import { Drawer as UiDrawer } from '../ui/drawer';
import {
  Table as UiTable,
  TableBody as UiTableBody,
  TableCell as UiTableCell,
  TableFooter as UiTableFooter,
  TableHead as UiTableHeadCell,
  TableHeader as UiTableHeader,
  TableRow as UiTableRow,
} from '../ui/table';
import { Tooltip as UiTooltip } from '../ui/tooltip';
import { cn, toStyle } from '../ui/lib/utils';
import {
  BREAKPOINT_VALUES,
  createBreakpoints,
  createCompatThemeBase,
  createContainerQueries,
  createSpacing,
} from './theme-helpers';

type OriginVertical = 'top' | 'center' | 'bottom';
type OriginHorizontal = 'left' | 'center' | 'right';
type Origin = { vertical?: OriginVertical; horizontal?: OriginHorizontal };

function resolveAnchorPoint(
  rect: DOMRect,
  origin: Origin | undefined,
  fallbackVertical: OriginVertical,
  fallbackHorizontal: OriginHorizontal
): { x: number; y: number } {
  const vertical = origin?.vertical ?? fallbackVertical;
  const horizontal = origin?.horizontal ?? fallbackHorizontal;
  const y =
    vertical === 'top' ? rect.top : vertical === 'bottom' ? rect.bottom : rect.top + rect.height / 2;
  const x =
    horizontal === 'left' ? rect.left : horizontal === 'right' ? rect.right : rect.left + rect.width / 2;
  return { x, y };
}

function originTranslate(origin: Origin | undefined, fallbackVertical: OriginVertical, fallbackHorizontal: OriginHorizontal): string {
  const vertical = origin?.vertical ?? fallbackVertical;
  const horizontal = origin?.horizontal ?? fallbackHorizontal;
  const tx = horizontal === 'left' ? '0' : horizontal === 'right' ? '-100%' : '-50%';
  const ty = vertical === 'top' ? '0' : vertical === 'bottom' ? '-100%' : '-50%';
  return `translate(${tx}, ${ty})`;
}

export type PaletteMode = 'light' | 'dark';
export type ThemeOptions = any;
export type SxProps<T = any> = any;
export type Theme = any;
export type Components<T = any> = any;
export interface PaletteOptions {
  [key: string]: any;
}
export interface Palette {
  [key: string]: any;
}
export type SimplePaletteColorOptions = any;
export type ButtonProps = any;
export type ButtonGroupProps = any;
export type DialogProps = any;
export type DialogTitleProps = any;
export type DialogContentProps = any;
export type DrawerProps = any;
export type TableProps = any;
export type TableBodyProps = any;
export type TableHeadProps = any;
export type TableFooterProps = any;
export type TableContainerProps = any;
export type TableRowProps<T = any> = any;
export type Grid2Props<T = any> = any;
export type TableCellProps = any;
export type TextFieldProps = any;
export type SelectProps = any;
export type OutlinedSelectProps = any;
export type BaseSelectProps<T = any> = any;
export type SwitchProps = any;
export type CheckboxProps = any;
export type IconButtonProps = any;
export type MenuProps = any;
export type PopperProps = any;
export type StackProps = any;
export type BoxProps<T = any> = any;
export type FormControlLabelProps = any;
export type CardProps<T = any> = any;
export type CardContentProps = any;
export type CardHeaderProps = any;
export type TabsProps = any;
export type TabProps = any;
export type RadioProps = any;
export type RadioGroupProps = any;
export type SkeletonOwnProps = any;
export type SelectChangeEvent<T = string> = any;
export type ListItemProps<T = any> = any;
export type TooltipProps = any;
export type AutocompleteProps<T = any, M = any, D = any, F = any> = any;
export type UseAutocompleteProps<T = any, M = any, D = any, F = any> = any;

export const alertClasses = {} as any;
export const linkClasses = {} as any;
export const tableSortLabelClasses = {} as any;
export const tooltipClasses = {} as any;
let lastCreatedTheme: Theme | null = null;

export function alpha(color: string, opacity: number): string {
  if (color.startsWith('#')) return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  return color;
}

export function capitalize(value: string): string {
  if (!value) return value;
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function createTheme(options: ThemeOptions = {} as any): Theme {
  const mode = ((options as { palette?: { mode?: PaletteMode } }).palette?.mode ?? 'light') as PaletteMode;
  const baseTheme = createCompatThemeBase(mode);
  const userPalette = ((options as Record<string, any>).palette ?? {}) as Record<string, any>;
  const breakpointValues =
    ((options as Record<string, any>).breakpoints?.values as Record<string, number> | undefined) ?? BREAKPOINT_VALUES;
  const theme = {
    ...baseTheme,
    spacing: createSpacing(),
    palette: {
      ...baseTheme.palette,
      ...userPalette,
      text: { ...baseTheme.palette.text, ...(userPalette.text ?? {}) },
      common: { ...baseTheme.palette.common, ...(userPalette.common ?? {}) },
      background: { ...baseTheme.palette.background, ...(userPalette.background ?? {}) },
      primary: { ...baseTheme.palette.primary, ...(userPalette.primary ?? {}) },
      secondary: { ...baseTheme.palette.secondary, ...(userPalette.secondary ?? {}) },
      error: { ...baseTheme.palette.error, ...(userPalette.error ?? {}) },
      warning: { ...baseTheme.palette.warning, ...(userPalette.warning ?? {}) },
      info: { ...baseTheme.palette.info, ...(userPalette.info ?? {}) },
      success: { ...baseTheme.palette.success, ...(userPalette.success ?? {}) },
      action: { ...baseTheme.palette.action, ...(userPalette.action ?? {}) },
      designSystem: {
        ...baseTheme.palette.designSystem,
        ...(userPalette.designSystem ?? {}),
      },
    },
    typography: {
      ...baseTheme.typography,
      ...((options as Record<string, any>).typography ?? {}),
      body1: {
        ...baseTheme.typography.body1,
        ...(((options as Record<string, any>).typography ?? {}).body1 ?? {}),
      },
      body2: {
        ...baseTheme.typography.body2,
        ...(((options as Record<string, any>).typography ?? {}).body2 ?? {}),
      },
    },
    ...options,
    // Always keep helpers — options may only pass partial breakpoint values.
    breakpoints: createBreakpoints(breakpointValues),
    containerQueries: createContainerQueries(breakpointValues),
  };
  lastCreatedTheme = theme;
  return theme;
}

export function useTheme(): Theme {
  return lastCreatedTheme ?? createTheme();
}

export function useMediaQuery(query: string): boolean {
  // breakpoints.up() returns `@media (...)`; matchMedia wants the query only.
  const normalized = typeof query === 'string' ? query.replace(/^@media\s*/i, '') : query;
  const getMatches = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(normalized).matches;
  };
  const [matches, setMatches] = useState(getMatches);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(normalized);
    const onChange = (): void => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [normalized]);
  return matches;
}

export function useScrollTrigger(options?: { threshold?: number; disableHysteresis?: boolean }): boolean {
  const threshold = options?.threshold ?? 100;
  if (typeof window === 'undefined') return false;
  return window.scrollY > threshold;
}

export function useForkRef(...refs: Array<React.Ref<any> | undefined>) {
  return (instance: unknown): void => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(instance);
        return;
      }
      (ref as React.MutableRefObject<unknown>).current = instance;
    });
  };
}

function resolveSx(sx: unknown): React.CSSProperties | undefined {
  return toStyle(sx);
}

/** MUI system props used by dashboards toolbars — map to CSS instead of leaking as DOM attrs. */
const SYSTEM_PROP_KEYS = new Set([
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'display',
  'flex',
  'flexDirection',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'alignItems',
  'justifyContent',
  'justifyItems',
  'gap',
  'rowGap',
  'columnGap',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'overflow',
  'overflowX',
  'overflowY',
  'whiteSpace',
  'color',
  'bgcolor',
  'backgroundColor',
  'borderRadius',
  'textAlign',
]);

function space(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return `${value * 8}px`;
  return String(value);
}

function systemPropsToStyle(props: Record<string, unknown>): {
  style: React.CSSProperties;
  rest: Record<string, unknown>;
} {
  const style: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!SYSTEM_PROP_KEYS.has(key) || value === undefined) {
      rest[key] = value;
      continue;
    }
    switch (key) {
      case 'p':
        style.padding = space(value);
        break;
      case 'px':
        style.paddingLeft = space(value);
        style.paddingRight = space(value);
        break;
      case 'py':
        style.paddingTop = space(value);
        style.paddingBottom = space(value);
        break;
      case 'pt':
        style.paddingTop = space(value);
        break;
      case 'pb':
        style.paddingBottom = space(value);
        break;
      case 'pl':
        style.paddingLeft = space(value);
        break;
      case 'pr':
        style.paddingRight = space(value);
        break;
      case 'm':
        style.margin = space(value);
        break;
      case 'mx':
        style.marginLeft = space(value);
        style.marginRight = space(value);
        break;
      case 'my':
        style.marginTop = space(value);
        style.marginBottom = space(value);
        break;
      case 'mt':
        style.marginTop = space(value);
        break;
      case 'mb':
        style.marginBottom = space(value);
        break;
      case 'ml':
        style.marginLeft = space(value);
        break;
      case 'mr':
        style.marginRight = space(value);
        break;
      case 'gap':
      case 'rowGap':
      case 'columnGap':
        style[key] = space(value);
        break;
      case 'bgcolor':
        style.backgroundColor = value;
        break;
      default:
        style[key] = value;
    }
  }
  return { style: style as React.CSSProperties, rest };
}

function withAs<T extends HTMLElement = HTMLDivElement>(defaultTag: React.ElementType = 'div'): any {
  return forwardRef<any, any>(function WithAs({ component: Comp = defaultTag, sx, style, className, ...props }, ref) {
    const El = Comp as any;
    const { style: systemStyle, rest } = systemPropsToStyle(props as Record<string, unknown>);
    return (
      <El
        ref={ref}
        style={{ ...systemStyle, ...resolveSx(sx), ...(style as React.CSSProperties) }}
        className={className}
        {...rest}
      />
    );
  });
}

export const Box = withAs();
export const Grid = withAs();
export const Grid2 = withAs();
export const Stack = forwardRef<any, any>(function Stack(
  { direction = 'column', spacing, sx, style, className, alignItems, justifyContent, flexWrap, gap, ...props },
  ref
) {
  const computedGap = gap ?? (spacing !== undefined ? space(spacing) : undefined);
  const { style: systemStyle, rest } = systemPropsToStyle(props as Record<string, unknown>);
  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems,
        justifyContent,
        flexWrap,
        gap: computedGap,
        ...systemStyle,
        ...resolveSx(sx),
        ...(style as React.CSSProperties),
      }}
      {...rest}
    />
  );
});

const TYPOGRAPHY_VARIANT_STYLE: Record<string, React.CSSProperties> = {
  h1: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.2, display: 'block' },
  h2: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.25, display: 'block' },
  h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.3, display: 'block' },
  h4: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.35, display: 'block' },
  h5: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4, display: 'block' },
  h6: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4, display: 'block' },
  subtitle1: { fontSize: '1rem', fontWeight: 500, display: 'block' },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500, display: 'block' },
  body1: { fontSize: '1rem', lineHeight: 1.5, display: 'block' },
  body2: { fontSize: '0.875rem', lineHeight: 1.43, display: 'block' },
  caption: { fontSize: '0.75rem', lineHeight: 1.4, display: 'block' },
  overline: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' },
};

export const Typography = forwardRef<any, any>(function Typography(
  { variant = 'body1', component, sx, style, className, ...props },
  ref
) {
  const El = (component as React.ElementType) || 'span';
  const { style: systemStyle, rest } = systemPropsToStyle(props as Record<string, unknown>);
  // Drop MUI-only props that must not reach the DOM.
  const { color: _color, gutterBottom: _gutterBottom, noWrap: _noWrap, align: _align, ...domRest } = rest as any;
  return (
    <El
      ref={ref}
      className={className}
      style={{
        margin: 0,
        ...(TYPOGRAPHY_VARIANT_STYLE[variant] ?? TYPOGRAPHY_VARIANT_STYLE.body1),
        ...systemStyle,
        ...resolveSx(sx),
        ...(style as React.CSSProperties),
      }}
      {...domRest}
    />
  );
});

export const Divider = ({ className, ...props }: any): React.ReactElement => (
  <hr className={cn('border-border', className)} {...props} />
);

export const AppBar = forwardRef<any, any>(function AppBar(
  { color = 'primary', position = 'static', elevation = 0, sx, style, className, ...props },
  ref
) {
  const { style: systemStyle, rest } = systemPropsToStyle(props as Record<string, unknown>);
  const isFixed = position === 'fixed' || position === 'sticky';
  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        position: isFixed ? position : 'relative',
        top: isFixed ? 0 : undefined,
        left: isFixed ? 0 : undefined,
        right: isFixed ? 0 : undefined,
        zIndex: elevation ? 1100 : undefined,
        // Prefer host background; never force Material paper white.
        backgroundColor: color === 'inherit' || color === 'transparent' ? 'inherit' : 'transparent',
        color: 'inherit',
        ...systemStyle,
        ...resolveSx(sx),
        ...(style as React.CSSProperties),
      }}
      {...rest}
    />
  );
});

export const Button = forwardRef<any, any>(function Button({ variant = 'default', size = 'medium', sx, style, ...props }, ref) {
  const { fullWidth, ...rest } = props;
  const mappedVariant = variant === 'contained' ? 'default' : variant === 'text' ? 'ghost' : variant;
  return (
    <UiButton
      ref={ref}
      variant={mappedVariant as any}
      size={size as any}
      className={cn(fullWidth ? 'w-full' : '', rest.className)}
      style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }}
      {...rest}
    />
  );
});

export const ButtonGroup = ({ className, ...props }: ButtonGroupProps): React.ReactElement => (
  <div className={cn('inline-flex items-center gap-2', className)} {...props} />
);

export const IconButton = forwardRef<any, any>(function IconButton(
  { className, sx, style, color: _color, edge: _edge, size: _size, ...props },
  ref
) {
  return (
    <UiButton
      ref={ref}
      variant="ghost"
      size="icon"
      className={className}
      style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }}
      {...props}
    />
  );
});

export const Alert = ({ severity, sx, style, ...props }: any): React.ReactElement => (
  <UiAlert severity={severity as any} style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }} {...props} />
);

export const Drawer = ({
  open,
  onClose,
  anchor,
  PaperProps,
  TransitionProps,
  slotProps,
  ModalProps: _ModalProps,
  variant: _variant,
  keepMounted: _keepMounted,
  hideBackdrop: _hideBackdrop,
  sx: _sx,
  ...props
}: DrawerProps): React.ReactElement | null => (
  <UiDrawer
    open={open}
    onClose={onClose as any}
    anchor={anchor}
    PaperProps={PaperProps}
    TransitionProps={TransitionProps}
    slotProps={slotProps}
    {...props}
  />
);

export const Dialog = ({
  open,
  onClose,
  fullWidth,
  maxWidth,
  scroll,
  TransitionProps,
  slotProps,
  keepMounted: _keepMounted,
  hideBackdrop: _hideBackdrop,
  sx,
  style,
  className,
  ...props
}: DialogProps): React.ReactElement | null => (
  <UiDialog
    open={open}
    onClose={onClose as any}
    fullWidth={fullWidth}
    maxWidth={maxWidth}
    scroll={scroll}
    TransitionProps={TransitionProps}
    slotProps={slotProps}
    className={className}
    style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }}
    {...props}
  />
);
export const DialogTitle = UiDialogTitle;
export const DialogContent = UiDialogContent;
export const DialogActions = UiDialogActions;
export const DialogContentText = withAs<any>('p');

export const Tooltip = ({ title, children, ...props }: { title?: React.ReactNode; children?: React.ReactNode } & Record<string, unknown>): React.ReactElement => (
  <UiTooltip title={title} {...props}>{children as React.ReactElement}</UiTooltip>
);

export const Portal = ({
  children,
  container,
}: {
  children?: React.ReactNode;
  container?: Element | DocumentFragment | null;
} & Record<string, unknown>): React.ReactElement | null => {
  if (typeof document === 'undefined') return null;
  return createPortal(children, container ?? document.body) as React.ReactElement;
};
export const ThemeProvider = ({ children }: { children?: React.ReactNode; theme?: unknown }): React.ReactElement => <>{children}</>;

export const Popover = ({
  open,
  children,
  anchorEl,
  anchorOrigin,
  transformOrigin,
  onClose,
  className,
  sx,
  style,
  hideBackdrop: _hideBackdrop,
  disableScrollLock: _disableScrollLock,
  keepMounted: _keepMounted,
  TransitionProps: _TransitionProps,
  slotProps: _slotProps,
  slots: _slots,
  MenuListProps: _MenuListProps,
  id,
  ..._rest
}: {
  open?: boolean;
  children?: React.ReactNode;
  anchorEl?: HTMLElement | null;
  anchorOrigin?: Origin;
  transformOrigin?: Origin;
  onClose?: (event?: Event | React.SyntheticEvent, reason?: string) => void;
  className?: string;
  sx?: unknown;
  style?: React.CSSProperties;
  id?: string;
} & Record<string, unknown>): React.ReactElement | null => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!anchorEl) {
      setCoords(null);
      return;
    }
    const rect = anchorEl.getBoundingClientRect();
    const point = resolveAnchorPoint(rect, anchorOrigin, 'bottom', 'left');
    setCoords({ top: point.y + 4, left: point.x });
  }, [anchorEl, anchorOrigin]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = (): void => updatePosition();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose?.(event, 'escapeKeyDown');
    };
    const onPointer = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorEl?.contains(target)) return;
      onClose?.(event, 'backdropClick');
    };
    document.addEventListener('keydown', onKey);
    // Defer so the opening click does not immediately close the menu.
    const timer = window.setTimeout(() => document.addEventListener('mousedown', onPointer), 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open, onClose, anchorEl]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      id={id}
      ref={panelRef}
      role="presentation"
      className={cn(
        'z-[1400] min-w-[8rem] rounded-md border border-border p-1 shadow-md',
        className
      )}
      style={{
        position: 'fixed',
        top: coords?.top ?? 0,
        left: coords?.left ?? 0,
        transform: originTranslate(transformOrigin, 'top', 'left'),
        visibility: coords ? 'visible' : 'hidden',
        borderColor: 'hsl(var(--border))',
        ...resolveSx(sx),
        ...(style as React.CSSProperties),
        // Force a solid surface after sx merges (Tailwind `bg-popover` may be purged).
        backgroundColor: 'hsl(222 40% 12%)',
        color: 'hsl(var(--popover-foreground))',
        opacity: 1,
        isolation: 'isolate',
      }}
    >
      {children}
    </div>,
    document.body
  ) as React.ReactElement;
};

export const ClickAwayListener = ({ children, onClickAway }: any): React.ReactElement => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent): void => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      onClickAway?.(event);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClickAway]);

  return <div ref={rootRef}>{children}</div>;
};

export const Menu = Popover;
export const Popper = Popover;
export const MenuItem = ({ className, sx, style, disableRipple: _disableRipple, value: _value, selected, ...props }: any): React.ReactElement => (
  <div
    role="menuitem"
    className={cn(
      'cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
      selected && 'bg-accent',
      className
    )}
    style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }}
    {...props}
  />
);

export const InputAdornment = ({ children, ...props }: any): React.ReactElement => <span {...props}>{children}</span>;

export const Select = forwardRef<any, any>(function Select(
  {
    sx,
    style,
    className,
    children,
    open: openProp,
    onClose,
    onOpen,
    onClick,
    value,
    renderValue,
    IconComponent,
    inputProps,
    MenuProps,
    displayEmpty: _displayEmpty,
    multiple: _multiple,
    native: _native,
    autoWidth: _autoWidth,
    variant: _variant,
    ...props
  },
  ref
) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const setOpen = (next: boolean): void => {
    if (openProp === undefined) setInternalOpen(next);
    if (next) onOpen?.({}, next);
    else onClose?.({}, 'backdropClick');
  };

  return (
    <>
      <button
        type="button"
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        className={cn(
          'inline-flex h-9 min-w-[10rem] items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm',
          className
        )}
        style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(event) => {
          onClick?.(event);
          if (openProp === undefined) setOpen(!open);
        }}
        {...inputProps}
        {...props}
      >
        <span className="truncate text-left">
          {renderValue ? renderValue(value) : value != null && value !== '' ? String(value) : null}
        </span>
        {IconComponent ? (
          <span className="inline-flex shrink-0 opacity-70">
            <IconComponent fontSize="small" />
          </span>
        ) : (
          <span className="text-xs opacity-70">▾</span>
        )}
      </button>
      <Menu
        open={open}
        anchorEl={triggerRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        {...MenuProps}
      >
        <div
          role="listbox"
          onClick={(event) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest?.('[role="menuitem"]')) {
              // Header rows may stopPropagation; value rows bubble and close.
              if (!event.defaultPrevented) setOpen(false);
            }
          }}
        >
          {children}
        </div>
      </Menu>
    </>
  );
});

export const MenuList = ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>): React.ReactElement => (
  <div role="menu" className="flex flex-col py-1" {...props}>
    {children}
  </div>
);
export const FormControl = withAs();
export const FormGroup = withAs();
export const FormLabel = withAs<HTMLLabelElement>('label');
export const InputLabel = withAs<HTMLLabelElement>('label');
export const FormControlLabel = ({ control, label, className, value, checked, name, onChange, disabled, ...props }: FormControlLabelProps): React.ReactElement => {
  const nextControl = React.isValidElement(control)
    ? React.cloneElement(control as React.ReactElement<any>, {
        value,
        checked,
        name,
        disabled,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          (control as React.ReactElement<any>).props?.onChange?.(event, event.target.checked);
          onChange?.(event, event.target.value);
        },
      })
    : control;

  return (
    <label className={cn('inline-flex items-center gap-2', className)} {...props}>
      {nextControl}
      <span>{label}</span>
    </label>
  );
};

export const Checkbox = forwardRef<any, any>(function Checkbox({ className, ...props }, ref) {
  const { indeterminate, focusRipple, disableRipple, ...rest } = props;
  return (
    <input
      ref={ref}
      type="checkbox"
      data-indeterminate={indeterminate ? 'true' : undefined}
      className={cn('h-4 w-4 rounded border-input', className)}
      {...rest}
    />
  );
});

export const Switch = forwardRef<any, any>(function Switch({ className, ...props }, ref) {
  const { onChange, ...rest } = props;
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn('h-4 w-8 rounded-full border-input', className)}
      onChange={(e) => onChange?.(e, (e.target as HTMLInputElement).checked)}
      {...rest}
    />
  );
});

export const Radio = forwardRef<any, any>(function Radio({ className, ...props }, ref) {
  const { onChange, ...rest } = props;
  return (
    <input
      ref={ref}
      type="radio"
      className={cn('h-4 w-4 border-input', className)}
      onChange={(e) => onChange?.(e, (e.target as HTMLInputElement).value)}
      {...rest}
    />
  );
});

export const RadioGroup = ({ children, value, defaultValue, onChange, name, row, className, ...props }: any): React.ReactElement => {
  const groupName = name ?? `radio-group-${Math.random().toString(36).slice(2, 8)}`;
  const selectedValue = value ?? defaultValue;
  return (
    <div className={cn(row ? 'flex flex-row gap-3' : 'flex flex-col gap-2', className)} role="radiogroup" {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const childElement = child as React.ReactElement<any>;
        const childValue = childElement.props?.value ?? index;
        return React.cloneElement(childElement, {
          name: groupName,
          value: childValue,
          checked: String(selectedValue) === String(childValue),
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event, String(childValue)),
        });
      })}
    </div>
  );
};

export const ToggleButton = forwardRef<any, any>(function ToggleButton({ selected, className, ...props }, ref) {
  return <Button ref={ref} className={cn(selected ? 'Mui-selected' : '', className)} {...props} />;
});
export const ToggleButtonGroup = ({
  value,
  onChange,
  exclusive,
  children,
  className,
  ...props
}: any): React.ReactElement => {
  return (
    <div className={cn('inline-flex items-center gap-2', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const childElement = child as React.ReactElement<any>;
        const childProps = (childElement.props ?? {}) as any;
        const childValue = childProps.value;
        const isSelected = exclusive ? value === childValue : Array.isArray(value) && value.includes(childValue);
        return React.cloneElement(childElement, {
          selected: isSelected,
          onClick: (e: React.MouseEvent) => {
            childProps.onClick?.(e);
            if (exclusive) {
              onChange?.(e, childValue);
            } else {
              onChange?.(e, childValue);
            }
          },
        });
      })}
    </div>
  );
};
export const ListItemButton = forwardRef<any, any>(function ListItemButton({ selected, className, ...props }, ref) {
  return <button ref={ref} className={cn(selected ? 'Mui-selected' : '', className)} {...props} />;
});
export const ListItemText = ({ primary, children, ...props }: any): React.ReactElement => (
  <span {...props}>{primary ?? children}</span>
);

export const TextField = forwardRef<any, any>(function TextField(
  { select, children, helperText, label, className, sx, style, inputProps, InputProps, slotProps, inputRef, ...props },
  ref
) {
  const inputSlotProps = slotProps?.input ?? {};
  const htmlInputProps = slotProps?.htmlInput ?? {};
  const mergedInputProps = { ...(InputProps ?? {}), ...(inputSlotProps ?? {}), ...(inputProps ?? {}), ...(htmlInputProps ?? {}) };
  const { startAdornment, endAdornment, ...cleanMergedInputProps } = mergedInputProps;
  return (
    <label className="grid gap-1 text-sm">
      {label ? <span className="text-muted-foreground">{label}</span> : null}
      {select ? (
        <select
          className={cn('h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm', className)}
          style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          {...cleanMergedInputProps}
        >
          {children}
        </select>
      ) : (
        <div className="flex items-center gap-1">
          {startAdornment ? <span>{startAdornment}</span> : null}
          <input
            ref={inputRef ?? ref}
            className={cn('h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm', className)}
            style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }}
            {...props}
            {...cleanMergedInputProps}
          />
          {endAdornment ? <span>{endAdornment}</span> : null}
        </div>
      )}
      {helperText ? <span className="text-xs text-muted-foreground">{helperText}</span> : null}
    </label>
  );
});

export const Skeleton = ({ className, ...props }: SkeletonOwnProps): React.ReactElement => (
  <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
);
export const CircularProgress = ({ className, ...props }: any): React.ReactElement => (
  <div className={cn('h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent', className)} {...props} />
);
export const Chip = ({ label, className, ...props }: any): React.ReactElement => (
  <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs', className)} {...props}>
    {label}
  </span>
);
export const Collapse = ({ in: open = false, children, ...props }: any): React.ReactElement | null =>
  open ? <div {...props}>{children}</div> : null;
export const Accordion = ({ className, ...props }: any): React.ReactElement => (
  <div className={cn('rounded-md border', className)} {...props} />
);
export const AccordionSummary = ({ className, ...props }: any): React.ReactElement => (
  <div className={cn('cursor-pointer px-3 py-2', className)} {...props} />
);
export const AccordionDetails = ({ className, ...props }: any): React.ReactElement => (
  <div className={cn('px-3 py-2', className)} {...props} />
);
/** shadcn-aligned Card — `variant="outlined"` draws a light border using theme tokens. */
export const Card = forwardRef<any, any>(function Card(
  { component: Comp = 'div', variant, elevation, sx, style, className, ...props },
  ref
) {
  const El = Comp as any;
  const { style: systemStyle, rest } = systemPropsToStyle(props as Record<string, unknown>);
  const outlined = variant === 'outlined' || elevation === 0;
  return (
    <El
      ref={ref}
      className={cn(
        'rounded-lg bg-card text-card-foreground',
        outlined ? 'border border-border' : 'border border-transparent shadow-sm',
        className
      )}
      style={{ ...systemStyle, ...resolveSx(sx), ...(style as React.CSSProperties) }}
      {...rest}
    />
  );
});
export const Paper = forwardRef<any, any>(function Paper(
  { component: Comp = 'div', variant, elevation, sx, style, className, ...props },
  ref
) {
  const El = Comp as any;
  const { style: systemStyle, rest } = systemPropsToStyle(props as Record<string, unknown>);
  const outlined = variant === 'outlined' || elevation === 0;
  return (
    <El
      ref={ref}
      className={cn(
        'rounded-md bg-card text-card-foreground',
        outlined ? 'border border-border' : 'border border-transparent',
        className
      )}
      style={{ ...systemStyle, ...resolveSx(sx), ...(style as React.CSSProperties) }}
      {...rest}
    />
  );
});
export const CardContent = withAs();
export const CardHeader = forwardRef<any, any>(function CardHeader(
  { title, subheader, className, sx, style, component: Comp = 'div', disableTypography, ...props },
  ref
) {
  const El = Comp as any;
  return (
    <El
      ref={ref}
      className={cn('space-y-1 border-b border-border px-3 py-2', className)}
      style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }}
      {...props}
    >
      {title ? (disableTypography ? title : <div className="text-sm font-medium leading-none">{title}</div>) : null}
      {subheader ? <div className="text-sm text-muted-foreground">{subheader}</div> : null}
    </El>
  );
});
export const Tabs = ({ value, onChange, children, className, ...props }: any): React.ReactElement => (
  <div className={cn('inline-flex items-center gap-2', className)} {...props}>
    {React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      const childElement = child as React.ReactElement<any>;
      const childValue = childElement.props?.value ?? index;
      return React.cloneElement(childElement, {
        selected: childValue === value,
        onClick: (event: React.MouseEvent) => {
          childElement.props?.onClick?.(event);
          onChange?.(event, childValue);
        },
      });
    })}
  </div>
);
export const Tab = ({ selected, className, ...props }: any): React.ReactElement => (
  <button type="button" className={cn('rounded px-3 py-1 text-sm', selected ? 'bg-accent' : '', className)} {...props} />
);

export const Table = ({ sx, style, className, ...props }: any): React.ReactElement => (
  <UiTable className={className} style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }} {...props} />
);
export const TableHead = forwardRef<any, any>(function TableHead(props, ref) {
  return <UiTableHeader {...props} ref={ref} />;
});
export const TableBody = forwardRef<any, any>(function TableBody(props, ref) {
  return <UiTableBody {...props} ref={ref} />;
});
export const TableFooter = forwardRef<any, any>(function TableFooter(props, ref) {
  return <UiTableFooter {...props} ref={ref} />;
});
export const TableRow = forwardRef<any, any>(function TableRow(props, ref) {
  return <UiTableRow {...props} ref={ref} />;
});
export const TableCell = UiTableCell;
export const Link = withAs<any>('a');
export const TableContainer = withAs();
export const TableSortLabel = ({ active, direction, children, ...props }: Record<string, unknown>): React.ReactElement => (
  <button type="button" className={cn(active ? 'Mui-active' : '')} {...props}>
    {children as React.ReactNode}
    <span
      data-testid="ArrowDownwardIcon"
      className={cn(
        !active || direction === 'desc' ? 'MuiTableSortLabel-iconDirectionDesc' : 'MuiTableSortLabel-iconDirectionAsc'
      )}
    />
  </button>
);
export const TablePagination = ({ count, page, rowsPerPage, onPageChange }: Record<string, any>): React.ReactElement => {
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / (rowsPerPage || 1)));
  return (
    <div className="flex items-center justify-end gap-2 p-2 text-xs">
      <span>
        Page {(page ?? 0) + 1} / {totalPages}
      </span>
      <Button size="small" onClick={(e: any) => onPageChange?.(e, Math.max(0, (page ?? 0) - 1))}>Prev</Button>
      <Button size="small" onClick={(e: any) => onPageChange?.(e, Math.min(totalPages - 1, (page ?? 0) + 1))}>Next</Button>
    </div>
  );
};

export function styled<T extends React.ElementType>(Comp: T, _options?: unknown) {
  return function styledFactory<P = Record<string, unknown>>(
    _styles?: Record<string, unknown> | ((props: P & { theme: Theme }) => unknown)
  ) {
    return forwardRef<any, P & Record<string, unknown>>(function StyledComp(props, ref) {
      const El = Comp as any;
      const generatedStyles =
        typeof _styles === 'function'
          ? (_styles as (p: P & { theme: Theme }) => unknown)({ ...(props as P), theme: createTheme({}) })
          : _styles;
      const { style, ...rest } = props as any;
      const inlineStyles = Object.fromEntries(
        Object.entries((generatedStyles as Record<string, unknown>) ?? {}).filter(
          ([key]) => !key.startsWith('&') && !key.startsWith('.') && !key.startsWith('@')
        )
      ) as React.CSSProperties;
      return <El ref={ref} style={{ ...inlineStyles, ...style }} {...rest} />;
    });
  };
}

export const Autocomplete = function Autocomplete({
  options = [],
  value = null,
  onChange,
  getOptionLabel = (option: any): string => String(option?.label ?? option?.id ?? option ?? ''),
  getOptionDisabled = () => false,
  isOptionEqualToValue = (option: any, selected: any): boolean => option === selected,
  renderInput,
  renderOption,
  filterOptions,
  id,
  'aria-labelledby': ariaLabelledBy,
  disabled,
}: any): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [inputValue, setInputValue] = useState<string>(value ? getOptionLabel(value) : '');

  const filtered = useMemo(() => {
    const isPristineValue = value != null && inputValue === getOptionLabel(value);
    const defaultFilter = (opts: any[]) =>
      opts.filter((opt) => getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase()));
    const base = isPristineValue
      ? options
      : filterOptions
        ? filterOptions(options, { inputValue })
        : defaultFilter(options);
    return base;
  }, [filterOptions, getOptionDisabled, getOptionLabel, inputValue, options]);

  const selectOption = (opt: any): void => {
    setInputValue(getOptionLabel(opt));
    setOpen(false);
    onChange?.({ type: 'change' }, opt);
  };

  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    id,
    role: 'combobox',
    'aria-labelledby': ariaLabelledBy,
    'aria-expanded': open,
    disabled,
    value: inputValue,
    onFocus: () => setOpen(true),
    onClick: () => setOpen(true),
    onChange: (e) => {
      setInputValue(e.currentTarget.value);
      setOpen(true);
      setHighlightIndex(0);
    },
    onKeyDown: (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setHighlightIndex((idx) => (idx + 1) % Math.max(filtered.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(true);
        setHighlightIndex((idx) => (idx - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered.length > 0) selectOption(filtered[highlightIndex] ?? filtered[0]);
      }
    },
  };

  const inputNode = renderInput
    ? renderInput({ inputProps })
    : <input className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" {...inputProps} />;

  return (
    <div className="relative">
      {inputNode}
      {open && filtered.length > 0 ? (
        <ul role="listbox" className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow">
          {filtered.map((option: any, index: number) => {
            const optionKey = `${getOptionLabel(option)}-${index}`;
            const isDisabled = !!getOptionDisabled(option);
            const isSelectedValue = value != null && isOptionEqualToValue(option, value);
            const optionProps = {
              role: 'option',
              'aria-selected': isSelectedValue,
              'aria-disabled': isDisabled,
              className: cn(
                'cursor-pointer rounded px-2 py-1.5 text-sm',
                isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : index === highlightIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent'
              ),
              onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
              onClick: () => {
                if (!isDisabled) selectOption(option);
              },
            };
            const defaultOption = (
              <li key={optionKey} {...optionProps}>
                {getOptionLabel(option)}
              </li>
            );
            return renderOption ? renderOption({ key: optionKey, ...optionProps }, option) : defaultOption;
          })}
        </ul>
      ) : null}
    </div>
  );
};
export const createFilterOptions = <T = any>(_config?: any) => {
  return (options: T[], state?: { inputValue?: string; getOptionLabel?: (option: T) => string }) => {
    const stringify = _config?.stringify ?? ((option: any) => String(option?.label ?? option?.id ?? option ?? ''));
    const input = (state?.inputValue ?? '').toLowerCase();
    if (!input) return options;
    return options.filter((option) => stringify(option).toLowerCase().includes(input));
  };
};

