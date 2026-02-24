import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Chip, Divider, Avatar, IconButton, TextField, Button, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import api from '../utils/api';
import useAuthStore from '../context/useAuthStore';

const SinglePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const { user, isAuthenticated } = useAuthStore();
    const [likeLoading, setLikeLoading] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await api.get(`/posts/${id}`);
            setPost(res.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch post');
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) return;
        setLikeLoading(true);
        try {
            const res = await api.put(`/posts/${id}/like`);
            setPost({ ...post, likes: res.data.data });
        } catch (err) {
            console.error("Like failed", err);
        }
        setLikeLoading(false);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !isAuthenticated) return;

        try {
            await api.post(`/posts/${id}/comments`, { content: commentText });
            setCommentText('');
            fetchPost();
        } catch (err) {
            console.error("Comment failed", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            await api.delete(`/comments/${commentId}`);
            fetchPost();
        } catch (err) {
            console.error("Delete comment failed", err);
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" my={12}>
            <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
    );
    if (error) return <Container><Alert severity="error" sx={{ mt: 4, borderRadius: 3 }}>{error}</Alert></Container>;
    if (!post) return null;

    const hasLiked = user && post.likes.includes(user._id);
    const canDeleteComment = (commentUser) => user && (user._id === commentUser || user.role === 'admin');

    return (
        <Container maxWidth="md">
            <Helmet>
                <title>{post.title} - MERN Blog</title>
                <meta name="description" content={post.content.substring(0, 150)} />
            </Helmet>

            <Box component="article" sx={{ mt: 4 }} className="animate-fade-in-up">
                {/* Categories */}
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {post.categories.map(cat => (
                        <Chip
                            key={cat._id}
                            label={cat.name}
                            sx={{
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                                color: 'primary.main',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                            }}
                        />
                    ))}
                </Box>

                {/* Title */}
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        lineHeight: 1.2,
                        mb: 3,
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                    }}
                >
                    {post.title}
                </Typography>

                {/* Author Info */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 4,
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: 'action.hover',
                    }}
                >
                    <Avatar
                        sx={{
                            mr: 2,
                            width: 44,
                            height: 44,
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            fontWeight: 700,
                        }}
                    >
                        {post.author?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                            {post.author?.username}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {moment(post.createdAt).format('MMMM D, YYYY')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 14 }} />
                                {Math.ceil(post.content.length / 1000)} min read
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VisibilityIcon sx={{ fontSize: 14 }} />
                                {post.views} Views
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Featured Image */}
                {post.image && post.image !== 'no-photo.jpg' && (
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 4,
                            overflow: 'hidden',
                            mb: 4,
                        }}
                    >
                        <Box
                            component="img"
                            src={post.image.startsWith('http') ? post.image : `${post.image.startsWith('/') ? '' : '/'}${post.image}`}
                            alt={post.title}
                            sx={{
                                width: '100%',
                                maxHeight: '500px',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                        />
                    </Box>
                )}

                {/* Content */}
                <Box
                    sx={{
                        typography: 'body1',
                        lineHeight: 1.9,
                        fontSize: '1.1rem',
                        mb: 4,
                        '& h1, & h2, & h3': { fontWeight: 700, mt: 4, mb: 1.5 },
                        '& p': { mb: 2 },
                        '& img': { borderRadius: 3, maxWidth: '100%' },
                        '& blockquote': {
                            borderLeft: '4px solid',
                            borderColor: 'primary.main',
                            pl: 3,
                            ml: 0,
                            fontStyle: 'italic',
                            color: 'text.secondary',
                        },
                        '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
                        '& code': {
                            backgroundColor: 'action.hover',
                            px: 1,
                            py: 0.3,
                            borderRadius: 1,
                            fontSize: '0.9em',
                            fontFamily: 'monospace',
                        },
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Like Section */}
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2.5,
                        my: 4,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'action.hover',
                    }}
                >
                    <IconButton
                        onClick={handleLike}
                        disabled={likeLoading || !isAuthenticated}
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    >
                        {hasLiked ? (
                            <FavoriteIcon fontSize="large" sx={{ color: '#ef4444' }} />
                        ) : (
                            <FavoriteBorderIcon fontSize="large" sx={{ color: 'text.secondary' }} />
                        )}
                    </IconButton>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>{post.likes.length}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {post.likes.length === 1 ? 'person liked this' : 'people liked this'}
                        </Typography>
                    </Box>
                    {!isAuthenticated && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                            <RouterLink to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Log in</RouterLink> to like
                        </Typography>
                    )}
                </Paper>

                <Divider sx={{ my: 4 }} />

                {/* Comments Section */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Comments
                        <Chip
                            label={post.comments?.length || 0}
                            size="small"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: '#fff',
                                height: 26,
                            }}
                        />
                    </Typography>
                </Box>

                {isAuthenticated ? (
                    <Box
                        component="form"
                        onSubmit={handleCommentSubmit}
                        sx={{
                            mb: 4,
                            display: 'flex',
                            gap: 2,
                            alignItems: 'flex-start',
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                mt: 0.5,
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                            }}
                        >
                            {user?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                placeholder="Share your thoughts..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                sx={{ mb: 1.5 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!commentText.trim()}
                                endIcon={<SendIcon />}
                                sx={{
                                    borderRadius: '50px',
                                    px: 3,
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    },
                                }}
                            >
                                Post Comment
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Paper elevation={0} sx={{ mb: 4, p: 3, borderRadius: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">
                            <RouterLink to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Sign in</RouterLink> to join the conversation.
                        </Typography>
                    </Paper>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 8 }}>
                    {post.comments?.map(comment => (
                        <Paper
                            key={comment._id}
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.1)',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            backgroundColor: 'primary.light',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        U
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={700}>User</Typography>
                                        <Typography variant="caption" color="text.secondary">{moment(comment.createdAt).fromNow()}</Typography>
                                    </Box>
                                </Box>
                                {canDeleteComment(comment.user) && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteComment(comment._id)}
                                        sx={{
                                            color: 'text.secondary',
                                            '&:hover': { color: 'error.main' },
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography variant="body2" sx={{ mt: 1.5, lineHeight: 1.7 }}>
                                {comment.content}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Box>
        </Container>
    );
};

export default SinglePost;
