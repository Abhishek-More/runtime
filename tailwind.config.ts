import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        "sc-purple": "#CC76D1",
        "sc-yellow": "#F7CD7A",
        "sc-green": "#CAE797",
        "sc-darkpurple": "#2A2D3D",
        "sc-darkerpurple": "#222431"
     },
    },
  },
  plugins: [],
}
export default config
