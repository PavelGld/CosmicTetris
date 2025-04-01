import { useState, useEffect, useCallback } from 'react';
import { GamePhase } from '@/game/constants';
import { useTetris } from '@/lib/stores/useTetris';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mobile touch controls for the game
const Controls = () => {
  const gamePhase = useTetris(state => state.gamePhase);
  const [touchState, setTouchState] = useState({
    left: false,
    right: false,
    down: false,
    rotate: false,
    drop: false
  });
  
  // Simulate keyboard events for mobile controls
  useEffect(() => {
    if (gamePhase !== GamePhase.PLAYING) return;
    
    // Create events to dispatch
    const createKeyEvent = (eventType: string, keyCode: string) => {
      return new KeyboardEvent(eventType, {
        code: keyCode,
        bubbles: true,
        cancelable: true,
      });
    };
    
    // Dispatch events based on touch state
    Object.entries(touchState).forEach(([key, isPressed]) => {
      if (isPressed) {
        let keyCode = '';
        
        switch (key) {
          case 'left':
            keyCode = 'ArrowLeft';
            break;
          case 'right':
            keyCode = 'ArrowRight';
            break;
          case 'down':
            keyCode = 'ArrowDown';
            break;
          case 'rotate':
            keyCode = 'ArrowUp';
            break;
          case 'drop':
            keyCode = 'Space';
            break;
          default:
            return;
        }
        
        window.dispatchEvent(createKeyEvent('keydown', keyCode));
      }
    });
    
    return () => {
      // Clean up by dispatching keyup events for all pressed keys
      Object.entries(touchState).forEach(([key, isPressed]) => {
        if (isPressed) {
          let keyCode = '';
          
          switch (key) {
            case 'left':
              keyCode = 'ArrowLeft';
              break;
            case 'right':
              keyCode = 'ArrowRight';
              break;
            case 'down':
              keyCode = 'ArrowDown';
              break;
            case 'rotate':
              keyCode = 'ArrowUp';
              break;
            case 'drop':
              keyCode = 'Space';
              break;
            default:
              return;
          }
          
          window.dispatchEvent(createKeyEvent('keyup', keyCode));
        }
      });
    };
  }, [touchState, gamePhase]);
  
  // Touch event handlers
  const startTouch = useCallback((key: keyof typeof touchState) => {
    setTouchState(prev => ({ ...prev, [key]: true }));
  }, []);
  
  const endTouch = useCallback((key: keyof typeof touchState) => {
    setTouchState(prev => ({ ...prev, [key]: false }));
  }, []);
  
  return (
    <div className="mt-4 w-full">
      <div className="grid grid-cols-3 gap-2">
        {/* Left movement */}
        <Button
          variant="outline"
          className={cn(
            touchState.left ? "bg-purple-900" : "bg-transparent"
          )}
          onTouchStart={() => startTouch('left')}
          onTouchEnd={() => endTouch('left')}
          onMouseDown={() => startTouch('left')}
          onMouseUp={() => endTouch('left')}
          onMouseLeave={() => endTouch('left')}
        >
          ←
        </Button>
        
        {/* Down movement */}
        <Button
          variant="outline"
          className={cn(
            touchState.down ? "bg-purple-900" : "bg-transparent"
          )}
          onTouchStart={() => startTouch('down')}
          onTouchEnd={() => endTouch('down')}
          onMouseDown={() => startTouch('down')}
          onMouseUp={() => endTouch('down')}
          onMouseLeave={() => endTouch('down')}
        >
          ↓
        </Button>
        
        {/* Right movement */}
        <Button
          variant="outline"
          className={cn(
            touchState.right ? "bg-purple-900" : "bg-transparent"
          )}
          onTouchStart={() => startTouch('right')}
          onTouchEnd={() => endTouch('right')}
          onMouseDown={() => startTouch('right')}
          onMouseUp={() => endTouch('right')}
          onMouseLeave={() => endTouch('right')}
        >
          →
        </Button>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-2">
        {/* Rotate */}
        <Button
          variant="outline"
          className={cn(
            touchState.rotate ? "bg-purple-900" : "bg-transparent"
          )}
          onTouchStart={() => startTouch('rotate')}
          onTouchEnd={() => endTouch('rotate')}
          onMouseDown={() => startTouch('rotate')}
          onMouseUp={() => endTouch('rotate')}
          onMouseLeave={() => endTouch('rotate')}
        >
          Rotate
        </Button>
        
        {/* Hard drop */}
        <Button
          variant="outline"
          className={cn(
            touchState.drop ? "bg-purple-900" : "bg-transparent"
          )}
          onTouchStart={() => startTouch('drop')}
          onTouchEnd={() => endTouch('drop')}
          onMouseDown={() => startTouch('drop')}
          onMouseUp={() => endTouch('drop')}
          onMouseLeave={() => endTouch('drop')}
        >
          Drop
        </Button>
      </div>
    </div>
  );
};

export default Controls;
