/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/seedkit/src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          tint: 'hsl(var(--primary-tint))',
          shade: 'hsl(var(--primary-shade))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
      },
      borderRadius: {
        base: 'var(--radius)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
