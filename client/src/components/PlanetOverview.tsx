import React from 'react';
import { useTetris } from '@/lib/stores/useTetris';
import { GamePhase } from '@/game/constants';
import { Button } from '@/components/ui/button';
import Polygon2D from './Polygon2D';

const PlanetOverview: React.FC = () => {
  const { 
    planetSides,
    allSides,
    setCurrentSide,
    setGamePhase,
    currentSide
  } = useTetris();
  
  // Handle side selection
  const handleSelectSide = (side: number) => {
    setCurrentSide(side);
    setGamePhase(GamePhase.PLAYING);
  };
  
  // Count active sides (with blocks) and completed sides
  const activeSides = allSides.filter(side => 
    side.board.some(row => row.some(cell => typeof cell === 'string'))
  ).length;
  
  const completedSides = allSides.filter(side => side.gameOver).length;
  
  return (
    <div className="flex flex-col items-center w-full h-full p-4">
      <div className="bg-black/80 border border-purple-500 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Planet Overview
        </h2>
        
        {/* Planet visualization */}
        <div className="flex justify-center mb-6">
          <Polygon2D 
            sides={planetSides} 
            size={250} 
            boardData={allSides}
            selectedSide={currentSide} 
            onSelectSide={handleSelectSide}
          />
        </div>
        
        {/* Planet stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-900/50 p-3 rounded-lg border border-purple-700">
            <p className="text-gray-300 text-sm">Active Sides</p>
            <p className="text-2xl font-bold text-white">{activeSides} / {planetSides}</p>
          </div>
          
          <div className="bg-purple-900/50 p-3 rounded-lg border border-purple-700">
            <p className="text-gray-300 text-sm">Completed</p>
            <p className="text-2xl font-bold text-white">{completedSides} / {planetSides}</p>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="text-gray-300 text-sm mb-6">
          <p className="mb-2">Click a side to resume playing there.</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><span className="inline-block w-3 h-3 bg-white/20 rounded-full mr-1"></span> Empty side</li>
            <li><span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-1"></span> Active side</li>
            <li><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span> Game over</li>
            <li><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span> Current side</li>
          </ul>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="border-purple-500 text-purple-500 hover:bg-purple-500/10"
            onClick={() => setGamePhase(GamePhase.PLAYING)}
          >
            Back to Game
          </Button>
          
          <Button 
            variant="ghost" 
            className="hover:bg-purple-500/10"
            onClick={() => setGamePhase(GamePhase.START)}
          >
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanetOverview;