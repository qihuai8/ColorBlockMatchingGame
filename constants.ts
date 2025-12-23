
import { Color } from './types';

export const GRID_SIZE = 10;
export const COLORS: Color[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export const COLOR_MAP: Record<Color, string> = {
  red: 'bg-rose-500 shadow-rose-500/50',
  blue: 'bg-cyan-500 shadow-cyan-500/50',
  green: 'bg-emerald-500 shadow-emerald-500/50',
  yellow: 'bg-amber-400 shadow-amber-400/50',
  purple: 'bg-fuchsia-600 shadow-fuchsia-600/50',
};

export const INITIAL_TARGET_SCORE = 2000;
export const SCORE_MULTIPLIER = 10;
