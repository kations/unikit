import tc from 'tinycolor2';

const primary = '#7D4CDB';

const defaultTheme = {
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    s: 0,
    m: 768,
    l: 1268,
    xl: 1668,
  },
  colors: {
    primary: primary,
    background: '#FFF',
    accent: '',
    text: tc(primary).darken(30).saturate(-30).toString(),
    surface: '#FFF',
    input: '#FFF',
    placeholder: 'rgba(0,0,0,0.3)',
    success: '#8bc34a',
    warning: '#ffbb33',
    error: '#f44336',
    shadow: '#000000',
    modes: {
      dark: {
        background: '#121212',
        surface: '#1D1D1D',
        text: '#FFF',
        input: '#1D1D1D',
        placeholder: 'rgba(255,255,255,0.3)',
      },
    },
  },
  fonts: {
    h1: {
      fontSize: 40,
    },
    h2: {
      fontSize: '2.5rem',
    },
    h3: {
      fontSize: '2rem',
    },
    h4: {
      fontSize: '1.5rem',
    },
    h5: {
      fontSize: '1.2rem',
    },
    p: {
      fontSize: '1rem',
      lineHeight: '1.4rem',
    },
    default: {
      fontSize: 16,
    },
    label: {
      fontSize: '0.7rem',
    },
    caption: {
      fontSize: '0.5rem',
    },
  },
  translations: {
    done: 'done',
    close: 'close',
    showToday: 'Show today',
    confirm: 'Confirm',
    cancel: 'Cancel',
    back: 'Back',
  },
  globals: {
    fontFamily: 'System',
    fontScale: 1,
    roundness: 5,
    shadow: 5,
    gap: 15,
    inputGap: 15,
  },
};

export default defaultTheme;
