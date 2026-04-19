"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageZoomModal } from "./ImageZoomModal";

interface Item {
  _id: string;
  imageUrl: string;
  type: string;
  name?: string;
  color: string[];
  style?: string;
}

interface Outfit {
  _id: string;
  items: Item[];
  vibe: string;
  saved: boolean;
}

interface OutfitPreviewProps {
  outfits: Outfit[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSave: (id: string) => void;
  onClose: () => void;
}

export function OutfitPreview({ outfits, currentIndex, onNext, onPrev, onSave, onClose }: OutfitPreviewProps) {
  const [zoomItem,  setZoomItem]  = useState<Item | null>(null);
  const [direction, setDirection] = useState(1);
  const [saving,    setSaving]    = useState(false);

  const outfit = outfits[currentIndex];
  if (!outfit) return null;

  function goNext() { setDirection(1);  onNext(); }
  function goPrev() { setDirection(-1); onPrev(); }

  async function handleSave() {
    setSaving(true);
    try { onSave(outfit._id); } finally { setSaving(false); }
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-neutral-900 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
          ← Back
        </button>
        <div className="flex gap-1.5">
          {outfits.map((_, i) => (
            <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === currentIndex ? "w-6 bg-primary-400" : "w-1.5 bg-white/20")} />
          ))}
        </div>
        <span className="text-white/50 text-sm">{currentIndex + 1} / {outfits.length}</span>
      </div>

      {/* Outfit items — horizontal scroll */}
      <div className="flex-1 flex flex-col justify-center px-5 gap-4 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={outfit._id}
            custom={direction}
            variants={{
              enter:  (d: number) => ({ x: d * 60, opacity: 0, scale: 0.96 }),
              center: { x: 0, opacity: 1, scale: 1 },
              exit:   (d: number) => ({ x: d * -60, opacity: 0, scale: 0.96 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="space-y-4"
          >
            {/* Vibe */}
            <div className="text-center">
              <p className="text-white font-display text-xl font-bold">{outfit.vibe}</p>
            </div>

            {/* Items grid */}
            <div className={cn(
              "grid gap-3",
              outfit.items.length <= 2 ? "grid-cols-2" : "grid-cols-2"
            )}>
              {outfit.items.map((item, idx) => (
                <motion.button
                  key={item._id}
                  onClick={() => setZoomItem(item)}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "relative rounded-2xl overflow-hidden bg-neutral-800 shadow-xl",
                    outfit.items.length === 3 && idx === 0 ? "col-span-2 aspect-video" : "aspect-square"
                  )}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name || item.type}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 45vw, 200px"
                  />
                  {/* Item label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-xs font-semibold capitalize">{item.name || item.type}</p>
                    <p className="text-white/60 text-xs">Tap to zoom</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-10 space-y-3">
        {/* Nav arrows */}
        <div className="flex gap-3">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex-1 py-3 rounded-xl border border-white/20 text-white font-semibold text-sm disabled:opacity-30 hover:bg-white/10 transition-all active:scale-95"
          >
            ← Prev
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === outfits.length - 1}
            className="flex-1 py-3 rounded-xl border border-white/20 text-white font-semibold text-sm disabled:opacity-30 hover:bg-white/10 transition-all active:scale-95"
          >
            Next →
          </button>
        </div>

        {/* Save */}
        {!outfit.saved && (
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-primary-400 text-white font-bold text-base rounded-2xl hover:bg-primary-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : "🔖 Save this outfit"
            }
          </motion.button>
        )}
        {outfit.saved && (
          <div className="w-full py-4 bg-accent-green/20 text-accent-green font-bold text-base rounded-2xl text-center">
            ✓ Saved to your collection
          </div>
        )}
      </div>

      {/* Zoom modal */}
      <ImageZoomModal item={zoomItem} onClose={() => setZoomItem(null)} />
    </motion.div>
  );
}
