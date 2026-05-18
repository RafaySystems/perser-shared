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

import { ReactElement, RefObject, useState } from 'react';
import { Trash2 as DeleteIcon } from 'lucide-react';
import { OptionsColorPicker } from '../ColorPicker/OptionsColorPicker';
import { ThresholdOptions } from '../model';
import { Button } from '../ui/button';

export interface ThresholdInputProps {
  label: string;
  color: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (color: string) => void;
  onBlur: () => void;
  onDelete: () => void;
  inputRef?: RefObject<HTMLInputElement | null>;
  mode?: ThresholdOptions['mode'];
}

export function ThresholdInput({
  inputRef,
  label,
  color,
  value,
  mode,
  onChange,
  onColorChange,
  onBlur,
  onDelete,
}: ThresholdInputProps): ReactElement {
  const [key, setKey] = useState(0); // use key to cause input to lose focus when pressing enter
  return (
    <div className="flex flex-1 flex-row items-center justify-between gap-2">
      <OptionsColorPicker label={label} color={color} onColorChange={onColorChange} />
      <label htmlFor={label} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={label}
          key={key}
          ref={inputRef}
          type="number"
          value={value === 0 ? '' : value}
          placeholder="0"
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onBlur();
              setKey(key + 1);
            }
          }}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {mode === 'percent' && (
          <span className="absolute right-3 text-sm text-muted-foreground pointer-events-none">%</span>
        )}
      </div>
      <Button variant="ghost" size="icon" aria-label={`delete threshold ${label}`} className="h-8 w-8" onClick={onDelete}>
        <DeleteIcon />
      </Button>
    </div>
  );
}
