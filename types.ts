
export interface Player {
  uid: string;
  name: string;
  score: number;
  color: string;
  team: 'A' | 'B' | null;
}

export interface FeudAnswer {
  text: string;
  points: number;
}

export interface FeudQuestion {
  id: number;
  text: string;
  category: string; // Added category
  answers: FeudAnswer[];
}

export enum GameState {
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface GameSession {
  state: GameState;
  currentQuestionIndex: number;
  revealedAnswers: number[];
  strikes: number;
  teamAScore: number;
  teamBScore: number;
  teamAColor: string; // Dynamic team color
  teamBColor: string; // Dynamic team color
  adminId: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
}
