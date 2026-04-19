import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { generate, getSaved, saveOutfit, deleteOutfit } from "../controllers/outfit.controller";

const router = Router();

router.use(requireAuth);

router.post("/generate", generate);
router.get("/saved",     getSaved);
router.patch("/:id/save", saveOutfit);
router.delete("/:id",    deleteOutfit);

export default router;
