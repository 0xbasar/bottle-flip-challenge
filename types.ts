
export enum GameStatus {
  Idle = 'IDLE',
  Spinning = 'SPINNING',
  LandedSuccess = 'LANDED_SUCCESS',
  LandedFail = 'LANDED_FAIL',
}

export interface BottlePhysicsState {
  yBase: number; // y-coordinate of the bottle's base from the bottom of the game area
  angle: number; // rotation angle in degrees
  verticalVelocity: number; // pixels per second
  angularVelocity: number; // degrees per second
  status: GameStatus;
}
    