/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        panel: '#111827',
        card: '#1F2937',
        code: '#0F172A',
        primary: {
          50: '#EEF2FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#3730A3',
        },
        primaryHover: '#4F46E5',
        border: '#1F2937',
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
        success: '#22C55E',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'panel': '12px',
      },
      spacing: {
        'sidebar': '240px',
        'navbar': '64px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'lift': 'lift 0.2s ease-out',
      },
      keyframes: {
        lift: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-2px)' },
        }
      }
    },
  },
  plugins: [],
}
