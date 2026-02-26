module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./templates/**/*.{md}"] ,
  theme: {
    extend: {
      colors: {
        background: "#0f172a", /* slate-900 */
        surface: "#0b1220",
        card: "#0f172a",
        foreground: "#e6eef8",
        primary: {
          DEFAULT: '#06b6d4', /* cyan-500 */
          600: '#0891b2'
        },
        muted: '#94a3b8',
        accent: '#7c3aed'
      },
    },
  },
  plugins: [],
};
