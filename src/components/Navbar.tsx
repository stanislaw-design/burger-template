import { MapPin, Flame, Layers } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  onOpenFindUs: () => void;
  onNavigateSection: (index: number) => void;
  activeIndex: number;
}

export default function Navbar({ onOpenFindUs, onNavigateSection, activeIndex }: NavbarProps) {
  // Accent colors corresponding to the 4 burgers matching design theme
  const getAccentColor = (idx: number) => {
    switch (idx) {
      case 0: return "#FF4E00"; // Smoky BBQ (Orange-Red)
      case 1: return "#FFD700"; // Mayo Gold (Yellow)
      case 2: return "#7FFF00"; // Garden Verde (Green)
      case 3: return "#A020F0"; // Obsidian Inferno (Purple)
      default: return "#FF4E00";
    }
  };

  const currentAccent = getAccentColor(activeIndex);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/10 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-5 md:px-10">
        
        {/* Brand Logo - Styled as 'Stacked.' italic heavy bold */}
        <div 
          className="flex items-center gap-1 select-none cursor-pointer" 
          onClick={() => onNavigateSection(0)}
        >
          <div className="text-2xl font-black tracking-tighter uppercase italic text-stone-100 flex items-baseline">
            <span>Burger Craft</span>
            <span className="text-3xl font-black leading-none ml-0.5 transition-colors duration-500" style={{ color: currentAccent }}>.</span>
          </div>
        </div>

        {/* Navigation Middle Links - Artistic Style */}
        <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] font-semibold text-white/40">
          {[
            { label: "Smoky BBQ", idx: 0 },
            { label: "Mayo Gold", idx: 1 },
            { label: "Garden Verde", idx: 2 },
            { label: "Obsidian Inferno", idx: 3 },
          ].map((item) => {
            const isActive = activeIndex === item.idx;
            const accent = getAccentColor(item.idx);
            
            return (
              <button
                key={item.idx}
                onClick={() => onNavigateSection(item.idx)}
                style={{ color: isActive ? "#ffffff" : "" }}
                className={`relative py-1 border-b transition-all duration-300 select-none cursor-pointer uppercase ${
                  isActive 
                    ? "font-bold border-white tracking-[0.3em]" 
                    : "border-transparent hover:text-white/80"
                }`}
              >
                {/* Micro accent dot under active item */}
                {isActive && (
                  <motion.span 
                    layoutId="activeNavDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions - Styled sharp and crisp */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenFindUs}
            className="relative px-5 py-2.5 border border-white/20 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black hover:border-white transition-all select-none cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Znajdź nas</span>
          </button>
        </div>

      </div>
    </header>
  );
}

