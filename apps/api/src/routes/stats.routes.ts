import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getStats, markWorn } from "../controllers/stats.controller";

const router = Router();

router.use(requireAuth);

router.get("/",              getStats);
router.patch("/worn/:id",    markWorn);

export default router;
