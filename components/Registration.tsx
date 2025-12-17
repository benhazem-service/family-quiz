
import React, { useState } from 'react';
import { Player } from '../types';
import { PLAYER_COLORS } from '../constants';

interface RegistrationProps {
  onComplete: (players: Player[]) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const [names, setNames] = useState<string[]>(['', '']);
  
  const addPlayer = () => {
    if (names.length < 8) setNames([...names, '']);
  };

  const removePlayer = (index: number) => {
    if (names.length > 2) {
      const newNames = names.filter((_, i) => i !== index);
      setNames(newNames);
    }
  };

  const handleChange = (index: number, val: string) => {
    const newNames = [...names];
    newNames[index] = val;
    setNames(newNames);
  };

  const handleStart = () => {
    // Fix: Corrected the Player mapping to match types.ts by removing 'isOnline' and adding required 'team' property
    const players: Player[] = names
      .filter(n => n.trim() !== '')
      .map((name, i) => ({
        uid: Math.random().toString(36).substr(2, 9),
        name,
        score: 0,
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        team: null
      }));
    
    if (players.length >= 2) {
      onComplete(players);
    } else {
      alert("يرجى إدخال اسمين على الأقل!");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">سجل أسماء المتسابقين</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {names.map((name, index) => (
          <div key={index} className="flex items-center space-x-2 space-x-reverse">
            <div className={`w-4 h-12 rounded-full ${PLAYER_COLORS[index % PLAYER_COLORS.length]}`} />
            <input
              type="text"
              value={name}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`اسم اللاعب ${index + 1}`}
              className="flex-1 bg-white/20 border-none rounded-xl p-3 focus:ring-2 focus:ring-white outline-none placeholder:text-white/50"
            />
            <button 
              onClick={() => removePlayer(index)}
              className="text-red-300 hover:text-red-500 transition-colors"
            >
              <i className="fas fa-times-circle text-xl" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col items-center space-y-4 mt-8">
        {names.length < 8 && (
          <button 
            onClick={addPlayer}
            className="flex items-center space-x-2 space-x-reverse text-white/80 hover:text-white transition-colors"
          >
            <i className="fas fa-plus-circle" />
            <span>إضافة لاعب</span>
          </button>
        )}
        
        <button
          onClick={handleStart}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-black py-4 rounded-2xl shadow-xl transform transition hover:scale-105 active:scale-95"
        >
          ابدأ التحدي!
        </button>
      </div>
    </div>
  );
};

export default Registration;
