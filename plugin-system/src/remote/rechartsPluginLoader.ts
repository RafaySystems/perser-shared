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

import { RECHARTS_PANEL_KINDS, RECHARTS_PANEL_PLUGINS } from '../panels-recharts';
import {
  LOCAL_PROMETHEUS_MODULE_NAME,
  LOCAL_PROMETHEUS_PLUGINS,
} from '../prometheus-local/localPrometheusPlugins';
import type { PluginLoader, PluginModuleResource } from '../model';
import { remotePluginLoader } from './remotePluginLoader';

type RemoteLoaderOptions = Parameters<typeof remotePluginLoader>[0];

function applyLocalPanelPlugins(
  mod: Record<string, unknown>,
  resource: PluginModuleResource
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...mod };
  for (const pluginMeta of resource.spec.plugins) {
    if (pluginMeta.kind === 'Panel' && RECHARTS_PANEL_KINDS.has(pluginMeta.spec.name)) {
      const local = RECHARTS_PANEL_PLUGINS[pluginMeta.spec.name];
      if (local) {
        out[pluginMeta.spec.name] = local;
      }
    }
  }
  return out;
}

function localPanelsModule(resource: PluginModuleResource): Record<string, unknown> {
  const mod: Record<string, unknown> = {};
  for (const pluginMeta of resource.spec.plugins) {
    if (pluginMeta.kind === 'Panel' && RECHARTS_PANEL_KINDS.has(pluginMeta.spec.name)) {
      const local = RECHARTS_PANEL_PLUGINS[pluginMeta.spec.name];
      if (local) {
        mod[pluginMeta.spec.name] = local;
      }
    }
  }
  return mod;
}

/**
 * Loads query/variable plugins from Perses but renders TimeSeries/Stat/Gauge panels with Recharts (shadcn).
 * Prometheus query/datasource/variable plugins are bundled in-process (remote MF breaks on React 18.3).
 */
export function rechartsPluginLoader(options?: RemoteLoaderOptions): PluginLoader {
  const remote = remotePluginLoader(options);

  return {
    getInstalledPlugins: () => remote.getInstalledPlugins(),
    importPluginModule: async (resource) => {
      if (resource.metadata.name === LOCAL_PROMETHEUS_MODULE_NAME) {
        return { ...LOCAL_PROMETHEUS_PLUGINS };
      }

      const panelPlugins = resource.spec.plugins.filter((p) => p.kind === 'Panel');
      const hasNonPanelPlugins = resource.spec.plugins.some((p) => p.kind !== 'Panel');

      if (panelPlugins.length > 0 && !hasNonPanelPlugins) {
        return localPanelsModule(resource);
      }

      const hasLocalPanel = panelPlugins.some((p) => RECHARTS_PANEL_KINDS.has(p.spec.name));
      if (!hasLocalPanel) {
        return remote.importPluginModule(resource);
      }

      const remoteModule = (await remote.importPluginModule(resource)) as Record<string, unknown>;
      return applyLocalPanelPlugins(remoteModule, resource);
    },
  };
}

/** @deprecated Use rechartsPluginLoader */
export const gaapPluginLoader = rechartsPluginLoader;
