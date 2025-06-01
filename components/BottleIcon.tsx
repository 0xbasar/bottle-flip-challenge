
import React from 'react';
import { BOTTLE_SVG_WIDTH, BOTTLE_SVG_HEIGHT, WATER_FILL_PERCENTAGE } from '../constants';

export const BottleIcon: React.FC = () => {
  const bottleW = BOTTLE_SVG_WIDTH;
  const bottleH = BOTTLE_SVG_HEIGHT;

  // Define bottle parts proportions
  const capHeight = bottleH * 0.1;
  const neckHeight = bottleH * 0.1;
  const bodyHeight = bottleH * 0.8;

  const bodyY = capHeight + neckHeight;

  // Water calculation (38% of body height)
  const waterHeight = bodyHeight * WATER_FILL_PERCENTAGE;
  const waterY = bodyY + (bodyHeight - waterHeight);

  return (
    <svg 
      width={bottleW} 
      height={bottleH} 
      viewBox={`0 0 ${bottleW} ${bottleH}`} 
      className="drop-shadow-md"
    >
      {/* Bottle Body */}
      <rect 
        x={bottleW * 0.15} 
        y={bodyY} 
        width={bottleW * 0.7} 
        height={bodyHeight} 
        rx={bottleW * 0.1} 
        className="fill-sky-400/70 stroke-sky-300/80"
        strokeWidth="1"
      />
      
      {/* Water */}
      <rect 
        x={bottleW * 0.15} 
        y={waterY} 
        width={bottleW * 0.7} 
        height={waterHeight} 
        rx={bottleW * 0.1} 
        ry={bottleW * 0.1} // ensure bottom corners are rounded with body
        className="fill-blue-600/80" 
        // Clip path could be used for more complex shapes, but for rectangle, simple rounding is fine.
        // Need to make sure only bottom part of water is rounded if rx/ry applied to full body.
        // For simplicity, let water inherit body's rounding at the bottom.
        style={{borderBottomLeftRadius: `${bottleW * 0.1}px`, borderBottomRightRadius: `${bottleW * 0.1}px`}}
      />
       {/* Re-draw bottom part of body stroke over water for clean edge */}
       <path 
        d={`M ${bottleW * 0.15 + bottleW * 0.1} ${bodyY + bodyHeight} 
            A ${bottleW*0.1} ${bottleW*0.1} 0 0 0 ${bottleW * 0.15} ${bodyY + bodyHeight - bottleW * 0.1}
            L ${bottleW * 0.15} ${bodyY + bottleW * 0.1}
            A ${bottleW*0.1} ${bottleW*0.1} 0 0 0 ${bottleW * 0.15 + bottleW * 0.1} ${bodyY}
            L ${bottleW * 0.85 - bottleW * 0.1} ${bodyY}
            A ${bottleW*0.1} ${bottleW*0.1} 0 0 0 ${bottleW * 0.85} ${bodyY + bottleW * 0.1}
            L ${bottleW * 0.85} ${bodyY + bodyHeight - bottleW * 0.1}
            A ${bottleW*0.1} ${bottleW*0.1} 0 0 0 ${bottleW * 0.85 - bottleW * 0.1} ${bodyY + bodyHeight}
            Z
        `}
        className="fill-none stroke-sky-300/80"
        strokeWidth="1.5"
       />


      {/* Bottle Neck */}
      <rect 
        x={bottleW * 0.3} 
        y={capHeight} 
        width={bottleW * 0.4} 
        height={neckHeight} 
        className="fill-sky-400/70 stroke-sky-300/80"
        strokeWidth="1"
      />
      
      {/* Bottle Cap */}
      <rect 
        x={bottleW * 0.25} 
        y={0} 
        width={bottleW * 0.5} 
        height={capHeight} 
        rx={bottleW * 0.05} 
        className="fill-neutral-400/90 stroke-neutral-500/90"
        strokeWidth="1"
      />

      {/* Shine effect */}
      <ellipse 
        cx={bottleW * 0.35} 
        cy={bottleH * 0.4} 
        rx={bottleW * 0.08} 
        ry={bottleH * 0.2} 
        className="fill-white/40"
        transform={`rotate(-15 ${bottleW * 0.35} ${bottleH * 0.4})`}
       />
    </svg>
  );
};
    