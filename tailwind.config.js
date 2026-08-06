/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#12141C',
        surface: '#1A1D28',
        surfaceAlt: '#20242F',
        rule: '#2C3140',
        gold: '#D9A94E',
        goldSoft: '#E8C878',
        mint: '#6FBF9E',
        coral: '#D97B6C',
        ivory: '#EDEBE4',
        muted: '#8C8FA3',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}