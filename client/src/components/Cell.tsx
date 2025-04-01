import React from 'react';
import { CELL_SIZE } from '@/game/constants';

interface CellProps {
  type: string | number;
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
          background: 'rgba(0, 0, 0, 0.2)'
        }}
      />
    );
    
    // Handle numeric types (preview)
    if (type === 1) {
      return (
        <div 
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.15)',
            boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.1)'
          }}
        />
      );
    }
    
    // Handle string types (colors)
    return (
      <div 
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          background: type as string,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `inset 0 0 10px 0 ${type}88, 0 0 4px 0 ${type}88`
        }}
      />
    );
  }, [type]);
  
  return cell;
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(Cell);
