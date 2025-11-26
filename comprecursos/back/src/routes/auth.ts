import express from "express";
import passport from "passport";
import { registro, login, logout, getProfile } from "../controllers/authController";

const router = express.Router();

router.post("/registro", registro);
router.post("/login", login);

// rota protegida para logout
router.post("/logout", passport.authenticate("jwt", { session: false }), logout);

// rota protegida para pegar dados do perfil (O /auth/me)
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  getProfile
);

export default router;