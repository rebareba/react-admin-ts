module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  darkMode: false, // or 'media' or 'class'
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
    spacing: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
    },
    colors: {
      link: '#5A50FF',
      red: '#fd4947',
      orange: '#f59d11',
      yellow: '#fff261',
      green: '#75c976',
      blue: '#2fb1f7',
      silver: '#ecebff',
      metal: '#565584',
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      purple: '#3f3cbb',
      midnight: '#121063',

      tahiti: '#3ab7bf',

      'bubble-gum': '#ff77e9',
      bermuda: '#78dcca',
    },
    // fontSize: {
    //   sm: ['14px', '20px'],
    //   base: ['16px', '24px'],
    //   lg: ['20px', '28px'],
    //   xl: ['24px', '32px'],
    // },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
