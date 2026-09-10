/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: "#0B1120",
                    darker: "#070C16",
                    card: "#111827",
                    "card-hover": "#172033",
                    gold: "#F5B754",
                    "gold-light": "#f0bf72ff",
                    "gold-dark": "#F5B754",
                    white: "#FFFFFF",
                    gray: "#94A3B8",
                    "gray-light": "#CBD5E1",
                    "gray-dark": "#475569",
                    border: "#1E2A3B",
                    "border-light": "#2D3F56",
                },
            },
            fontSize: {
                display: ["5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
                hero: ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
                "heading-xl": ["2.5rem", { lineHeight: "1.2" }],
                "heading-lg": ["2rem", { lineHeight: "1.25" }],
                "heading-md": ["1.5rem", { lineHeight: "1.3" }],
                "heading-sm": ["1.25rem", { lineHeight: "1.4" }],
                "body-lg": ["1.125rem", { lineHeight: "1.6" }],
                body: ["1rem", { lineHeight: "1.6" }],
                "body-sm": ["0.875rem", { lineHeight: "1.5" }],
                caption: ["0.75rem", { lineHeight: "1.4" }],
            },
            fontFamily: {
                heading: ["Roboto", "sans-serif"],
                body: ["Roboto", "sans-serif"],
                hero: ["Philosopher", "serif"],
            },
            backgroundImage: {
                "hero-gradient": "linear-gradient(135deg, #0B1120 0%, #0D1830 50%, #0B1120 100%)",
                "card-gradient": "linear-gradient(180deg, transparent 0%, #0B1120 100%)",
                "gold-gradient": "linear-gradient(135deg, #F4B942 0%, #C9931A 100%)",
            },
            boxShadow: {
                gold: "0 0 30px rgba(244, 185, 66, 0.15)",
                "gold-strong": "0 0 50px rgba(244, 185, 66, 0.3)",
                card: "0 4px 24px rgba(0, 0, 0, 0.4)",
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-out forwards",
                "slide-up": "slideUp 0.6s ease-out forwards",
                "pulse-gold": "pulseGold 2s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                pulseGold: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(244, 185, 66, 0.2)" },
                    "50%": { boxShadow: "0 0 40px rgba(244, 185, 66, 0.5)" },
                },
            },
        },
    },
    plugins: [],
}
