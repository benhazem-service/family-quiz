
import React from 'react';
import { FeudAnswer } from '../types';

interface FeudBoardProps {
  answers: FeudAnswer[];
  revealedIndices: number[];
  strikes: number;
}

const FeudBoard: React.FC<FeudBoardProps> = ({ answers, revealedIndices, strikes }) => {
  return (
    <div className="w-full space-y-8">
      {/* Strikes Overlay */}
      <div className="flex justify-center gap-4 h-20">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className={`text-6xl font-black transition-all duration-300 transform ${i < strikes ? 'text-red-600 scale-110 opacity-100' : 'text-black/20 scale-75 opacity-50'}`}
          >
            <i className="fas fa-times"></i>
          </div>
        ))}
      </div>

      {/* Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 perspective-1000">
        {answers.map((ans, i) => {
          const isRevealed = revealedIndices.includes(i);
          return (
            <div key={i} className="relative h-20 w-full group">
              <div className={`absolute inset-0 transition-all duration-500 preserve-3d shadow-xl rounded-lg ${isRevealed ? 'rotate-x-180' : ''}`}
                   style={{ transformStyle: 'preserve-3d', transform: isRevealed ? 'rotateX(180deg)' : 'rotateX(0deg)' }}>
                
                {/* Front (Hidden) */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-blue-800 to-blue-900 border-2 border-yellow-500 flex items-center justify-center rounded-lg">
                  <div className="w-12 h-12 bg-blue-700 rounded-full border-2 border-yellow-500 flex items-center justify-center font-black text-2xl text-yellow-500 shadow-inner">
                    {i + 1}
                  </div>
                </div>

                {/* Back (Revealed) */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-yellow-400 to-yellow-600 border-2 border-white flex items-center justify-between px-6 rounded-lg text-blue-900 font-black text-2xl shadow-inner"
                     style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}>
                  <span className="truncate">{ans.text}</span>
                  <span className="bg-blue-900 text-yellow-400 w-12 h-12 flex items-center justify-center rounded border-2 border-yellow-500">
                    {ans.points}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeudBoard;
