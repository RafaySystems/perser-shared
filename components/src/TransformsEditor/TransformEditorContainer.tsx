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

import { ChevronRight, ChevronDown, EyeOff as EyeOffIcon, Eye as EyeIcon, Trash2 as DeleteIcon } from 'lucide-react';
import { ReactElement } from 'react';
import { Transform, TRANSFORM_TEXT } from '../model';
import { TransformEditor, TransformEditorProps } from './TransformEditor';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export interface TransformEditorContainerProps extends TransformEditorProps {
  index?: number;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onDelete: () => void;
}

export function TransformEditorContainer({
  index,
  value,
  isCollapsed,
  onChange,
  onCollapse,
  onDelete,
  ...props
}: TransformEditorContainerProps): ReactElement {
  function handleTransformDisable(): void {
    onChange({ ...value, spec: { ...value.spec, disabled: !value.spec?.disabled } } as Transform);
  }

  return (
    <div {...props}>
      <div
        className="flex flex-row items-center border-b border-border justify-between gap-4"
      >
        <div className="flex flex-row gap-2">
          <Button
            variant="ghost"
            size="icon"
            data-testid={`transform-toggle#${index}`}
            className="h-8 w-8"
            onClick={() => onCollapse(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronDown />}
          </Button>
          <h4 className="text-xs font-medium uppercase tracking-widest self-center" style={{ textTransform: 'none' }}>
            {value.kind ? (
              <span>
                <strong>{TRANSFORM_TEXT[value.kind]}</strong>
              </span>
            ) : (
              <strong>Select a transformation kind</strong>
            )}
          </h4>
        </div>

        <div className="flex flex-row gap-2">
          {isCollapsed && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8"
                    onClick={handleTransformDisable}
                  >
                    {value.spec?.disabled ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {value.spec?.disabled ? 'Enable transformation' : 'Disable transformation'}
                </TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-auto self-stretch mx-1" />
            </>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-8 w-8"
                onClick={onDelete}
              >
                <DeleteIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Remove transformation</TooltipContent>
          </Tooltip>
        </div>
      </div>
      {!isCollapsed && <TransformEditor value={value} onChange={onChange} />}
    </div>
  );
}
