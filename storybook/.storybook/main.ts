import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@perses-dev/components': path.resolve(__dirname, '../../components/src'),
      '@perses-dev/dashboards': path.resolve(__dirname, '../../dashboards/src'),
      '@perses-dev/explore': path.resolve(__dirname, '../../explore/src'),
      '@perses-dev/plugin-system': path.resolve(__dirname, '../../plugin-system/src'),
    };
    return config;
  },
};

export default config;
