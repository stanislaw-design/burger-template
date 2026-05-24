import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, Clock, Copy, Check, ChevronDown, Plus, HelpCircle, Sparkles } from "lucide-react";

import { BURGERS } from "./data";
import { Burger } from "./types";
import Navbar from "./components/Navbar";
import BurgerArc from "./components/BurgerArc";
import BurgerNutritionCard from "./components/BurgerNutritionCard";
import CartDrawer from "./components/CartDrawer";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Shopping Cart systems
  const [cart, setCart] = useState<{ burger: Burger; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  
  // Customization layer for active item
  const [showQuickOrderPopup, setShowQuickOrderPopup] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFindUsOpen, setIsFindUsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<"phone" | "address" | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync scroll positions when using navigation or buttons
  const navigateToSection = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = target.scrollTop / target.clientHeight;
    
    // Continuous floating progress
    setScrollProgress(progress);
    
    // Round to discrete active index
    const rounded = Math.round(progress);
    const clamped = Math.max(0, Math.min(rounded, 3));
    if (clamped !== activeIndex) {
      setActiveIndex(clamped);
      
      // Attempt play tactile beep synthesised via browser AudioContext API
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(140 - clamped * 15, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      } catch (_) {}
    }
  };

  // Add items to cart
  const handleAddToCart = (burger: Burger) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.burger.id === burger.id);
      if (existing) {
        return prevCart.map((item) =>
          item.burger.id === burger.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { burger, quantity: 1 }];
    });

    // Provide visual overlay notification
    setShowQuickOrderPopup(`DODANO: ${burger.name}!`);
    setTimeout(() => {
      setShowQuickOrderPopup(null);
    }, 2500);

    // Audio confirmation chirp
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch (_) {}
  };

  const handleUpdateQuantity = (burgerId: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.burger.id === burgerId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckout = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderCompleted(true);
      setCart([]);
      
      // Play final success deep chord sound
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const now = ctx.currentTime;
          
          [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.9);
          });
        }
      } catch (_) {}
    }, 2000);
  };

  // Reset order success state on close drawer
  const handleCloseCart = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setOrderCompleted(false);
    }, 300);
  };

  const activeBurger = BURGERS[activeIndex];

  // Dynamic interpolation values for styling
  const getInterpolatedRgb = (progress: number) => {
    const rgbColors = [
      { r: 255, g: 78,  b: 0.1 },  // Volcano Orange (#FF4E00)
      { r: 255, g: 215, b: 0 },    // Golden Yellow (#FFD700)
      { r: 127, g: 255, b: 0 },    // Chartreuse Green (#7FFF00)
      { r: 160, g: 32,  b: 240 }   // Vibrant Purple (#A020F0)
    ];
    
    const indexLow = Math.max(0, Math.min(3, Math.floor(progress)));
    const indexHigh = Math.min(3, indexLow + 1);
    const ratio = progress - indexLow;
    
    const r = Math.round(rgbColors[indexLow].r + (rgbColors[indexHigh].r - rgbColors[indexLow].r) * ratio);
    const g = Math.round(rgbColors[indexLow].g + (rgbColors[indexHigh].g - rgbColors[indexLow].g) * ratio);
    const b = Math.round(rgbColors[indexLow].b + (rgbColors[indexHigh].b - rgbColors[indexLow].b) * ratio);
    
    return `${r}, ${g}, ${b}`;
  };

  const getThemeColorHex = (id: number) => {
    switch (id) {
      case 0: return "#FF4E00"; // Smoky BBQ (Orange-Red)
      case 1: return "#FFD700"; // Mayo Gold (Yellow)
      case 2: return "#7FFF00"; // Garden Verde (Green)
      case 3: return "#A020F0"; // Obsidian Inferno (Purple)
      default: return "#FF4E00";
    }
  };

  const getThemeBgHex = (id: number) => {
    switch (id) {
      case 0: return "rgba(255, 78, 0, 0.15)";
      case 1: return "rgba(255, 215, 0, 0.15)";
      case 2: return "rgba(127, 255, 0, 0.15)";
      case 3: return "rgba(160, 32, 240, 0.15)";
      default: return "rgba(255, 78, 0, 0.15)";
    }
  };

  const interpolatedRgb = getInterpolatedRgb(scrollProgress);
  const burgerCount = BURGERS.length;
  const totalCartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const currentAccent = getThemeColorHex(activeIndex);
  
  // Dynamic Title splitted word layout for extreme Artistic Flair
  const nameParts = activeBurger.name.split(" ");
  const mainPart = nameParts.slice(0, nameParts.length - 1).join(" ") || "The";
  const highlightWord = nameParts[nameParts.length - 1];

  // The remaining 3 burgers to show in the right vertical panels
  const remainingBurgers = BURGERS.filter(b => b.id !== activeIndex);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#080808] font-sans relative select-none text-white">
      
      {/* Dynamic Animated Core Background */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at 45% 50%, rgba(${interpolatedRgb}, 0.1) 0%, rgba(8, 8, 8, 0) 65%)`
        }}
      >
        {/* Abstract subtle moving ambient particles */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-repeat bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Dynamic vertical panel lines */}
        <div className="absolute inset-y-0 left-1/5 w-[1px] bg-white/[0.03]" />
        <div className="absolute inset-y-0 left-2/5 w-[1px] bg-white/[0.02]" />
        <div className="absolute inset-y-0 left-3/5 w-[1px] bg-white/[0.03]" />
      </div>

      {/* Floating popup alerts */}
      <AnimatePresence>
        {showQuickOrderPopup && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#0a0a0a] border border-white/10 px-5 py-3 shadow-2xl flex items-center gap-2.5 font-mono text-[10px] uppercase font-bold tracking-widest"
          >
            <Sparkles className="w-4 h-4 animate-pulse" style={{ color: currentAccent }} />
            <span className="text-white">
              {showQuickOrderPopup}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar overlay */}
      <Navbar
        onOpenFindUs={() => setIsFindUsOpen(true)}
        onNavigateSection={navigateToSection}
        activeIndex={activeIndex}
      />

      {/* FIXED CONTENT LAYER (Unified full-screen layout with compact floating selection wheel in bottom-right) */}
      <div className="absolute inset-0 z-40 pointer-events-none flex flex-col pt-20 select-none">
        
        <div className="flex-grow relative h-full overflow-hidden">
          
          {/* PRIMARY FOCUS: Full width - The Large featured burger area */}
          <div className="w-full h-full relative flex flex-col justify-start lg:justify-between p-4 pb-28 xs:p-6 xs:pb-32 md:p-14 lg:px-20 overflow-hidden">
            
            {/* Massive Background Number Decoration Watermark */}
            <div className="absolute -left-6 top-[28%] lg:top-1/2 -translate-y-1/2 text-[14rem] sm:text-[22rem] lg:text-[26rem] font-black text-white/[0.015] leading-none select-none italic font-sans uppercase">
              0{activeIndex + 1}
            </div>

            {/* Left section split: description & active stats panel */}
            <div className="relative z-10 flex flex-col justify-start lg:justify-center mx-auto lg:mx-0 text-center lg:text-left items-center lg:items-start max-w-sm sm:max-w-md lg:max-w-lg space-y-2.5 sm:space-y-4 lg:space-y-6 pointer-events-auto pt-2 lg:pt-0 pb-2 lg:pb-0 order-1 w-full lg:w-auto lg:h-full">
              
              {/* Rectangular high contrast badge */}
              <span 
                className="hidden lg:inline-block px-3 py-1 text-black text-[10px] font-extrabold uppercase tracking-widest self-center lg:self-start transition-colors duration-500"
                style={{ backgroundColor: currentAccent }}
              >
                {activeBurger.tag}
              </span>

              {/* Huge Artistic Heading - Clickable on mobile to open detailed info modal */}
              <div 
                className="space-y-1 w-full cursor-pointer lg:cursor-default select-none group"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsDetailModalOpen(true);
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBurger.id}
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -25, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center lg:items-start"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-white/40 leading-none hidden lg:block">
                      {activeBurger.subName}
                    </span>
                    <span className="inline-flex lg:hidden items-center gap-1.5 text-[8px] font-mono uppercase tracking-[0.25em] font-bold text-white/40 mb-1 animate-pulse bg-white/[0.04] border border-white/5 px-2.5 py-1 rounded-full">
                      Pokaż szczegóły ↗
                    </span>
                    <h1 className="text-[28px] xs:text-[36px] sm:text-[52px] lg:text-[68px] xl:text-[76px] font-black leading-[0.85] uppercase italic tracking-tighter mt-1 text-stone-100 uppercase select-none">
                      {mainPart}<br/>
                      <span className="transition-colors duration-500" style={{ color: currentAccent }}>
                        {highlightWord}
                      </span>
                    </h1>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dynamic Highlights - Hidden on mobile */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBurger.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="hidden lg:flex flex-wrap gap-1.5 xs:gap-2 pt-1 justify-center lg:justify-start"
                >
                  {activeBurger.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 xs:px-2.5 xs:py-1 bg-white/[0.02] border border-white/5 font-mono text-[9px] text-white/60 tracking-wider shadow-sm"
                    >
                      • {highlight}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Interactive pricing & nutrition metrics - Hidden on mobile */}
              <div className="hidden lg:flex items-center justify-center lg:justify-start gap-8 sm:gap-12 border-t border-white/5 pt-4 w-full">
                <div>
                  <div className="text-[9px] font-mono tracking-widest text-white/30 uppercase mb-1">Cena zestawu</div>
                  <div className="text-xl xs:text-2xl font-mono font-bold transition-colors duration-500" style={{ color: currentAccent }}>
                    {activeBurger.price}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono tracking-widest text-white/30 uppercase mb-1">Kalorie (Kcal)</div>
                  <div className="text-xl xs:text-2xl font-mono font-bold text-white/70">
                    {activeBurger.nutrition.calories.split(" ")[0]} <span className="text-[10px] text-white/20">KCAL</span>
                  </div>
                </div>
              </div>

              {/* Action purchase trigger - Sharp borders */}
              <div className="pt-1 flex flex-row gap-3 items-stretch select-auto w-[85%] sm:w-auto">
                <button
                  onClick={() => setIsFindUsOpen(true)}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 border text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] font-extrabold transition-all cursor-pointer select-none active:scale-95 duration-300 flex-grow text-center"
                  style={{
                    borderColor: `${currentAccent}40`,
                    color: "#ffffff",
                    backgroundColor: `${currentAccent}12`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentAccent;
                    e.currentTarget.style.borderColor = currentAccent;
                    e.currentTarget.style.color = "#000000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${currentAccent}12`;
                    e.currentTarget.style.borderColor = `${currentAccent}40`;
                    e.currentTarget.style.color = "#ffffff";
                  }}
                >
                  <span>ZAMÓW</span>
                </button>
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 border border-white/10 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] font-extrabold transition-all cursor-pointer select-none active:scale-95 duration-300 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 text-center"
                >
                  <span>MENU</span>
                </button>
              </div>

            </div>

            {/* Spinning background dynamic wheels & Giant Burger Graphic overlay - Placed lower and larger on mobile, pointer-events-auto on mobile to allow click */}
            <div className="relative lg:absolute top-0 lg:top-1/2 left-0 lg:left-auto transform-none lg:-translate-y-1/2 lg:-translate-x-0 lg:right-[22%] xl:right-[26%] w-[230px] h-[230px] xs:w-[270px] xs:h-[270px] sm:w-[350px] sm:h-[350px] lg:w-[520px] lg:h-[520px] xl:w-[600px] xl:h-[600px] flex items-center justify-center select-none pointer-events-auto lg:pointer-events-none z-20 lg:-z-10 order-2 mx-auto lg:mx-0 transition-all duration-500 my-2 lg:my-0 mt-8 xs:mt-10 sm:mt-12 lg:-mt-0">
              {/* Blurred color wash */}
              <div 
                className="absolute inset-0 rounded-full blur-3xl opacity-35 transition-all duration-1000"
                style={{
                  background: `radial-gradient(circle, ${currentAccent} 0%, transparent 70%)`
                }}
              />
              
              {/* Spinning structural dashed rings */}
              <div 
                className="absolute w-full h-full border-[10px] rounded-full flex items-center justify-center transition-all duration-1000 opacity-20"
                style={{ borderColor: currentAccent }}
              >
                <div 
                  className="w-[82%] h-[82%] border-[4px] border-dashed rounded-full animate-[spin_25s_linear_infinite]"
                  style={{ borderColor: currentAccent }}
                />
              </div>

              {/* Real big active spinning product image - Clickable on mobile to open modal, triggers Add to Cart on desktop */}
              <div 
                className="w-[85%] h-[85%] relative flex items-center justify-center pointer-events-auto cursor-pointer"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsDetailModalOpen(true);
                  }
                }}
              >
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={activeBurger.id}
                    src={activeBurger.image}
                    alt={activeBurger.name}
                    referrerPolicy="no-referrer"
                    className="w-[90%] h-[90%] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.9)] cursor-pointer active:scale-95 select-none"
                    initial={{
                      scale: 0.1,
                      opacity: 0,
                      x: "15vw",
                      y: "15vh",
                      rotate: -45,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      x: 0,
                      y: 0,
                      rotate: 0,
                    }}
                    exit={{
                      scale: 0.1,
                      opacity: 0,
                      x: "15vw",
                      y: "15vh",
                      rotate: 45,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 105,
                      damping: 24,
                      mass: 0.85,
                    }}
                    whileHover={{
                      scale: 1.04,
                      filter: "brightness(1.04)",
                    }}
                    onClick={(e) => {
                      if (window.innerWidth < 1024) {
                        e.stopPropagation();
                        setIsDetailModalOpen(true);
                      } else {
                        setIsFindUsOpen(true);
                      }
                    }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* ARTISTIC FLAVOR CORNER METADATA FOOTER (LEFT BOTTOM) */}
            <div className="border-t border-white/5 pt-2 md:pt-4 mt-2 lg:mt-6 z-10 flex flex-wrap justify-between items-center text-[8px] sm:text-[9px] uppercase tracking-widest text-white/35 font-mono w-full order-3">
              <div className="hidden xs:flex gap-4 sm:gap-6 md:gap-8">
                <span>Est. 2026</span>
                <span>Lokalne składniki</span>
                <span className="hidden sm:inline">Rzemieślnicza brioche</span>
              </div>
              <div className="flex gap-4 items-center mt-1 sm:mt-0 mx-auto xs:mx-0">
                <span className="hidden lg:flex items-center gap-1.5 transition-colors duration-500" style={{ color: currentAccent }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentAccent }} />
                  {activeBurger.name}
                </span>
                <span className="opacity-50 hidden lg:inline">Zscrolluj w dół &darr;</span>
              </div>
            </div>

          </div>

          {/* MOBILE SELECTION BAR: Visible only on smaller viewports */}
          <div 
            className="lg:hidden absolute bottom-10 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex items-center justify-center gap-4 px-5 py-2.5 bg-[#0a0a0a]/80 border border-white/10 rounded-full shadow-2xl backdrop-blur-md"
          >
            {BURGERS.map((burger) => {
              const isCurrent = burger.id === activeIndex;
              const accentColor = getThemeColorHex(burger.id);
              
              return (
                <button
                  key={burger.id}
                  onClick={() => navigateToSection(burger.id)}
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isCurrent ? "scale-110" : "scale-90 opacity-40 hover:opacity-80"
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center p-1.5 transition-all"
                    style={{
                      border: `1.5px solid ${isCurrent ? accentColor : "rgba(255, 255, 255, 0.1)"}`,
                      backgroundColor: isCurrent ? getThemeBgHex(burger.id) : "rgba(255, 255, 255, 0.02)",
                    }}
                  >
                    <img 
                      src={burger.image}
                      alt={burger.name}
                      className="w-full h-full object-contain filter drop-shadow-sm select-none"
                    />
                  </div>
                  {isCurrent && (
                    <span 
                      className="absolute -top-0.5 right-0 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* THE SELECTION ARC: Floating transparent widget in the bottom-right corner (Visible on lg+) */}
          <div className="hidden lg:flex absolute bottom-16 right-6 md:right-10 lg:bottom-16 lg:right-16 w-[260px] h-[260px] flex flex-col justify-end bg-transparent z-40 pointer-events-auto">
            
            {/* Minimal header */}
            <div className="text-center text-[8px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-1 pointer-events-none select-none font-mono">
              WYBÓR SMAKÓW
            </div>

            {/* Main Interactive Rotation Arc Area */}
            <div className="relative w-full h-[220px] flex items-center justify-center">
              {/* The Curved Arc path line - SVG based */}
              <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
                <svg width="260" height="260" className="w-[260px] h-[260px] overflow-visible opacity-25" viewBox="0 0 260 260">
                  {/* Subtle glowing shadow path */}
                  <path
                    d="M 50,140 A 80,80 0 0,1 210,140"
                    fill="none"
                    stroke={currentAccent}
                    strokeWidth="3"
                    className="blur-sm transition-colors duration-500"
                  />
                  {/* Clean thin dashed arc line */}
                  <path
                    d="M 50,140 A 80,80 0 0,1 210,140"
                    fill="none"
                    stroke={currentAccent}
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    className="transition-colors duration-500"
                  />
                  {/* Active dot decoration on top of the arc */}
                  <circle cx="130" cy="60" r="3" fill={currentAccent} className="transition-all duration-500" />
                </svg>
              </div>

              {/* Individual Arc Items */}
              {BURGERS.map((burger) => {
                const spacing = 50; 
                const baseAngle = -90; 
                const angle = baseAngle + (burger.id - scrollProgress) * spacing;
                const angleRad = (angle * Math.PI) / 180;
                
                const R_val = 80;
                const x = R_val * Math.cos(angleRad);
                const y = R_val * Math.sin(angleRad);
                
                const distanceToActive = Math.abs(burger.id - scrollProgress);
                const isCurrent = burger.id === activeIndex;
                
                const scale = Math.max(0.7, 1.15 - Math.min(1.2, distanceToActive) * 0.4);
                const opacity = Math.max(0.25, 1 - Math.min(1.5, distanceToActive) * 0.65);
                const tiltRotation = (burger.id - scrollProgress) * 12;

                return (
                  <div
                    key={burger.id}
                    onClick={() => navigateToSection(burger.id)}
                    style={{
                      left: `calc(130px + ${x}px)`,
                      top: `calc(140px + ${y}px)`,
                      opacity: opacity,
                      transform: `translate(-50%, -50%) scale(${scale})`,
                    }}
                    className="absolute flex flex-col items-center cursor-pointer text-center group font-mono z-10 transition-all duration-500"
                  >
                    {/* Item label */}
                    <div 
                      className="mb-1 text-[8px] font-bold uppercase tracking-wider transition-colors duration-300 pointer-events-none select-none max-w-[70px] truncate leading-none text-center"
                      style={{
                        color: isCurrent ? getThemeColorHex(burger.id) : "rgba(255,255,255,0.35)"
                      }}
                    >
                      {burger.name.split(" ").slice(0, 2).join(" ")}
                    </div>

                    {/* Miniature Burger preview icon on the Arc line */}
                    <div 
                      className="w-11 h-11 flex items-center justify-center p-1 rounded-full relative transition-all duration-300"
                      style={{
                        background: isCurrent ? getThemeBgHex(burger.id) : "rgba(255,255,255,0.01)",
                        border: `1.2px solid ${isCurrent ? getThemeColorHex(burger.id) : "rgba(255,255,255,0.06)"}`,
                        boxShadow: isCurrent ? `0 6px 15px -4px ${getThemeColorHex(burger.id)}20` : "none",
                      }}
                    >
                      {/* Active tiny pulsing dot accent */}
                      {isCurrent && (
                        <span 
                          className="absolute -top-0.5 w-1.5 h-1.5 rounded-full animate-ping"
                          style={{ backgroundColor: getThemeColorHex(burger.id) }}
                        />
                      )}
                      
                      <img
                        src={burger.image}
                        alt={burger.name}
                        referrerPolicy="no-referrer"
                        className="w-[85%] h-[85%] object-contain filter drop-shadow-md select-none group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Mini details displayed dynamically under selected item */}
                    <AnimatePresence>
                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -3 }}
                          className="mt-1 flex flex-col items-center"
                        >
                          <span className="text-[9px] font-bold text-white leading-none">
                            {burger.price}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* THE ACTUAL GHOST SCROLL CONTAINER SECTION IN HIGH PRIORITY DEPTH */}
      {/* Sits above standard graphics yet intercepts scroll, driving active states via handleScroll */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="absolute inset-x-0 inset-y-0 overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar z-30"
      >
        <div className="h-screen w-full snap-start" />
        <div className="h-screen w-full snap-start" />
        <div className="h-screen w-full snap-start" />
        <div className="h-screen w-full snap-start" />
      </div>

      {/* Drawer Panel Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClear={handleClearCart}
        onOrderComplete={handleCheckout}
        isOrdering={isOrdering}
        orderCompleted={orderCompleted}
      />

      {/* Detail Modal for Mobile View */}
      <AnimatePresence>
        {isDetailModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDetailModalOpen(false)}
            className="fixed inset-0 bg-[#060606]/85 backdrop-blur-lg z-50 flex items-end justify-center pointer-events-auto p-4 lg:hidden"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-t-[32px] p-6 pb-8 space-y-6 shadow-2xl overflow-y-auto no-scrollbar max-h-[85vh] relative text-left"
            >
              {/* Close Button & Badge */}
              <div className="flex justify-between items-center pb-2">
                <span 
                  className="px-2.5 py-0.5 text-black text-[9px] font-mono tracking-widest font-extrabold uppercase transition-colors duration-500"
                  style={{ backgroundColor: currentAccent }}
                >
                  {activeBurger.tag}
                </span>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-stone-400 hover:text-white transition-all select-none active:scale-90"
                >
                  &times;
                </button>
              </div>

              {/* Header Title with Subname */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-medium text-white/40 leading-none">
                  {activeBurger.subName}
                </span>
                <h2 className="text-2xl xs:text-3xl font-black italic tracking-tighter uppercase text-stone-100">
                  {mainPart}{" "}
                  <span className="transition-colors duration-500" style={{ color: currentAccent }}>
                    {highlightWord}
                  </span>
                </h2>
              </div>

              {/* Middle Section: Image and Pricing info */}
              <div className="flex gap-4 items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
                <img 
                  src={activeBurger.image} 
                  alt={activeBurger.name} 
                  className="w-20 h-20 object-contain drop-shadow-md"
                />
                <div>
                  <div className="text-[9px] font-mono tracking-wider text-white/30 uppercase">Cena zestawu</div>
                  <div className="text-xl font-mono font-bold" style={{ color: currentAccent }}>
                    {activeBurger.price}
                  </div>
                  <div className="text-[10px] text-white/60 font-medium italic mt-0.5">
                    {activeBurger.tagline}
                  </div>
                </div>
              </div>

              {/* Description info */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-mono tracking-widest text-white/40 uppercase">O burgerze</h3>
                <p className="text-xs text-white/70 leading-relaxed font-sans font-medium">
                  {activeBurger.description}
                </p>
              </div>

              {/* Ingredients highlights badgified */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Składniki premium</h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeBurger.highlights.map((highlight, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 bg-white/[0.03] border border-white/5 font-mono text-[9px] text-white/80"
                    >
                      • {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nutrition details grid */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Wartości odżywcze</h3>
                <div className="grid grid-cols-4 gap-2 bg-white/[0.01] border border-white/5 p-3 text-center">
                  <div>
                    <div className="text-[8px] font-mono text-white/30 uppercase">Kalorie</div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">{activeBurger.nutrition.calories}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-white/30 uppercase">Białko</div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">{activeBurger.nutrition.protein}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-white/30 uppercase">Tłuszcze</div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">{activeBurger.nutrition.fat}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-white/30 uppercase">Węglow.</div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">{activeBurger.nutrition.carbs}</div>
                  </div>
                </div>
              </div>

              {/* Giant modal action button */}
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsFindUsOpen(true);
                }}
                className="w-full py-4 uppercase border font-mono tracking-[0.2em] text-[11px] font-extrabold transition-all active:scale-95 duration-200 select-none cursor-pointer"
                style={{
                  borderColor: `${currentAccent}400`,
                  backgroundColor: `${currentAccent}15`,
                  color: "#ffffff"
                }}
              >
                Zamów ten zestaw +
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Menu Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-[#060606]/92 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-2xl relative overflow-y-auto no-scrollbar max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30">Burger Craft Premium</span>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase text-stone-100 mt-0.5">
                    Nasze <span className="transition-colors duration-500" style={{ color: currentAccent }}>Menu</span>
                  </h2>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-stone-400 hover:text-white transition-all select-none active:scale-90"
                >
                  &times;
                </button>
              </div>

              {/* Burger Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BURGERS.map((burger) => {
                  const accentColor = getThemeColorHex(burger.id);
                  const isActive = burger.id === activeIndex;
                  return (
                    <motion.div
                      key={burger.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigateToSection(burger.id);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? `${accentColor}10` : "rgba(255,255,255,0.02)",
                        borderColor: isActive ? `${accentColor}40` : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <div
                          className="absolute inset-0 rounded-full blur-xl opacity-40"
                          style={{ background: accentColor }}
                        />
                        <img
                          src={burger.image}
                          alt={burger.name}
                          className="relative w-full h-full object-contain drop-shadow-lg select-none"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-[8px] font-mono uppercase tracking-widest font-bold"
                          style={{ color: accentColor }}
                        >
                          {burger.tag}
                        </span>
                        <h3 className="text-sm font-black italic uppercase tracking-tight text-stone-100 leading-tight mt-0.5">
                          {burger.name}
                        </h3>
                        <p className="text-[10px] text-white/40 font-sans mt-1 leading-relaxed line-clamp-2">
                          {burger.tagline}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-mono font-bold text-sm" style={{ color: accentColor }}>
                            {burger.price}
                          </span>
                          <span className="text-[9px] font-mono text-white/25">
                            {burger.nutrition.calories.split(" ")[0]} kcal
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="mt-6 w-full py-3.5 uppercase border border-white/10 font-mono tracking-[0.15em] text-[10px] font-extrabold transition-all active:scale-95 duration-200 select-none cursor-pointer text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5"
              >
                Zamknij
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Znajdź nas / Kontakt Modal */}
      <AnimatePresence>
        {isFindUsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFindUsOpen(false)}
            className="fixed inset-0 bg-[#060606]/92 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-[24px] p-6 sm:p-8 space-y-6 shadow-2xl relative text-left overflow-y-auto no-scrollbar max-h-[90vh]"
            >
              {/* Close Button & Accent Badge */}
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span 
                  className="px-3 py-1 text-black text-[10px] font-mono tracking-widest font-extrabold uppercase transition-colors duration-500"
                  style={{ backgroundColor: currentAccent }}
                >
                  Odwiedź Nas
                </span>
                <button 
                  onClick={() => setIsFindUsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-stone-400 hover:text-white transition-all select-none active:scale-90"
                >
                  &times;
                </button>
              </div>

              {/* Title Header */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-medium text-white/40 leading-none">
                  Burger Craft Premium
                </span>
                <h2 className="text-2xl xs:text-3xl font-black italic tracking-tighter uppercase text-stone-100">
                  Kontakt{" "}
                  <span className="transition-colors duration-500" style={{ color: currentAccent }}>
                    & Lokalizacja
                  </span>
                </h2>
              </div>

              {/* Grid content columns for desktop / Stacked for mobile */}
              <div className="space-y-5">
                
                {/* Contact and address row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address Box */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col justify-between space-y-3 relative group">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-white/30 uppercase">
                        <MapPin className="w-3.5 h-3.5" style={{ color: currentAccent }} />
                        Adres lokalu
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 font-sans font-medium mt-2 leading-relaxed">
                        ul. Chmielna 10<br />
                        00-021 Warszawa
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("ul. Chmielna 10, 00-021 Warszawa");
                        setCopiedText("address");
                        setTimeout(() => setCopiedText(null), 2000);
                      }}
                      className="mt-1 flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors duration-200 border border-white/10 py-1.5 px-2.5 rounded bg-white/[0.01]"
                    >
                      {copiedText === "address" ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Skopiowano!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Kopiuj adres</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Phone Box */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col justify-between space-y-3 relative group">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-white/30 uppercase">
                        <Phone className="w-3.5 h-3.5" style={{ color: currentAccent }} />
                        Zadzwoń do nas
                      </div>
                      <p className="text-xs sm:text-lg text-stone-100 font-mono font-extrabold mt-3 tracking-tight">
                        +48 555 123 456
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href="tel:+48555123456"
                        className="flex-1 flex items-center justify-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-black py-1.5 px-2.5 rounded transition-all active:scale-95 duration-200 text-center"
                        style={{ backgroundColor: currentAccent }}
                      >
                        Połącz
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("+48555123456");
                          setCopiedText("phone");
                          setTimeout(() => setCopiedText(null), 2000);
                        }}
                        className="flex items-center justify-center border border-white/10 py-1.5 px-2.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        {copiedText === "phone" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-white/40" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Styled Dark Google Map */}
                <div className="relative w-full h-44 sm:h-52 border border-white/10 rounded-2xl overflow-hidden bg-black/40">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2442.277028148902!2d21.01172!3d52.22967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471eccf42bf22b4b%3A0xe5c843bc40b7194f!2sChmielna%2010%2C%2000-021%20Warszawa!5e0!3m2!1spl!2spl!4v1716323143521!5m2!1spl!2spl" 
                    className="w-full h-full border-0 invert-[0.91] hue-rotate-180 brightness-[0.78] contrast-[1.25] grayscale" 
                    allowFullScreen={false} 
                    loading="lazy"
                  ></iframe>
                  {/* Subtle border shadow over map */}
                  <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl shadow-inner" />
                </div>

                {/* Opening Hours list */}
                <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-white/30 uppercase mb-1">
                    <Clock className="w-3.5 h-3.5" style={{ color: currentAccent }} />
                    Godziny Otwarcia
                  </div>
                  <div className="space-y-2 text-xs font-medium">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-1.5">
                      <span className="text-white/60 font-sans">Poniedziałek – Czwartek</span>
                      <span className="font-mono text-stone-200">12:00 – 22:00</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-1.5">
                      <span className="text-white/60 font-sans">Piątek – Sobota</span>
                      <span className="font-semibold font-mono" style={{ color: currentAccent }}>12:00 – 00:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 font-sans">Niedziela</span>
                      <span className="font-mono text-stone-200">13:00 – 21:00</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* CTA button to close and navigate */}
              <button
                onClick={() => setIsFindUsOpen(false)}
                className="w-full py-3.5 uppercase border font-mono tracking-[0.15em] text-[10px] font-extrabold transition-all active:scale-95 duration-200 select-none cursor-pointer text-center hover:bg-white hover:text-black hover:border-white"
                style={{
                  borderColor: `${currentAccent}30`,
                  backgroundColor: `transparent`,
                  color: "#ffffff"
                }}
              >
                Zamknij panel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
