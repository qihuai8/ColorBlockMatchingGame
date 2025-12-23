
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BlockData, Color, GameState } from './types';
import { GRID_SIZE, COLORS, INITIAL_TARGET_SCORE, SCORE_MULTIPLIER } from './constants';
import Block from './components/Block';
import { getGameHint } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    score: 0,
    level: 1,
    highScore: parseInt(localStorage.getItem('neonPopHighScore') || '0'),
    targetScore: INITIAL_TARGET_SCORE,
    isGameOver: false,
    isProcessing: false,
  });

  const [selectedGroup, setSelectedGroup] = useState<[number, number][]>([]);
  const [hint, setHint] = useState<string>("Welcome to Neon Pop! Match same-colored blocks to score.");
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Initialize Board
  const initBoard = useCallback(() => {
    const newBoard: BlockData[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const row: BlockData[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        row.push({
          id: `${x}-${y}-${Math.random()}`,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x,
          y
        });
      }
      newBoard.push(row);
    }
    return newBoard;
  }, []);

  // Set initial board on mount
  useEffect(() => {
    setGameState(prev => ({ ...prev, board: initBoard() }));
  }, [initBoard]);

  // Find connected group
  const findGroup = (x: number, y: number, board: BlockData[][]): [number, number][] => {
    const color = board[y][x].color;
    const group: [number, number][] = [];
    const visited = new Set<string>();
    const queue: [number, number][] = [[x, y]];

    while (queue.length > 0) {
      const [currX, currY] = queue.shift()!;
      const key = `${currX},${currY}`;

      if (visited.has(key)) continue;
      visited.add(key);

      if (board[currY][currX].color === color) {
        group.push([currX, currY]);
        
        const neighbors = [[currX + 1, currY], [currX - 1, currY], [currX, currY + 1], [currX, currY - 1]];
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
            queue.push([nx, ny]);
          }
        }
      }
    }
    return group;
  };

  const handleBlockClick = (x: number, y: number) => {
    if (gameState.isProcessing || gameState.isGameOver) return;

    const group = findGroup(x, y, gameState.board);
    
    // If clicking on already selected group, pop it
    const isAlreadySelected = selectedGroup.some(([gx, gy]) => gx === x && gy === y);
    
    if (isAlreadySelected && group.length >= 2) {
      popGroup(group);
    } else {
      setSelectedGroup(group.length >= 2 ? group : []);
    }
  };

  const popGroup = async (group: [number, number][]) => {
    const points = group.length * group.length * SCORE_MULTIPLIER;
    const newBoard = gameState.board.map(row => [...row]);

    setGameState(prev => ({ ...prev, isProcessing: true }));

    // Mark blocks as null (removing)
    for (const [gx, gy] of group) {
      newBoard[gy][gx] = { ...newBoard[gy][gx], color: 'null' as any }; // Temporary state
    }
    
    setGameState(prev => ({ ...prev, board: newBoard, score: prev.score + points }));

    // Delay for animation
    await new Promise(res => setTimeout(res, 200));

    // Apply gravity
    const processedBoard: BlockData[][] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const column: BlockData[] = [];
      for (let y = GRID_SIZE - 1; y >= 0; y--) {
        if (newBoard[y][x].color !== 'null') {
          column.unshift(newBoard[y][x]);
        }
      }
      
      // Fill from top
      while (column.length < GRID_SIZE) {
        column.unshift({
          id: `new-${x}-${column.length}-${Math.random()}`,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x,
          y: 0 // Will be updated
        });
      }
      
      processedBoard.push(column);
    }

    // Reconstruct board from columns
    const finalBoard: BlockData[][] = Array.from({ length: GRID_SIZE }, () => []);
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        finalBoard[y][x] = { ...processedBoard[x][y], x, y };
      }
    }

    setGameState(prev => ({ 
      ...prev, 
      board: finalBoard, 
      isProcessing: false,
    }));
    setSelectedGroup([]);

    // Check game over
    if (!hasAnyMoves(finalBoard)) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
  };

  const hasAnyMoves = (board: BlockData[][]): boolean => {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const group = findGroup(x, y, board);
        if (group.length >= 2) return true;
      }
    }
    return false;
  };

  const resetGame = () => {
    setGameState({
      board: initBoard(),
      score: 0,
      level: 1,
      highScore: parseInt(localStorage.getItem('neonPopHighScore') || '0'),
      targetScore: INITIAL_TARGET_SCORE,
      isGameOver: false,
      isProcessing: false,
    });
    setSelectedGroup([]);
    setHint("New game started! Good luck.");
  };

  const fetchAIHint = async () => {
    setIsLoadingHint(true);
    const tip = await getGameHint(gameState.board, gameState.score, gameState.targetScore);
    setHint(tip);
    setIsLoadingHint(false);
  };

  useEffect(() => {
    if (gameState.score > gameState.highScore) {
      localStorage.setItem('neonPopHighScore', gameState.score.toString());
      setGameState(prev => ({ ...prev, highScore: gameState.score }));
    }
    
    if (gameState.score >= gameState.targetScore) {
      setGameState(prev => ({ 
        ...prev, 
        level: prev.level + 1, 
        targetScore: prev.targetScore + (INITIAL_TARGET_SCORE * (prev.level + 1))
      }));
    }
  }, [gameState.score]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center justify-center">
      {/* Header Info */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">High Score</span>
          <span className="text-3xl font-black text-amber-400">{gameState.highScore.toLocaleString()}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Score</span>
          <span className="text-4xl font-black text-white">{gameState.score.toLocaleString()}</span>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-500" 
              style={{ width: `${Math.min(100, (gameState.score / gameState.targetScore) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Goal: {gameState.targetScore}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Level</span>
          <span className="text-3xl font-black text-fuchsia-500">{gameState.level}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-6xl">
        {/* Game Board */}
        <div className="relative group mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-2xl overflow-hidden grid-container">
            <div 
              className="grid gap-1 md:gap-2" 
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                width: 'min(85vw, 500px)',
                height: 'min(85vw, 500px)'
              }}
            >
              {gameState.board.map((row, y) => 
                row.map((block, x) => (
                  <Block 
                    key={block.id}
                    color={block.color}
                    isSelected={selectedGroup.some(([gx, gy]) => gx === x && gy === y)}
                    isRemoving={block.color === ('null' as any)}
                    onClick={() => handleBlockClick(x, y)}
                  />
                ))
              )}
            </div>

            {/* Game Over Overlay */}
            {gameState.isGameOver && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-in fade-in zoom-in duration-300">
                <h2 className="text-5xl font-black text-white mb-4">GAME OVER</h2>
                <p className="text-slate-400 mb-8">No more matches found!</p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                >
                  TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls & AI */}
        <div className="flex-1 w-full space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-slate-100">Tactical Analyzer</h3>
            </div>
            
            <p className="text-slate-300 italic mb-6 leading-relaxed min-h-[60px]">
              "{hint}"
            </p>
            
            <button 
              onClick={fetchAIHint}
              disabled={isLoadingHint || gameState.isGameOver}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-100 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              {isLoadingHint ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  Thinking...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.908-.607L18.5 9.5a7 7 0 10-13 0l3.255 6.893a1 1 0 00.908.607z" />
                  </svg>
                  Get AI Tip
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
            <h4 className="font-bold text-slate-400 text-sm uppercase mb-4">How to Play</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex gap-2">
                <span className="text-cyan-500 font-bold">1.</span>
                <span>Click a group of 2 or more same-colored blocks to select it.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-500 font-bold">2.</span>
                <span>Click the selected group again to pop it.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-500 font-bold">3.</span>
                <span>Larger groups grant exponential points!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-500 font-bold">4.</span>
                <span>Reach the target score to advance your level.</span>
              </li>
            </ul>
            
            <button 
              onClick={resetGame}
              className="w-full mt-6 py-2 text-slate-500 hover:text-rose-400 text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              Restart Session
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-12 text-slate-600 text-xs font-medium uppercase tracking-[0.2em]">
        Neon Pop Engine v1.0 • Powered by Gemini AI
      </footer>
    </div>
  );
};

export default App;
