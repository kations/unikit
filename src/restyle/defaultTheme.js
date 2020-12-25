import tc from 'tinycolor2';
import { rem } from '../utils';

const primary = '#673fb4';

const defaultTheme = {
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
    desktop: 1268,
  },
  colors: {
    primary: primary,
    background: '#FFF',
    accent: '',
    text: tc(primary).darken(30).toString(),
    surface: '#FFF',
    input: '#FFF',
    placeholder: 'rgba(0,0,0,0.3)',
    success: '#8bc34a',
    warning: '#ffbb33',
    error: '#f44336',
    shadow: tc(primary).setAlpha(0.1).toRgbString(),
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
      fontSize: rem(3.5),
    },
    h2: {
      fontSize: rem(2.5),
    },
    h3: {
      fontSize: rem(2),
    },
    h4: {
      fontSize: rem(1.5),
    },
    h5: {
      fontSize: rem(1.25),
    },
    p: {
      fontSize: rem(1),
      lineHeight: `${rem(1.6)}px`,
    },
    default: {
      fontSize: rem(1),
    },
    label: {
      fontSize: rem(0.75),
    },
    caption: {
      fontSize: rem(0.5),
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
