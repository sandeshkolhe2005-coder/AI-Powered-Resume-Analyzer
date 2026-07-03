/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0F1115',
        bgSurface: '#1A1D23',
        bgSurfaceHover: '#22262E',
        borderSubtle: '#2A2E37',
        accentPrimary: '#5B8CFF',
        accentViolet: '#7C5CFF',
        brandSuccess: '#34D399',
        brandWarning: '#FBBF24',
        brandDanger: '#F87171',
        textPrimary: '#F5F6F8',
        textSecondary: '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
