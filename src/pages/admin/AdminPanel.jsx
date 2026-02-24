import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel, Chip, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import { Helmet } from 'react-helmet-async';
import api from '../../utils/api';
import useAuthStore from '../../context/useAuthStore';

const AdminPanel = () => {
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const { user: currentUser } = useAuthStore();
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState({ _id: '', username: '', role: '' });

    const fetchCategories = async () => { try { const res = await api.get('/categories'); setCategories(res.data.data); } catch (err) { console.error(err); } };
    const fetchUsers = async () => { try { const res = await api.get('/users'); setUsers(res.data.data); } catch (err) { console.error(err); } };
    useEffect(() => { fetchCategories(); fetchUsers(); }, []);

    const handleCategoryOpen = (category = null) => {
        if (category) { setCurrentCategory(category); setIsEditingCategory(true); } else { setCurrentCategory({ name: '', description: '' }); setIsEditingCategory(false); }
        setOpenCategoryDialog(true);
    };
    const handleCategoryClose = () => setOpenCategoryDialog(false);
    const handleCategorySave = async () => {
        try { if (isEditingCategory) await api.put(`/categories/${currentCategory._id}`, currentCategory); else await api.post('/categories', currentCategory); fetchCategories(); handleCategoryClose(); } catch (err) { console.error(err); }
    };
    const handleCategoryDelete = async (id) => { if (!window.confirm("Delete this category?")) return; try { await api.delete(`/categories/${id}`); fetchCategories(); } catch (err) { console.error(err); } };

    const handleUserOpen = (user) => { setSelectedUser(user); setOpenUserDialog(true); };
    const handleUserClose = () => setOpenUserDialog(false);
    const handleUserSave = async () => { try { await api.put(`/users/${selectedUser._id}`, { role: selectedUser.role }); fetchUsers(); handleUserClose(); } catch (err) { console.error(err); } };
    const handleUserDelete = async (id) => {
        if (id === currentUser._id) { alert("Cannot delete your own account."); return; }
        if (!window.confirm("Delete this user?")) return;
        try { await api.delete(`/users/${id}`); fetchUsers(); } catch (err) { console.error(err); }
    };

    const roleColors = { admin: 'linear-gradient(135deg, #ef4444, #dc2626)', author: 'linear-gradient(135deg, #6366f1, #8b5cf6)', reader: 'linear-gradient(135deg, #64748b, #475569)' };

    return (
        <Container maxWidth="lg">
            <Helmet><title>Admin Panel - MERN Blog</title></Helmet>

            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5 }}>
                    Admin Panel
                </Typography>
                <Typography variant="body1" color="text.secondary">Manage users, categories, and platform settings.</Typography>
            </Box>

            {/* Users Section */}
            <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <PeopleIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h5" fontWeight={700}>Manage Users</Typography>
                    <Box sx={{ flexGrow: 1, height: '2px', background: 'linear-gradient(90deg, rgba(99,102,241,0.3), transparent)', borderRadius: 1 }} />
                </Box>
                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead><TableRow>
                            <TableCell>User</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell align="right">Actions</TableCell>
                        </TableRow></TableHead>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 32, height: 32, background: roleColors[u.role] || roleColors.reader, fontSize: '0.8rem', fontWeight: 700 }}>{u.username?.charAt(0).toUpperCase()}</Avatar>
                                            <Typography variant="body2" fontWeight={600}>{u.username} {u._id === currentUser._id && <Chip size="small" label="You" sx={{ ml: 1, height: 20, fontSize: '0.65rem', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }} />}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell><Typography variant="body2" color="text.secondary">{u.email}</Typography></TableCell>
                                    <TableCell><Chip label={u.role} size="small" sx={{ fontWeight: 600, background: roleColors[u.role] || roleColors.reader, color: '#fff', textTransform: 'capitalize' }} /></TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" sx={{ color: 'primary.main', mr: 0.5, '&:hover': { backgroundColor: 'rgba(99,102,241,0.08)' } }} onClick={() => handleUserOpen(u)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', backgroundColor: 'rgba(239,68,68,0.08)' } }} onClick={() => handleUserDelete(u._id)} disabled={u._id === currentUser._id}><DeleteIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Categories Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CategoryIcon sx={{ color: 'secondary.main' }} />
                        <Typography variant="h5" fontWeight={700}>Manage Categories</Typography>
                        <Box sx={{ flexGrow: 1, height: '2px', background: 'linear-gradient(90deg, rgba(249,115,22,0.3), transparent)', borderRadius: 1, minWidth: 40 }} />
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleCategoryOpen()} sx={{ borderRadius: '50px', px: 3, background: 'linear-gradient(135deg, #f97316, #ea580c)', '&:hover': { background: 'linear-gradient(135deg, #ea580c, #dc2626)' } }}>
                        Add Category
                    </Button>
                </Box>
                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead><TableRow>
                            <TableCell>Name</TableCell><TableCell>Slug</TableCell><TableCell>Description</TableCell><TableCell align="right">Actions</TableCell>
                        </TableRow></TableHead>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat._id}>
                                    <TableCell><Typography variant="body2" fontWeight={600}>{cat.name}</Typography></TableCell>
                                    <TableCell><Chip label={cat.slug} size="small" sx={{ fontWeight: 500, fontSize: '0.7rem' }} /></TableCell>
                                    <TableCell><Typography variant="body2" color="text.secondary">{cat.description}</Typography></TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" sx={{ color: 'primary.main', mr: 0.5, '&:hover': { backgroundColor: 'rgba(99,102,241,0.08)' } }} onClick={() => handleCategoryOpen(cat)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', backgroundColor: 'rgba(239,68,68,0.08)' } }} onClick={() => handleCategoryDelete(cat._id)}><DeleteIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Category Dialog */}
            <Dialog open={openCategoryDialog} onClose={handleCategoryClose} maxWidth="sm" fullWidth>
                <Box sx={{ height: '4px', background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' }} />
                <DialogTitle sx={{ fontWeight: 700 }}>{isEditingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Category Name" fullWidth variant="outlined" value={currentCategory.name} onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })} sx={{ mb: 2, mt: 1 }} />
                    <TextField margin="dense" label="Description" fullWidth multiline rows={3} variant="outlined" value={currentCategory.description} onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCategoryClose} sx={{ borderRadius: '50px' }}>Cancel</Button>
                    <Button onClick={handleCategorySave} variant="contained" disabled={!currentCategory.name} sx={{ borderRadius: '50px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } }}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* User Edit Dialog */}
            <Dialog open={openUserDialog} onClose={handleUserClose} maxWidth="xs" fullWidth>
                <Box sx={{ height: '4px', background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' }} />
                <DialogTitle sx={{ fontWeight: 700 }}>Edit Role — {selectedUser.username}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Role</InputLabel>
                        <Select value={selectedUser.role || 'reader'} label="Role" onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}>
                            <MenuItem value="reader">Reader</MenuItem>
                            <MenuItem value="author">Author</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleUserClose} sx={{ borderRadius: '50px' }}>Cancel</Button>
                    <Button onClick={handleUserSave} variant="contained" sx={{ borderRadius: '50px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } }}>Save Role</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminPanel;
