import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Futurabookc',
        fontSize: 14,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(to bottom, rgba(191, 223, 255, 0.3), white)',
                    backgroundAttachment: 'fixed', 
                    margin: 0,
                    padding: 0,
                    height: '100vh',
                    width: '100vw', 
                    overflowX: 'hidden', 
                },
            },
        },
    },
});

export default theme;