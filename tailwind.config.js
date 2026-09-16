/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nb: {
          yellow: '#FFE500',
          'yellow-dark': '#FFD000',
          black: '#000000',
          white: '#FFFFFF',
          pink: '#FF6B9D',
          blue: '#4ECDC4',
          green: '#95E867',
          orange: '#FF8C42',
          purple: '#A855F7',
          bg: '#FAFAFA',
          muted: '#555555',
        },
      },
      boxShadow: {
        nb: '4px 4px 0px #000000',
        'nb-lg': '6px 6px 0px #000000',
        'nb-xl': '8px 8px 0px #000000',
        'nb-hover': '2px 2px 0px #000000',
        'nb-none': '0px 0px 0px #000000',
      },
      borderWidth: {
        3: '3px',
        4: '4px',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      transitionTimingFunction: {
        nb: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-5deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' },
        },
        stripes: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 0' },
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        stripes: 'stripes 1s linear infinite',
        'heart-beat': 'heartBeat 0.3s ease',
        wiggle: 'wiggle 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
};