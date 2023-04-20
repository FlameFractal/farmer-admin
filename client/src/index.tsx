import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { teal, orange } from '@mui/material/colors';

import App from './App';

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: orange,
  },
});

createRoot(document.getElementById('root') as Element).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
