import { Router } from "express";
import { adicionarFavorito, removerFavorito, listarFavoritos} from "../controllers/favoriteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/:postId", authMiddleware, adicionarFavorito);
router.delete("/:postId", authMiddleware, removerFavorito);
router.get("/", authMiddleware, listarFavoritos);

export default router;
