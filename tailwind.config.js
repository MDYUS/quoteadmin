
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
          '950': '#172554',
        },
        neutral: {
           '50': '#f8fafc',
           '100': '#f1f5f9',
           '200': '#e2e8f0',
           '300': '#cbd5e1',
           '400': '#94a3b8',
           '500': '#64748b',
           '600': '#475569',
           '700': '#334155',
           '800': '#1e293b',
           '900': '#0f172a',
           '950': '#020617',
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '75%': { opacity: '1', transform: 'scale(1.05) translateY(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-in-out': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '90%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        'pulse-red-border': {
          '0%, 100%': { borderColor: 'rgba(239, 68, 68, 0.5)' },
          '50%': { borderColor: 'rgba(239, 68, 68, 1)' },
        },
        'pulse-red-border-strong': {
          '0%, 100%': { borderColor: 'rgba(239, 68, 68, 0.4)' },
          '50%': { borderColor: 'rgba(239, 68, 68, 1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'pop-in': 'pop-in 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
        'fade-in-out': 'fade-in-out 3s ease-in-out forwards',
        'pulse-red-border': 'pulse-red-border 2.5s ease-in-out infinite',
        'pulse-red-border-strong': 'pulse-red-border-strong 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
