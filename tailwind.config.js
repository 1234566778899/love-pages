/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: { '2xl': '1400px' },
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                /* Paleta suave — acceso directo desde Tailwind */
                paper: '#f9f8fc',
                'paper-2': '#f3f1f9',
                'paper-3': '#ebe7f5',
                'paper-soft': '#ffffff',
                lila: '#f2e4e8',
                'lila-2': '#e3c7cf',
                'lila-soft': '#faf2f4',
                melocoton: '#ffd3c2',
                mint: '#cfe8b8',
                butter: '#ffe9b0',
                ink: '#494a5f',
                'ink-2': '#5c5d72',
                'ink-soft': '#71677e',
                'ink-faint': '#9b93a6',
                'accent-purple': '#7b2240',
                'accent-strong': '#651a34',
                'accent-deep': '#521329',
                'accent-soft': '#f6e8ec',
                plum: '#7b2240',
                gold: '#ffd166',
                hairline: '#f0f0f4',
            },
            fontSize: {
                /* Nada por debajo de 14px: la app antigua vivía en 11-13px */
                eyebrow: ['13px', { lineHeight: '18px', letterSpacing: '0.02em' }],
                caption: ['14px', { lineHeight: '20px' }],
                body: ['16px', { lineHeight: '24px' }],
                'body-lg': ['17px', { lineHeight: '26px' }],
                lead: ['20px', { lineHeight: '32px' }],
            },
            borderRadius: {
                sm: 'var(--r-sm)',
                DEFAULT: 'var(--r-md)',
                md: 'var(--r-md)',
                lg: 'var(--r-lg)',
                xl: 'var(--r-xl)',
                full: '999px',
                /* Keep shadcn compatibility */
                'shadcn-lg': 'var(--radius)',
                'shadcn-md': 'calc(var(--radius) - 2px)',
                'shadcn-sm': 'calc(var(--radius) - 4px)',
            },
            boxShadow: {
                soft: 'var(--shadow-soft)',
                card: 'var(--shadow-card)',
                sticker: 'var(--shadow-sticker)',
                /* Las sombras sólidas de la estética riso pasan a ser suaves;
                   se conservan los nombres porque siguen referenciadas. */
                ink: 'var(--shadow-card)',
                'ink-sm': 'var(--shadow-soft)',
                'ink-xs': 'var(--shadow-soft)',
            },
            fontFamily: {
                display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                serif: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
                'serif-italic': ['var(--font-dancing)', 'cursive'],
                mono: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                hand: ['var(--font-dancing)', 'cursive'],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
                'fade-in': {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'bounce-soft': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'heart-beat': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '25%': { transform: 'scale(1.1)' },
                    '50%': { transform: 'scale(1)' },
                },
                'scroll-x': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-50%)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
                'heart-beat': 'heart-beat 1.5s ease-in-out infinite',
                'scroll-x': 'scroll-x 30s linear infinite',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
