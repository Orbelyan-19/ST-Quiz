/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                st: {
                    red: '#ff0000', // The iconic neon red
                    dark: '#0a0a0b', // Deep void black
                    glow: '#ff2a2a', // Glow effect color
                    blue: '#0d1b2a', // Upside down blue
                    slime: '#2c3e50',
                }
            },
            fontFamily: {
                title: ['"Rubik Glitch"', 'cursive'], // Glitchy horror title
                body: ['"Courier Prime"', 'monospace'], // Typewriter feel
                serif: ['"Merriweather"', 'serif'], // Fallback for 80s serif
            },
            backgroundImage: {
                'noise': "url('https://grainy-gradients.vercel.app/noise.svg')",
            },
            animation: {
                'flicker': 'flicker 3s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                flicker: {
                    '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
                        opacity: '0.99',
                        filter: 'drop-shadow(0 0 1px rgba(255, 0, 0, 1)) drop-shadow(0 0 5px rgba(255, 0, 0, 1)) drop-shadow(0 0 15px rgba(255, 0, 0, 1))',
                    },
                    '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
                        opacity: '0.4',
                        filter: 'none',
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
