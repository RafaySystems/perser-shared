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
import { cn } from '../lib/utils';

export interface ChartEmptyStateProps {
  message?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ChartEmptyState({
  message = 'No data',
  className,
  style,
}: ChartEmptyStateProps): ReactElement {
  return (
    <div
      className={cn(
        'flex h-full min-h-[80px] items-center justify-center text-sm text-muted-foreground',
        className
      )}
      style={style}
    >
      {message}
    </div>
  );
}
