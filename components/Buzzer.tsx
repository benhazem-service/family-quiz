
import React, { useState, useEffect } from 'react';
import { Player } from '../types';

interface BuzzerProps {
  players: Player[];
  onComplete: (winnerId: string | null) => void;
}

const Buzzer: React.FC<BuzzerProps> = ({ players, onComplete }) => {
  const [active, setActive] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  useEffect(() => {
    const delay = Math.random() * 3000 + 2000;
    const timeout = setTimeout(() => {
      setActive(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const handlePress = (player: Player) => {
    if (!active || winner) return;
    setWinner(player);
    // Fix: Using 'player.uid' instead of 'player.id' to match the Player interface defined in types.ts
    setTimeout(() => onComplete(player.uid), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <h2 className="text-3xl font-bold text-center">تحدي السرعة!</h2>
      <p className="text-white/70">اضغط فور ظهور اللون الأخضر</p>
      
      <div className={`w-40 h-40 rounded-full shadow-2xl transition-all duration-300 ${active ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />

      {winner ? (
        <div className="text-4xl font-black text-yellow-400 animate-bounce">
          الفائز: {winner.name}!
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {players.map(p => (
            <button
              // Fix: Using 'p.uid' as key instead of 'p.id' to match the Player interface
              key={p.uid}
              onClick={() => handlePress(p)}
              className={`${p.color} p-6 rounded-2xl font-black text-2xl shadow-xl transform active:scale-75 transition-all`}
            >
              بزر!
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Buzzer;
