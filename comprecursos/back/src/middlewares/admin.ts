import { Request, Response, NextFunction } from "express";
import { User, UserRole } from "../entities/user";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User | undefined;

  if (!user) {
    return res.status(401).json({ erro: "Usuário não autenticado." });
  }

  if (user.role !== UserRole.ADMINISTRADOR) {
    return res.status(403).json({ erro: "Acesso permitido apenas para administradores." });
  }

  next();
};
