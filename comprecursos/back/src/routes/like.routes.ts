import { Router } from "express";
import { darLike, removerLike, listarLikesDoPost } from "../controllers/likeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/:postId", authMiddleware, darLike);
router.delete("/:postId", authMiddleware, removerLike);
router.get("/:postId", listarLikesDoPost);

export default router;
