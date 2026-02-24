import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip, Grid, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import api from '../utils/api';
import useAuthStore from '../context/useAuthStore';

const StatCard = ({ icon: Icon, label, value, gradient }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
        }}
    >
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: gradient,
            }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: gradient,
                    opacity: 0.9,
                }}
            >
                <Icon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
                <Typography variant="h5" fontWeight={800}>{value}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
            </Box>
        </Box>
    </Paper>
);

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    const fetchMyPosts = async () => {
        if (!user) return;
        try {
            const url = user.role === 'admin' ? '/posts' : `/posts?author=${user._id}`;
            const res = await api.get(url);
            setPosts(res.data.data);

            const authRes = await api.get('/users/authors');
            setAuthors(authRes.data.data);

            setLoading(false);
        } catch (err) {
            console.error("Failed to load posts", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyPosts();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/posts/${id}`);
            fetchMyPosts();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

    return (
        <Container maxWidth="lg">
            <Helmet>
                <title>Dashboard - MERN Blog</title>
            </Helmet>

            {/* Header */}
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 0.5,
                    }}
                >
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back, {user?.username}! Here's an overview of your content.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        icon={ArticleIcon}
                        label="Total Posts"
                        value={posts.length}
                        gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        icon={VisibilityIcon}
                        label="Total Views"
                        value={totalViews.toLocaleString()}
                        gradient="linear-gradient(135deg, #06b6d4, #0891b2)"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        icon={FavoriteIcon}
                        label="Total Likes"
                        value={totalLikes}
                        gradient="linear-gradient(135deg, #f43f5e, #e11d48)"
                    />
                </Grid>
            </Grid>

            {/* Posts Table */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" fontWeight={700}>
                        {user?.role === 'admin' ? 'All Posts' : 'My Posts'}
                    </Typography>
                    <Box sx={{ flexGrow: 1, height: '2px', background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.3), transparent)', borderRadius: 1, minWidth: 60 }} />
                </Box>
                <Button
                    component={RouterLink}
                    to="/dashboard/create-post"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        borderRadius: '50px',
                        px: 3,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        },
                    }}
                >
                    New Post
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Views</TableCell>
                            <TableCell>Likes</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <Typography color="text.secondary">Loading...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <Typography color="text.secondary">No posts found. Create your first one!</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => (
                                <TableRow key={post._id}>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            component={RouterLink}
                                            to={`/post/${post._id}`}
                                            sx={{
                                                textDecoration: 'none',
                                                color: 'text.primary',
                                                fontWeight: 600,
                                                transition: 'color 0.2s ease',
                                                '&:hover': { color: 'primary.main' },
                                            }}
                                        >
                                            {post.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {moment(post.createdAt).format('MMM D, YYYY')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {post.views}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={<FavoriteIcon sx={{ fontSize: 14 }} />}
                                            label={post.likes?.length || 0}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                backgroundColor: post.likes?.length > 0 ? 'rgba(244, 63, 94, 0.1)' : 'action.hover',
                                                color: post.likes?.length > 0 ? '#f43f5e' : 'text.secondary',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            component={RouterLink}
                                            to={`/dashboard/edit-post/${post._id}`}
                                            size="small"
                                            sx={{
                                                color: 'primary.main',
                                                mr: 0.5,
                                                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.08)' },
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(post._id)}
                                            size="small"
                                            sx={{
                                                color: 'text.secondary',
                                                '&:hover': { color: 'error.main', backgroundColor: 'rgba(239, 68, 68, 0.08)' },
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Author Directory */}
            <Box sx={{ mt: 8, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <PeopleIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h5" fontWeight={700}>Author Directory</Typography>
                    <Box sx={{ flexGrow: 1, height: '2px', background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.3), transparent)', borderRadius: 1 }} />
                </Box>
                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Author</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Joined</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {authors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">No authors found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                authors.map(author => (
                                    <TableRow key={author._id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {author.username?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {author.username}
                                                    {author._id === user?._id && (
                                                        <Chip
                                                            size="small"
                                                            label="You"
                                                            sx={{
                                                                ml: 1,
                                                                height: 20,
                                                                fontSize: '0.7rem',
                                                                fontWeight: 700,
                                                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                                color: '#fff',
                                                            }}
                                                        />
                                                    )}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">{author.email}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">{moment(author.createdAt).format('LL')}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default Dashboard;
