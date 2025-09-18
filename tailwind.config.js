/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#43d5cb", // RGB(67,213,203)
        secondary: "#435ba1", // RGB(67,91,161)
        accent: "#4c69c6", // RGB(76,105,198)
        light: "#fafafa", // RGB(250,250,250)
        dark: "#333333", // RGB(51,51,51)
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.dark"),
            "--tw-prose-headings": theme("colors.primary"),
            "--tw-prose-links": theme("colors.accent"),
            "--tw-prose-bold": theme("colors.secondary"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
