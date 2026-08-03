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

import { Box, Dialog, IconButton, Stack, Typography } from '@rafaysystems/components/compat/mui';
import { Close as CloseIcon } from '@rafaysystems/components/compat/icons';
import {
  DataQueriesProvider,
  TimeRangeControls,
  useSuggestedStepMs,
  useTimeZoneParams,
} from '@rafaysystems/plugin-system';
import { PanelDefinition } from '@perses-dev/spec';
import { ReactElement, useCallback, useMemo } from 'react';
import { useDashboardStore, useViewPanel } from '../../context';
import { Panel } from '../Panel';

/** Force legend to the right while a panel is opened in the large dialog. */
function withRightLegend(definition: PanelDefinition): PanelDefinition {
  const pluginSpec = (definition.spec.plugin.spec ?? {}) as Record<string, unknown>;
  const legend = (pluginSpec.legend ?? {}) as Record<string, unknown>;
  return {
    ...definition,
    spec: {
      ...definition.spec,
      plugin: {
        ...definition.spec.plugin,
        spec: {
          ...pluginSpec,
          legend: {
            ...legend,
            position: 'right',
          },
        },
      },
    },
  };
}

/**
 * Opens the expanded panel action in an ~80% viewport dialog with time-range toolbar
 * and legend forced to the right for chart panels.
 */
export function ViewPanelDialog(): ReactElement | null {
  const { viewPanelId, setViewPanel } = useViewPanel();
  const { timeZone, setTimeZone } = useTimeZoneParams('local');

  const panelDefinition = useDashboardStore(
    useCallback(
      (store) => {
        if (!viewPanelId) return undefined;
        const panelKey =
          store.panelGroups[viewPanelId.panelGroupId]?.itemPanelKeys[viewPanelId.panelGroupItemLayoutId];
        if (!panelKey) return undefined;
        return store.panels[panelKey];
      },
      [viewPanelId]
    )
  );

  const open = Boolean(viewPanelId && panelDefinition);
  const definition = useMemo(
    () => (panelDefinition ? withRightLegend(panelDefinition) : undefined),
    [panelDefinition]
  );

  const dialogWidth = typeof window !== 'undefined' ? Math.round(window.innerWidth * 0.8) : 960;
  const suggestedStepMs = useSuggestedStepMs(dialogWidth);

  const onClose = (): void => {
    setViewPanel(undefined);
  };

  if (!open || !definition) {
    return null;
  }

  const title = definition.spec.display?.name ?? 'Panel';
  const queries = definition.spec.queries ?? [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      className="!max-h-[80vh] !w-[80vw] !max-w-none"
      style={{ width: '80vw', maxWidth: '80vw', height: '80vh', maxHeight: '80vh' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '80vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid var(--border, rgba(0,0,0,0.12))',
            flexShrink: 0,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h6" noWrap sx={{ flex: '1 1 auto', minWidth: 0 }}>
            {title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
            <TimeRangeControls timeZone={timeZone} onTimeZoneChange={(tz) => setTimeZone(tz.value)} />
            <IconButton aria-label="Close expanded panel" size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            p: 1.5,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ flex: 1, minHeight: 0, width: '100%', height: '100%' }}>
            <DataQueriesProvider
              definitions={queries}
              options={{ suggestedStepMs }}
              queryOptions={{ enabled: open }}
            >
              <Panel
                definition={definition}
                panelOptions={{ showIcons: 'always' }}
                readHandlers={{
                  isPanelViewed: true,
                  onViewPanelClick: onClose,
                }}
                sx={{ height: '100%' }}
              />
            </DataQueriesProvider>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
