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

import { Pencil as PencilIcon } from 'lucide-react';
import { Button, ButtonProps } from '@perses-dev/components';
import { ReactElement } from 'react';

export interface EditButtonProps {
  /**
   * The label used inside the button.
   */
  label?: string;

  /**
   * Handler that puts the dashboard into editing mode.
   */
  onClick: () => void;

  variant?: ButtonProps['variant'];
  color?: string;
}

export const EditButton = ({ label = 'Edit', onClick, variant = 'outline' }: EditButtonProps): ReactElement => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className="whitespace-nowrap min-w-0"
    >
      <PencilIcon className="mr-0.5" />
      {label}
    </Button>
  );
};
