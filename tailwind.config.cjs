module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./templates/**/*.{md}"] ,
  theme: {
    extend: {
      colors: {
        background: "#0b1220",
        surface: "#121d31",
        card: "#111a2c",
        foreground: "#eaf1fb",
        primary: {
          DEFAULT: '#3b82f6',
          600: '#2563eb'
        },
        muted: '#9eb0c9',
        accent: '#60a5fa'
      },
    },
  },
  plugins: [],
};
