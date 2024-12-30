/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '100%',
        md: '100%',
        lg: '900px',
        xl: '900px',
        '2xl': '900px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'var(--background)',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        primaryActive: {
          DEFAULT: 'hsl(var(--primaryActive))',
          foreground: 'hsl(var(--primaryActive-foreground))',
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
        accordion: {
          bg: 'hsl(var(--accordion-bg))',
          body: 'hsl(var(--accordion-body))',
        },
        // grays
        // TODO: fix
        /* customGray: {
          '100': 'var(--gray-100)',
          '75': 'hsl(var(--gray-75))',
          '50': 'hsl(var(--gray-50))',
        '40': 'var(--gray-40)',
          '25': 'var(--gray-25)',
          '15': 'rgba(var(--gray-15))',
          '10': 'hsl(var(--gray-10))',
        }, */
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
      fontSize: {
        // desktop
        'h1-desktop': '2.5rem',
        'h2-desktop': '2rem',
        'h3-desktop': '1.5rem',
        'h4-desktop': '1.24rem',
        'h5-desktop': '0.99rem', // used for paragraphs
        'h6-desktop': '0.875rem',
        // mobile
        'h1-mobile': '2rem',
        'h2-mobile': '1.6rem',
        'h3-mobile': '1.2rem',
        'h4-mobile': '0.99rem',
        'h5-mobile': '0.79rem',
        'h6-mobile': '0.7rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config

export default config
