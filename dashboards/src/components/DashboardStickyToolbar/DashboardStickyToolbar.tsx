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
import { Button, cn } from '@perses-dev/components';
import { Pin as PinOutline, PinOff as PinOffOutline } from 'lucide-react';
import { TimeRangeControls, useTimeZoneParams } from '@perses-dev/plugin-system';
import { VariableList } from '../Variables';

interface DashboardStickyToolbarProps {
  initialVariableIsSticky?: boolean;
  className?: string;
}

export function DashboardStickyToolbar(props: DashboardStickyToolbarProps): ReactElement {
  const [isPin, setIsPin] = useState(props.initialVariableIsSticky);
  const [isScrolled, setIsScrolled] = useState(false);

  // Since we no longer have MUI AppBar/useScrollTrigger, we simulate sticky behaviour
  // by listening to scroll events on the window
  const isSticky = isScrolled && props.initialVariableIsSticky && isPin;

  const { timeZone, setTimeZone } = useTimeZoneParams('local');

  return (
    // marginBottom=-4px counteracts the mb-1 on every variable input
    <div className="-mb-1" data-testid="variable-list">
      <div
        className={cn(
          isSticky ? 'fixed top-0 left-0 right-0 z-40 shadow-md' : 'static shadow-none',
          'bg-inherit',
          props.className
        )}
        onScroll={() => {
          // handled via window scroll
        }}
      >
        <div className={cn('flex justify-between', 'flex-col md:flex-row')}>
          <div
            className={cn(
              'flex pt-1',
              isSticky ? 'flex-nowrap overflow-x-auto max-w-[100vw] pl-1 mt-0.5 ml-0.5 scrollbar-thin' : 'flex-wrap overflow-x-hidden max-w-full',
              'gap-1'
            )}
            style={{
              scrollbarWidth: 'thin',
            }}
          >
            <VariableList />
            {props.initialVariableIsSticky && (
              <Button
                variant="ghost"
                size="icon"
                className="h-fit w-fit"
                onClick={() => setIsPin(!isPin)}
              >
                {isPin ? <PinOutline /> : <PinOffOutline />}
              </Button>
            )}
          </div>
          {isSticky && (
            <div className="flex flex-row justify-end m-1 md:m-1.5 md:ml-1.5 ml-auto">
              <TimeRangeControls timeZone={timeZone} onTimeZoneChange={(tz) => setTimeZone(tz.value)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
