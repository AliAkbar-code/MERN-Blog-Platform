import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#6366f1',
                        light: '#818cf8',
                        dark: '#4f46e5',
                    },
                    secondary: {
                        main: '#f97316',
                        light: '#fb923c',
                        dark: '#ea580c',
                    },
                    ...(mode === 'dark'
                        ? {
                            background: {
                                default: '#0f172a',
                                paper: '#1e293b',
                            },
                            text: {
                                primary: '#f1f5f9',
                                secondary: '#94a3b8',
                            },
                        }
                        : {
                            background: {
                                default: '#f8fafc',
                                paper: '#ffffff',
                            },
                            text: {
                                primary: '#1e293b',
                                secondary: '#64748b',
                            },
                        }),
                },
                typography: {
                    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
                    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
                    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
                    h4: { fontWeight: 700 },
                    h5: { fontWeight: 600 },
                    h6: { fontWeight: 600 },
                    button: { fontWeight: 600, textTransform: 'none' },
                },
                shape: {
                    borderRadius: 12,
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 10,
                                padding: '8px 20px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            },
                            contained: {
                                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.35)',
                                '&:hover': {
                                    boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.5)',
                                    transform: 'translateY(-1px)',
                                },
                            },
                            outlined: {
                                borderWidth: '1.5px',
                                '&:hover': {
                                    borderWidth: '1.5px',
                                    transform: 'translateY(-1px)',
                                },
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 16,
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                                backdropFilter: 'blur(10px)',
                                backgroundColor: mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                borderRadius: 16,
                                ...(mode === 'dark' && {
                                    backgroundImage: 'none',
                                    border: '1px solid rgba(148, 163, 184, 0.08)',
                                }),
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 10,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
                                    },
                                },
                            },
                        },
                    },
                    MuiChip: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                            },
                        },
                    },
                    MuiTableContainer: {
                        styleOverrides: {
                            root: {
                                borderRadius: 16,
                                border: mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
                            },
                        },
                    },
                    MuiTableHead: {
                        styleOverrides: {
                            root: {
                                '& .MuiTableCell-head': {
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.08em',
                                    color: mode === 'dark' ? '#94a3b8' : '#64748b',
                                    backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 1)',
                                    borderBottom: mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
                                },
                            },
                        },
                    },
                    MuiTableRow: {
                        styleOverrides: {
                            root: {
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: mode === 'dark' ? 'rgba(99, 102, 241, 0.05) !important' : 'rgba(99, 102, 241, 0.03) !important',
                                },
                            },
                        },
                    },
                    MuiDialog: {
                        styleOverrides: {
                            paper: {
                                borderRadius: 20,
                                ...(mode === 'dark' && {
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(148, 163, 184, 0.1)',
                                }),
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundImage: 'none',
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};
