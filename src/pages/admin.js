import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, Snackbar, Box, Typography, Grid, CircularProgress, FormControl, InputLabel, FormHelperText } from '@mui/material';

const API_URL = 'https://4rs9xu26ah.execute-api.us-west-1.amazonaws.com/prod';

export default function Admin() {
    const [pairs, setPairs] = useState([]);
    const [newPair, setNewPair] = useState({ category: '', image1: '', image2: '' });
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategories();
        fetchPairs();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            console.log('Raw response:', await response.text());
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setCategories(['', ...data]);
            } else if (typeof data === 'object' && data !== null) {
                const categoryValues = Object.values(data);
                if (Array.isArray(categoryValues)) {
                    setCategories(['', ...categoryValues]);
                } else {
                    console.error('Unexpected data format for categories:', data);
                    setCategories([]);
                }
            } else {
                console.error('Unexpected data format for categories:', data);
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setMessage('Error fetching categories');
            setCategories([]);
        }
    };

    const fetchPairs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/pairs?level=Extremely Hard&category=all`);
            const data = await response.json();
            setPairs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching pairs:', error);
            setMessage('Error fetching pairs');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newPair.category) {
            newErrors.category = 'Please enter a category';
        }
        if (!newPair.image1) {
            newErrors.image1 = 'Please upload the first image';
        }
        if (!newPair.image2) {
            newErrors.image2 = 'Please upload the second image';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validateForm()) {
            setMessage('Please correct the errors before submitting');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/manage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    operation: 'CREATE',
                    pairID: Date.now().toString(),
                    ...newPair
                })
            });
            const data = await response.json();
            setMessage(data.message);
            fetchPairs();
            fetchCategories();
            setNewPair({ category: '', image1: '', image2: '' });
        } catch (error) {
            console.error('Error creating pair:', error);
            setMessage('Error creating pair');
        }
    };

    const handleUpdate = async (pairID) => {
        // Implement update logic here
    };

    const handleDelete = async (pairID) => {
        // Implement delete logic here
    };

    const handleImageUpload = (event, imageNumber) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewPair({ ...newPair, [`image${imageNumber}`]: reader.result });
            setErrors({ ...errors, [`image${imageNumber}`]: null });
        };
        reader.readAsDataURL(file);
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom>Card Pair Management</Typography>
            <Box sx={{ marginBottom: 2 }}>
                <FormControl fullWidth error={!!errors.category} sx={{ marginBottom: 2 }}>
                    <TextField
                        label="Category"
                        value={newPair.category}
                        onChange={(e) => setNewPair({ ...newPair, category: e.target.value })}
                        error={!!errors.category}
                        helperText={errors.category}
                    />
                </FormControl>
                <Box sx={{ marginBottom: 2 }}>
                    <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, 1)}
                        accept="image/*"
                    />
                    {errors.image1 && <FormHelperText error>{errors.image1}</FormHelperText>}
                    {newPair.image1 && (
                        <Box sx={{ mt: 1 }}>
                            <img src={newPair.image1} alt="Preview 1" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                        </Box>
                    )}
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                    <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, 2)}
                        accept="image/*"
                    />
                    {errors.image2 && <FormHelperText error>{errors.image2}</FormHelperText>}
                    {newPair.image2 && (
                        <Box sx={{ mt: 1 }}>
                            <img src={newPair.image2} alt="Preview 2" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                        </Box>
                    )}
                </Box>
                <Button onClick={handleCreate} variant="contained" color="primary">Create Pair</Button>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {pairs.map(pair => (
                        <Grid item xs={6} key={pair.pairID}>
                            <img src={pair.image1} alt="Card 1" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                            <img src={pair.image2} alt="Card 2" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                            <Typography>{pair.category}</Typography>
                            <Button onClick={() => handleUpdate(pair.pairID)}>Update</Button>
                            <Button onClick={() => handleDelete(pair.pairID)}>Delete</Button>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Snackbar open={!!message} message={message} autoHideDuration={3000} onClose={() => setMessage('')} />
        </Box>
    );
}