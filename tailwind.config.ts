import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"]
      },
      colors: {
        ink: "#17201d",
        moss: "#45624d",
        leaf: "#6fa174",
        mint: "#dceee2",
        skywash: "#e8f3f8",
        coral: "#d98870",
        sun: "#f4c95d",
        paper: "#fbfaf6",
        // New extended palette
        peach: "#ffd4b2",
        lilac: "#e8d5f5",
        "sky-soft": "#c8e6f9",
        "warm-white": "#fffdf7",
        lavender: "#d4ccf0",
        blush: "#f9d6e3",
        "leaf-dark": "#3d7045",
        "ink-soft": "#2c3a34"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 29, 0.10)",
        glow: "0 0 32px rgba(111, 161, 116, 0.28)",
        "glow-coral": "0 0 32px rgba(217, 136, 112, 0.32)",
        "glow-sun": "0 0 24px rgba(244, 201, 93, 0.36)",
        "card-up": "0 24px 64px rgba(23, 32, 29, 0.14)",
        float: "0 8px 32px rgba(23, 32, 29, 0.18)"
      },
      backgroundImage: {
        "gradient-peach": "linear-gradient(135deg, #ffd4b2, #f9d6e3)",
        "gradient-mint": "linear-gradient(135deg, #dceee2, #c8e6f9)",
        "gradient-sun": "linear-gradient(135deg, #f4c95d, #ffd4b2)",
        "gradient-lavender": "linear-gradient(135deg, #e8d5f5, #d4ccf0)",
        "gradient-hero": "linear-gradient(160deg, #fffdf7 0%, #e8f3f8 50%, #f9f0fc 100%)"
      },
      animation: {
        "luma-float": "luma-float 4.2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.8s ease-in-out infinite",
        blink: "blink 5s infinite",
        "orbit-spin": "orbit-spin 9s linear infinite",
        "chip-bob": "chip-bob 3.6s ease-in-out infinite",
        "mic-pulse": "mic-pulse 1.1s ease infinite",
        "star-twinkle": "star-twinkle 3s ease-in-out infinite",
        "screen-fade": "screen-fade 320ms ease both",
        "pop-in": "pop-in 400ms cubic-bezier(0.34,1.56,0.64,1) both",
        "slide-up": "slide-up 300ms ease both",
        "heart-beat": "heart-beat 1.4s ease-in-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
        wave: "wave 0.9s ease-in-out infinite",
        "mood-bounce": "mood-bounce 350ms cubic-bezier(0.34,1.56,0.64,1)",
        "ring-fill": "ring-fill 1.2s cubic-bezier(0.4,0,0.2,1) forwards",
        "fade-in": "fade-in 400ms ease both",
        "particle-drift": "particle-drift 3s ease-in-out infinite"
      },
      keyframes: {
        "luma-float": {
          "0%,100%": { transform: "translate(-50%,-50%) rotateX(10deg) translateY(0)" },
          "50%": { transform: "translate(-50%,-50%) rotateX(10deg) translateY(-12px)" }
        },
        "pulse-glow": {
          "0%,100%": { opacity: "0.45", transform: "scale(0.96)" },
          "50%": { opacity: "0.82", transform: "scale(1.08)" }
        },
        blink: {
          "0%,94%,100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(0.12)" }
        },
        "orbit-spin": {
          to: { rotate: "360deg" }
        },
        "chip-bob": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" }
        },
        "mic-pulse": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(217,136,112,0.32)" },
          "50%": { boxShadow: "0 0 0 10px rgba(217,136,112,0)" }
        },
        "star-twinkle": {
          "0%,100%": { opacity: "0.72", transform: "scale(0.94)" },
          "50%": { opacity: "1", transform: "scale(1.06)" }
        },
        "screen-fade": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "pop-in": {
          from: { opacity: "0", transform: "scale(0.7)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "heart-beat": {
          "0%,100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.15)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.1)" },
          "70%": { transform: "scale(1)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        wave: {
          "0%,100%": { transform: "scaleY(0.5)" },
          "50%": { transform: "scaleY(1.4)" }
        },
        "mood-bounce": {
          from: { transform: "scale(0.8)" },
          to: { transform: "scale(1)" }
        },
        "ring-fill": {
          from: { strokeDashoffset: "339" },
          to: { strokeDashoffset: "var(--ring-offset)" }
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "particle-drift": {
          "0%,100%": { transform: "translateY(0) translateX(0) scale(1)", opacity: "0.7" },
          "33%": { transform: "translateY(-12px) translateX(6px) scale(1.1)", opacity: "1" },
          "66%": { transform: "translateY(-6px) translateX(-8px) scale(0.9)", opacity: "0.8" }
        }
      }
    }
  },
  plugins: []
};

export default config;
