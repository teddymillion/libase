import mongoose, { Schema, Document } from "mongoose";

export interface IOutfit extends Document {
  userId:    mongoose.Types.ObjectId;
  items:     mongoose.Types.ObjectId[];
  vibe:      string;
  saved:     boolean;
  wornOn?:   Date;
  createdAt: Date;
}

const OutfitSchema = new Schema<IOutfit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User",         required: true, index: true },
    items:  [{ type: Schema.Types.ObjectId, ref: "ClothingItem", required: true }],
    vibe:   { type: String, required: true },
    saved:  { type: Boolean, default: false },
    wornOn: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IOutfit>("Outfit", OutfitSchema);
