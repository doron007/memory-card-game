import React from 'react';

const Card = ({ id, image, isFlipped, onClick }) => {
  return (
    <div 
      className="w-full h-32 cursor-pointer"
      onClick={() => onClick(id)}
    >
      {isFlipped ? (
        <div className="w-full h-full bg-white rounded-md border-2 border-blue-500 flex items-center justify-center p-2">
          <img 
            src={image} 
            alt="card" 
            className="max-w-full max-h-full object-contain" 
          />
        </div>
      ) : (
        <div className="w-full h-full bg-blue-500 rounded-md border-2 border-white flex items-center justify-center">
          <span className="text-white text-2xl"></span>
        </div>
      )}
    </div>
  );
};

export default Card;