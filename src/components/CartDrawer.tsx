import { X, Plus, Minus, Check, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Burger } from "../types";

interface CartItem {
  burger: Burger;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (burgerId: number, delta: number) => void;
  onClear: () => void;
  onOrderComplete: () => void;
  isOrdering: boolean;
  orderCompleted: boolean;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClear,
  onOrderComplete,
  isOrdering,
  orderCompleted,
}: CartDrawerProps) {
  
  // Calculations
  const subtotal = items.reduce((acc, item) => {
    const rawPrice = parseFloat(item.burger.price.replace(" zł", "").replace(",", "."));
    return acc + rawPrice * item.quantity;
  }, 0);
  
  const delivery = subtotal > 0 ? 9.5 : 0;
  const total = subtotal + delivery;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#060404] z-50 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-stone-900 border-l border-white/5 shadow-2xl z-50 flex flex-col focus:outline-none"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-stone-950/40">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-500" />
                <h3 className="font-bebas text-2xl tracking-wide uppercase">DOKONAJ ZAMÓWIENIA</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {orderCompleted ? (
                /* Success Complete state */
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center h-full py-12 space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/20">
                    <Check className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1.5 max-w-xs">
                    <h4 className="font-bebas text-3xl text-emerald-400">ZAMÓWIENIE PRZYJĘTE</h4>
                    <p className="text-xs text-stone-400 font-sans leading-relaxed">
                      Twoje rzemieślnicze burgery trafiają właśnie na grill. Nasz grillmaster dba o każdy detal!
                    </p>
                  </div>
                  <div className="w-full bg-stone-950/40 border border-white/5 rounded-xl p-4 font-mono text-[10px] text-stone-400 text-left space-y-2">
                    <div className="flex justify-between font-bold border-b border-white/5 pb-2">
                      <span>METADANE KRAFTU</span>
                      <span className="text-amber-500">#ZAM-{Math.floor(Math.random() * 90000 + 10000)}</span>
                    </div>
                    <p>Status: <span className="text-emerald-400 font-bold">W przygotowaniu</span></p>
                    <p>Technologia: Gruntowy płomień dębowy</p>
                    <p>Czas dostawy: ~35-45 minut</p>
                  </div>
                </motion.div>
              ) : items.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center text-center h-full py-12 space-y-4 text-stone-500">
                  <div className="w-16 h-16 rounded-2xl bg-stone-950/40 border border-white/5 flex items-center justify-center text-stone-600">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans text-sm font-semibold text-stone-300">Koszyk jest pusty</h4>
                    <p className="text-xs max-w-[200px] leading-relaxed">
                      Zjedź na dół i dodaj do koszyka jednego z naszych wybornych burgerów!
                    </p>
                  </div>
                </div>
              ) : (
                /* Active items */
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] font-mono font-semibold text-stone-400 uppercase tracking-widest">
                      WYBRANE SMAKI ({items.length})
                    </span>
                    <button
                      onClick={onClear}
                      className="text-[10px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>WYCZYŚĆ KOSZYK</span>
                    </button>
                  </div>
                  
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.burger.id}
                      className="flex items-center gap-4 bg-stone-950/40 border border-white/5 p-4 rounded-xl shadow-lg relative overflow-hidden"
                    >
                      {/* Background decor strip */}
                      <div
                        className={`absolute top-0 bottom-0 left-0 w-1 ${
                          item.burger.id === 0 ? "bg-amber-500" :
                          item.burger.id === 1 ? "bg-yellow-500" :
                          item.burger.id === 2 ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />

                      {/* Image */}
                      <div className="w-16 h-16 bg-stone-900 rounded-lg p-1.5 flex items-center justify-center border border-white/5 flex-shrink-0">
                        <img
                          src={item.burger.image}
                          alt={item.burger.name}
                          className="w-full h-full object-contain filter drop-shadow-md"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bebas text-lg leading-tight text-stone-100">{item.burger.name}</h4>
                        <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">{item.burger.subName.split(" ")[0]}</p>
                        <span className="font-mono text-sm font-bold text-amber-500">{item.burger.price}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center gap-1.5 bg-stone-900 px-2 py-1.5 rounded-lg border border-white/5">
                        <button
                          onClick={() => onUpdateQuantity(item.burger.id, 1)}
                          className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white cursor-pointer active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold text-stone-200">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.burger.id, -1)}
                          className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white cursor-pointer active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary (only if items exist and order not completed) */}
            {items.length > 0 && !orderCompleted && (
              <div className="p-6 border-t border-white/5 bg-stone-950/65 space-y-4">
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Suma częściowa</span>
                    <span>{subtotal.toFixed(2).replace(".", ",")} zł</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Dostawa Kraftowa</span>
                    <span>{delivery.toFixed(2).replace(".", ",")} zł</span>
                  </div>
                  <div className="flex justify-between text-stone-200 font-bold text-sm border-t border-white/5 pt-2.5">
                    <span>SUMA KOŃCOWA</span>
                    <span className="text-amber-500">{total.toFixed(2).replace(".", ",")} zł</span>
                  </div>
                </div>

                <button
                  disabled={isOrdering}
                  onClick={onOrderComplete}
                  className="w-full py-4 text-center rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-stone-950 font-mono font-bold uppercase tracking-widest cursor-pointer shadow-lg shadow-orange-900/10 active:scale-[0.98] transition-all disabled:opacity-50 select-none flex items-center justify-center gap-2"
                >
                  {isOrdering ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
                      <span>PRZETWARZANIE...</span>
                    </>
                  ) : (
                    "ZŁÓŻ ZAMÓWIENIE"
                  )}
                </button>
                <p className="text-[9px] font-mono text-stone-500 text-center uppercase tracking-wide">
                  *Płatność przy odbiorze lub szybkim kodem Kraft-BLIK.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
