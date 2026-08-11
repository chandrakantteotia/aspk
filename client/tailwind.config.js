/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0057FF',
          sky: '#00D4FF',
          ink: '#0F172A',
          slate: '#64748B'
        }
      },
      boxShadow: {
        premium: '0 20px 60px rgba(15, 23, 42, 0.12)',
        glow: '0 0 0 1px rgba(0, 87, 255, 0.1), 0 24px 80px rgba(0, 87, 255, 0.18)'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0057FF 0%, #00D4FF 100%)',
        'mesh': 'radial-gradient(circle at top left, rgba(0, 215, 255, 0.22), transparent 28%), radial-gradient(circle at top right, rgba(0, 87, 255, 0.2), transparent 26%), linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(248, 250, 252, 1))'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '33%': { transform: 'translate3d(16px, -24px, 0)' },
          '66%': { transform: 'translate3d(-10px, 18px, 0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite',
        shimmer: 'shimmer 12s ease infinite'
      }
    }
  },
  plugins: []
};
