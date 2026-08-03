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

import {
  Button,
  ButtonProps,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
  IconButton,
  Dialog as MuiDialog,
  DialogContentProps as MuiDialogContentProps,
  styled,
} from '@rafaysystems/components/compat/mui';
import { CloseIcon } from '@rafaysystems/components/compat/icons';
import { MouseEvent, ReactElement, ReactNode } from 'react';
import { combineSx } from '../utils';

export interface DialogHeaderProps extends DialogTitleProps {
  children?: ReactNode;
  /**
   * Callback fired when close button is clicked. If undefined, close button will not appear in header.
   */
  onClose?: (e: MouseEvent<HTMLElement>) => void;
}

export type DialogButtonProps = Omit<ButtonProps, 'variant' | 'color' | 'type'>;

export type DialogContentProps = MuiDialogContentProps;

const Header = ({ children, onClose, ...props }: DialogHeaderProps): ReactElement => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '16px 48px 12px 24px',
        borderBottom: '1px solid hsl(var(--border))',
        flexShrink: 0,
        zIndex: 2,
        background: 'hsl(var(--background))',
      }}
    >
      <DialogTitle style={{ textOverflow: 'ellipsis', overflow: 'hidden', flex: 1, margin: 0 }} {...props}>
        {children}
      </DialogTitle>
      {onClose && (
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
};

const Content = ({ children, sx, ...props }: DialogContentProps): ReactElement => (
  <DialogContent dividers {...props} sx={combineSx({ minWidth: `500px`, textWrap: 'balance' }, sx)}>
    {children}
  </DialogContent>
);

const PrimaryButton = ({ children, ...props }: DialogButtonProps): ReactElement => (
  <Button variant="contained" type="submit" {...props}>
    {children}
  </Button>
);

const SecondaryButton = ({ children, ...props }: DialogButtonProps): ReactElement => (
  <Button variant="outlined" color="secondary" {...props}>
    {children}
  </Button>
);

/*
 * Material-ui has a prop "scroll=paper" that is specifically for dialog header and actions to be sticky and body to scroll,
 * but that doesn't work when dialog content is wrapped in form.
 * https://github.com/mui-org/material-ui/issues/13253
 * This component adds style to get expected behavior & should be used whenever we have a Form inside a Dialog
 */
const Form = styled('form')({
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  flex: 1,
});

export const Dialog: React.FC<DialogProps> & {
  Header: typeof Header;
  Form: typeof Form;
  Content: typeof Content;
  PrimaryButton: typeof PrimaryButton;
  SecondaryButton: typeof SecondaryButton;
  Actions: typeof DialogActions;
} = ({ children, ...props }) => <MuiDialog {...props}>{children}</MuiDialog>;

Dialog.Header = Header;
Dialog.Form = Form;
Dialog.Content = Content;
Dialog.PrimaryButton = PrimaryButton;
Dialog.SecondaryButton = SecondaryButton;
Dialog.Actions = DialogActions;
