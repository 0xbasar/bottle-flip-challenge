
import React, { useState, useCallback, useEffect } from 'react';
import { BottleIcon } from './components/BottleIcon';
import { useBottlePhysics } from './hooks/useBottlePhysics';
import { GameStatus } from './types';
import { BOTTLE_SVG_HEIGHT, BOTTLE_SVG_WIDTH, LANDING_Y_OFFSET, GAME_AREA_HEIGHT, GAME_AREA_WIDTH } from './constants';

const App: React.FC = () => {
  const { bottleState, spinBottle, resetBottle, wins, tries, resetCounters } = useBottlePhysics();
  const [gameMessage, setGameMessage] = useState<string>("Click 'Flip!' to Start");
  const [shareFeedbackMessage, setShareFeedbackMessage] = useState<string>("");

  useEffect(() => {
    switch (bottleState.status) {
      case GameStatus.Idle:
        setGameMessage("Click 'Flip!' to Start");
        break;
      case GameStatus.Spinning:
        setGameMessage("Flipping...");
        break;
      case GameStatus.LandedSuccess:
        setGameMessage(`Perfect Landing! Wins: ${wins}`);
        break;
      case GameStatus.LandedFail:
        setGameMessage("Oops! Try Again.");
        break;
    }
  }, [bottleState.status, wins]);

  const handleSpin = useCallback(() => {
    if (bottleState.status === GameStatus.LandedSuccess || bottleState.status === GameStatus.LandedFail) {
      resetBottle(); 
      setTimeout(spinBottle, 50); 
    } else {
      spinBottle();
    }
  }, [bottleState.status, spinBottle, resetBottle]);

  const handleShare = useCallback(async () => {
    const shareText = `I flipped my way to ${wins} wins in ${tries} tries in the Bottle Flip Challenge! 🍾 Can you do better?`;
    const shareTitle = "My Bottle Flip Score!";

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        });
        setShareFeedbackMessage("Shared successfully!");
      } catch (error) {
        // Error could be AbortError if user cancels, or other errors.
        // For simplicity, we'll use a generic message.
        console.warn('Share API error:', error);
        setShareFeedbackMessage("Share cancelled or failed.");
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setShareFeedbackMessage("Score copied to clipboard!");
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        setShareFeedbackMessage("Failed to copy score. Please share manually.");
      }
    }
  }, [wins, tries]);

  useEffect(() => {
    if (shareFeedbackMessage) {
      const timer = setTimeout(() => {
        setShareFeedbackMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [shareFeedbackMessage]);

  const noiseTextureUrl = "data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseVariant'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseVariant)'/%3E%3C/svg%3E";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800 p-4 select-none relative">
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("${noiseTextureUrl}")`,
          opacity: 0.025,
          pointerEvents: 'none',
          zIndex: 0, 
        }}
        aria-hidden="true"
      />
      
      <header className="mb-8 text-center relative z-10">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">Bottle Flip Challenge!</h1>
        <p className="text-xl text-sky-200 mt-2">Land the bottle perfectly upright.</p>
      </header>

      <div 
        className="relative bg-neutral-600/70 backdrop-blur-sm rounded-xl shadow-2xl border-4 border-neutral-500/50 overflow-hidden z-10"
        style={{ width: `${GAME_AREA_WIDTH}px`, height: `${GAME_AREA_HEIGHT}px`}}
      >
        <div className="absolute bottom-0 left-0 w-full bg-neutral-800/80" style={{ height: `${LANDING_Y_OFFSET}px` }} />
        <div 
            className="absolute left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 shadow-md rounded-full" 
            style={{ bottom: `${LANDING_Y_OFFSET - 2}px` }} 
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: `${bottleState.yBase}px`,
            width: `${BOTTLE_SVG_WIDTH}px`,
            height: `${BOTTLE_SVG_HEIGHT}px`,
            transform: `translateX(-50%) rotate(${bottleState.angle}deg)`,
            transformOrigin: 'center center', 
          }}
        >
          <BottleIcon />
        </div>
      </div>

      <div className="mt-8 text-center w-full max-w-md relative z-10">
        <p className="text-2xl font-semibold text-white mb-4 min-h-[60px] flex items-center justify-center p-2 bg-black/20 rounded-lg">
          {gameMessage}
        </p>
        <button
          onClick={handleSpin}
          className="px-12 py-4 bg-yellow-400 hover:bg-yellow-500 text-neutral-800 font-bold text-xl rounded-lg shadow-lg transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          aria-label={bottleState.status === GameStatus.Spinning ? 'Flipping bottle' : 'Flip bottle'}
        >
          {bottleState.status === GameStatus.Spinning ? 'Flipping...' : 'Flip!'}
        </button>
        <div className="text-sky-200 mt-6 text-lg flex justify-center space-x-8">
          <p><span className="font-semibold">Wins:</span> {wins}</p>
          <p><span className="font-semibold">Tries:</span> {tries}</p>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={resetCounters}
            className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-base rounded-lg shadow-md transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-300"
            aria-label="Reset win and try counters"
          >
            Reset Counters
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-base rounded-lg shadow-md transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label="Share your score"
            disabled={bottleState.status === GameStatus.Spinning} // Disable while flipping for safety
          >
            Share Score
          </button>
        </div>
        {shareFeedbackMessage && (
          <p className="mt-3 text-sm text-white bg-black/30 px-3 py-1.5 rounded-md">
            {shareFeedbackMessage}
          </p>
        )}
      </div>
       <footer className="mt-8 text-center text-sm text-sky-300 relative z-10">
        Inspired by the classic challenge. Physics are simplified for fun!
      </footer>
    </div>
  );
};

export default App;
