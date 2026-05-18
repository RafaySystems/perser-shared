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

import { FC, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ValueMapping } from '../model';
import { ValueMappingEditor } from './ValueMappingEditor';

export interface ValueMappingsEditorProps {
  mappings: ValueMapping[];
  onChange: (valueMappings: ValueMapping[]) => void;
}

export const ValueMappingsEditor: FC<ValueMappingsEditorProps> = ({ mappings, onChange }) => {
  const [valueMappings, setValueMappings] = useState<ValueMapping[]>(mappings);

  function handleValueMappingChange(index: number, mapping: ValueMapping): void {
    const updatedValueMappings = [...valueMappings];
    updatedValueMappings[index] = mapping;
    setValueMappings(updatedValueMappings);
    onChange(updatedValueMappings);
  }

  function handleAddValueMappingEditor(): void {
    const updatedValueMappings = [...valueMappings];
    updatedValueMappings.push({ kind: 'Value', spec: { result: { value: '' } } } as ValueMapping);
    setValueMappings(updatedValueMappings);
    onChange(updatedValueMappings);
  }

  function handleValueMappingDelete(index: number): void {
    const updatedValueMappings = [...valueMappings];
    updatedValueMappings.splice(index, 1);
    setValueMappings(updatedValueMappings);
    onChange(updatedValueMappings);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Column headers */}
      <div className="grid grid-cols-10 gap-4 px-0">
        <div className="col-span-5">
          <span className="text-sm font-semibold">Condition</span>
        </div>
        <div className="col-span-4">
          <span className="text-sm font-semibold">Display Text</span>
        </div>
        <div className="col-span-1 text-center">
          <span className="text-sm font-semibold">Color</span>
        </div>
      </div>

      {/* Mappings list */}
      <div className="flex flex-col gap-3">
        {valueMappings.map((mapping, i) => (
          <div key={i}>
            {i > 0 && <Separator className="mb-3" />}
            <ValueMappingEditor
              mapping={mapping}
              onChange={(updatedMapping: ValueMapping) => handleValueMappingChange(i, updatedMapping)}
              onDelete={() => handleValueMappingDelete(i)}
            />
          </div>
        ))}
      </div>

      <Button
        variant="default"
        className="mt-1 gap-1.5"
        onClick={handleAddValueMappingEditor}
      >
        <Plus className="h-4 w-4" />
        Add value mappings
      </Button>
    </div>
  );
};
