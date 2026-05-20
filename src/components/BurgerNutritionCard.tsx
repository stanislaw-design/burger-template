import { motion } from "motion/react";
import { BurgerNutrition } from "../types";

interface BurgerNutritionCardProps {
  nutrition: BurgerNutrition;
  themeColor: string; // Amber-500, Yellow-500, Emerald-400, Red-500
}

export default function BurgerNutritionCard({ nutrition, themeColor }: BurgerNutritionCardProps) {
  // Parse numeric values to animate the progress circles
  const calPercent = 85; // fixed relative scale
  const protPercent = 75;
  const fatPercent = 65;
  const carbPercent = 55;

  const circles = [
    { label: "Kcal", value: nutrition.calories, percent: calPercent, color: themeColor },
    { label: "Białko", value: nutrition.protein, percent: protPercent, color: themeColor },
    { label: "Tłuszcz", value: nutrition.fat, percent: fatPercent, color: themeColor },
    { label: "Węgle", value: nutrition.carbs, percent: carbPercent, color: themeColor },
  ];

  return (
    <div className="bg-stone-900/40 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/5 space-y-4 shadow-xl">
      <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
        <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
          KARTA SZACOWANEJ KALORYCZNOŚCI
        </h4>
        <span className="text-[10px] bg-white/5 text-stone-300 font-mono px-2 py-0.5 rounded border border-white/10 uppercase">
          PORCJA PREMIUM
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {circles.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-2">
            
            {/* Minimalist donut gauge */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                {/* Background track */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-stone-800"
                  strokeWidth="3.5"
                  fill="none"
                />
                {/* Animated progress overlay */}
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke={
                    item.color === "emerald-400" ? "#34d399" :
                    item.color === "yellow-500" ? "#facc15" :
                    item.color === "red-500" ? "#f87171" : "#fbbf24"
                  }
                  strokeWidth="3.5"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 20) * (1 - item.percent / 100) }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.15 }}
                />
              </svg>
              {/* Center percentage/value indicator */}
              <div className="absolute text-[8px] font-mono tracking-tighter text-stone-400 font-bold">
                {item.percent}%
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="block text-[10px] font-mono text-stone-500 uppercase">{item.label}</span>
              <span className="block text-xs font-mono font-bold text-stone-200">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
