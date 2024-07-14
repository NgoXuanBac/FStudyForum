import withMT from "@material-tailwind/react/utils/withMT";
import defaultTheme from "tailwindcss/defaultTheme"

export default withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter",...defaultTheme.fontFamily.sans],
        sans: ["Lexend", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
})

