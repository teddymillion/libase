import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import ClothingItem from "../models/ClothingItem";
import Outfit from "../models/Outfit";
import { calculateDripScore, getDripLabel, getDailyTip } from "../services/dripScore";
import { generateOutfits } from "../services/outfitGenerator";

export async function getStats(req: AuthRequest, res: Response) {
  const [items, savedOutfits] = await Promise.all([
    ClothingItem.find({ userId: req.userId }),
    Outfit.find({ userId: req.userId, saved: true }),
  ]);

  const score      = calculateDripScore(items as any, savedOutfits as any);
  const dripLabel  = getDripLabel(score);
  const tip        = getDailyTip(items as any);

  // Recently worn — last 5 items with lastWorn set
  const recentlyWorn = [...items]
    .filter((i) => i.lastWorn)
    .sort((a, b) => new Date(b.lastWorn!).getTime() - new Date(a.lastWorn!).getTime())
    .slice(0, 5);

  // Daily outfit suggestion — generate 1 fresh outfit
  let dailySuggestion = null;
  if (items.length >= 2) {
    const generated = generateOutfits(items as any);
    if (generated.length > 0) {
      const pick = generated[0];
      dailySuggestion = {
        items: pick.items,
        vibe:  pick.vibe,
      };
    }
  }

  res.json({
    dripScore:      score,
    dripLabel,
    tip,
    totalItems:     items.length,
    savedOutfits:   savedOutfits.length,
    recentlyWorn,
    dailySuggestion,
  });
}

export async function markWorn(req: AuthRequest, res: Response) {
  const item = await ClothingItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $inc: { wornCount: 1 }, lastWorn: new Date() },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json({ item });
}
