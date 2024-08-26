import React from 'react';

const Card = ({ id, image, isFlipped, onClick }) => {
  return (
    <div 
      className="w-full h-32 cursor-pointer rounded-md overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
      onClick={() => onClick(id)}
    >
      <div className="w-full h-full">
        {isFlipped ? (
          <div className="w-full h-full bg-white flex items-center justify-center p-2">
            <img 
              src={image} 
              alt="card" 
              className="max-w-full max-h-full object-contain" 
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            {/* Card back design - you can add a logo or pattern here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;