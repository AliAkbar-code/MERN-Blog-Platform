import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar, useMediaQuery, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { ThemeContext } from '../../context/ThemeContext';
import useAuthStore from '../../context/useAuthStore';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
    const { mode, toggleTheme } = useContext(ThemeContext);
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const pageLinks = (
        <>
            {[{ label: 'Blog', to: '/blog' }, { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }].map(link => (
                <Button
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    sx={{
                        color: 'text.primary',
                        borderRadius: '50px',
                        px: 2,
                        fontSize: '0.9rem',
                        '&:hover': { background: 'rgba(99, 102, 241, 0.08)' },
                    }}
                >
                    {link.label}
                </Button>
            ))}
        </>
    );

    const navLinks = (
        <>
            {isAuthenticated ? (
                <>
                    {(user?.role === 'author' || user?.role === 'admin') && (
                        <Button
                            component={RouterLink}
                            to="/dashboard"
                            startIcon={<DashboardIcon />}
                            sx={{
                                color: 'text.primary',
                                borderRadius: '50px',
                                px: 2.5,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                                },
                            }}
                        >
                            Dashboard
                        </Button>
                    )}
                    {user?.role === 'admin' && (
                        <Button
                            component={RouterLink}
                            to="/admin"
                            startIcon={<AdminPanelSettingsIcon />}
                            sx={{
                                color: 'text.primary',
                                borderRadius: '50px',
                                px: 2.5,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                                },
                            }}
                        >
                            Admin
                        </Button>
                    )}
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            cursor: 'default',
                        }}
                    >
                        {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Button
                        onClick={handleLogout}
                        sx={{
                            color: 'text.secondary',
                            borderRadius: '50px',
                            '&:hover': {
                                color: 'error.main',
                                background: 'rgba(239, 68, 68, 0.08)',
                            },
                        }}
                    >
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        component={RouterLink}
                        to="/login"
                        sx={{
                            color: 'text.primary',
                            borderRadius: '50px',
                            px: 2.5,
                            '&:hover': { background: 'rgba(99, 102, 241, 0.08)' },
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/register"
                        variant="contained"
                        sx={{
                            borderRadius: '50px',
                            px: 3,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            },
                        }}
                    >
                        Get Started
                    </Button>
                </>
            )}
        </>
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    backgroundColor: mode === 'dark'
                        ? 'rgba(15, 23, 42, 0.8)'
                        : 'rgba(255, 255, 255, 0.8)',
                    borderBottom: '1px solid',
                    borderColor: mode === 'dark'
                        ? 'rgba(148, 163, 184, 0.1)'
                        : 'rgba(0, 0, 0, 0.06)',
                }}
            >
                <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            fontWeight: 800,
                            fontSize: '1.4rem',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        ✦ MERN Blog
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            onClick={toggleTheme}
                            sx={{
                                color: 'text.primary',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'rotate(180deg)',
                                    color: 'primary.main',
                                },
                            }}
                        >
                            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>

                        {isMobile ? (
                            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.primary' }}>
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {pageLinks}
                                {navLinks}
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        background: mode === 'dark' ? '#1e293b' : '#ffffff',
                        pt: 2,
                    },
                }}
            >
                <Box sx={{ px: 2, pb: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                        }}
                    >
                        ✦ MERN Blog
                    </Typography>
                </Box>
                <Divider />
                <List>
                    {[{ label: 'Blog', to: '/blog' }, { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }].map(link => (
                        <ListItem disablePadding key={link.to}>
                            <ListItemButton component={RouterLink} to={link.to} onClick={() => setDrawerOpen(false)}>
                                <ListItemText primary={link.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    {isAuthenticated ? (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ py: 1.5, px: 3 }}>
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            mr: 2,
                                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <ListItemText primary={user?.username} secondary={user?.role} />
                                </ListItemButton>
                            </ListItem>
                            <Divider sx={{ my: 1 }} />
                            {(user?.role === 'author' || user?.role === 'admin') && (
                                <ListItem disablePadding>
                                    <ListItemButton component={RouterLink} to="/dashboard" onClick={() => setDrawerOpen(false)}>
                                        <ListItemText primary="Dashboard" />
                                    </ListItemButton>
                                </ListItem>
                            )}
                            {user?.role === 'admin' && (
                                <ListItem disablePadding>
                                    <ListItemButton component={RouterLink} to="/admin" onClick={() => setDrawerOpen(false)}>
                                        <ListItemText primary="Admin Panel" />
                                    </ListItemButton>
                                </ListItem>
                            )}
                            <Divider sx={{ my: 1 }} />
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => { handleLogout(); setDrawerOpen(false); }}>
                                    <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) : (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/login" onClick={() => setDrawerOpen(false)}>
                                    <ListItemText primary="Login" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/register" onClick={() => setDrawerOpen(false)}>
                                    <ListItemText primary="Get Started" sx={{ color: 'primary.main', fontWeight: 600 }} />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;
