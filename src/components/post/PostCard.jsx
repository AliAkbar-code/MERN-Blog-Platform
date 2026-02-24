import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';

const PostCard = ({ post }) => {
    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
                    '& .card-image': {
                        transform: 'scale(1.05)',
                    },
                    '& .card-overlay': {
                        opacity: 1,
                    },
                },
            }}
        >
            {/* Image with overlay */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    className="card-image"
                    component="img"
                    height="220"
                    image={post.image?.startsWith('http') ? post.image : `${post.image?.startsWith('/') ? '' : '/'}${post.image}`}
                    alt={post.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=220&fit=crop&auto=format'; }}
                    sx={{
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        objectFit: 'cover',
                    }}
                />
                <Box
                    className="card-overlay"
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                {/* Categories */}
                <Box sx={{ mb: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {post.categories && post.categories.map((cat) => (
                        <Chip
                            key={cat._id}
                            label={cat.name}
                            size="small"
                            sx={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                height: 24,
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                                color: 'primary.main',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                            }}
                        />
                    ))}
                </Box>

                {/* Title */}
                <Typography
                    gutterBottom
                    variant="h6"
                    component={RouterLink}
                    to={`/post/${post._id}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'text.primary',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                            color: 'primary.main',
                        },
                    }}
                >
                    {post.title}
                </Typography>

                {/* Excerpt */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                        fontSize: '0.85rem',
                    }}
                >
                    {post.content.substring(0, 120).replace(/(<([^>]+)>)/gi, "")}...
                </Typography>

                {/* Footer */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto',
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {moment(post.createdAt).format('MMM D, YYYY')} • {post.author?.username || 'Unknown'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <VisibilityIcon sx={{ fontSize: 15, opacity: 0.7 }} />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{post.views}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <FavoriteIcon
                                sx={{
                                    fontSize: 15,
                                    color: post.likes?.length > 0 ? '#ef4444' : 'inherit',
                                    opacity: post.likes?.length > 0 ? 1 : 0.7,
                                }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{post.likes?.length || 0}</Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PostCard;
