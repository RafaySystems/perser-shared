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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@perses-dev/components';
import { ToolbarIconButton } from '@perses-dev/components';
import { Download as DownloadIcon } from 'lucide-react';
import React, { ReactElement, useRef } from 'react';
import { useDashboard } from '../../context';
import { serializeDashboard } from './serializeDashboard';

// Button that enables downloading the dashboard as a JSON file
export function DownloadButton(): ReactElement {
  const { dashboard } = useDashboard();
  const hiddenLinkRef = useRef<HTMLAnchorElement>(null);

  const handleItemClick = (format: 'json' | 'yaml', shape?: 'cr-v1alpha1' | 'cr-v1alpha2') => (): void => {
    const { contentType, content } = serializeDashboard(dashboard, format, shape);

    if (!hiddenLinkRef || !hiddenLinkRef.current) return;
    // Create blob URL
    const hiddenLinkUrl = URL.createObjectURL(new Blob([content], { type: contentType }));
    // Simulate click
    hiddenLinkRef.current.download = `${dashboard.metadata.name}${shape ? `-${shape}` : ''}.${format}`;
    hiddenLinkRef.current.href = hiddenLinkUrl;
    hiddenLinkRef.current.click();
    // Remove blob URL (for memory management)
    URL.revokeObjectURL(hiddenLinkUrl);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarIconButton
            id="download-dashboard-button"
            aria-haspopup="true"
          >
            <DownloadIcon />
          </ToolbarIconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleItemClick('json')}>JSON</DropdownMenuItem>
          <DropdownMenuItem onClick={handleItemClick('yaml')}>YAML</DropdownMenuItem>
          <DropdownMenuItem onClick={handleItemClick('yaml', 'cr-v1alpha2')}>YAML (CR v1alpha2)</DropdownMenuItem>
          <DropdownMenuItem onClick={handleItemClick('yaml', 'cr-v1alpha1')}>YAML (CR v1alpha1)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden link to download the dashboard as a JSON or YAML file */}
      {/* eslint-disable jsx-a11y/anchor-has-content */}
      {/* eslint-disable jsx-a11y/anchor-is-valid  */}
      <a ref={hiddenLinkRef} style={{ display: 'none' }} />
    </>
  );
}
