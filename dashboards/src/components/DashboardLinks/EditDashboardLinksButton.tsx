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

import { ReactElement, useState } from 'react';
import { Pencil as PencilIcon } from 'lucide-react';
import { Button, ButtonProps, Drawer, InfoTooltip } from '@perses-dev/components';
import { Link } from '@perses-dev/spec';
import { TOOLTIP_TEXT } from '../../constants';
import { useDashboardLinks, useDashboardLinksActions } from '../../context';
import { DashboardLinksEditor } from './DashboardLinksEditor';

export interface EditDashboardLinksButtonProps {
  /**
   * The variant to use to display the button.
   */
  variant?: ButtonProps['variant'];

  /**
   * The color to use to display the button.
   */
  color?: string;

  /**
   * The label used inside the button.
   */
  label?: string;

  fullWidth?: boolean;
}

export function EditDashboardLinksButton({
  variant = 'ghost',
  label = 'Links',
  fullWidth,
}: EditDashboardLinksButtonProps): ReactElement {
  const [isLinksEditorOpen, setIsLinksEditorOpen] = useState(false);
  const links = useDashboardLinks();
  const { setLinks } = useDashboardLinksActions();

  const openLinksEditor = (): void => {
    setIsLinksEditorOpen(true);
  };

  const closeLinksEditor = (): void => {
    setIsLinksEditorOpen(false);
  };

  return (
    <>
      <InfoTooltip description={TOOLTIP_TEXT.editLinks}>
        <Button
          onClick={openLinksEditor}
          aria-label={TOOLTIP_TEXT.editLinks}
          variant={variant}
          className={`whitespace-nowrap min-w-0${fullWidth ? ' w-full' : ''}`}
        >
          <PencilIcon className="mr-0.5" />
          {label}
        </Button>
      </InfoTooltip>
      <Drawer
        isOpen={isLinksEditorOpen}
        onClose={closeLinksEditor}
        PaperProps={{ sx: { width: '50%' } }}
        data-testid="dashboard-links-editor"
      >
        <DashboardLinksEditor
          links={links}
          onCancel={closeLinksEditor}
          onChange={(updatedLinks: Link[]) => {
            setLinks?.(updatedLinks);
            setIsLinksEditorOpen(false);
          }}
        />
      </Drawer>
    </>
  );
}
