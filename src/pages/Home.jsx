import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import api from '../utils/api';
import PostCard from '../components/post/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts?limit=6');
                setPosts(res.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch posts');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Container maxWidth="lg">
            <Helmet>
                <title>MERN Blog - Latest Tech Articles</title>
                <meta name="description" content="Discover the latest articles on web development, MERN stack, and programming." />
            </Helmet>

            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    my: { xs: 4, md: 8 },
                    textAlign: 'center',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative blobs */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -60,
                        left: '10%',
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        animation: 'float 6s ease-in-out infinite',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: -40,
                        right: '10%',
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        animation: 'float 8s ease-in-out 1s infinite',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -40,
                        left: '50%',
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        animation: 'float 7s ease-in-out 0.5s infinite',
                    }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2.5,
                            py: 0.8,
                            mb: 3,
                            borderRadius: '50px',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                        }}
                    >
                        <AutoStoriesIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Welcome to the Blog
                        </Typography>
                    </Box>

                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '2.2rem', md: '3.5rem' },
                            lineHeight: 1.1,
                            mb: 2,
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 40%, #ec4899 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Discover Stories & Ideas
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 600,
                            mx: 'auto',
                            fontWeight: 400,
                            lineHeight: 1.6,
                            fontSize: { xs: '1rem', md: '1.15rem' },
                        }}
                    >
                        Explore articles on web development, technology, and creative thinking from talented writers worldwide.
                    </Typography>
                </Box>
            </Box>

            {/* Latest Posts Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{ fontWeight: 700 }}
                    >
                        Latest Posts
                    </Typography>
                    <Box sx={{ flexGrow: 1, height: '2px', background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.3), transparent)', borderRadius: 1 }} />
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" my={8}>
                        <CircularProgress sx={{ color: 'primary.main' }} />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
                ) : posts.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <Typography variant="h6" color="text.secondary">No posts found yet. Check back soon!</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3} className="stagger-children">
                        {posts.map(post => (
                            <Grid item key={post._id} xs={12} sm={6} md={4}>
                                <PostCard post={post} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* View All Button */}
            <Box display="flex" justifyContent="center" mt={6} mb={4}>
                <Button
                    component={RouterLink}
                    to="/blog"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                        borderRadius: '50px',
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        fontSize: '1rem',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                        },
                    }}
                >
                    View All Posts
                </Button>
            </Box>
        </Container>
    );
};

export default Home;
