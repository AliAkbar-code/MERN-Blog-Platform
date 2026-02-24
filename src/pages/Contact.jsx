import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Alert, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const contactInfo = [
    { icon: EmailIcon, title: 'Email Us', detail: 'hello@mernblog.com', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { icon: LocationOnIcon, title: 'Location', detail: 'Remote — Worldwide', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    { icon: AccessTimeIcon, title: 'Response Time', detail: 'Within 24 hours', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
];

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <Container maxWidth="md">
            <Helmet>
                <title>Contact Us - MERN Blog</title>
                <meta name="description" content="Get in touch with the MERN Blog team. We'd love to hear from you." />
            </Helmet>

            {/* Hero */}
            <Box sx={{ mt: 5, mb: 5, textAlign: 'center', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: -40, left: '15%', width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <Box sx={{ position: 'absolute', top: -20, right: '20%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 0.8, mb: 3, borderRadius: '50px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>Get In Touch</Typography>
                    </Box>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Contact Us
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}>
                        Have a question, suggestion, or want to collaborate? Drop us a message and we'll get back to you soon.
                    </Typography>
                </Box>
            </Box>

            {/* Contact Info Cards */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {contactInfo.map((info, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(99,102,241,0.1)' } }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: info.gradient, mx: 'auto', mb: 2 }}>
                                <info.icon sx={{ color: '#fff', fontSize: 22 }} />
                            </Box>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>{info.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{info.detail}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Contact Form */}
            <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, position: 'relative', overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Send a Message</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Fill out the form below and we'll respond as soon as possible.</Typography>

                {submitted && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Thanks for reaching out! We'll get back to you shortly.</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth label="Your Name" name="name" value={formData.name} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField required fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required fullWidth multiline rows={5} label="Your Message" name="message" value={formData.message} onChange={handleChange} />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" size="large" endIcon={<SendIcon />}
                        sx={{ mt: 3, borderRadius: '50px', px: 4, py: 1.3, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '1rem', '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' } }}>
                        Send Message
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Contact;
