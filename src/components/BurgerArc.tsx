import { motion } from "motion/react";
import { Burger } from "../types";

interface BurgerArcProps {
  burgers: Burger[];
  scrollProgress: number;
  activeIndex: number;
  onSelectBurger: (id: number) => void;
  accentColor: string; // The active theme hex index or tailwind color
}

export default function BurgerArc({
  burgers,
  scrollProgress,
  activeIndex,
  onSelectBurger,
  accentColor,
}: BurgerArcProps) {
  // Arc configuration
  const radius = 280; // Radius in pixels
  const spacingDeg = 38; // Spacing in degrees
  const offsetDeg = 15; // Shift the entire arc starting position
  
  return (
    <div className="absolute left-[-140px] bottom-[-140px] md:left-[-160px] md:bottom-[-160px] w-[580px] h-[580px] md:w-[680px] md:h-[680px] rounded-full z-20 pointer-events-none">
      
      {/* Visual Arc Curve Line in background */}
      <svg className="absolute inset-0 w-full h-full text-stone-800/40 pointer-events-none overflow-visible">
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e2a24" />
            <stop offset="50%" stopColor={accentColor === "emerald-400" ? "#10b981" : accentColor === "yellow-500" ? "#eab308" : accentColor === "red-500" ? "#ef4444" : "#f59e0b"} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1c1917" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Draw a perfect circle matching the burger placement radius */}
        {/* Center of circle is exactly (w/2, h/2). With w=580, r=280 is spaced nicely inside */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="2"
          strokeDasharray="4 8"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      {/* Render each of the burgers along the rotation curve */}
      {burgers.map((burger) => {
        // Calculate the angular sweep for each burger
        // angle (degrees) decreases as scrollProgress increases to pull burgers counterclockwise
        const angle = (burger.id - scrollProgress) * spacingDeg + offsetDeg;
        
        // Let's hide burgers that slide too far away to keep rendering light and crisp
        const isFarAway = angle < -110 || angle > 190;
        const isCurrentActive = burger.id === activeIndex;
        
        if (isFarAway) return null;
        
        return (
          <motion.button
            key={burger.id}
            onClick={() => onSelectBurger(burger.id)}
            className="absolute top-1/2 left-1/2 pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900 rounded-full group select-none"
            style={{
              width: "100px",
              height: "100px",
              marginLeft: "-50px", // Offset by center of button
              marginTop: "-50px",
              transformOrigin: "center center",
            }}
            // Animate position using rotation with transform-origin style smoothly
            animate={{
              transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg) scale(${isCurrentActive ? 1.35 : 0.95})`,
              opacity: isCurrentActive ? 0.95 : 0.65,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              mass: 0.8,
            }}
            whileHover={{
              scale: isCurrentActive ? 1.4 : 1.1,
              opacity: 1,
            }}
          >
            {/* Glowing ring under highlighted small burger */}
            {isCurrentActive && (
              <motion.div
                layoutId="activeRing"
                className="absolute inset-0 rounded-full bg-gradient-to-tr filter blur-md -z-10"
                style={{
                  background: burger.id === 0 ? "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)" :
                              burger.id === 1 ? "radial-gradient(circle, rgba(234,179,8,0.4) 0%, transparent 70%)" :
                              burger.id === 2 ? "radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)" :
                                                "radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)"
                }}
              />
            )}
            
            {/* Glassmorphic plate */}
            <div className="absolute inset-2 rounded-full bg-stone-900/80 backdrop-blur-sm border border-white/5 shadow-inner transition-colors group-hover:bg-stone-900/90 group-hover:border-white/20" />
            
            {/* High-quality Burger Thumbnail */}
            <img
              src={burger.image}
              alt={burger.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-contain p-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] group-hover:rotate-6 transition-transform duration-300"
            />
            
            {/* Polish indicator / Mini labels */}
            <div className={`absolute bottom-[-16px] left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[8px] font-mono font-semibold uppercase tracking-wider select-none border whitespace-nowrap transition-all opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 ${
              burger.id === 0 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
              burger.id === 1 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
              burger.id === 2 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                "bg-red-500/10 text-red-500 border-red-500/20"
            }`}>
              {burger.name}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
