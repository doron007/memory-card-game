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
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [matchedAnimation, setMatchedAnimation] = useState([]);

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    let timer;
    if (!isGameOver) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameOver]);

  useEffect(() => {
    if (matchedPairs.length === cards.length && cards.length > 0) {
      setIsGameOver(true);
    }
  }, [matchedPairs, cards]);

  const shuffleCards = () => {
    const shuffledCards = [...initialCards, ...initialCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setIsGameOver(false);
    setTime(0);
  };

  const handleCardClick = (uniqueId) => {
    if (isGameOver || flippedCards.length === 2 || flippedCards.includes(uniqueId) || matchedPairs.includes(uniqueId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, uniqueId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(card => card.uniqueId === firstCardId);
      const secondCard = cards.find(card => card.uniqueId === secondCardId);

      if (firstCard.id === secondCard.id) {
        setMatchedPairs(prev => [...prev, firstCardId, secondCardId]);
        setScore(prevScore => prevScore + 1);
        setMatchedAnimation([firstCardId, secondCardId]);
        setTimeout(() => setMatchedAnimation([]), 500);
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Memory Card Game</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl">Score: {score}</div>
        <div className="text-xl">Time: {formatTime(time)}</div>
      </div>
      <button 
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
        onClick={shuffleCards}
      >
        New Game
      </button>
      {isGameOver && (
        <div className="text-2xl font-bold text-green-600 mb-6 text-center">
          Congratulations! You've completed the game in {formatTime(time)}!
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {cards.map(card => (
          <div 
            key={card.uniqueId} 
            className={`transition-transform duration-200 ${
              matchedAnimation.includes(card.uniqueId) ? 'scale-110' : ''
            }`}
          >
            <Card
              id={card.uniqueId}
              image={card.image}
              isFlipped={flippedCards.includes(card.uniqueId) || matchedPairs.includes(card.uniqueId)}
              onClick={handleCardClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;