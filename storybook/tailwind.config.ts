import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/**/*.{ts,tsx}',
    '../components/src/**/*.{ts,tsx}',
    '../dashboards/src/**/*.{ts,tsx}',
    '../explore/src/**/*.{ts,tsx}',
    '../plugin-system/src/**/*.{ts,tsx}',
  ],
  presets: [require('../components/tailwind.config')],
};

export default config;
