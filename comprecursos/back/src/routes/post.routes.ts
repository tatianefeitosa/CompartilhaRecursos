import { Router } from "express";
import { criarPost, deletarPost, editarPost } from "../controllers/postController";
import { obterFeed } from "../controllers/feedController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Criar post
router.post("/", authMiddleware, criarPost);

// Deletar post
router.delete("/:id", authMiddleware, deletarPost);

/*Listar posts do usuário
router.get("/usuario/:userId", authMiddleware, listarPostsPorUsuario);*/

// Feed
router.get("/feed", authMiddleware, obterFeed);

export default router;
