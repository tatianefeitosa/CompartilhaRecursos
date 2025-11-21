import { Router } from "express";
import { seguirUsuario, deixarDeSeguir } from "../controllers/followController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/:userId", authMiddleware, seguirUsuario);
router.delete("/:userId", authMiddleware, deixarDeSeguir);

/*router.get("/:userId/seguidores", authMiddleware, listarSeguidores);
router.get("/:userId/seguindo", authMiddleware, listarSeguindo);*/

export default router;
