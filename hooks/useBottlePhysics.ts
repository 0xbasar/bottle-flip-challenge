
import { useState, useCallback, useEffect, useRef } from 'react';
import { BottlePhysicsState, GameStatus } from '../types';
import {
  GRAVITY,
  INITIAL_Y_VELOCITY_MIN,
  INITIAL_Y_VELOCITY_MAX,
  INITIAL_ANGULAR_VELOCITY_MIN,
  INITIAL_ANGULAR_VELOCITY_MAX,
  LANDING_Y_OFFSET,
  ANGULAR_DAMPING_FACTOR,
  BOTTLE_SVG_WIDTH,
  BOTTLE_SVG_HEIGHT,
} from '../constants';

const initialBottleState: BottlePhysicsState = {
  yBase: LANDING_Y_OFFSET,
  angle: 0,
  verticalVelocity: 0,
  angularVelocity: 0,
  status: GameStatus.Idle,
};

export const useBottlePhysics = () => {
  const [bottleState, setBottleState] = useState<BottlePhysicsState>(initialBottleState);
  const [wins, setWins] = useState<number>(0);
  const [tries, setTries] = useState<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const latestCalculatedStatusRef = useRef<GameStatus>(initialBottleState.status);

  const resetBottle = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    lastTimeRef.current = null;
    setBottleState(prev => ({
        ...initialBottleState,
        angle: 0, 
    }));
    latestCalculatedStatusRef.current = initialBottleState.status; // Reflect reset status
  }, []);

  const resetCounters = useCallback(() => {
    setWins(0);
    setTries(0);
  }, []);


  const gameLoop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
      animationFrameId.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000; // seconds
    lastTimeRef.current = timestamp;

    setBottleState((prev) => {
      if (prev.status !== GameStatus.Spinning) {
        latestCalculatedStatusRef.current = prev.status;
        return prev;
      }

      let newYBase = prev.yBase;
      let newAngle = prev.angle;
      let newVerticalVelocity = prev.verticalVelocity;
      let newAngularVelocity = prev.angularVelocity;
      let newStatus: GameStatus = prev.status; // Explicitly type newStatus

      // Apply gravity
      newVerticalVelocity -= GRAVITY * deltaTime;

      // Update position
      newYBase += newVerticalVelocity * deltaTime;
      
      // Update angle (apply damping)
      const damping = 1 - (ANGULAR_DAMPING_FACTOR * deltaTime);
      newAngularVelocity *= Math.max(0, damping); 
      newAngle += newAngularVelocity * deltaTime;

      // Check for landing
      if (newYBase <= LANDING_Y_OFFSET) {
        newYBase = LANDING_Y_OFFSET; 
        newVerticalVelocity = 0; 
        newAngularVelocity = 0; 
        
        if (Math.random() < 0.20) { // 20% chance of success
          newStatus = GameStatus.LandedSuccess;
          newAngle = 0; 
          setWins(w => w + 1);
        } else { // 80% chance of failure
          newStatus = GameStatus.LandedFail;
          newAngle = Math.random() < 0.5 ? 90 : -90; 
          newYBase = LANDING_Y_OFFSET - (BOTTLE_SVG_HEIGHT / 2) + (BOTTLE_SVG_WIDTH / 2);
        }
        
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        lastTimeRef.current = null;
      }
      
      const finalStatus: GameStatus = newStatus;
      latestCalculatedStatusRef.current = finalStatus;

      return {
        yBase: newYBase,
        angle: newAngle,
        verticalVelocity: newVerticalVelocity,
        angularVelocity: newAngularVelocity,
        status: newStatus as GameStatus, // Explicit cast to GameStatus
      };
    });
    
    if (latestCalculatedStatusRef.current === GameStatus.Spinning) {
        animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  }, [setWins]); 

 const spinBottle = useCallback(() => {
    setTries(t => t + 1); // Increment tries count
    setBottleState(_prev => { 
      const newState = {
        ...initialBottleState, 
        status: GameStatus.Spinning, 
        verticalVelocity: (Math.random() * (INITIAL_Y_VELOCITY_MAX - INITIAL_Y_VELOCITY_MIN)) + INITIAL_Y_VELOCITY_MIN,
        angularVelocity: (Math.random() * (INITIAL_ANGULAR_VELOCITY_MAX - INITIAL_ANGULAR_VELOCITY_MIN)) + INITIAL_ANGULAR_VELOCITY_MIN,
      };
      latestCalculatedStatusRef.current = newState.status; 
      return newState;
    });

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    lastTimeRef.current = null; 
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return { bottleState, spinBottle, resetBottle, wins, tries, resetCounters };
};
