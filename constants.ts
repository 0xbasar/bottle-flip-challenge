
// Game Area Dimensions
export const GAME_AREA_WIDTH = 360; // px
export const GAME_AREA_HEIGHT = 600; // px

// Bottle Visual Dimensions (used for SVG and container)
export const BOTTLE_SVG_WIDTH = 55; // px 
export const BOTTLE_SVG_HEIGHT = 150; // px

// Landing Surface
// The y-coordinate (from bottom of game area) where the bottle's base should rest.
export const LANDING_Y_OFFSET = 50; // px; height of the visual platform area

// Physics Constants
export const GRAVITY = 2800; // pixels/s^2 (Adjust for game feel)
export const INITIAL_Y_VELOCITY_MIN = 750; // pixels/s
export const INITIAL_Y_VELOCITY_MAX = 950; // pixels/s
// Adjusted to target roughly one 360-degree flip.
// Flight time ~0.6s. Target ~360deg / 0.6s = 600deg/s average. Initial needs to be higher due to damping.
export const INITIAL_ANGULAR_VELOCITY_MIN = 580; // degrees/s 
export const INITIAL_ANGULAR_VELOCITY_MAX = 740; // degrees/s 

export const ANGULAR_DAMPING_FACTOR = 0.3; // Reduces angular velocity by this factor *per second* due to air resistance.

// Landing Success Criteria (These are now less directly tied to success rate, which is probabilistic)
// They can influence the appearance of a failed landing.
export const LANDING_ANGLE_TOLERANCE = 10; // degrees from vertical (0 or 360)
export const LANDING_VELOCITY_TOLERANCE = 150; // px/s (max vertical speed for stable landing) - Not directly used for success anymore
export const LANDING_ANGULAR_VELOCITY_TOLERANCE = 180; // deg/s (max spin speed for stable landing) - Not directly used for success anymore

export const WATER_FILL_PERCENTAGE = 0.38; // 38%