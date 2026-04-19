import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import authRoutes from "./routes/auth.routes";
import clothingRoutes from "./routes/clothing.routes";
import outfitRoutes from "./routes/outfit.routes";
import statsRoutes  from "./routes/stats.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfits",  outfitRoutes);
app.use("/api/stats",    statsRoutes);
app.get("/health", (_, res) => res.json({ status: "ok", service: "libase-api" }));

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });

export default app;
