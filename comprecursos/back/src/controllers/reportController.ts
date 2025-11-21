import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Report } from "../entities/Report";
import { Post } from "../entities/Post";
import { User } from "../entities/user";

export const denunciarPost = async (req: Request, res: Response) => {
  try {
    const { motivo } = req.body;
    const { postId } = req.params;
    const user = req.user as User;

    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id: Number(postId) } });

    if (!post) return res.status(404).json({ erro: "Post não encontrado." });

    const reportRepo = AppDataSource.getRepository(Report);

    const report = reportRepo.create({
      motivo,
      denunciante: user,
      post,
    });

    await reportRepo.save(report);

    return res.json({ mensagem: "Post denunciado!", report });
  } catch {
    return res.status(500).json({ erro: "Erro ao denunciar post." });
  }
};
