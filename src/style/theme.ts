import { Platform } from 'react-native';
import tc from 'tinycolor2';

import { rem } from '../util';

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
    accent: '#B642D8',
    text: tc(primary).darken(30).saturate(-30).toString(),
    surface: '#FFF',
    input: '#FFF',
    placeholder: 'rgba(0,0,0,0.3)',
    success: '#8bc34a',
    warning: '#ffbb33',
    error: '#f44336',
    shadow: '#000',
    gradient: ['primary', 'accent'],
    twitter: '#1CA1F2',
    facebook: '#385898',
    modes: {
      dark: {
        background: '#121212',
        surface: '#1D1D1D',
        text: '#FFF',
        input: '#222737',
        placeholder: 'rgba(255,255,255,0.3)',
      },
    },
  },
  fonts: {
    h1: {
      fontSize: 40,
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
      fontSize: rem(1.2),
    },
    p: {
      fontSize: rem(1.1),
      lineHeight: rem(1.61),
    },
    default: {
      fontSize: 16,
    },
    label: {
      fontSize: rem(0.7),
    },
    caption: {
      fontSize: rem(0.5),
    },
    code: {
      fontFamily: Platform.select({ default: 'Courier', android: 'monospace' }),
      fontWeight: '500',
      fontSize: rem(1),
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
