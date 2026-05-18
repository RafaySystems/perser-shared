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

import { PluginLoaderComponent, useListPluginMetadata } from '@perses-dev/plugin-system';
import { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button, Card, useLocalStorage } from '@perses-dev/components';
import { ExploreToolbar } from '../ExploreToolbar';
import { useExplorerManagerContext } from './ExplorerManagerProvider';

const EXPLORE_TABS_COLLAPSED_KEY = 'PERSES_EXPLORE_TABS_COLLAPSED';

export interface ExploreManagerProps {
  exploreTitleComponent?: ReactNode;
}

export function ExploreManager(props: ExploreManagerProps): ReactElement {
  const { exploreTitleComponent } = props;
  const { explorer, setExplorer } = useExplorerManagerContext();

  const plugins = useListPluginMetadata(['Explore']);

  const [isCollapsed, setIsCollapsed] = useLocalStorage<boolean>(EXPLORE_TABS_COLLAPSED_KEY, false);

  const explorerPluginsMap = useMemo(
    () =>
      Object.fromEntries(plugins.data?.map((plugin) => [`${plugin.module.name}-${plugin.spec.name}`, plugin]) ?? []),
    [plugins.data]
  );

  useEffect(() => {
    const plugins = Object.keys(explorerPluginsMap);
    if (!explorer && plugins?.[0]) {
      setExplorer(plugins[0]);
    }
  }, [explorerPluginsMap, explorer, setExplorer]);

  const currentPlugin = explorer ? explorerPluginsMap[explorer] : undefined;

  if (!explorer) {
    return <div>No explorer plugin available</div>;
  }

  return (
    <div className="flex flex-col w-full px-2 pb-2 pt-[1.5] gap-1">
      <ExploreToolbar exploreTitleComponent={exploreTitleComponent} />

      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div
          className="border-b md:border-b-0 md:border-r border-border"
          style={{ minWidth: isCollapsed ? 15 : 100 }}
        >
          <div className="relative h-[30px] hidden md:block" test-id="qdqwd">
            <Button
              title={isCollapsed ? 'Expand explorer tabs' : 'Collapse explorer tabs'}
              aria-label={isCollapsed ? 'Expand explorer tabs' : 'Collapse explorer tabs'}
              variant="ghost"
              className="absolute -right-[15px] z-[1] p-1 min-w-0"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>

          <div
            className={`${isCollapsed ? 'hidden' : 'flex'} flex-row md:flex-col`}
          >
            {plugins.data
              ?.sort((a, b) => a.spec.display.name.localeCompare(b.spec.display.name))
              .map((plugin) => {
                const value = `${plugin.module.name}-${plugin.spec.name}`;
                return (
                  <button
                    key={value}
                    onClick={() => setExplorer(value)}
                    className={`px-2 py-1 text-sm text-left hover:bg-accent transition-colors ${explorer === value ? 'bg-accent font-medium' : ''}`}
                  >
                    {plugin.spec.display.name}
                  </button>
                );
              })}
          </div>
        </div>
        <Card className="p-[10px] w-full">
          {currentPlugin && (
            <PluginLoaderComponent
              key={`${currentPlugin.module.name}-${currentPlugin.spec.name}`}
              plugin={{
                name: currentPlugin.spec.name,
                moduleName: currentPlugin.module.name,
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
