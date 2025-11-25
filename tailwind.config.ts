import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors using CSS Variables
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'accent-primary': 'var(--accent-primary)',
        'accent-hover': 'var(--accent-hover)',
        'accent-text-light': 'var(--accent-text-light)',
        'accent-text-lighter': 'var(--accent-text-lighter)',
        'accent-dark': 'var(--accent-dark)',
        'border-primary': 'var(--border-primary)',
        'border-secondary': 'var(--border-secondary)',
        // Keep existing custom colors for backward compatibility
        purple: {
          accent: '#a855f7',
          dark: '#7c3aed',
        },
        pink: {
          accent: '#ec4899',
          dark: '#db2777',
        },
      },
      animation: {
        'typewriter': 'typewriter 2s steps(20) forwards',
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config

