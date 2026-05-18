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

import { createInstance, ModuleFederation } from '@module-federation/enhanced/runtime';
import * as emotionReact from '@emotion/react';
import * as emotionStyled from '@emotion/styled';
import * as hookformResolversZod from '@hookform/resolvers/zod';
import * as PersesComponents from '@perses-dev/components';
import * as PersesCore from '@perses-dev/core';
import * as PersesDashboards from '@perses-dev/dashboards';
import * as PersesExplore from '@perses-dev/explore';
import * as PersesPluginSystem from '@perses-dev/plugin-system';
import * as ReactQuery from '@tanstack/react-query';
import * as dateFns from 'date-fns';
import * as dateFnsTz from 'date-fns-tz';
import * as immerModule from 'immer';
import lodash from 'lodash';
import * as lucideReact from 'lucide-react';
import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactHookForm from 'react-hook-form';
import * as ReactRouterDOM from 'react-router-dom';
import useResizeObserver from 'use-resize-observer';
import { PersesPlugin, RemotePluginModule } from './PersesPlugin.types';

let instance: ModuleFederation | null = null;

const getPluginRuntime = (): ModuleFederation => {
  if (instance === null) {
    const pluginRuntime = createInstance({
      name: '@perses/perses-ui-host',
      remotes: [], // all remotes are loaded dynamically
      shared: {
        react: {
          version: React.version,
          lib: () => React,
          shareConfig: {
            singleton: true,
            requiredVersion: `^${React.version}`,
          },
        },
        'react-dom': {
          version: '18.3.1',
          lib: () => ReactDOM,
          shareConfig: {
            singleton: true,
            requiredVersion: `^18.3.1`,
          },
        },
        'react-router-dom': {
          version: '6.26.0',
          lib: () => ReactRouterDOM,
          shareConfig: {
            singleton: true,
            requiredVersion: '^6.26.0',
          },
        },
        '@tanstack/react-query': {
          version: '4.39.1',
          lib: () => ReactQuery,
          shareConfig: {
            singleton: true,
            requiredVersion: '^4.39.1',
          },
        },
        'react-hook-form': {
          version: '7.52.2',
          lib: () => ReactHookForm,
          shareConfig: {
            singleton: true,
            requiredVersion: '^7.52.2',
          },
        },
        '@perses-dev/core': {
          version: '0.53.1',
          lib: () => PersesCore,
          shareConfig: {
            singleton: true,
            requiredVersion: '^0.53.1',
          },
        },
        '@perses-dev/components': {
          version: '0.53.1',
          lib: () => PersesComponents,
          shareConfig: {
            singleton: true,
            requiredVersion: '^0.53.1',
          },
        },
        '@perses-dev/plugin-system': {
          version: '0.53.1',
          lib: () => PersesPluginSystem,
          shareConfig: {
            singleton: true,
            requiredVersion: '^0.53.1',
          },
        },
        '@perses-dev/explore': {
          version: '0.53.1',
          lib: () => PersesExplore,
          shareConfig: {
            singleton: true,
            requiredVersion: '^0.53.1',
          },
        },
        '@perses-dev/dashboards': {
          version: '0.53.1',
          lib: () => PersesDashboards,
          shareConfig: {
            singleton: true,
            requiredVersion: '^0.53.1',
          },
        },
        'date-fns': {
          version: '4.1.0',
          lib: () => dateFns,
          shareConfig: {
            singleton: true,
            requiredVersion: '^4.1.0',
          },
        },
        'date-fns-tz': {
          version: '3.2.0',
          lib: () => dateFnsTz,
          shareConfig: {
            singleton: true,
            requiredVersion: '^3.2.0',
          },
        },
        lodash: {
          version: '4.17.21',
          lib: () => lodash,
          shareConfig: {
            singleton: true,
            requiredVersion: '^4.17.21',
          },
        },
        '@emotion/react': {
          version: '11.11.3',
          lib: () => emotionReact,
          shareConfig: {
            singleton: true,
            requiredVersion: '^11.11.3',
          },
        },
        '@emotion/styled': {
          version: '11.11.0',
          lib: () => emotionStyled,
          shareConfig: {
            singleton: true,
            requiredVersion: '^11.11.0',
          },
        },
        '@hookform/resolvers/zod': {
          version: '3.3.4',
          lib: () => hookformResolversZod,
          shareConfig: {
            singleton: true,
            requiredVersion: '^3.3.4',
          },
        },
        'use-resize-observer': {
          version: '9.1.0',
          lib: () => useResizeObserver,
          shareConfig: {
            singleton: true,
            requiredVersion: '^9.1.0',
          },
        },
        'lucide-react': {
          version: '0.469.0',
          lib: () => lucideReact,
          shareConfig: {
            singleton: true,
            requiredVersion: '^0.469.0',
          },
        },
        immer: {
          version: '10.1.1',
          lib: () => immerModule,
          shareConfig: {
            singleton: true,
            requiredVersion: '^10.1.1',
          },
        },
      },
    });

    instance = pluginRuntime;

    return instance;
  }
  return instance;
};

const registerRemote = (name: string, baseURL?: string): void => {
  const pluginRuntime = getPluginRuntime();
  const existingRemote = pluginRuntime.options.remotes.find((remote) => remote.name === name);
  if (!existingRemote) {
    const remoteEntryURL = baseURL ? `${baseURL}/${name}/mf-manifest.json` : `/plugins/${name}/mf-manifest.json`;
    pluginRuntime.registerRemotes([
      {
        name,
        entry: remoteEntryURL,
        alias: name,
      },
    ]);
  }
};

export const loadPlugin = async (
  moduleName: string,
  pluginName: string,
  baseURL?: string
): Promise<RemotePluginModule | null> => {
  registerRemote(moduleName, baseURL);

  const pluginRuntime = getPluginRuntime();

  return pluginRuntime.loadRemote<RemotePluginModule>(`${moduleName}/${pluginName}`);
};

export function usePluginRuntime({ plugin }: { plugin: PersesPlugin }): {
  pluginRuntime: ModuleFederation;
  loadPlugin: () => Promise<RemotePluginModule | null>;
} {
  return {
    pluginRuntime: getPluginRuntime(),
    loadPlugin: () => loadPlugin(plugin.moduleName, plugin.name, plugin.baseURL),
  };
}
