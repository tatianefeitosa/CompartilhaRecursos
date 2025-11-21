import express from "express";
import passport from "passport";
import { registro, login, logout } from "../controllers/authController";

const router = express.Router();

router.post("/registro", registro);
router.post("/login", login);
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  logout
);

export default router;
