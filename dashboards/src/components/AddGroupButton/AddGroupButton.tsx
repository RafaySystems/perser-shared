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

import { PlusSquare as AddGroupIcon } from 'lucide-react';
import { Button, InfoTooltip } from '@perses-dev/components';
import { ReactElement } from 'react';
import { TOOLTIP_TEXT } from '../../constants';
import { useDashboardActions } from '../../context';

export const AddGroupButton = (): ReactElement => {
  const { openAddPanelGroup } = useDashboardActions();

  return (
    <InfoTooltip description={TOOLTIP_TEXT.addGroup}>
      <Button
        variant="ghost"
        onClick={openAddPanelGroup}
        aria-label={TOOLTIP_TEXT.addGroup}
        className="whitespace-nowrap min-w-0"
      >
        <AddGroupIcon className="mr-0.5" />
        Panel Group
      </Button>
    </InfoTooltip>
  );
};
