/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /** Primary brand color: orange */
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        /** Sign-in left panel background */
        auth: {
          panel: '#f8fbff',
        },
        /** Sidebar: active uses primary orange; badge (sky) for contrast */
        sidebar: {
          active: '#ea580c',
          'active-hover': '#c2410c',
          badge: '#0ea5e9',
          'badge-muted': '#e0f2fe',
          profile: '#f1f5f9',
          'profile-border': '#cbd5e1',
        },
      },
    },
  },
  plugins: [],
}
