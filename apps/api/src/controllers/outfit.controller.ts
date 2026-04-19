import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import ClothingItem from "../models/ClothingItem";
import Outfit from "../models/Outfit";
import { generateOutfits } from "../services/outfitGenerator";
import { buildUserPreferences } from "../services/aiRecommender";

export async function generate(req: AuthRequest, res: Response) {
  const [items, savedOutfits] = await Promise.all([
    ClothingItem.find({ userId: req.userId }),
    Outfit.find({ userId: req.userId, saved: true }).populate("items"),
  ]);

  if (items.length < 2)
    return res.status(400).json({ message: "Add at least 2 clothing items to generate outfits" });

  // Build AI preference profile from user behavior
  const prefs     = buildUserPreferences(items as any, savedOutfits as any);
  const generated = generateOutfits(items as any, prefs);

  if (generated.length === 0)
    return res.status(400).json({ message: "Not enough matching items yet. Try adding more variety!" });

  const saved = await Outfit.insertMany(
    generated.map((o) => ({
      userId: req.userId,
      items:  o.items.map((i) => i._id),
      vibe:   o.vibe,
      saved:  false,
    }))
  );

  const populated = await Outfit.find({ _id: { $in: saved.map((s) => s._id) } })
    .populate("items")
    .lean();

  res.json({ outfits: populated, preferences: prefs });
}

export async function getSaved(req: AuthRequest, res: Response) {
  const outfits = await Outfit.find({ userId: req.userId, saved: true })
    .populate("items")
    .sort({ createdAt: -1 })
    .lean();
  res.json({ outfits });
}

export async function saveOutfit(req: AuthRequest, res: Response) {
  const outfit = await Outfit.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { saved: true },
    { new: true }
  ).populate("items");

  if (!outfit) return res.status(404).json({ message: "Outfit not found" });
  res.json({ outfit });
}

export async function deleteOutfit(req: AuthRequest, res: Response) {
  await Outfit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Outfit deleted" });
}
