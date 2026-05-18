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

import { MouseEvent, ReactElement, ReactNode } from 'react';
import { Button, ButtonProps } from '../ui/button';
import { cn } from '../lib/utils';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';

export interface DialogProps {
  open: boolean;
  onClose?: (e: MouseEvent<HTMLElement> | unknown) => void;
  children?: ReactNode;
  className?: string;
}

export interface DialogHeaderProps {
  onClose?: (e: MouseEvent<HTMLElement>) => void;
  children?: ReactNode;
  className?: string;
  description?: string;
}

export type DialogButtonProps = Omit<ButtonProps, 'variant' | 'color' | 'type'>;

const Header = ({ children, onClose, description, className }: DialogHeaderProps): ReactElement => (
  <SheetHeader className={cn('pr-8', className)}>
    <SheetTitle className="truncate">{children}</SheetTitle>
    {description && <SheetDescription>{description}</SheetDescription>}
  </SheetHeader>
);

const Content = ({ children, className }: { children?: ReactNode; className?: string }): ReactElement => (
  <div className={cn('min-w-0 flex-1 overflow-y-auto px-6 py-4', className)}>{children}</div>
);

const PrimaryButton = ({ children, ...props }: DialogButtonProps): ReactElement => (
  <Button variant="default" type="submit" {...props}>
    {children}
  </Button>
);

const SecondaryButton = ({ children, ...props }: DialogButtonProps): ReactElement => (
  <Button variant="outline" {...props}>
    {children}
  </Button>
);

const Form = ({ children, className, ...props }: React.ComponentProps<'form'>): ReactElement => (
  <form className={cn('flex flex-col overflow-y-auto', className)} {...props}>
    {children}
  </form>
);

const Actions = ({ children, className }: { children?: ReactNode; className?: string }): ReactElement => (
  <SheetFooter className={cn('px-6 py-4 border-t', className)}>{children}</SheetFooter>
);

/**
 * All dialogs are rendered as side-panel Drawers (Sheet) for a consistent
 * slide-in UX. Replace `<Dialog open={…} onClose={…}>` with this component.
 */
export const Dialog: React.FC<DialogProps> & {
  Header: typeof Header;
  Form: typeof Form;
  Content: typeof Content;
  PrimaryButton: typeof PrimaryButton;
  SecondaryButton: typeof SecondaryButton;
  Actions: typeof Actions;
} = ({ open, onClose, children, className }) => (
  <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose?.(isOpen)}>
    <SheetContent side="right" className={cn('flex flex-col w-full sm:max-w-[680px] p-0', className)}>
      {children}
    </SheetContent>
  </Sheet>
);

Dialog.Header = Header;
Dialog.Form = Form;
Dialog.Content = Content;
Dialog.PrimaryButton = PrimaryButton;
Dialog.SecondaryButton = SecondaryButton;
Dialog.Actions = Actions;

export { SheetClose as DialogClose };
