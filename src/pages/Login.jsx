import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert, Paper, Avatar } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useAuthStore from '../context/useAuthStore';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login, error, loading, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData);
        if (success) {
            navigate('/');
        }
    };

    return (
        <Container maxWidth="xs">
            <Helmet>
                <title>Login - MERN Blog Platform</title>
            </Helmet>
            <Paper
                elevation={0}
                sx={{
                    mt: 8,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                    },
                }}
            >
                <Avatar
                    sx={{
                        m: 1,
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    }}
                >
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                    Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    Sign in to your account
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.3,
                            borderRadius: '50px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            fontSize: '1rem',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <Box textAlign="center">
                        <RouterLink
                            to="/register"
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                                Don't have an account? Get Started →
                            </Typography>
                        </RouterLink>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
