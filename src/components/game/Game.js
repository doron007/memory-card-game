import React, { useState, useEffect } from 'react';
import Card from './Card';

const initialCards = [
  { id: 1, image: '/images/card1.png' },
  { id: 2, image: '/images/card2.png' },
  { id: 3, image: '/images/card3.png' },
  { id: 4, image: '/images/card4.png' },
  { id: 5, image: '/images/card5.png' },
  { id: 6, image: '/images/card6.png' },
];

const Game = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    const shuffledCards = [...initialCards, ...initialCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }));
    setCards(shuffledCards);
  }, []);

  const handleCardClick = (uniqueId) => {
    if (flippedCards.length === 2 || flippedCards.includes(uniqueId) || matchedPairs.includes(uniqueId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, uniqueId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(card => card.uniqueId === firstCardId);
      const secondCard = cards.find(card => card.uniqueId === secondCardId);

      if (firstCard.id === secondCard.id) {
        setMatchedPairs([...matchedPairs, firstCardId, secondCardId]);
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Memory Card Game</h2>
      <div className="grid grid-cols-4 gap-4">
        {cards.map(card => (
          <Card
            key={card.uniqueId}
            id={card.uniqueId}
            image={card.image}
            isFlipped={flippedCards.includes(card.uniqueId) || matchedPairs.includes(card.uniqueId)}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;