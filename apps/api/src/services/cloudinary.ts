import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { extractClothing } from "./clothingExtractor";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Memory storage — we process with sharp before uploading ───────────────
const memoryStorage = multer.memoryStorage();

export const upload = multer({
  storage: memoryStorage,
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10MB raw input
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPG, PNG and WEBP images are allowed"));
  },
});

// ─── Compress image with sharp before uploading ────────────────────────────
// Reduces file size by 60-80% — critical for low-bandwidth users in Ethiopia
export async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })   // WebP = 30% smaller than JPEG at same quality
    .toBuffer();
}

// ─── Upload to Cloudinary with full processing pipeline ───────────────────
export interface UploadResult {
  imageUrl:   string;   // full quality URL
  thumbUrl:   string;   // 200px thumbnail
  cardUrl:    string;   // 400px card
  publicId:   string;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  folder = "libase/clothing"
): Promise<UploadResult> {
  // Step 1 — Extract clothing (remove person + background)
  const extracted = await extractClothing(buffer);

  // Step 2 — Compress to WebP
  const compressed = await compressImage(extracted);

  // Upload as base64 stream
  const b64 = `data:image/webp;base64,${compressed.toString("base64")}`;

  const result = await cloudinary.uploader.upload(b64, {
    folder,
    resource_type: "image",
    transformation: [
      { quality: "auto:best" },
      { fetch_format: "auto" },
      { effect: "improve:outdoor:50" },
      { effect: "sharpen:60" },
    ],
    // background_removal handled by Remove.bg before this step
  });

  const base = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const id   = result.public_id;

  return {
    imageUrl: result.secure_url,
    // Thumbnail — 200×200, WebP, auto quality (for closet grid)
    thumbUrl: `${base}/w_200,h_200,c_fill,f_webp,q_auto:eco/${id}`,
    // Card — 400×400, WebP (for outfit cards)
    cardUrl:  `${base}/w_400,h_400,c_fill,f_webp,q_auto:good/${id}`,
    publicId: result.public_id,
  };
}

// ─── Local fallback (when Cloudinary not configured) ──────────────────────
export async function uploadLocal(
  buffer: Buffer,
  originalName: string
): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const compressed = await compressImage(buffer);
  const filename   = `${Date.now()}-${path.parse(originalName).name}.webp`;
  const filepath   = path.join(uploadDir, filename);

  fs.writeFileSync(filepath, compressed);

  const url = `http://localhost:${process.env.PORT || 4000}/uploads/${filename}`;
  return { imageUrl: url, thumbUrl: url, cardUrl: url, publicId: filename };
}

export { cloudinary };
