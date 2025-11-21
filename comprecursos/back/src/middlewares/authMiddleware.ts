import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/user";

const SECRET_KEY = process.env.JWT_SECRET || "sua-chave-secreta-super-segura";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ erro: "Token não fornecido." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ erro: "Token inválido." });
    }

    // Decodifica o token
    const decoded: any = jwt.verify(token, SECRET_KEY);

    // Obtém o id do usuário contido no token
    const userRepository = AppDataSource.getRepository(User);
    const usuario = await userRepository.findOne({
      where: { id: decoded.id },
    });

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado." });
    }

    // Define req.user com tipagem correta
    req.user = usuario;

    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
};
