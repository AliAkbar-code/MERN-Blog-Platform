import React from 'react';
import { Container, Typography, Box, Grid, Avatar, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import GroupsIcon from '@mui/icons-material/Groups';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CodeIcon from '@mui/icons-material/Code';

const values = [
    { icon: RocketLaunchIcon, title: 'Innovation', desc: 'We push boundaries and explore cutting-edge topics in web development.', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { icon: GroupsIcon, title: 'Community', desc: 'A welcoming space where developers share knowledge and grow together.', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    { icon: CodeIcon, title: 'Quality Content', desc: 'Every article is crafted with care to deliver real, practical value.', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { icon: FavoriteIcon, title: 'Passion', desc: 'Built by developers who love what they do and want to inspire others.', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
];

const About = () => {
    return (
        <Container maxWidth="md">
            <Helmet>
                <title>About Us - MERN Blog</title>
                <meta name="description" content="Learn more about MERN Blog — our mission, values, and the team behind the platform." />
            </Helmet>

            {/* Hero */}
            <Box sx={{ mt: 5, mb: 6, textAlign: 'center', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: -40, left: '20%', width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <Box sx={{ position: 'absolute', top: -20, right: '15%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 0.8, mb: 3, borderRadius: '50px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <GroupsIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>About Us</Typography>
                    </Box>

                    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Our Story
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 550, mx: 'auto', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        MERN Blog is a platform built for developers, by developers. We believe in the power of sharing knowledge to help the tech community grow and thrive.
                    </Typography>
                </Box>
            </Box>

            {/* Mission */}
            <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 4, border: '1px solid', borderColor: 'divider', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Our Mission</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    We're on a mission to make high-quality web development content accessible to everyone. Whether you're a beginner taking your first steps or a seasoned developer looking for advanced insights, MERN Blog is your go-to destination for articles that matter.
                </Typography>
            </Paper>

            {/* Values */}
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, textAlign: 'center' }}>What We Stand For</Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {values.map((v, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                        <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(99,102,241,0.1)' } }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.gradient, mb: 2 }}>
                                <v.icon sx={{ color: '#fff', fontSize: 22 }} />
                            </Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom>{v.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{v.desc}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Tech Stack */}
            <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Built With</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>The modern MERN stack powering this platform.</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {['MongoDB', 'Express.js', 'React', 'Node.js'].map((tech, i) => (
                        <Box key={i} sx={{ px: 3, py: 1.5, borderRadius: '50px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.15)', fontWeight: 600, fontSize: '0.9rem', color: 'primary.main' }}>
                            {tech}
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default About;
