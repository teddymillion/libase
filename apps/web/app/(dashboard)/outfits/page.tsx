"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { OutfitCard } from "@/components/shared/OutfitCard";
import { OutfitPreview } from "@/components/shared/OutfitPreview";
import { PageTransition } from "@/components/shared/PageTransition";
import { SkeletonList } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Tab = "generated" | "saved";

interface ClothingItem {
  _id: string;
  imageUrl: string;
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

interface Preferences {
  topStyles: string[];
  topColors: string[];
}

export default function OutfitsPage() {
  const [tab,          setTab]          = useState<Tab>("generated");
  const [outfits,      setOutfits]      = useState<Outfit[]>([]);
  const [saved,        setSaved]        = useState<Outfit[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [fetching,     setFetching]     = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [prefs,        setPrefs]        = useState<Preferences | null>(null);
  const [gridKey,      setGridKey]      = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/outfits/saved");
        setSaved(data.outfits);
        // Auto-generate on first visit if no saved outfits
        if (data.outfits.length === 0) {
          setLoading(true);
          try {
            const gen = await api.post("/outfits/generate");
            setOutfits(gen.data.outfits);
            setPrefs(gen.data.preferences);
            setGridKey((k) => k + 1);
          } catch { /* not enough items yet — silent fail */ }
          finally { setLoading(false); }
        }
      } finally {
        setFetching(false);
      }
    }
    load();
  }, []);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/outfits/generate");
      setOutfits(data.outfits);
      setPrefs(data.preferences);
      setGridKey((k) => k + 1);
      setTab("generated");
    } catch (e: any) {
      setError(e.response?.data?.message || "Could not generate outfits");
    } finally {
      setLoading(false);
    }
  }

  function handleSave(id: string) {
    // Update generated list
    setOutfits((prev) => prev.map((o) => o._id === id ? { ...o, saved: true } : o));
    const outfit = outfits.find((o) => o._id === id);
    if (outfit) setSaved((prev) => [{ ...outfit, saved: true }, ...prev]);
  }

  function handleDeleteGenerated(id: string) {
    setOutfits((prev) => prev.filter((o) => o._id !== id));
  }

  function handleDeleteSaved(id: string) {
    setSaved((prev) => prev.filter((o) => o._id !== id));
  }

  function openPreview(id: string) {
    const list = tab === "generated" ? outfits : saved;
    const idx  = list.findIndex((o) => o._id === id);
    if (idx !== -1) setPreviewIndex(idx);
  }

  const displayList = tab === "generated" ? outfits : saved;

  return (
    <>
      <PageTransition>
        <main className="min-h-screen bg-neutral-50 pb-28">
        <div className="max-w-2xl mx-auto px-4">

          {/* Header */}
          <div className="pt-10 pb-4 animate-slide-down">
            <h1 className="font-display text-2xl font-bold text-neutral-900">Outfits</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Personalised from your closet</p>
          </div>

          <Button onClick={handleGenerate} loading={loading} className="mb-4">
            ✨ Generate new outfits
          </Button>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* AI Style Profile */}
          {prefs && prefs.topStyles.length > 0 && (
            <div className="mb-4 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 animate-fade-in">
              <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-1">🤖 Your Style Profile</p>
              <p className="text-sm text-primary-900">
                You lean <span className="font-bold capitalize">{prefs.topStyles[0]}</span>
                {prefs.topStyles[1] && <> with a touch of <span className="font-bold capitalize">{prefs.topStyles[1]}</span></>}.
                {prefs.topColors[0] && <> Ranked by your love for <span className="font-bold capitalize">{prefs.topColors[0]}</span> tones.</>}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl mb-5">
            {(["generated", "saved"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all duration-200",
                  tab === t ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                )}
              >
                {t === "generated" ? `Generated (${outfits.length})` : `Saved (${saved.length})`}
              </button>
            ))}
          </div>

          {/* Content */}
          {fetching ? (
            <SkeletonList count={2} />
          ) : displayList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 animate-fade-in">
              <span className="text-5xl">{tab === "generated" ? "✨" : "🔖"}</span>
              <p className="font-semibold text-neutral-700">
                {tab === "generated" ? "No outfits yet" : "No saved outfits"}
              </p>
              <p className="text-neutral-400 text-sm">
                {tab === "generated"
                  ? "Hit the button above to generate outfits from your closet"
                  : "Save outfits you love to find them here"}
              </p>
            </div>
          ) : (
            <div key={gridKey} className="space-y-4">
              {displayList.map((outfit, idx) => (
                <div key={outfit._id} className="relative">
                  {tab === "generated" && idx === 0 && (
                    <div className="absolute -top-2 left-4 z-10 bg-primary-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Best match for you 🎯
                    </div>
                  )}
                  <OutfitCard
                    outfit={outfit}
                    onSave={handleSave}
                    onDelete={tab === "generated" ? handleDeleteGenerated : handleDeleteSaved}
                    onPreview={openPreview}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
        </main>
      </PageTransition>

      {/* Full screen preview */}
      <AnimatePresence>
        {previewIndex !== null && (
          <OutfitPreview
            outfits={displayList}
            currentIndex={previewIndex}
            onNext={() => setPreviewIndex((i) => Math.min(displayList.length - 1, (i ?? 0) + 1))}
            onPrev={() => setPreviewIndex((i) => Math.max(0, (i ?? 0) - 1))}
            onSave={handleSave}
            onClose={() => setPreviewIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
