import { Request, Response, NextFunction } from "express";

import { User, UserRole } from "../entities/user";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    if (!user) {
      return res.status(401).json({ erro: "Não autenticado" });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        erro: "Acesso negado. Você não tem permissão para esta ação.",
      });
    }
    next();
  };
};
