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

interface YAxisLabelProps {
  name: string;
  height: number;
}

export function YAxisLabel({ name, height }: YAxisLabelProps): ReactElement {
  return (
    <div
      style={{
        maxWidth: height,
        top: `calc(${height}px / 2)`,
        transform: 'translateX(-50%) rotate(-90deg)',
        transformOrigin: 'top',
      }}
      className="inline-block absolute text-center z-[1]"
    >
      <p
        aria-label="y axis label"
        className="text-sm text-foreground whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {name}
      </p>
    </div>
  );
}
