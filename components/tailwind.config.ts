import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Perses design system colors
        perses: {
          blue: {
            50: '#E7F1FC',
            100: '#D0E3FA',
            200: '#A1C7F5',
            300: '#72ABF0',
            400: '#438FEB',
            500: '#1473E6',
            600: '#105CB8',
            700: '#0C458A',
            800: '#082E5C',
            900: '#04172E',
          },
          grey: {
            50: '#F0F1F6',
            100: '#E1E3ED',
            200: '#C3C7DB',
            300: '#A4ACC8',
            400: '#8690B6',
            500: '#717CA4',
            600: '#535D83',
            700: '#3E4662',
            800: '#2A2E42',
            850: '#1F2331',
            900: '#151721',
            950: '#0A0C10',
          },
          red: {
            50: '#FDEDED',
            400: '#EE6C6C',
            500: '#EA4747',
            600: '#BD3939',
          },
          green: {
            50: '#E8F5E9',
            400: '#66BB6A',
            500: '#4CAF50',
          },
          orange: {
            50: '#FFF3E0',
            400: '#FFA726',
            500: '#FF9800',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
