import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import Game from '../components/game/Game';

const API_URL = 'https://4rs9xu26ah.execute-api.us-west-1.amazonaws.com/prod';

export default function Home() {
    const [level, setLevel] = useState('Easy');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [pairs, setPairs] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (category) {
            fetchPairs();
        }
    }, [level, category]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            setCategories(data);
            if (data.length > 0) {
                setCategory(data[0]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPairs = async () => {
        try {
            const response = await fetch(`${API_URL}/pairs?level=${level}&category=${category}`);
            const data = await response.json();
            setPairs(data);
        } catch (error) {
            console.error('Error fetching pairs:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom>Memory Card Game</Typography>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                <Select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                    <MenuItem value="Extremely Hard">Extremely Hard</MenuItem>
                </Select>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                </Select>
                <Link href="/admin" passHref>
                    <Button variant="contained" color="primary">Admin</Button>
                </Link>
            </Box>
            <Game pairs={pairs} level={level} />
        </Box>
    );
}