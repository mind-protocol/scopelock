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
        // ScopeLock Dark Theme (from MECHANISM.md)
        background: '#0E1116',
        surface: '#151A21',
        'surface-hover': '#1A2028',
        text: '#E6EAF2',
        muted: '#9AA3AE',
        accent: '#1EE5B8',
        'accent-2': '#64A8FF',
        success: '#5CE27E',
        warning: '#FFC857',
        danger: '#FF5D5D',
        border: '#2A3139',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
