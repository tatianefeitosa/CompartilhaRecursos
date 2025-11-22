import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { obterFeed } from "../controllers/feedController";

const router = Router();

// GET /feed – apenas posts de quem o usuário segue
router.get("/", authMiddleware, obterFeed);

export default router;
