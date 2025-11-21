import { Router } from "express";
import { criarPost, deletarPost, editarPost } from "../controllers/postController";
import { obterFeed } from "../controllers/feedController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = Router();

// múltiplos arquivos
router.post(
  "/",
  authMiddleware,
  upload.array("arquivos", 5),
  criarPost
);

// Deletar post
router.delete("/:id", authMiddleware, deletarPost);

// Editar post
router.put(
  "/:id",
  authMiddleware,
  upload.array("arquivos", 5),
  editarPost
);

/*Listar posts do usuário
router.get("/usuario/:userId", authMiddleware, listarPostsPorUsuario);*/

// Feed
router.get("/feed", authMiddleware, obterFeed);

export default router;
