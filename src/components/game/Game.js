import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, Box } from '@mui/material';

export default function Game({ pairs, level }) {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        // Shuffle and set up cards
        const shuffledCards = [...pairs, ...pairs]
            .sort(() => Math.random() - 0.5)
            .map((card, index) => ({ ...card, id: index }));
        setCards(shuffledCards);
        setFlipped([]);
        setSolved([]);
    }, [pairs]);

    const handleClick = (id) => {
        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true);
            const firstCard = cards[flipped[0]];
            const secondCard = cards[id];

            if (firstCard.pairID === secondCard.pairID) {
                setSolved([...solved, firstCard.pairID]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setFlipped([...flipped, id]);
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    const gridSize = {
        Easy: 4,
        Medium: 5,
        Hard: 6,
        'Extremely Hard': 8
    }[level];

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Grid container spacing={1} columns={gridSize}>
                {cards.map((card, index) => (
                    <Grid item xs={1} key={index}>
                        <Card 
                            onClick={() => !disabled && !flipped.includes(index) && !solved.includes(card.pairID) && handleClick(index)}
                            sx={{ 
                                aspectRatio: '1 / 1',
                                cursor: 'pointer',
                                backgroundColor: flipped.includes(index) || solved.includes(card.pairID) ? 'white' : 'lightblue'
                            }}
                        >
                            {(flipped.includes(index) || solved.includes(card.pairID)) && (
                                <CardMedia
                                    component="img"
                                    image={card.image1}
                                    alt="Card"
                                    sx={{ objectFit: 'contain', height: '100%', width: '100%' }}
                                />
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}