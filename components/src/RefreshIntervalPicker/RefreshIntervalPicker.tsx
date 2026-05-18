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

import { DurationString } from '@perses-dev/spec';
import { ReactElement, useMemo } from 'react';
import { TimeOption } from '../model';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface RefreshIntervalPickerProps {
  timeOptions: TimeOption[];
  value?: DurationString;
  onChange: (value: DurationString) => void;
  height?: string;
}

export function RefreshIntervalPicker(props: RefreshIntervalPickerProps): ReactElement {
  const { value, onChange, timeOptions, height } = props;

  // If the dashboard refresh interval is not provided in timeOptions, it will create a specific option for the select
  const customInterval = useMemo(() => {
    if (value && !timeOptions.some((option) => option.value.pastDuration === value)) {
      return <SelectItem value={value}>{value}</SelectItem>;
    }
  }, [timeOptions, value]);

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        onChange(val as DurationString);
      }}
    >
      <SelectTrigger
        aria-label={`Select refresh interval. Currently set to ${value}`}
        style={height ? { lineHeight: height, paddingTop: 0, paddingBottom: 0 } : undefined}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((item, idx) => (
          <SelectItem key={idx} value={item.value.pastDuration}>
            {item.display}
          </SelectItem>
        ))}
        {customInterval}
      </SelectContent>
    </Select>
  );
}
