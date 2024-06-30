import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: {
          base: "var(--color-primary)",
          on: "var(--color-on-primary)",
          container: "var(--color-primary-container)",
          container_on: "var(--color-on-primary-container)",
        },

        secondary: {
          base: "var(--color-secondary)",
          on: "var(--color-on-secondary)",
          container: "var(--color-secondary-container)",
          container_on: "var(--color-on-secondary-container)",
        },

        tertiary: {
          base: "var(--color-tertiary)",
          on: "var(--color-on-tertiary)",
          container: "var(--color-tertiary-container)",
          container_on: "var(--color-on-tertiary-container)",
        },

        error: {
          base: "var(--color-error)",
          on: "var(--color-on-error)",
          container: "var(--color-error-container)",
          container_on: "var(--color-on-error-container)",
        },

        surface: {
          dim: "var(--color-surface-dim)",
          base: "var(--color-surface)",
          bright: "var(--color-surface-bright)",
          container_lowest: "var(--color-surface-container-lowest)",
          container_low: "var(--color-surface-container-low)",
          container: "var(--color-surface-container)",
          container_high: "var(--color-surface-container-high)",
          container_highest: "var(--color-surface-container-highest)",
          on: "var(--color-on-surface)",
          on_variant: "var(--color-on-surface-variant)",
        },

        outline: {
          base: "var(--color-outline)",
          variant: "var(--color-outline-variant)",
        },

        airbnb: "var(--color-airbnb)",
        hotpink: "hotpink",
      },
    },
  },
  plugins: [],
} satisfies Config;
