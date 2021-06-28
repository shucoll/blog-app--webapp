import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

let theme = {
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e57373',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
};

export const lightTheme = responsiveFontSizes(createMuiTheme({
  ...theme,
  palette: {
    ...theme.palette,
    type: 'light',
  },
}));

export const darkTheme = responsiveFontSizes(createMuiTheme({
  ...theme,
  palette: {
    ...theme.palette,
    type: 'dark',
  },
}));
