/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#F46173',
          hover: '#E14C61',
          soft: '#FDE8EB',
        },
        accent: {
          DEFAULT: '#D9A441',
          soft: '#F8EDD4',
        },
        success: {
          DEFAULT: '#5C8D76',
          soft: '#E4F0EA',
        },
        ink: '#1F2937',
        muted: '#6B7280',
        line: '#E8E2D9',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(31, 41, 55, 0.06)',
        card: '0 8px 30px rgba(31, 41, 55, 0.08)',
        lift: '0 16px 40px rgba(31, 41, 55, 0.12)',
        glow: '0 8px 24px rgba(244, 97, 115, 0.25)',
      },
      maxWidth: {
        content: '1200px',
        wide: '1400px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease forwards',
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
}
