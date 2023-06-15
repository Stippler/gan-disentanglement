import { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = { 
  palette: {
    mode: 'light',
    primary: {
      main: "#009688"
      //main: '#112940' // blue/red
      //main: '#48c1a6' //naturals 
    },
    secondary: {
      main: '#d4d4d4'
      //main: "#b9625a" // grey/orange
      //main: '#91d9d8' // blue/red
      //main: '#f26058' // naturals
    }
  },
  typography: {
    fontFamily: 'Roboto',
    h1: {
      fontWeight: '900',
      letterSpacing: 9,
      fontSize: 28
    },
    h2: {
      fontWeight: '500',
      fontSize: 32,
      textAlign: 'left'
    },
    h3: {
      fontWeight: '500',
      fontSize: 16,
      textAlign: 'left',
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    h6: {
      fontWeight: '300',
      fontSize: 14,
      textAlign: 'left',
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    body1: {
      fontSize: 14,
      lineHeight: 1.5,
      textAlign: 'left'
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // Some CSS
          fontWeight: 300,
          fontSize: 14,
          textTransform: 'uppercase',
        },
      },
    },
  },
};

export default themeOptions;