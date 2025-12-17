
import React from 'react';
import { Player } from '../types';

interface LeaderboardProps {
  players: Player[];
  onRestart?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, onRestart }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8 py-4">
      <div className="text-center">
        <i className="fas fa-trophy text-6xl text-yellow-400 mb-4 animate-bounce-slow" />
        <h2 className="text-4xl font-black">النتائج النهائية</h2>
      </div>

      <div className="space-y-4">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.uid}
            className={`flex items-center justify-between p-5 rounded-3xl bg-white/10 border-l-8 ${player.color.replace('bg-', 'border-')} transform transition hover:translate-x-2`}
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-2xl font-black opacity-30 w-8">{index + 1}</span>
              <span className="text-xl font-bold">{player.name}</span>
            </div>
            <div className="text-2xl font-black text-yellow-400">{player.score} <span className="text-sm font-normal text-white/50">نقطة</span></div>
          </div>
        ))}
      </div>

      {onRestart && (
        <button
          onClick={onRestart}
          className="w-full mt-8 bg-yellow-400 text-purple-900 font-black py-5 rounded-2xl shadow-xl hover:bg-yellow-300 transition-all transform hover:scale-105"
        >
          جولة جديدة للجميع
        </button>
      )}
      {!onRestart && <p className="text-center text-white/50 animate-pulse">في انتظار الأدمن لبدء جولة جديدة...</p>}
    </div>
  );
};

export default Leaderboard;
