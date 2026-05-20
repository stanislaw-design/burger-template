import { Burger } from "./types";

export const BURGERS: Burger[] = [
  {
    id: 0,
    name: "Smoky BBQ Bandit",
    subName: "KLASYK Z DZIKIEGO TYROLU",
    tagline: "Dymny sos BBQ, soczysta wołowina Angus, karmelizowana cebula.",
    image: "/smoky-bbq.png",
    description: "Nasz flagowy burger z soczystej wołowiny Angus, grillowany na żywym ogniu. Podlewany gęstym, dymnym sosem BBQ o aromacie hikory, przełamany chrupiącym boczkiem, ciągnącym się serem Cheddar i słodką, karmelizowaną czerwoną cebulą.",
    price: "34,90 zł",
    themeColor: "amber-500",
    buttonColor: "bg-amber-500 hover:bg-amber-400 text-stone-950 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]",
    gradientBg: "from-[#110d0b] via-[#21150f] to-[#0d0a08]",
    tag: "BESTSELLER",
    tagStyles: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    highlights: ["Wołowina Angus 200g", "Chrupiący Bekon", "Ser Cheddar Dojrzewający", "Dymny Sos BBQ"],
    nutrition: {
      calories: "840 kcal",
      protein: "42g",
      fat: "48g",
      carbs: "52g"
    },
    floatingIngredients: [
      { id: 1, emoji: "🥓", name: "Boczek", color: "text-red-500", delay: 0, initialX: 72, initialY: 34, rangeX: 25, rangeY: 30, speed: 2.5 },
      { id: 2, emoji: "🧅", name: "Cebula", color: "text-amber-200", delay: 1.2, initialX: 58, initialY: 42, rangeX: 40, rangeY: 25, speed: 3.2 },
      { id: 3, emoji: "🧀", name: "Cheddar", color: "text-yellow-500", delay: 0.6, initialX: 82, initialY: 58, rangeX: 30, rangeY: 35, speed: 2.8 },
      { id: 4, emoji: "💨", name: "Dym", color: "text-stone-300", delay: 1.8, initialX: 68, initialY: 72, rangeX: 20, rangeY: 40, speed: 3.5 },
      { id: 5, emoji: "🍅", name: "Pomidor", color: "text-red-600", delay: 0.9, initialX: 85, initialY: 22, rangeX: 35, rangeY: 20, speed: 2.2 }
    ]
  },
  {
    id: 1,
    name: "Crispy Mayo Gold",
    subName: "ZŁOCISTY CHRUP",
    tagline: "Kurczak w panko, aksamitny majonez, dojrzałe pomidory.",
    image: "/crispy-mayo.png",
    description: "Wyjątkowo soczysty, marynowany w maślance i panierowany w płatkach kukurydzianych filet z kurczaka premium. Serwowany na złocistej bułce maślanej z podwójną warstwą domowego majonezu, świeżą sałatą rzymską i soczystym pomidorem.",
    price: "31,90 zł",
    themeColor: "yellow-500",
    buttonColor: "bg-yellow-500 hover:bg-yellow-400 text-stone-950 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]",
    gradientBg: "from-[#100f0a] via-[#211d0e] to-[#0c0b08]",
    tag: "CHRUPIĄCY DRÓB",
    tagStyles: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    highlights: ["Kurczak w Panko 180g", "Maślana Bułka Brioche", "Świeży Pomidor Malinowy", "Aksamitny Majonez"],
    nutrition: {
      calories: "720 kcal",
      protein: "36g",
      fat: "34g",
      carbs: "56g"
    },
    floatingIngredients: [
      { id: 1, emoji: "🍗", name: "Kurczak", color: "text-amber-600", delay: 0, initialX: 74, initialY: 28, rangeX: 20, rangeY: 25, speed: 2.9 },
      { id: 2, emoji: "🥬", name: "Sałata", color: "text-emerald-500", delay: 1.5, initialX: 56, initialY: 52, rangeX: 35, rangeY: 30, speed: 3.4 },
      { id: 3, emoji: "🥚", name: "Majonez", color: "text-stone-100", delay: 0.8, initialX: 88, initialY: 44, rangeX: 25, rangeY: 20, speed: 2.1 },
      { id: 4, emoji: "🌾", name: "Sezam", color: "text-amber-100", delay: 2.2, initialX: 63, initialY: 68, rangeX: 45, rangeY: 35, speed: 3.8 },
      { id: 5, emoji: "🍋", name: "Cytryna", color: "text-yellow-400", delay: 1.1, initialX: 84, initialY: 66, rangeX: 30, rangeY: 40, speed: 2.6 }
    ]
  },
  {
    id: 2,
    name: "Garden Verde",
    subName: "KRAFTOWA ZIELEŃ 100% ROŚLINNA",
    tagline: "Kotlet z quinoa, aromatyczne pesto bazyliowe, kremowe guacamole.",
    image: "/garden-verde.png",
    description: "Mistrzowska kompozycja wegetariańska. Ręcznie robiony kotlet z ciecierzycy, pieczonego batata i quinoa. Podawany z autorskim, głębokim pesto ze świeżej bazylii, puszystym guacamole z awokado Hass oraz chrupiącą rukolą w pełnoziarnistej bułce.",
    price: "29,90 zł",
    themeColor: "emerald-400",
    buttonColor: "bg-emerald-500 hover:bg-emerald-400 text-stone-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    gradientBg: "from-[#0a0e0c] via-[#0f2115] to-[#070a08]",
    tag: "100% WEGE",
    tagStyles: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    highlights: ["Kotlet Batat & Quinoa", "Awokado Guacamole", "Świeże Bazyliowe Pesto", "Kiełki Rzodkiewki"],
    nutrition: {
      calories: "590 kcal",
      protein: "18g",
      fat: "22g",
      carbs: "68g"
    },
    floatingIngredients: [
      { id: 1, emoji: "🥑", name: "Awokado", color: "text-emerald-400", delay: 0.2, initialX: 71, initialY: 24, rangeX: 30, rangeY: 30, speed: 2.4 },
      { id: 2, emoji: "🌿", name: "Bazylia", color: "text-emerald-500", delay: 1.1, initialX: 59, initialY: 46, rangeX: 40, rangeY: 25, speed: 3.1 },
      { id: 3, emoji: "🥒", name: "Ogórek", color: "text-green-600", delay: 0.7, initialX: 86, initialY: 48, rangeX: 20, rangeY: 35, speed: 2.7 },
      { id: 4, emoji: "🌱", name: "Kiełki", color: "text-green-300", delay: 2.0, initialX: 62, initialY: 72, rangeX: 35, rangeY: 40, speed: 3.6 },
      { id: 5, emoji: "🍅", name: "Pomidorek", color: "text-red-500", delay: 1.4, initialX: 84, initialY: 76, rangeX: 25, rangeY: 25, speed: 2.3 }
    ]
  },
  {
    id: 3,
    name: "Obsidian Inferno",
    subName: "PIEKIELNY WULKAN SMAKU",
    tagline: "Czarna bułka węglowa, papryczki jalapeño, krwisty sos sriracha.",
    image: "/obsidian-inferno.png",
    description: "Skomponowany dla miłośników intensywnej ostrości. Soczysty, przyprawiony chili wołowy kotlet zamknięty w rzemieślniczej czarnej bułce z dodatkiem węgla aktywnego. Ogień rozpalają siekane papryczki jalapeño, ser Pepper Jack i ostry sos Sriracha Mayo.",
    price: "36,90 zł",
    themeColor: "red-500",
    buttonColor: "bg-red-500 hover:bg-red-400 text-stone-950 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    gradientBg: "from-[#110a0a] via-[#241010] to-[#0d0606]",
    tag: "BARDZO OSTRY",
    tagStyles: "bg-red-500/10 text-red-400 border border-red-500/20",
    highlights: ["Wołowina Angus 200g", "Czarna Bułka Węglowa", "Piekielne Jalapeño", "Sos Sriracha Mayo"],
    nutrition: {
      calories: "860 kcal",
      protein: "44g",
      fat: "49g",
      carbs: "51g"
    },
    floatingIngredients: [
      { id: 1, emoji: "🌶️", name: "Jalapeno", color: "text-red-500", delay: 0.1, initialX: 75, initialY: 32, rangeX: 25, rangeY: 35, speed: 2.8 },
      { id: 2, emoji: "🔥", name: "Ogień", color: "text-orange-500", delay: 1.4, initialX: 55, initialY: 38, rangeX: 35, rangeY: 20, speed: 3.3 },
      { id: 3, emoji: "🧀", name: "Pepper Jack", color: "text-amber-100", delay: 0.9, initialX: 87, initialY: 54, rangeX: 30, rangeY: 40, speed: 2.5 },
      { id: 4, emoji: "🧅", name: "Czerwona Cebula", color: "text-purple-400", delay: 2.1, initialX: 65, initialY: 74, rangeX: 40, rangeY: 30, speed: 3.7 },
      { id: 5, emoji: "🧄", name: "Czosnek", color: "text-stone-200", delay: 1.6, initialX: 81, initialY: 72, rangeX: 20, rangeY: 25, speed: 2.2 }
    ]
  }
];
