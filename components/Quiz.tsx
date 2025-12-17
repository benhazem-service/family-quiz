
import React, { useState, useEffect, useCallback } from 'react';
import { Question, Player } from '../types';
import { INITIAL_QUESTIONS } from '../constants';

interface QuizProps {
  players: Player[];
  onFinish: (updatedPlayers: Player[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ players, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timer, setTimer] = useState(10);
  const [gameState, setGameState] = useState<Player[]>(players);
  const [answeringPlayer, setAnsweringPlayer] = useState<Player | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const currentQuestion = INITIAL_QUESTIONS[currentIdx];

  const nextQuestion = useCallback(() => {
    if (currentIdx + 1 < INITIAL_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
      setTimer(10);
      setAnsweringPlayer(null);
      setIsLocked(false);
    } else {
      onFinish(gameState);
    }
  }, [currentIdx, gameState, onFinish]);

  useEffect(() => {
    if (timer > 0 && !answeringPlayer && !isLocked) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      nextQuestion();
    }
  }, [timer, answeringPlayer, isLocked, nextQuestion]);

  const handleOptionClick = (optionIdx: number) => {
    if (!answeringPlayer || isLocked) return;

    setIsLocked(true);
    const isCorrect = optionIdx === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      // Fix: Using 'uid' instead of 'id' as defined in the Player interface in types.ts
      const updated = gameState.map(p => 
        p.uid === answeringPlayer.uid ? { ...p, score: p.score + 10 + timer } : p
      );
      setGameState(updated);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const selectPlayer = (player: Player) => {
    if (answeringPlayer) return;
    setAnsweringPlayer(player);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
        <div className="text-xl font-bold">سؤال {currentIdx + 1} / {INITIAL_QUESTIONS.length}</div>
        <div className={`text-4xl font-black ${timer <= 3 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
          {timer}
        </div>
        <div className="px-3 py-1 bg-white/20 rounded-lg text-sm">{currentQuestion.category}</div>
      </div>

      {/* Question */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-black leading-tight mb-8">
          {currentQuestion.text}
        </h2>
      </div>

      {/* Answer Mode or Selection Mode */}
      {!answeringPlayer ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <p className="col-span-full text-center text-white/70 animate-bounce">اضغط على اسمك للإجابة!</p>
          {gameState.map(p => (
            <button
              // Fix: Using 'p.uid' as key to match the Player interface
              key={p.uid}
              onClick={() => selectPlayer(p)}
              className={`${p.color} p-4 rounded-xl font-bold shadow-lg transform active:scale-90 transition-all`}
            >
              {p.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center p-2 rounded bg-white/10 mb-4">
            المجيب الآن: <span className="font-bold underline">{answeringPlayer.name}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                disabled={isLocked}
                onClick={() => handleOptionClick(i)}
                className={`p-6 text-xl rounded-2xl text-right transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg
                  ${isLocked && i === currentQuestion.correctAnswer ? 'bg-green-500 text-white' : 
                    isLocked && answeringPlayer && i !== currentQuestion.correctAnswer ? 'bg-red-500/50 text-white/50' :
                    'bg-white text-purple-900 hover:bg-purple-100'}`}
              >
                <span className="ml-4 opacity-50">{String.fromCharCode(65 + i)})</span>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
