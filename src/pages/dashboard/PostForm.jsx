import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Alert, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Helmet } from 'react-helmet-async';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PublishIcon from '@mui/icons-material/Publish';
import SaveIcon from '@mui/icons-material/Save';
import api from '../../utils/api';
import useAuthStore from '../../context/useAuthStore';

const PostForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({ title: '', content: '', categories: [], tags: [] });
    const [availableCategories, setAvailableCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try { const res = await api.get('/categories'); setAvailableCategories(res.data.data); } catch (err) { console.error(err); }
        };
        const fetchPost = async () => {
            if (!isEditMode) return;
            try {
                const res = await api.get(`/posts/${id}`);
                const post = res.data.data;
                if (user.role !== 'admin' && post.author._id !== user._id) { navigate('/dashboard'); }
                setFormData({ title: post.title, content: post.content, categories: post.categories.map(c => c._id), tags: post.tags || [] });
                setImageUrl(post.image);
            } catch (err) { setError("Failed to load post for editing"); }
        };
        fetchCategories();
        fetchPost();
    }, [id, isEditMode, navigate, user]);

    const handleContentChange = (content) => setFormData({ ...formData, content });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCategoryChange = (event) => setFormData({ ...formData, categories: event.target.value });

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };
    const handleDeleteTag = (t) => setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== t) });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const fd = new FormData(); fd.append('image', file);
            try { const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); setImageUrl(res.data.image); } catch (err) { setError("Image upload failed"); }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError(null);
        const postData = { ...formData, image: imageUrl || 'no-photo.jpg' };
        try {
            if (isEditMode) await api.put(`/posts/${id}`, postData); else await api.post('/posts', postData);
            navigate('/dashboard');
        } catch (err) { setError(err.response?.data?.error || 'Failed to save post'); setLoading(false); }
    };

    const modules = { toolbar: [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image'], ['clean']] };

    return (
        <Container maxWidth="md">
            <Helmet><title>{isEditMode ? 'Edit Post' : 'Create Post'} - MERN Blog</title></Helmet>
            <Paper elevation={0} sx={{ my: 4, overflow: 'hidden', position: 'relative', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' } }}>
                <Box sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 3 }}>
                        {isEditMode ? 'Edit Post' : 'Create New Post'}
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField margin="normal" required fullWidth label="Post Title" name="title" value={formData.title} onChange={handleChange} autoFocus sx={{ mb: 2, '& .MuiOutlinedInput-root': { fontSize: '1.1rem', fontWeight: 500 } }} />
                        <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                            <InputLabel>Categories</InputLabel>
                            <Select multiple name="categories" value={formData.categories} onChange={handleCategoryChange}
                                renderValue={(selected) => (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{selected.map((v) => { const cat = availableCategories.find(c => c._id === v); return <Chip key={v} label={cat ? cat.name : v} size="small" sx={{ fontWeight: 600, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))', color: 'primary.main' }} />; })}</Box>)}>
                                {availableCategories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <Box sx={{ my: 3 }}>
                            <Typography variant="subtitle2" gutterBottom fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Featured Image</Typography>
                            <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 3, p: 3, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(99,102,241,0.03)' } }} onClick={() => document.getElementById('raised-button-file').click()}>
                                <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" type="file" onChange={handleImageChange} />
                                {imageUrl && imageUrl !== 'no-photo.jpg' ? (
                                    <Box><img src={imageUrl.startsWith('http') ? imageUrl : `${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`} alt="Featured" style={{ maxHeight: '200px', borderRadius: '12px', objectFit: 'cover' }} /><Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>Click to change image</Typography></Box>
                                ) : (
                                    <Box><CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} /><Typography variant="body2" color="text.secondary">Click to upload an image</Typography></Box>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ my: 3 }}>
                            <Typography variant="subtitle2" gutterBottom fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Content</Typography>
                            <Box sx={{ height: '300px', mb: 6 }}><ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} modules={modules} style={{ height: '100%' }} /></Box>
                        </Box>

                        <Box sx={{ my: 2 }}>
                            <TextField margin="normal" fullWidth label="Add Tags (Press Enter)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {formData.tags.map(tag => <Chip key={tag} label={tag} onDelete={() => handleDeleteTag(tag)} sx={{ fontWeight: 500, background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.15)', '& .MuiChip-deleteIcon': { color: 'primary.main', '&:hover': { color: 'error.main' } } }} />)}
                            </Box>
                        </Box>

                        <Button type="submit" fullWidth variant="contained" size="large" startIcon={isEditMode ? <SaveIcon /> : <PublishIcon />}
                            sx={{ mt: 3, py: 1.5, borderRadius: '50px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '1rem', '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } }}
                            disabled={loading || !formData.title || !formData.content}>
                            {loading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Publish Post')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default PostForm;
