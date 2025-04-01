import { useEffect, useState } from 'react';

type KeyState = { [key: string]: boolean };

export const useKeyboard = () => {
  const [keyState, setKeyState] = useState<KeyState>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for game controls
      if ([
        'ArrowUp', 
        'ArrowDown', 
        'ArrowLeft', 
        'ArrowRight', 
        'Space', 
        'KeyP'
      ].includes(e.code)) {
        e.preventDefault();
      }
      
      setKeyState(prev => ({ ...prev, [e.code]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeyState(prev => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keyState;
};
