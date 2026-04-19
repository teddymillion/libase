import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import ClothingItem from "../models/ClothingItem";
import { cloudinary } from "../services/cloudinary";
import { z } from "zod";

const itemSchema = z.object({
  type:   z.enum(["top", "bottom", "shoes", "outerwear", "accessory", "dress"]),
  color:  z.string().min(1),
  style:  z.enum(["casual", "formal", "traditional", "sporty", "streetwear"]),
  season: z.enum(["all", "summer", "winter", "rainy"]).optional(),
  name:   z.string().optional(),
});

export async function uploadItem(req: AuthRequest, res: Response) {
  console.log("UPLOAD HIT — file:", req.file, "body:", req.body);
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });

  const result = itemSchema.safeParse(req.body);
  if (!result.success) {
    console.log("VALIDATION FAIL:", result.error.errors);
    return res.status(400).json({ message: result.error.errors[0].message });
  }

  const { type, color, style, season, name } = result.data;
  const file = req.file as any;

  // Works for both Cloudinary (file.path + file.filename) and local (file.path + file.filename)
  const imageUrl = file.path?.startsWith("http")
    ? file.path
    : `${process.env.CLIENT_URL?.replace("3000", "4000") || "http://localhost:4000"}/uploads/${file.filename}`;

  const publicId = file.filename || file.public_id || file.path;

  const item = await ClothingItem.create({
    userId: req.userId,
    imageUrl,
    publicId,
    type,
    color:  color.split(",").map((c: string) => c.trim()),
    style,
    season: season || "all",
    name,
  });

  res.status(201).json({ item });
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

  // Only destroy from Cloudinary if it's a Cloudinary URL
  if (item.imageUrl.includes("cloudinary.com")) {
    await cloudinary.uploader.destroy(item.publicId);
  }

  await item.deleteOne();
  res.json({ message: "Item deleted" });
}
