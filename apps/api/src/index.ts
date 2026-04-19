import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import authRoutes    from "./routes/auth.routes";
import clothingRoutes from "./routes/clothing.routes";
import outfitRoutes  from "./routes/outfit.routes";
import statsRoutes   from "./routes/stats.routes";

dotenv.config();

// Validate required env vars at startup
const REQUIRED = ["MONGODB_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
const missing  = REQUIRED.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error("❌ Missing required environment variables:", missing.join(", "));
  process.exit(1);
}

const app  = express();
const PORT = process.env.PORT || 4000;

// CORS — allow multiple origins
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3000",
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth",     authRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfits",  outfitRoutes);
app.use("/api/stats",    statsRoutes);

app.get("/health", (_, res) => res.json({
  status:  "ok",
  service: "libase-api",
  env:     process.env.NODE_ENV,
}));

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("GLOBAL ERROR:", err?.message || err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

// Connect to MongoDB then start server
const MONGO_URI = process.env.MONGODB_URI!;

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // fail fast if Atlas unreachable
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("   URI used:", MONGO_URI.replace(/:([^@]+)@/, ":****@")); // hide password
    process.exit(1);
  });

export default app;
