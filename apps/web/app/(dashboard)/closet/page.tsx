"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { ImageZoomModal } from "@/components/shared/ImageZoomModal";
import { PageTransition } from "@/components/shared/PageTransition";
import { SkeletonGrid } from "@/components/ui/Skeleton";

const FILTERS = ["all", "top", "bottom", "shoes", "outerwear", "accessory", "dress"];

interface ClothingItem {
  _id: string;
  imageUrl: string;
  type: string;
  style: string;
  color: string[];
  name?: string;
  wornCount?: number;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-3 animate-fade-in">
      <span className="text-5xl">👗</span>
      <p className="font-semibold text-neutral-700">Your closet is empty</p>
      <p className="text-neutral-400 text-sm">Add your first item to get started</p>
      <Link href="/closet/upload"
        className="mt-2 bg-primary-400 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-primary-500 transition-colors"
      >
        Add first item ✨
      </Link>
    </div>
  );
}

export default function ClosetPage() {
  const [items,    setItems]    = useState<ClothingItem[]>([]);
  const [filter,   setFilter]   = useState("all");
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [marking,  setMarking]  = useState<string | null>(null);
  const [zoomItem, setZoomItem] = useState<ClothingItem | null>(null);
  const [gridKey,  setGridKey]  = useState(0);

  async function fetchItems(type: string) {
    setLoading(true);
    try {
      const params = type !== "all" ? { type } : {};
      const { data } = await api.get("/clothing", { params });
      setItems(data.items);
      setGridKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(filter); }, [filter]);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await api.delete(`/clothing/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } finally {
      setDeleting(null);
    }
  }

  async function handleMarkWorn(id: string) {
    setMarking(id);
    try {
      const { data } = await api.patch(`/stats/worn/${id}`);
      setItems((prev) => prev.map((i) => i._id === id ? { ...i, wornCount: data.item.wornCount } : i));
    } finally {
      setMarking(null);
    }
  }

  return (
    <PageTransition>
    <main className="min-h-screen bg-neutral-50 pb-28">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="pt-10 pb-4 flex items-center justify-between animate-slide-down">
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">My Closet</h1>
            <p className="text-neutral-500 text-sm mt-0.5">
              {loading ? "Loading..." : `${items.length} item${items.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link href="/closet/upload"
            className="flex items-center gap-1.5 bg-primary-400 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-primary-500 active:scale-95 transition-all duration-150"
          >
            <span className="text-lg leading-none">+</span> Add item
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all duration-200",
                filter === f
                  ? "bg-primary-400 text-white shadow-md scale-105"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-400"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div key={gridKey} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {items.map((item) => (
              <div key={item._id} className="grid-item group relative aspect-square rounded-xl overflow-hidden bg-white shadow-card">

                <Image
                  src={item.imageUrl}
                  alt={item.name || item.type}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  sizes="(max-width: 640px) 50vw, 33vw"
                  onClick={() => setZoomItem(item)}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1.5">
                    <p className="text-white text-xs font-semibold capitalize truncate">{item.name || item.type}</p>
                    {/* Mark worn button */}
                    <button
                      onClick={() => handleMarkWorn(item._id)}
                      disabled={marking === item._id}
                      className="w-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium py-1.5 rounded-lg hover:bg-white/30 transition-all flex items-center justify-center gap-1"
                    >
                      {marking === item._id
                        ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : <>👕 Worn today {item.wornCount ? `(${item.wornCount}×)` : ""}</>
                      }
                    </button>
                  </div>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleting === item._id}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 active:scale-90 transition-all"
                  >
                    {deleting === item._id
                      ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : "✕"}
                  </button>
                </div>

                {/* Color dots */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.color.slice(0, 3).map((c) => (
                    <span key={c} className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        <ImageZoomModal item={zoomItem} onClose={() => setZoomItem(null)} />
      </AnimatePresence>
    </main>
    </PageTransition>
  );
}
