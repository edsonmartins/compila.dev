import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores Primárias (Brand) - mantidas consistente entre temas
        primary: {
          DEFAULT: "#0F2A44", // Azul Profundo (principal)
          dark: "#0A1E30",
          light: "#1A3A5C", // Versão mais clara para dark mode
        },
        accent: {
          DEFAULT: "#1ECAD3", // Ciano (destaque/output)
          hover: "#19B5BE",
        },
        // Cores Neutras - Light mode
        neutral: {
          white: "#FFFFFF",
          dark: "#1F2933",
          light: "#F3F4F6",
        },
        // Dark mode cores - inspirado no pullwise.ai mas com azul
        dark: {
          background: "#0A0F1D", // Fundo principal (quase preto com leve azulado)
          foreground: "#F1F5F9", // Texto principal (branco azulado)
          card: "#111827", // Cards (cinza muito escuro)
          "card-hover": "#1F2937", // Cards em hover
          border: "#1F2937", // Bordas
          "border-light": "#374151", // Bordas mais visíveis
          muted: "#6B7280", // Texto secundário
          "muted-light": "#9CA3AF", // Texto terciário
        },
        // Cores de fundo por seção
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-fira)", "monospace"],
      },
      letterSpacing: {
        wide: "0.02em", // +2% tracking
        wider: "0.04em", // +4% tracking
      },
      spacing: {
        xs: "0.5rem", // 8px
        s: "1rem", // 16px
        m: "1.5rem", // 24px
        l: "3rem", // 48px
        xl: "6rem", // 96px
      },
    },
  },
  plugins: [],
};

export default config;
