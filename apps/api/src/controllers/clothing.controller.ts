import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import ClothingItem from "../models/ClothingItem";
import { cloudinary, uploadToCloudinary, uploadLocal } from "../services/cloudinary";
import { z } from "zod";

const itemSchema = z.object({
  type:   z.enum(["top", "bottom", "shoes", "outerwear", "accessory", "dress"]),
  color:  z.string().min(1),
  style:  z.enum(["casual", "formal", "traditional", "sporty", "streetwear"]),
  season: z.enum(["all", "summer", "winter", "rainy"]).optional(),
  name:   z.string().optional(),
});

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

export async function uploadItem(req: AuthRequest, res: Response) {
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });

  const result = itemSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ message: result.error.errors[0].message });

  const { type, color, style, season, name } = result.data;

  try {
    // ── Process & upload image ─────────────────────────────────────────────
    const uploaded = useCloudinary
      ? await uploadToCloudinary(req.file.buffer, "libase/clothing")
      : await uploadLocal(req.file.buffer, req.file.originalname);

    const item = await ClothingItem.create({
      userId:   req.userId,
      imageUrl: uploaded.imageUrl,
      thumbUrl: uploaded.thumbUrl,
      cardUrl:  uploaded.cardUrl,
      publicId: uploaded.publicId,
      type,
      color:  color.split(",").map((c: string) => c.trim()),
      style,
      season: season || "all",
      name,
    });

    res.status(201).json({ item });
  } catch (err: any) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Image processing failed: " + err.message });
  }
}

export async function getItems(req: AuthRequest, res: Response) {
  const { type, style } = req.query;
  const filter: any = { userId: req.userId };
  if (type)  filter.type  = type;
  if (style) filter.style = style;

  const items = await ClothingItem.find(filter).sort({ createdAt: -1 });
  res.json({ items });
}

export async function deleteItem(req: AuthRequest, res: Response) {
  const item = await ClothingItem.findOne({ _id: req.params.id, userId: req.userId });
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (item.imageUrl.includes("cloudinary.com")) {
    await cloudinary.uploader.destroy(item.publicId);
  }

  await item.deleteOne();
  res.json({ message: "Item deleted" });
}
