import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
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
  const baseTheme = {
    spacing: (n: number): string => `${n * 8}px`,
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      body1: { fontSize: '1rem', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' },
      body2: { fontSize: '0.875rem', lineHeight: 1.43, fontFamily: 'Inter, sans-serif' },
    },
    palette: {
      mode,
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
      grey: {
        50: '#fafafa',
        100: '#f5f5f5',
        300: '#e0e0e0',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
      },
      designSystem: { grey: {} },
    },
    shadows: ['none', '0 1px 2px rgba(0,0,0,0.08)'],
  };
  const userPalette = ((options as Record<string, any>).palette ?? {}) as Record<string, any>;
  const theme = {
    ...baseTheme,
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
  };
  lastCreatedTheme = theme;
  return theme;
}

export function useTheme(): Theme {
  return lastCreatedTheme ?? createTheme();
}

export function useMediaQuery(query: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
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

function withAs<T extends HTMLElement = HTMLDivElement>(defaultTag: React.ElementType = 'div'): any {
  return forwardRef<any, any>(
    function WithAs({ component: Comp = defaultTag, sx, style, className, ...props }, ref) {
      const El = Comp as any;
      return <El ref={ref} style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }} className={className} {...props} />;
    }
  );
}

export const Box = withAs();
export const Grid = withAs();
export const Grid2 = withAs();
export const Stack = forwardRef<any, any>(function Stack(
  { direction = 'column', spacing, sx, style, className, alignItems, justifyContent, flexWrap, gap, ...props },
  ref
) {
  const computedGap = gap ?? (spacing ? `${spacing * 8}px` : undefined);
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
        ...resolveSx(sx),
        ...(style as React.CSSProperties),
      }}
      {...props}
    />
  );
});

export const Typography = withAs<any>('span');
export const Divider = ({ className, ...props }: any): React.ReactElement => (
  <hr className={cn('border-border', className)} {...props} />
);

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

export const IconButton = forwardRef<any, any>(function IconButton({ className, ...props }, ref) {
  return <UiButton ref={ref} variant="ghost" size="icon" className={className} {...props} />;
});

export const Alert = ({ severity, sx, style, ...props }: any): React.ReactElement => (
  <UiAlert severity={severity as any} style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }} {...props} />
);

export const AppBar = withAs();

export const Drawer = ({ open, onClose, anchor, ...props }: DrawerProps): React.ReactElement | null => (
  <UiDrawer open={open} onClose={onClose} anchor={anchor} {...props} />
);

export const Dialog = ({ open, onClose, ...props }: DialogProps): React.ReactElement | null => (
  <UiDialog open={open} onClose={onClose} {...props} />
);
export const DialogTitle = UiDialogTitle;
export const DialogContent = UiDialogContent;
export const DialogActions = UiDialogActions;
export const DialogContentText = withAs<any>('p');

export const Tooltip = ({ title, children, ...props }: { title?: React.ReactNode; children?: React.ReactNode } & Record<string, unknown>): React.ReactElement => (
  <UiTooltip title={title} {...props}>{children as React.ReactElement}</UiTooltip>
);

export const Portal = ({ children }: { children?: React.ReactNode } & any): React.ReactElement => <>{children}</>;
export const ThemeProvider = ({ children }: { children?: React.ReactNode; theme?: unknown }): React.ReactElement => <>{children}</>;

export const Popover = ({ open, children, ...props }: { open?: boolean; children?: React.ReactNode } & Record<string, unknown>): React.ReactElement | null => {
  if (!open) return null;
  return <div className="rounded-md border bg-popover p-2 shadow" {...props}>{children}</div>;
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
export const MenuItem = ({ className, ...props }: any): React.ReactElement => (
  <div className={cn('cursor-pointer rounded px-2 py-1.5 hover:bg-accent', className)} {...props} />
);

export const InputAdornment = ({ children, ...props }: any): React.ReactElement => <span {...props}>{children}</span>;

export const Select = forwardRef<any, any>(function Select({ sx, style, className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn('h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm', className)}
      style={{ ...resolveSx(sx), ...(style as React.CSSProperties) }}
      {...props}
    >
      {children}
    </select>
  );
});

export const MenuList = ({ children }: { children?: React.ReactNode }): React.ReactElement => <>{children}</>;
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
export const Card = withAs();
export const Paper = withAs();
export const CardContent = withAs();
export const CardHeader = ({ title, subheader, className, ...props }: any): React.ReactElement => (
  <div className={cn('space-y-1 p-4', className)} {...props}>
    {title ? <div>{title}</div> : null}
    {subheader ? <div className="text-sm text-muted-foreground">{subheader}</div> : null}
  </div>
);
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

