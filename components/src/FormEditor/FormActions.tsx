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

import { ReactElement } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { cn } from '../lib/utils';
import { Action } from '@perses-dev/components';

export interface FormActionsProps {
  action: Action;
  submitText?: string;
  cancelText?: string;
  isReadonly?: boolean;
  isValid?: boolean;
  onActionChange?: (action: Action) => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function FormActions({
  action,
  submitText = 'Save',
  cancelText = 'Cancel',
  isReadonly,
  isValid,
  onActionChange,
  onSubmit,
  onDelete,
  onCancel,
  className,
}: FormActionsProps): ReactElement {
  return (
    <div className={cn('flex flex-row gap-2 ml-auto items-center', className)}>
      {action === 'read' ? (
        <>
          {onActionChange && (
            <Button disabled={isReadonly} onClick={() => onActionChange('update')}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" disabled={isReadonly} onClick={onDelete}>
              Delete
            </Button>
          )}
          {onCancel && (onSubmit || onDelete) && (
            <Separator orientation="vertical" className="mx-2 h-6" />
          )}
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
        </>
      ) : (
        <>
          {onSubmit && (
            <Button disabled={!isValid} onClick={onSubmit}>
              {submitText}
            </Button>
          )}
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
