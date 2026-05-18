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

import { PlusSquare as AddPanelIcon } from 'lucide-react';
import { Button, ButtonProps, InfoTooltip } from '@perses-dev/components';
import { ReactElement } from 'react';
import { TOOLTIP_TEXT } from '../../constants';
import { useDashboardActions } from '../../context';

export interface AddPanelButtonProps {
  /**
   * The variant to use to display the button.
   */
  variant?: ButtonProps['variant'];

  /**
   * The label used inside the button.
   */
  label?: string;

  fullWidth?: boolean;
}

export const AddPanelButton = ({
  variant = 'ghost',
  label = 'Panel',
  fullWidth,
}: AddPanelButtonProps): ReactElement => {
  const { openAddPanel } = useDashboardActions();

  return (
    <InfoTooltip description={TOOLTIP_TEXT.addPanel}>
      <Button
        onClick={openAddPanel}
        aria-label={TOOLTIP_TEXT.addPanel}
        variant={variant}
        className={`whitespace-nowrap min-w-0${fullWidth ? ' w-full' : ''}`}
      >
        <AddPanelIcon className="mr-0.5" />
        {label}
      </Button>
    </InfoTooltip>
  );
};
