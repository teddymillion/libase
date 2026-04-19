import { IClothingItem } from "../models/ClothingItem";
import { colorsMatch, stylesMatch, getOutfitVibeLabel } from "./styleEngine";
import { UserPreferences, scoreOutfitForUser } from "./aiRecommender";

type Item = IClothingItem & { _id: any };

interface GeneratedOutfit {
  items: Item[];
  vibe:  string;
  score: number;
}

function findMatches(anchor: Item, pool: Item[]): Item[] {
  return pool
    .filter((p) => p._id.toString() !== anchor._id.toString())
    .filter((p) => stylesMatch(anchor.style, p.style) || colorsMatch(anchor.color, p.color))
    .sort((a, b) => {
      let sa = 0, sb = 0;
      if (stylesMatch(anchor.style, a.style)) sa += 3;
      if (colorsMatch(anchor.color, a.color)) sa += 2;
      if (stylesMatch(anchor.style, b.style)) sb += 3;
      if (colorsMatch(anchor.color, b.color)) sb += 2;
      return sb - sa;
    });
}

export function generateOutfits(allItems: Item[], prefs?: UserPreferences): GeneratedOutfit[] {
  const tops      = allItems.filter((i) => ["top", "dress"].includes(i.type));
  const bottoms   = allItems.filter((i) => i.type === "bottom");
  const shoes     = allItems.filter((i) => i.type === "shoes");
  const outerwear = allItems.filter((i) => i.type === "outerwear");

  const candidates: GeneratedOutfit[] = [];
  const usedCombos = new Set<string>();

  for (const top of tops) {
    const isDress      = top.type === "dress";
    const bottomMatches = isDress ? [null] : findMatches(top, bottoms);
    const shoeMatches   = findMatches(top, shoes);
    const outerMatches  = [null, ...findMatches(top, outerwear)];

    // Try top 2 bottoms × top 2 shoes × optional outer
    const bottomPool = isDress ? [null] : [bottomMatches[0] || null, bottomMatches[1] || null];
    const shoePool   = [shoeMatches[0] || null, shoeMatches[1] || null];

    for (const bottom of bottomPool) {
      for (const shoe of shoePool) {
        for (const outer of outerMatches.slice(0, 2)) {
          if (!isDress && !bottom && !shoe) continue;

          const comboItems: Item[] = [top];
          if (bottom) comboItems.push(bottom);
          if (shoe)   comboItems.push(shoe);
          if (outer)  comboItems.push(outer);

          const comboKey = comboItems.map((i) => i._id.toString()).sort().join("-");
          if (usedCombos.has(comboKey)) continue;
          usedCombos.add(comboKey);

          const allColors = comboItems.flatMap((i) => i.color);
          const allStyles = comboItems.map((i) => i.style);
          const vibe      = getOutfitVibeLabel(allStyles, allColors);
          const score     = prefs ? scoreOutfitForUser(comboItems, prefs) : 0;

          candidates.push({ items: comboItems, vibe, score });
        }
      }
    }
  }

  // Sort by AI score (personalised) then return top 5
  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
