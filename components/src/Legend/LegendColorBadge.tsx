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

import { memo, ReactElement } from 'react';
import { cn } from '../lib/utils';

export interface LegendColorBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
}

export const LegendColorBadge = memo(function LegendColorBadge({
  color,
  className,
  ...others
}: LegendColorBadgeProps): ReactElement {
  return (
    <div
      {...others}
      className={cn('h-1 w-4 m-0.5', className)}
      style={{ backgroundColor: color }}
    />
  );
});
