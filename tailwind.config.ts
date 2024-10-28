import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))", //shadcn
          foreground: "hsl(var(--primary-foreground))", //shadcn
          base: "var(--color-primary)",
          on: "var(--color-on-primary)",
          container: "var(--color-primary-container)",
          container_on: "var(--color-on-primary-container)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", //shadcn
          foreground: "hsl(var(--secondary-foreground))", //shadcn
          base: "var(--color-secondary)",
          on: "var(--color-on-secondary)",
          container: "var(--color-secondary-container)",
          container_on: "var(--color-on-secondary-container)",
        },
        tertiary: {
          DEFAULT: "var(--color-tertiary)",
          on: "var(--color-on-tertiary)",
          container: "var(--color-tertiary-container)",
          container_on: "var(--color-on-tertiary-container)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          on: "var(--color-on-error)",
          container: "var(--color-error-container)",
          container_on: "var(--color-on-error-container)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          dim: "var(--color-surface-dim)",
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
          DEFAULT: "var(--color-outline)",
          variant: "var(--color-outline-variant)",
        },
        airbnb: {
          DEFAULT: "var(--color-airbnb)",
          container: "var(--color-airbnb-container)",
        },
        hotpink: "hotpink",

        // shadcn
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
