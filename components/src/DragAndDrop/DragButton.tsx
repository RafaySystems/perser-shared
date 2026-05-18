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

import { GripVertical as DragIcon } from 'lucide-react';
import { useState, MouseEvent, ReactElement, forwardRef } from 'react';
import { Button, ButtonProps } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function handleMoveUp<T>(element: T, elements: T[]): T[] {
  const index = elements.indexOf(element);
  if (index === 0) {
    return elements;
  }

  const newElements = [...elements];
  newElements.splice(index, 1);
  newElements.splice(index - 1, 0, element);
  return newElements;
}

export function handleMoveDown<T>(element: T, elements: T[]): T[] {
  const index = elements.indexOf(element);
  if (index === elements.length - 1) {
    return elements;
  }

  const newElements = [...elements];
  newElements.splice(index, 1);
  newElements.splice(index + 1, 0, element);
  return newElements;
}

export interface DragButtonProps extends ButtonProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  menuSx?: React.CSSProperties;
}

export const DragButton = forwardRef<HTMLButtonElement, DragButtonProps>(function DragButton(
  { onMoveUp, onMoveDown, onMoveLeft, onMoveRight, menuSx, ...otherProps }: DragButtonProps,
  ref
): ReactElement {
  const [open, setOpen] = useState(false);

  function handleMove(callback?: () => void): void {
    setOpen(false);
    callback?.();
  }

  const hasMenuItems = onMoveUp || onMoveDown || onMoveLeft || onMoveRight;

  return (
    <>
      {hasMenuItems ? (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              {...otherProps}
              ref={ref}
              variant="ghost"
              size="icon"
              aria-label="move"
              aria-haspopup={true}
              aria-expanded={open}
              className="h-8 w-8"
            >
              <DragIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent style={menuSx}>
            {onMoveUp && <DropdownMenuItem onClick={() => handleMove(onMoveUp)}>Move Up</DropdownMenuItem>}
            {onMoveDown && <DropdownMenuItem onClick={() => handleMove(onMoveDown)}>Move Down</DropdownMenuItem>}
            {onMoveLeft && <DropdownMenuItem onClick={() => handleMove(onMoveLeft)}>Move Left</DropdownMenuItem>}
            {onMoveRight && <DropdownMenuItem onClick={() => handleMove(onMoveRight)}>Move Right</DropdownMenuItem>}
            {onMoveRight && <DropdownMenuItem onClick={() => handleMove(onMoveRight)}>Move Right</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          {...otherProps}
          ref={ref}
          variant="ghost"
          size="icon"
          aria-label="move"
          className="h-8 w-8"
        >
          <DragIcon />
        </Button>
      )}
    </>
  );
});
