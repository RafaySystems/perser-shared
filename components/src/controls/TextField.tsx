// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ChangeEvent, ForwardedRef, forwardRef, useCallback, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { Input, InputProps } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../lib/utils';

export interface TextFieldProps extends Omit<InputProps, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  debounceMs?: number;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
}

export const TextField = forwardRef(function (
  { debounceMs = 250, value, onChange, label, helperText, error, fullWidth, className, id, ...props }: TextFieldProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [currentValue, setCurrentValue] = useState(value);

  const handleDebounceFn = useCallback(
    (inputValue: string) => {
      onChange?.(inputValue);
    },
    [onChange]
  );

  const debounceFn = useMemo(() => debounce(handleDebounceFn, debounceMs), [debounceMs, handleDebounceFn]);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setCurrentValue(event.target.value);
    debounceFn(event.target.value);
  }

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        ref={ref}
        id={id}
        value={currentValue}
        onChange={handleChange}
        className={cn(error && 'border-destructive focus-visible:ring-destructive', fullWidth && 'w-full')}
        {...props}
      />
      {helperText && (
        <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>{helperText}</p>
      )}
    </div>
  );
});
TextField.displayName = 'TextField';
