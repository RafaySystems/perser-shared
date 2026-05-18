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

import { Alert, AlertDescription, Button, ErrorBoundary, ErrorAlert } from '@perses-dev/components';
import { TimeRangeControls, useTimeZoneParams } from '@perses-dev/plugin-system';
import { ReactElement, ReactNode } from 'react';
import { OnSaveDashboard, useEditMode, useDashboardLinks } from '../../context';
import { AddPanelButton } from '../AddPanelButton';
import { AddGroupButton } from '../AddGroupButton';
import { DownloadButton } from '../DownloadButton';
import { EditVariablesButton } from '../Variables';
import { EditDatasourcesButton } from '../Datasources';
import { EditButton } from '../EditButton';
import { EditJsonButton } from '../EditJsonButton';
import { SaveDashboardButton } from '../SaveDashboardButton';
import { DashboardStickyToolbar } from '../DashboardStickyToolbar';
import { EditDashboardLinksButton } from '../DashboardLinks';
import { LinksDisplay } from '../LinksDisplay';

export interface DashboardToolbarProps {
  dashboardName: string;
  dashboardTitleComponent?: ReactNode;
  initialVariableIsSticky?: boolean;
  isReadonly: boolean;
  isVariableEnabled: boolean;
  isDatasourceEnabled: boolean;
  isLinksEnabled?: boolean;
  onEditButtonClick: () => void;
  onCancelButtonClick: () => void;
  onSave?: OnSaveDashboard;
}

export const DashboardToolbar = (props: DashboardToolbarProps): ReactElement => {
  const {
    dashboardName,
    dashboardTitleComponent,
    initialVariableIsSticky,
    isReadonly,
    isVariableEnabled,
    isDatasourceEnabled,
    isLinksEnabled = true,
    onEditButtonClick,
    onCancelButtonClick,
    onSave,
  } = props;

  const { isEditMode } = useEditMode();
  const { timeZone, setTimeZone } = useTimeZoneParams('local');
  const dashboardLinks = useDashboardLinks();

  const dashboardTitle = dashboardTitleComponent ? (
    dashboardTitleComponent
  ) : (
    <h2 className="text-base font-semibold">{dashboardName}</h2>
  );

  const testId = 'dashboard-toolbar';

  return (
    <>
      <div data-testid={testId} className="flex flex-col">
        <div
          className="px-2 py-1.5 flex gap-2"
          style={{ backgroundColor: isEditMode ? 'color-mix(in srgb, var(--primary) 30%, transparent)' : undefined }}
        >
          {dashboardTitle}
          {isLinksEnabled && (
            <div className="flex justify-items-center items-center justify-center">
              <LinksDisplay links={dashboardLinks} variant="dashboard" />
            </div>
          )}
          {isEditMode ? (
            <div className="flex flex-row gap-1 ml-auto">
              {isReadonly && (
                <Alert variant="default" className="bg-transparent p-0 border-0">
                  <AlertDescription>
                    Dashboard managed via code only. Download JSON and commit changes to save.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex flex-row gap-0.5 ml-1 whitespace-nowrap">
                {isVariableEnabled && <EditVariablesButton />}
                {isDatasourceEnabled && <EditDatasourcesButton />}
                {isLinksEnabled && <EditDashboardLinksButton />}
                <AddPanelButton />
                <AddGroupButton />
              </div>
              <SaveDashboardButton onSave={onSave} isDisabled={isReadonly} />
              <Button variant="outline" onClick={onCancelButtonClick}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden sm:flex flex-row gap-1 ml-auto">
                <EditButton onClick={onEditButtonClick} />
              </div>
            </>
          )}
        </div>
        <div className="flex w-full items-start px-2 pt-1 flex-col md:flex-row flex-nowrap gap-1">
          <div className="w-full">
            <ErrorBoundary FallbackComponent={ErrorAlert}>
              <DashboardStickyToolbar
                initialVariableIsSticky={initialVariableIsSticky}
                className="bg-background"
              />
            </ErrorBoundary>
          </div>
          <div className="flex flex-row ml-auto flex-wrap justify-end">
            <div className="flex flex-row gap-1 mt-1 ml-1">
              <TimeRangeControls timeZone={timeZone} onTimeZoneChange={(tz) => setTimeZone(tz.value)} />
              <DownloadButton />
              <EditJsonButton isReadonly={!isEditMode} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
