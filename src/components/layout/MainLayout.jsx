import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Navbar from './Navbar';
import { ThemeContext } from '../../context/ThemeContext';

const MainLayout = () => {
    const { mode } = useContext(ThemeContext);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
                <Outlet />
            </Container>

            {/* Modern Footer */}
            <Box
                component="footer"
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    py: 5,
                    px: 3,
                    mt: 'auto',
                    backgroundColor: mode === 'dark' ? '#0c1222' : '#1e293b',
                    color: '#94a3b8',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #f97316)',
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                        {/* Brand */}
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 0.5,
                                }}
                            >
                                ✦ MERN Blog
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Discover stories & ideas from writers around the world.
                            </Typography>
                        </Box>

                        {/* Social */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {[GitHubIcon, TwitterIcon, LinkedInIcon].map((Icon, i) => (
                                <IconButton
                                    key={i}
                                    size="small"
                                    sx={{
                                        color: '#64748b',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: '#a855f7',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>

                        {/* Copyright */}
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem' }}>
                            © {new Date().getFullYear()} MERN Blog. Crafted with ❤️
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;
