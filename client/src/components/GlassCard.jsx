import React from 'react';

/**
 * GlassCard - The foundational UI container for the Sahil Rent Pay premium aesthetic.
 * * @param {ReactNode} children - The inner content of the card.
 * @param {string} className - Additional custom Tailwind classes.
 * @param {boolean} interactive - Toggles the premium hover scale and glow effects.
 * @param {string} animationDelay - Used for staggered loading (e.g., 'delay-100', 'delay-200').
 */
const GlassCard = ({ 
  children, 
  className = '', 
  interactive = true, 
  animationDelay = '' 
}) => {
  // Foundational glassmorphism implementation
  const baseClasses = "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl";
  
  // Generous whitespace and layout constraints
  const paddingClasses = "p-6 md:p-8 w-full max-w-full";

  // Sleek hover states ensuring fluid, instant-harsh-transition-free interactions
  const hoverClasses = interactive 
    ? "transition-all duration-300 hover:scale-[1.02] hover:border-[#200497]/50 hover:shadow-2xl cursor-default" 
    : "transition-all duration-300";

  // Page entry reveals (requires the custom tailwind config below)
  const animationClasses = `animate-fadeInUp opacity-0 fill-mode-forwards ${animationDelay}`;

  return (
    <div className={`${baseClasses} ${paddingClasses} ${hoverClasses} ${animationClasses} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;