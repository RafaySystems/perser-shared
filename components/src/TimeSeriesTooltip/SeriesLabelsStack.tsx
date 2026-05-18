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
import { Separator } from '../ui/separator';
import { SeriesMarker } from './SeriesMarker';

export interface SeriesLabelsStackProps {
  formattedY: string;
  metricName: string;
  metricLabels: string[];
  markerColor: string;
}

export function SeriesLabelsStack(props: SeriesLabelsStackProps): ReactElement {
  const { formattedY, markerColor, metricName, metricLabels } = props;
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex h-4 flex-row items-center justify-start text-white" style={{ fontSize: '11px' }}>
        <SeriesMarker markerColor={markerColor} className="mt-0.5" />
        <span>
          {metricName}
          <span className="text-white font-bold pl-[2px]">{formattedY}</span>
        </span>
      </div>
      <Separator className="border-gray-500" />
      <div className="text-white">
        {metricLabels.map((label) => {
          // show labels on separate lines when many labels and only one focused series
          if (label) {
            const [name, value] = label.split('=');
            const formattedName = value !== undefined ? `${name}: ` : name;
            const formattedValue = value !== undefined ? value.replace(/(^"|"$)/g, '') : value;
            return (
              <div key={label} className="flex gap-1">
                <span style={{ fontSize: '11px' }}>{formattedName}</span>
                <span className="text-white font-bold" style={{ fontSize: '11px' }}>
                  {formattedValue}
                </span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
