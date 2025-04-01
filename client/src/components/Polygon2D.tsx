import React, { useMemo } from 'react';
import { PlanetSide } from '@/lib/stores/useTetris';

interface Polygon2DProps {
  sides: number;
  size: number;
  boardData?: PlanetSide[];
  selectedSide?: number | null;
  onSelectSide?: (side: number) => void;
}

const Polygon2D: React.FC<Polygon2DProps> = ({ 
  sides, 
  size, 
  boardData = [], 
  selectedSide = null,
  onSelectSide 
}) => {
  // Generate points for the polygon
  const points = useMemo(() => {
    const pts = [];
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;
    
    for (let i = 0; i < sides; i++) {
      // Start from the top (90° or π/2) and go clockwise
      const angle = Math.PI / 2 - (i * 2 * Math.PI / sides);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY - radius * Math.sin(angle);
      pts.push({ x, y, angle });
    }
    
    return pts;
  }, [sides, size]);
  
  // Create the polygon path
  const pathData = useMemo(() => {
    if (points.length < 3) return '';
    
    return points.map((pt, i) => 
      `${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`
    ).join(' ') + ' Z';
  }, [points]);
  
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Main polygon shape */}
        <path
          d={pathData}
          fill="rgba(139, 92, 246, 0.1)"
          stroke="#8b5cf6"
          strokeWidth="2"
        />
        
        {/* Center point */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={4}
          fill="#8b5cf6"
        />
        
        {/* Side indicators */}
        {points.map((point, index) => {
          // Get the corresponding side data
          const sideData = boardData[index];
          const hasBlocks = sideData?.board?.some(row => row.some(cell => typeof cell === 'string'));
          const isGameOver = sideData?.gameOver;
          
          // Calculate middle point between center and vertex for the indicator
          const midX = (point.x + size / 2) / 2;
          const midY = (point.y + size / 2) / 2;
          
          let fillColor = "rgba(255, 255, 255, 0.2)";
          if (hasBlocks) fillColor = "#8b5cf6";
          if (isGameOver) fillColor = "#ef4444";
          if (selectedSide === index) fillColor = "#22c55e";
          
          return (
            <g key={index}>
              {/* Line from center to vertex */}
              <line
                x1={size / 2}
                y1={size / 2}
                x2={point.x}
                y2={point.y}
                stroke="#8b5cf680"
                strokeWidth="1"
              />
              
              {/* Side indicator */}
              <circle
                cx={midX}
                cy={midY}
                r={6}
                fill={fillColor}
                stroke={selectedSide === index ? "#22c55e" : "#8b5cf6"}
                strokeWidth="2"
                style={{ cursor: onSelectSide ? 'pointer' : 'default' }}
                onClick={() => onSelectSide && onSelectSide(index)}
              />
              
              {/* Side number */}
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="10"
                fontWeight="bold"
              >
                {index + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Polygon2D;