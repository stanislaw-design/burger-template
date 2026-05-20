export interface BurgerNutrition {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
}

export interface FloatingIngredient {
  id: number;
  emoji: string;
  name: string;
  color: string;
  delay: number;
  initialX: number; // percentage width
  initialY: number; // percentage height
  rangeX: number;
  rangeY: number;
  speed: number;
}

export interface Burger {
  id: number;
  name: string;
  subName: string;
  tagline: string;
  image: string;
  description: string;
  price: string;
  themeColor: string; // Tailwind tint coloring
  buttonColor: string; // Action button color
  gradientBg: string; // CSS background gradient
  tag: string;
  tagStyles: string;
  highlights: string[];
  nutrition: BurgerNutrition;
  floatingIngredients: FloatingIngredient[];
}
