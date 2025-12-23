
export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface BlockData {
  id: string;
  color: Color;
  x: number;
  y: number;
}

export interface GameState {
  board: BlockData[][];
  score: number;
  level: number;
  highScore: number;
  targetScore: number;
  isGameOver: boolean;
  isProcessing: boolean;
}

export interface Move {
  x: number;
  y: number;
  size: number;
}
