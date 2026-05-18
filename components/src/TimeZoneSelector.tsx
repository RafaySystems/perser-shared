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

import { ReactElement, useMemo } from 'react';
import { TimeZoneOption, getTimeZoneOptions } from './model/timeZoneOption';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { cn } from './lib/utils';

export interface TimeZoneSelectorProps {
  value: string;
  onChange?: (timeZoneOption: TimeZoneOption) => void;
  timeZoneOptions?: TimeZoneOption[];
  variant?: 'standard' | 'compact';
  heightPx?: string | number;
  className?: string;
  disabled?: boolean;
}

/**
 * Timezone selector component
 * Allows users to select a timezone from a dropdown list
 */
export function TimeZoneSelector({
  value,
  onChange,
  timeZoneOptions,
  variant = 'standard',
  heightPx,
  className,
  disabled,
}: TimeZoneSelectorProps): ReactElement {
  const options = useMemo(() => timeZoneOptions ?? getTimeZoneOptions(), [timeZoneOptions]);

  const height = heightPx ? (typeof heightPx === 'number' ? `${heightPx}px` : heightPx) : undefined;

  const handleChange = (selectedValue: string): void => {
    const selectedOption = options.find((opt: TimeZoneOption) => opt.value === selectedValue);
    if (selectedOption && onChange) {
      onChange(selectedOption);
    }
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          variant === 'compact' ? 'min-w-[80px]' : 'min-w-[150px]',
          variant === 'compact' ? 'h-8 text-xs' : 'h-9',
          className
        )}
        style={height ? { lineHeight: height, paddingTop: 0, paddingBottom: 0 } : undefined}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option: TimeZoneOption) => (
          <SelectItem key={option.value} value={option.value}>
            {option.display}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
