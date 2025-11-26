import { Router } from "express";
import { criarComentario, deletarComentario, listarComentarios } from "../controllers/commentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/:postId", authMiddleware, criarComentario);
router.delete("/:id", authMiddleware, deletarComentario);
router.get("/post/:postId", listarComentarios);

export default router;
