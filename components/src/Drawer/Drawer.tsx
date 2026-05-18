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

import { ReactNode } from 'react';
import { Sheet, SheetContent } from '../ui/sheet';
import { cn } from '../lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  anchor?: 'left' | 'right';
  className?: string;
  children?: ReactNode;
}

export function Drawer({ anchor = 'right', isOpen, onClose, className, children }: DrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={anchor}
        className={cn('w-full sm:max-w-[1080px] overflow-hidden p-0', className)}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
