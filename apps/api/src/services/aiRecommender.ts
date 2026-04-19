import { IClothingItem } from "../models/ClothingItem";
import { IOutfit } from "../models/Outfit";

type Item   = IClothingItem & { _id: any };
type Outfit = IOutfit & { _id: any; items: Item[] };

export interface UserPreferences {
  topStyles:  string[];   // styles sorted by frequency
  topColors:  string[];   // colors sorted by frequency
  topTypes:   string[];   // types sorted by frequency
  avoidColors: string[];  // colors never worn
  avoidStyles: string[];  // styles never worn
}

/*
  Build a preference profile from user behavior:
  - Saved outfits = strong positive signal
  - High wornCount = strong positive signal
  - Recent lastWorn = positive signal
  - Never worn = weak negative signal
*/
export function buildUserPreferences(items: Item[], savedOutfits: Outfit[]): UserPreferences {
  const styleScore:  Record<string, number> = {};
  const colorScore:  Record<string, number> = {};
  const typeScore:   Record<string, number> = {};

  // Score from clothing items — worn items get higher weight
  for (const item of items) {
    const weight = 1 + (item.wornCount || 0) * 2;

    styleScore[item.style] = (styleScore[item.style] || 0) + weight;
    typeScore[item.type]   = (typeScore[item.type]   || 0) + weight;
    for (const c of item.color) {
      colorScore[c] = (colorScore[c] || 0) + weight;
    }
  }

  // Boost from saved outfits — strong signal
  for (const outfit of savedOutfits) {
    for (const item of outfit.items) {
      styleScore[item.style] = (styleScore[item.style] || 0) + 5;
      for (const c of item.color) {
        colorScore[c] = (colorScore[c] || 0) + 5;
      }
    }
  }

  const sortByScore = (map: Record<string, number>) =>
    Object.entries(map).sort((a, b) => b[1] - a[1]).map(([k]) => k);

  const topStyles = sortByScore(styleScore);
  const topColors = sortByScore(colorScore);
  const topTypes  = sortByScore(typeScore);

  // Items that exist but were never worn = avoid signal
  const allStyles  = [...new Set(items.map((i) => i.style))];
  const allColors  = [...new Set(items.flatMap((i) => i.color))];
  const avoidStyles = allStyles.filter((s) => !styleScore[s] || styleScore[s] <= 1);
  const avoidColors = allColors.filter((c) => !colorScore[c] || colorScore[c] <= 1);

  return { topStyles, topColors, topTypes, avoidColors, avoidStyles };
}

/*
  Score an outfit against user preferences
  Higher = better match for this specific user
*/
export function scoreOutfitForUser(
  outfitItems: Item[],
  prefs: UserPreferences
): number {
  let score = 0;

  for (const item of outfitItems) {
    // Style preference rank — top style = +4, second = +3, etc.
    const styleRank = prefs.topStyles.indexOf(item.style);
    if (styleRank !== -1) score += Math.max(0, 4 - styleRank);

    // Color preference rank
    for (const c of item.color) {
      const colorRank = prefs.topColors.indexOf(c);
      if (colorRank !== -1) score += Math.max(0, 3 - colorRank);
    }

    // Penalise avoided styles/colors
    if (prefs.avoidStyles.includes(item.style)) score -= 2;
    for (const c of item.color) {
      if (prefs.avoidColors.includes(c)) score -= 1;
    }

    // Boost items not recently worn — encourages variety
    const daysSinceWorn = item.lastWorn
      ? (Date.now() - new Date(item.lastWorn).getTime()) / (1000 * 60 * 60 * 24)
      : 999;
    if (daysSinceWorn > 7) score += 2;
  }

  return score;
}
