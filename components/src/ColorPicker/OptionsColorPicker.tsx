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

import { ReactElement, useState, forwardRef } from 'react';
import { Circle as CircleIcon } from 'lucide-react';
import { useChartsTheme } from '../context';
import { ColorPicker } from './ColorPicker';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '../lib/utils';

export interface OptionsColorPickerProps {
  label: string;
  color: string;
  onColorChange: (color: string) => void;
  onClear?: () => void;
}

export function OptionsColorPicker({ label, color, onColorChange, onClear }: OptionsColorPickerProps): ReactElement {
  const [open, setOpen] = useState(false);

  const closeColorPicker = (): void => {
    setOpen(false);
  };

  const {
    thresholds: { defaultColor, palette },
  } = useChartsTheme();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`change ${label} color`}
          className={cn('h-8 w-8', open && 'ring-2 ring-offset-1')}
          style={{
            color,
            backgroundColor: open ? `${color}3F` : undefined,
          }}
        >
          <CircleIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-testid="options color picker"
        className="p-4 w-auto"
        align="end"
        side="top"
      >
        <ColorPicker color={color} palette={[defaultColor, ...palette]} onChange={onColorChange} onClear={onClear} />
      </PopoverContent>
    </Popover>
  );
}
