import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Blog from './pages/Blog';
import SinglePost from './pages/SinglePost';
import Dashboard from './pages/Dashboard';
import PostForm from './pages/dashboard/PostForm';
import AdminPanel from './pages/admin/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import useAuthStore from './context/useAuthStore';

function App() {
    const { loadUser } = useAuthStore();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="blog" element={<Blog />} />
                <Route path="post/:id" element={<SinglePost />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />

                {/* Protected Routes for Author and Admin */}
                <Route element={<ProtectedRoute allowedRoles={['author', 'admin']} />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="dashboard/create-post" element={<PostForm />} />
                    <Route path="dashboard/edit-post/:id" element={<PostForm />} />
                </Route>

                {/* Protected Routes for Admin Only */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="admin" element={<AdminPanel />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
