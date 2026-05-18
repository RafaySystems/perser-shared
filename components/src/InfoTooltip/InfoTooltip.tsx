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

import { ReactElement, ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

export type TooltipPlacement = TooltipContentProps['side'];

interface InfoTooltipProps {
  description: string;
  children: ReactNode;
  id?: string;
  title?: string;
  placement?: TooltipPlacement;
  delayDuration?: number;
}

export function InfoTooltip({
  id,
  title,
  description,
  placement = 'top',
  children,
  delayDuration = 500,
}: InfoTooltipProps): ReactElement {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>
        <span id={id}>{children}</span>
      </TooltipTrigger>
      <TooltipContent side={placement} className="max-w-[300px] text-xs">
        {title && <p className="font-medium mb-0.5">{title}</p>}
        <p className="whitespace-pre-line">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
