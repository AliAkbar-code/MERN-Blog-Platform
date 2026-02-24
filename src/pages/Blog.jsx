import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Alert, Pagination, TextField, InputAdornment, Chip } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import PostCard from '../components/post/PostCard';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const categoryQuery = searchParams.get('category') || '';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data);
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                let url = `/posts?page=${page}&limit=9`;
                if (search) url += `&search=${search}`;
                if (categoryQuery) {
                    const selectedCat = categories.find(c => c.slug === categoryQuery);
                    if (selectedCat) {
                        url += `&categories[in]=${selectedCat._id}`;
                    }
                }

                const res = await api.get(url);
                setPosts(res.data.data);

                const { count, pagination } = res.data;
                const limit = 9;
                let estimatedTotalPages = 1;

                if (pagination.next) estimatedTotalPages = pagination.next.page;
                else estimatedTotalPages = page;

                setTotalPages(estimatedTotalPages > page ? estimatedTotalPages : page);

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch posts');
                setLoading(false);
            }
        };

        if (categories.length > 0 || !categoryQuery) {
            fetchPosts();
        }
    }, [page, search, categoryQuery, categories]);

    const handlePageChange = (event, value) => {
        searchParams.set('page', value);
        setSearchParams(searchParams);
        window.scrollTo(0, 0);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            searchParams.set('search', e.target.value);
            searchParams.set('page', 1);
            setSearchParams(searchParams);
        }
    };

    const handleCategoryClick = (slug) => {
        if (categoryQuery === slug) {
            searchParams.delete('category');
        } else {
            searchParams.set('category', slug);
        }
        searchParams.set('page', 1);
        setSearchParams(searchParams);
    };

    return (
        <Container maxWidth="lg">
            <Helmet>
                <title>Blog - MERN Blog Platform</title>
                <meta name="description" content="Browse all blog posts" />
            </Helmet>

            {/* Page Header */}
            <Box sx={{ mt: 4, mb: 5 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, mb: 2, borderRadius: '50px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <ExploreIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>Explore</Typography>
                </Box>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    All Articles
                </Typography>
            </Box>

            {/* Search & Filter Bar */}
            <Box
                sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    alignItems: { md: 'center' },
                }}
            >
                <TextField
                    placeholder="Search articles..."
                    variant="outlined"
                    size="small"
                    defaultValue={search}
                    onKeyDown={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        flexGrow: 1,
                        minWidth: '250px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                            backgroundColor: 'action.hover',
                        },
                    }}
                />

                <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                        label="All"
                        onClick={() => handleCategoryClick('')}
                        clickable
                        sx={{
                            fontWeight: 600,
                            ...(
                                !categoryQuery
                                    ? {
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        color: '#fff',
                                        '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
                                    }
                                    : {
                                        variant: 'outlined',
                                        '&:hover': { background: 'rgba(99, 102, 241, 0.08)' },
                                    }
                            ),
                        }}
                    />
                    {categories.map(cat => (
                        <Chip
                            key={cat._id}
                            label={cat.name}
                            onClick={() => handleCategoryClick(cat.slug)}
                            clickable
                            sx={{
                                fontWeight: 500,
                                ...(
                                    categoryQuery === cat.slug
                                        ? {
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            color: '#fff',
                                            '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
                                        }
                                        : {
                                            '&:hover': { background: 'rgba(99, 102, 241, 0.08)' },
                                        }
                                ),
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Posts Grid */}
            {loading ? (
                <Box display="flex" justifyContent="center" my={8}>
                    <CircularProgress sx={{ color: 'primary.main' }} />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>
            ) : posts.length === 0 ? (
                <Box my={8} textAlign="center">
                    <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500 }}>
                        No posts found matching your criteria.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Try adjusting your search or filters.
                    </Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={3} className="stagger-children">
                        {posts.map(post => (
                            <Grid item key={post._id} xs={12} sm={6} md={4}>
                                <PostCard post={post} />
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 0 && (
                        <Box display="flex" justifyContent="center" mt={6} mb={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                        },
                                        '&.Mui-selected': {
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default Blog;
