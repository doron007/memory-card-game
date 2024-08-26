import React, { useState, useEffect } from 'react';
import Card from './Card';

// Import all card images
import card1Image from '../../../public/images/card1.png';
import card2Image from '../../../public/images/card2.png';
import card3Image from '../../../public/images/card3.png';
import card4Image from '../../../public/images/card4.png';
import card5Image from '../../../public/images/card5.png';
import card6Image from '../../../public/images/card6.png';

const initialCards = [
  { id: 1, image: card1Image.src },
  { id: 2, image: card2Image.src },
  { id: 3, image: card3Image.src },
  { id: 4, image: card4Image.src },
  { id: 5, image: card5Image.src },
  { id: 6, image: card6Image.src },
];

const Game = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [time, setTime] = useState(0);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-400 to-purple-500 p-2 sm:p-4">
      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4 text-white">Memory Card Game</h1>
        <div className="flex-grow flex flex-col bg-white rounded-lg shadow-lg p-2 sm:p-4">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <div className="text-lg sm:text-xl">Score: {score}</div>
            <div className="text-lg sm:text-xl">Time: {formatTime(time)}</div>
          </div>
          <button 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-4"
            onClick={shuffleCards}
          >
            New Game
          </button>
          {isGameOver && (
            <div className="text-xl sm:text-2xl font-bold text-green-600 mb-2 sm:mb-4 text-center">
              Congratulations! You've completed the game in {formatTime(time)}!
            </div>
          )}
          <div className="flex-grow grid grid-cols-4 gap-2 sm:gap-3">
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
      </div>
    </div>
  );
};

export default Game;