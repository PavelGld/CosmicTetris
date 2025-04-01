import { useEffect } from "react";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { useTetris } from "@/lib/stores/useTetris";
import { usePlanet } from "@/lib/stores/usePlanet";
import { useGame } from "@/lib/stores/useGame";
import { useAudio } from "@/lib/stores/useAudio";

const GameControls = () => {
  const { 
    movePieceLeft, 
    movePieceRight, 
    rotatePiece, 
    softDrop, 
    hardDrop,
    isPaused,
    gameOver
  } = useTetris();

  const {
    switchSide,
    toggleOverviewMode,
    isOverviewMode
  } = usePlanet();

  const { pause } = useGame();
  const { playHit } = useAudio();

  const [subscribeKeys, getKeys] = useKeyboardControls();

  // Game controls handling with keyboard
  useEffect(() => {
    // Skip controls if game is paused or in overview mode
    if (isPaused || gameOver || isOverviewMode) return;

    const unsubscribeLeft = subscribeKeys(
      state => state.left,
      pressed => {
        if (pressed) {
          movePieceLeft();
          playHit();
        }
      }
    );

    const unsubscribeRight = subscribeKeys(
      state => state.right,
      pressed => {
        if (pressed) {
          movePieceRight();
          playHit();
        }
      }
    );

    const unsubscribeRotate = subscribeKeys(
      state => state.rotate,
      pressed => {
        if (pressed) {
          rotatePiece();
          playHit();
        }
      }
    );

    const unsubscribeSoftDrop = subscribeKeys(
      state => state.softDrop,
      pressed => {
        if (pressed) {
          softDrop();
        }
      }
    );

    const unsubscribeHardDrop = subscribeKeys(
      state => state.hardDrop,
      pressed => {
        if (pressed) {
          hardDrop();
          playHit();
        }
      }
    );

    const unsubscribePause = subscribeKeys(
      state => state.pause,
      pressed => {
        if (pressed) {
          pause();
        }
      }
    );

    return () => {
      unsubscribeLeft();
      unsubscribeRight();
      unsubscribeRotate();
      unsubscribeSoftDrop();
      unsubscribeHardDrop();
      unsubscribePause();
    };
  }, [
    movePieceLeft,
    movePieceRight,
    rotatePiece,
    softDrop,
    hardDrop,
    pause,
    isPaused,
    gameOver,
    isOverviewMode,
    playHit,
    subscribeKeys
  ]);

  // Planet side switching controls
  useEffect(() => {
    if (gameOver) return;

    const unsubscribeSwitchLeft = subscribeKeys(
      state => state.switchLeft,
      pressed => {
        if (pressed) {
          switchSide(-1);
          playHit();
        }
      }
    );

    const unsubscribeSwitchRight = subscribeKeys(
      state => state.switchRight,
      pressed => {
        if (pressed) {
          switchSide(1); 
          playHit();
        }
      }
    );

    const unsubscribeOverview = subscribeKeys(
      state => state.overview,
      pressed => {
        if (pressed) {
          toggleOverviewMode();
          playHit();
        }
      }
    );

    return () => {
      unsubscribeSwitchLeft();
      unsubscribeSwitchRight();
      unsubscribeOverview();
    };
  }, [
    switchSide,
    toggleOverviewMode,
    gameOver,
    playHit,
    subscribeKeys
  ]);

  return null; // This component doesn't render anything, it just handles keyboard controls
};

export default GameControls;
