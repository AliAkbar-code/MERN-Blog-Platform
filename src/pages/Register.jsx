import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert, Paper, FormControlLabel, Switch, Avatar } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import useAuthStore from '../context/useAuthStore';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAuthor: false
    });
    const [localError, setLocalError] = useState('');
    const { register, error, loading, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        if (error) clearError();
        if (localError) setLocalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        const success = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.isAuthor ? 'author' : 'reader'
        });

        if (success) {
            navigate('/');
        }
    };

    return (
        <Container maxWidth="xs">
            <Helmet>
                <title>Register - MERN Blog Platform</title>
            </Helmet>
            <Paper
                elevation={0}
                sx={{
                    mt: 6,
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
                    <PersonAddOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                    Create Account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    Join our community of writers & readers
                </Typography>

                {(error || localError) && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
                        {localError || error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(168, 85, 247, 0.03))',
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isAuthor}
                                    onChange={handleChange}
                                    name="isAuthor"
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#8b5cf6',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#8b5cf6',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>Register as Author</Typography>
                                    <Typography variant="caption" color="text.secondary">Publish your own articles</Typography>
                                </Box>
                            }
                            sx={{ m: 0, width: '100%' }}
                        />
                    </Box>
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
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    <Box textAlign="center">
                        <RouterLink
                            to="/login"
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                                Already have an account? Sign In →
                            </Typography>
                        </RouterLink>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
