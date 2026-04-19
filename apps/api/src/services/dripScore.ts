import { IClothingItem } from "../models/ClothingItem";
import { IOutfit } from "../models/Outfit";

type Item = IClothingItem & { _id: any };
type Outfit = IOutfit & { _id: any };

/*
  Drip Score (0–100) — measures wardrobe health and style activity
  Breakdown:
    - Variety score   (30pts): how many different types user has
    - Activity score  (30pts): how recently items were worn
    - Closet size     (20pts): more items = more potential
    - Saved outfits   (20pts): engagement with the app
*/
export function calculateDripScore(items: Item[], savedOutfits: Outfit[]): number {
  if (items.length === 0) return 0;

  // 1. Variety — unique types out of 6 possible
  const uniqueTypes = new Set(items.map((i) => i.type)).size;
  const varietyScore = Math.round((uniqueTypes / 6) * 30);

  // 2. Activity — items worn in last 7 days
  const now = Date.now();
  const recentlyWorn = items.filter((i) => {
    if (!i.lastWorn) return false;
    const diff = (now - new Date(i.lastWorn).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;
  const activityScore = Math.min(30, Math.round((recentlyWorn / Math.max(items.length, 1)) * 30 * 3));

  // 3. Closet size — caps at 20 items for full score
  const sizeScore = Math.min(20, Math.round((items.length / 20) * 20));

  // 4. Saved outfits — caps at 5 for full score
  const outfitScore = Math.min(20, Math.round((savedOutfits.length / 5) * 20));

  return Math.min(100, varietyScore + activityScore + sizeScore + outfitScore);
}

export function getDripLabel(score: number): { label: string; emoji: string; color: string } {
  if (score >= 80) return { label: "Drip God",      emoji: "🔥", color: "text-orange-500" };
  if (score >= 60) return { label: "Stylist Mode",  emoji: "✨", color: "text-accent-purple" };
  if (score >= 40) return { label: "Getting There", emoji: "💪", color: "text-accent-green" };
  if (score >= 20) return { label: "Just Starting", emoji: "👟", color: "text-blue-500" };
  return               { label: "Build It Up",    emoji: "🌱", color: "text-neutral-400" };
}

export function getDailyTip(items: Item[]): string {
  if (items.length === 0) return "Start by adding your first clothing item 👗";

  const neverWorn   = items.filter((i) => i.wornCount === 0);
  const hasNoShoes  = !items.some((i) => i.type === "shoes");
  const hasNoBottom = !items.some((i) => i.type === "bottom");

  if (hasNoShoes)  return "Add some shoes to unlock more outfit combinations 👟";
  if (hasNoBottom) return "Add a bottom (pants/skirt) to get full outfit suggestions 👖";
  if (neverWorn.length > 0) return `You have ${neverWorn.length} item${neverWorn.length > 1 ? "s" : ""} you've never worn. Time to switch it up! 🔄`;
  return "Generate new outfits today and try something fresh ✨";
}
