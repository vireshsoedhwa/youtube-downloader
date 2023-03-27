/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },
        extend: {
            keyframes: {
                rotate: {
                    '0%, 100%': { transform: 'rotate(-15deg)' },
                    '50%': { transform: 'rotate(15deg)' },
                },
            },
            animation: {
                rotate: 'wiggle 1s ease-in-out infinite',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
}