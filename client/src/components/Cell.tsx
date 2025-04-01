import React from 'react';
import { CELL_SIZE } from '@/game/constants';

interface CellProps {
  type: string | 0 | 1 | 2;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  const cell = React.useMemo(() => {
    // Return empty cell if type is 0
    if (type === 0) return (
      <div 
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.2)',
          position: 'relative',
        }}
      >
        {/* Grid lines to make empty cells more visible */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: `${CELL_SIZE/4}px ${CELL_SIZE/4}px`
        }} />
      </div>
    );
    
    // Handle numeric types (preview/ghost piece)
    if (type === 1) {
      return (
        <div 
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.15)',
            boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.2)',
            position: 'relative',
          }}
        >
          {/* Grid pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0.1) 2px, transparent 0, transparent 8px)',
          }} />
        </div>
      );
    }
    
    // Handle string types (colors)
    return (
      <div 
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          background: type as string,
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `inset 0 0 10px 0 ${type}99, 0 0 5px 0 ${type}99`,
          position: 'relative',
        }}
      >
        {/* Highlight effect */}
        <div style={{
          position: 'absolute',
          top: 3,
          left: 3,
          width: CELL_SIZE - 15,
          height: CELL_SIZE - 15,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
        }} />
      </div>
    );
  }, [type]);
  
  return cell;
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(Cell);
