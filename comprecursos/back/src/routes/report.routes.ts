import { Router } from "express";
import { denunciarPost } from "../controllers/reportController";
import { authorize } from "../middlewares/authorize";
import { adminMiddleware } from "../middlewares/admin";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Denunciar
router.post("/:postId", authMiddleware, denunciarPost);

/* Listar denúncias (somente admin)
router.get("/", authorize, adminMiddleware, listarDenuncias);
*/

export default router;
