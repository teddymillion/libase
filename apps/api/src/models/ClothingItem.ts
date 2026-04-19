import mongoose, { Schema, Document } from "mongoose";

export interface IClothingItem extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  publicId: string;
  type: "top" | "bottom" | "shoes" | "outerwear" | "accessory" | "dress";
  color: string[];
  style: "casual" | "formal" | "traditional" | "sporty" | "streetwear";
  season: "all" | "summer" | "winter" | "rainy";
  name?: string;
  wornCount: number;
  lastWorn?: Date;
  createdAt: Date;
}

const ClothingItemSchema = new Schema<IClothingItem>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageUrl:  { type: String, required: true },
    publicId:  { type: String, required: true },
    type:      { type: String, required: true, enum: ["top", "bottom", "shoes", "outerwear", "accessory", "dress"] },
    color:     { type: [String], required: true },
    style:     { type: String, required: true, enum: ["casual", "formal", "traditional", "sporty", "streetwear"] },
    season:    { type: String, default: "all", enum: ["all", "summer", "winter", "rainy"] },
    name:      { type: String, trim: true },
    wornCount: { type: Number, default: 0 },
    lastWorn:  { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IClothingItem>("ClothingItem", ClothingItemSchema);
