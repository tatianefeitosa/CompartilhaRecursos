import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { criarPost, editarPost, deletarPost, listarPosts, listarMeusPosts } from "../controllers/postController";
import { upload } from "../config/multer"; 

const router = Router();

router.use(authMiddleware);


// Rota GET (Listar)
router.get("/", listarPosts);
router.get("/meus-posts", listarMeusPosts);

// Rotas existentes
router.post("/", upload.array("arquivos"), criarPost);
router.put("/:id", upload.array("arquivos"), editarPost);
router.delete("/:id", deletarPost);

export default router;