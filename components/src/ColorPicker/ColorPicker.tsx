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

import { ChangeEvent, ReactElement, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Circle as CircleIcon, Trash2 as DeleteIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface ColorPickerProps {
  color: string;
  onChange?: (color: string) => void;
  onClear?: () => void;
  /**
   * Preset color palette
   */
  palette?: string[];
}

export const ColorPicker = ({ color, onChange, onClear, palette }: ColorPickerProps): ReactElement => {
  // value is the visible value for the controlled text input
  const [value, setValue] = useState(color);

  const handleColorChange = (color: string): void => {
    setValue(color);
    onChange?.(color);
  };

  // we should update this if https://github.com/omgovich/react-colorful/issues/157 is resolved
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value.replace(/([^0-9A-F]+)/gi, '').substring(0, 8);
    setValue(`#${inputValue}`); // always prefix input value with # to indicate hex format
    // only set color if input value is a valid hex color
    if (isValidHex(e.target.value)) {
      onChange?.(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <HexColorPicker color={color} onChange={handleColorChange} style={{ width: '100%' }} />
      <div className="flex flex-row flex-wrap justify-evenly w-[200px]">
        {palette &&
          palette.map((color, i) => (
            <Button
              key={i}
              variant="ghost"
              size="icon"
              aria-label={`change color to ${color}`}
              style={{ color }}
              className="h-8 w-8"
              onClick={() => handleColorChange(color)}
            >
              <CircleIcon />
            </Button>
          ))}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <input
          aria-label="enter hex color"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={value}
          onChange={handleInputChange}
        />
        {onClear && (
          <Button variant="ghost" size="icon" onClick={onClear}>
            <DeleteIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

const isValidHex = (value: string, alpha?: boolean): boolean => {
  const matcher = /^#?([0-9A-F]{3,8})$/i;
  const match = matcher.exec(value);
  const length = match && match[1] ? match[1].length : 0;
  return (
    length === 3 || // '#rgb' format
    length === 6 || // '#rrggbb' format
    (!!alpha && length === 4) || // '#rgba' format
    (!!alpha && length === 8) // '#rrggbbaa' format
  );
};
