
import React from 'react';
import { Color } from '../types';
import { COLOR_MAP } from '../constants';

interface BlockProps {
  color: Color;
  isSelected: boolean;
  onClick: () => void;
  isRemoving: boolean;
}

const Block: React.FC<BlockProps> = ({ color, isSelected, onClick, isRemoving }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full h-full rounded-md transition-all duration-200 
        ${COLOR_MAP[color]}
        ${isSelected ? 'scale-90 ring-4 ring-white shadow-xl' : 'scale-100 hover:scale-105 shadow-md'}
        ${isRemoving ? 'opacity-0 scale-0' : 'opacity-100'}
        flex items-center justify-center overflow-hidden
      `}
    >
      <div className="w-1/2 h-1/2 bg-white/20 rounded-full blur-sm -translate-y-1 -translate-x-1" />
    </button>
  );
};

export default Block;
