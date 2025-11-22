import { Router } from "express";
import passport from "passport";
import { criarPost, editarPost, deletarPost, listarPosts } from "../controllers/postController";
import { upload } from "../config/multer";

const router = Router();

// protege todas as rotas com JWT
router.use(passport.authenticate("jwt", { session: false }));

// rota GET (Listar)
router.get("/", listarPosts);

// rotas existentes
router.post("/", upload.array("arquivos"), criarPost);
router.put("/:id", upload.array("arquivos"), editarPost);
router.delete("/:id", deletarPost);

export default router;