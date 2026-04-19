"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

interface Item {
  _id: string;
  imageUrl: string;
  thumbUrl?: string;
  cardUrl?:  string;
  type: string;
  name?: string;
  color: string[];
  style?: string;
}

interface ImageZoomModalProps {
  item: Item | null;
  onClose: () => void;
}

export function ImageZoomModal({ item, onClose }: ImageZoomModalProps) {
  // Close on escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-sm"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={item.imageUrl}
                alt={item.name || item.type}
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>

            {/* Info */}
            <div className="mt-4 bg-white rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-neutral-900 capitalize text-lg">
                    {item.name || item.type}
                  </p>
                  <p className="text-neutral-500 text-sm capitalize">{item.style}</p>
                </div>
                <div className="flex gap-1.5">
                  {item.color.map((c) => (
                    <span
                      key={c}
                      className="w-5 h-5 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
