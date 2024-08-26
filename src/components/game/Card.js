import React from 'react';

const Card = ({ id, image, isFlipped, onClick }) => {
  return (
    <div 
      className={`w-24 h-32 border-2 rounded-md cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden ${
        isFlipped ? 'bg-white' : 'bg-blue-500'
      }`}
      onClick={() => onClick(id)}
    >
      {isFlipped && (
        <div className="w-full h-full p-2 flex items-center justify-center">
          <img 
            src={image} 
            alt="card" 
            className="max-w-full max-h-full object-contain" 
          />
        </div>
      )}
    </div>
  );
};

export default Card;