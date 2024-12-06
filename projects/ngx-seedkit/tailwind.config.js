/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'sk-',
  content: ['./projects/ngx-seedkit/src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--sk-background))',
        foreground: 'hsl(var(--sk-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--sk-primary))',
          foreground: 'hsl(var(--sk-primary-foreground))',
          tint: 'hsl(var(--sk-primary-tint))',
          shade: 'hsl(var(--sk-primary-shade))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--sk-secondary))',
          foreground: 'hsl(var(--sk-secondary-foreground))',
        },
      },
      borderRadius: {
        base: 'var(--sk-radius)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
