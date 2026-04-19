import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth";
import { upload } from "../services/cloudinary";
import { uploadItem, getItems, deleteItem } from "../controllers/clothing.controller";

const router = Router();

router.use(requireAuth);

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("MULTER ERROR:", err);
      return res.status(400).json({ message: err.message || "File upload error" });
    }
    next();
  });
}, uploadItem);

router.get("/",       getItems);
router.delete("/:id", deleteItem);

export default router;
