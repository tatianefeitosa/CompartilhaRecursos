import { Router } from "express";
import { criarComentario, deletarComentario } from "../controllers/commentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/:postId", authMiddleware, criarComentario);
router.delete("/:id", authMiddleware, deletarComentario);

export default router;
