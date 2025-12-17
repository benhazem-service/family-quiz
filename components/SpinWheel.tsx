
import React, { useState } from 'react';
import { Player } from '../types';

interface SpinWheelProps {
  players: Player[];
  onComplete: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ players, onComplete }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const extraDegrees = Math.floor(Math.random() * 360) + 1440; // 4 full circles + random
    const newRotation = rotation + extraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDeg = newRotation % 360;
      const index = Math.floor(((360 - actualDeg) % 360) / (360 / players.length));
      setSelectedPlayer(players[index]);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      <h2 className="text-3xl font-black">عجلة الحظ العائلية</h2>
      
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10 w-4 h-8 bg-white clip-path-polygon" style={{clipPath: 'polygon(50% 100%, 0 0, 100% 0)'}}></div>
        <div 
          className="w-full h-full rounded-full border-8 border-white/30 shadow-2xl relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {players.map((p, i) => (
            <div
              // Fix: Using 'p.uid' as key instead of 'p.id' to match the Player interface defined in types.ts
              key={p.uid}
              className={`absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left ${p.color}`}
              style={{
                transform: `rotate(${i * (360 / players.length)}deg) skewY(${90 - (360 / players.length)}deg)`,
                opacity: 0.9
              }}
            >
               <span className="absolute left-4 bottom-4 font-bold text-white origin-center" style={{ transform: `skewY(-${90 - (360 / players.length)}deg) rotate(45deg)` }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer ? (
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">المختار هو: <span className="text-yellow-400 text-4xl block">{selectedPlayer.name}</span></div>
          <p className="text-white/70 italic">عليه تنفيذ تحدي عائلي سريع!</p>
          <button onClick={onComplete} className="bg-white text-purple-900 px-8 py-3 rounded-full font-bold">متابعة</button>
        </div>
      ) : (
        <button
          onClick={spin}
          disabled={isSpinning}
          className="bg-yellow-400 text-purple-900 px-12 py-4 rounded-full font-black text-xl shadow-xl hover:bg-yellow-300 disabled:opacity-50"
        >
          {isSpinning ? 'تدور...' : 'دوران!'}
        </button>
      )}
    </div>
  );
};

export default SpinWheel;
