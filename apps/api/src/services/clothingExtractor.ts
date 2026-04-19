import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";

/*
  Clothing extraction pipeline:

  1. Send image to Remove.bg → returns PNG with transparent background
     (removes person's skin, hair, background — keeps only clothing)
  2. Enhance the extracted clothing image with sharp:
     - Trim transparent edges
     - Add soft white background (looks clean in the closet grid)
     - Sharpen details
  3. Return processed buffer ready for Cloudinary upload

  Falls back gracefully if Remove.bg API key is not set or call fails.
*/

export async function extractClothing(imageBuffer: Buffer): Promise<Buffer> {
  const apiKey = process.env.REMOVEBG_API_KEY;

  if (!apiKey) {
    console.log("ℹ️  REMOVEBG_API_KEY not set — skipping clothing extraction");
    return imageBuffer;
  }

  try {
    const form = new FormData();
    form.append("image_file", imageBuffer, {
      filename:    "upload.jpg",
      contentType: "image/jpeg",
    });
    form.append("size",            "auto");
    form.append("type",            "product");   // "product" mode = keeps clothing, removes person
    form.append("type_level",      "2");          // aggressive extraction
    form.append("format",          "png");        // PNG to preserve transparency
    form.append("crop",            "true");       // auto-crop to clothing bounds
    form.append("crop_margin",     "10px");       // small padding around clothing

    const response = await axios.post("https://api.remove.bg/v1.0/removebg", form, {
      headers:      { ...form.getHeaders(), "X-Api-Key": apiKey },
      responseType: "arraybuffer",
      timeout:      30000, // 30s timeout
    });

    const removedBgBuffer = Buffer.from(response.data);

    // Post-process with sharp:
    // 1. Trim excess transparent space
    // 2. Add clean white background
    // 3. Resize to standard 800×800
    // 4. Sharpen clothing details
    const processed = await sharp(removedBgBuffer)
      .trim({ threshold: 10 })                   // remove transparent edges
      .flatten({ background: { r: 255, g: 255, b: 255 } }) // white bg
      .resize(800, 800, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
      .sharpen({ sigma: 1.2 })
      .webp({ quality: 85 })
      .toBuffer();

    console.log("✅ Clothing extracted successfully");
    return processed;

  } catch (err: any) {
    // Log but don't crash — fall back to original image
    const status = err.response?.status;
    if (status === 402) {
      console.warn("⚠️  Remove.bg free quota exceeded — using original image");
    } else if (status === 403) {
      console.warn("⚠️  Remove.bg API key invalid — using original image");
    } else {
      console.warn("⚠️  Clothing extraction failed:", err.message, "— using original image");
    }
    return imageBuffer;
  }
}
