"use client";
import Image from "next/image";
import { useState } from "react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface ClothingItem {
  _id: string;
  imageUrl: string;
  thumbUrl?: string;
  cardUrl?:  string;
  type: string;
  name?: string;
  color: string[];
  style?: string;
}

interface Outfit {
  _id: string;
  items: ClothingItem[];
  vibe: string;
  saved: boolean;
}

interface OutfitCardProps {
  outfit:    Outfit;
  onSave:    (id: string) => void;
  onDelete:  (id: string) => void;
  onPreview: (id: string) => void;
}

export function OutfitCard({ outfit, onSave, onDelete, onPreview }: OutfitCardProps) {
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved,    setSaved]    = useState(outfit.saved);

  async function handleSave() {
    setSaving(true);
    try {
      await api.patch(`/outfits/${outfit._id}/save`);
      setSaved(true);
      onSave(outfit._id);
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/outfits/${outfit._id}`);
      onDelete(outfit._id);
    } finally { setDeleting(false); }
  }

  const Spinner = () => (
    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
  );

  return (
    <div className="grid-item card p-4 space-y-3">

      {/* Vibe + saved badge */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-800">{outfit.vibe}</span>
        {saved && (
          <span className="text-xs bg-accent-green/10 text-accent-green font-semibold px-2.5 py-1 rounded-full">
            Saved ✓
          </span>
        )}
      </div>

      {/* Items strip */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {outfit.items.map((item) => (
          <div key={item._id} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
            <Image src={item.cardUrl || item.thumbUrl || item.imageUrl} alt={item.name || item.type} fill className="object-cover" sizes="80px" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1">
              <p className="text-white text-[10px] font-medium capitalize truncate">{item.name || item.type}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions — Preview + Save/Delete */}
      <div className="flex gap-2">
        <button
          onClick={() => onPreview(outfit._id)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-900 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-neutral-800 active:scale-95 transition-all"
        >
          👁 Preview
        </button>

        {!saved ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary-400 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-500 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? <Spinner /> : "🔖 Save"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 flex items-center justify-center text-sm font-medium py-2.5 rounded-xl border border-neutral-200 text-neutral-500 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all disabled:opacity-50"
            >
              {deleting ? <Spinner /> : "✕"}
            </button>
          </>
        ) : (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 flex items-center justify-center text-sm font-medium py-2.5 rounded-xl border border-neutral-200 text-neutral-500 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {deleting ? <Spinner /> : "Remove"}
          </button>
        )}
      </div>

    </div>
  );
}
