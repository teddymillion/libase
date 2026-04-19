"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { DripScoreRing } from "@/components/shared/DripScoreRing";
import { PageTransition } from "@/components/shared/PageTransition";
import { SkeletonProfile } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

interface ClothingItem {
  _id: string;
  imageUrl: string;
  type: string;
  name?: string;
  wornCount: number;
}

interface Stats {
  dripScore:       number;
  dripLabel:       { label: string; emoji: string; color: string };
  tip:             string;
  totalItems:      number;
  savedOutfits:    number;
  recentlyWorn:    ClothingItem[];
  dailySuggestion: { items: ClothingItem[]; vibe: string } | null;
}

export default function ProfilePage() {
  const { logout } = useAuth();
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stats")
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 pb-28">
        <div className="max-w-lg mx-auto px-4 pt-10">
          <SkeletonProfile />
        </div>
      </main>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-neutral-50 pb-28">
        <div className="max-w-lg mx-auto px-4 pt-10 space-y-5">

          <h1 className="font-display text-2xl font-bold text-neutral-900">Profile</h1>

          {/* Drip Score */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Your Drip Score</p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neutral-900">{stats?.totalItems}</p>
                    <p className="text-xs text-neutral-400">Items</p>
                  </div>
                  <div className="w-px bg-neutral-100" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neutral-900">{stats?.savedOutfits}</p>
                    <p className="text-xs text-neutral-400">Outfits</p>
                  </div>
                </div>
              </div>
              {stats && (
                <DripScoreRing
                  score={stats.dripScore}
                  label={stats.dripLabel.label}
                  emoji={stats.dripLabel.emoji}
                  color={stats.dripLabel.color}
                />
              )}
            </div>
            {stats?.tip && (
              <div className="mt-4 bg-primary-50 rounded-xl px-4 py-3">
                <p className="text-sm text-primary-900 font-medium">{stats.tip}</p>
              </div>
            )}
          </div>

          {/* Daily Suggestion */}
          {stats?.dailySuggestion && (
            <div className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Today&apos;s Suggestion</p>
                  <p className="text-sm font-semibold text-neutral-800 mt-0.5">{stats.dailySuggestion.vibe}</p>
                </div>
                <Link href="/outfits" className="text-xs text-primary-400 font-semibold hover:underline">
                  See all →
                </Link>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {stats.dailySuggestion.items.map((item) => (
                  <div key={item._id} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                    <Image src={item.imageUrl} alt={item.name || item.type} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently Worn */}
          {stats?.recentlyWorn && stats.recentlyWorn.length > 0 && (
            <div className="card p-4 space-y-3">
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Recently Worn</p>
              <div className="space-y-2">
                {stats.recentlyWorn.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.name || item.type} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 capitalize truncate">{item.name || item.type}</p>
                      <p className="text-xs text-neutral-400">Worn {item.wornCount} time{item.wornCount !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mark worn tip */}
          <div className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Boost Your Score</p>
              <Link href="/closet" className="text-xs text-primary-400 font-semibold hover:underline">Go to closet →</Link>
            </div>
            <p className="text-sm text-neutral-500">
              Hover over items in your <Link href="/closet" className="text-primary-400 font-semibold">closet</Link> and tap <span className="font-semibold">👕 Worn today</span> to track activity and raise your Drip Score.
            </p>
          </div>

          <Button variant="ghost" onClick={logout} className="border border-neutral-200">
            Sign out
          </Button>

        </div>
      </main>
    </PageTransition>
  );
}
