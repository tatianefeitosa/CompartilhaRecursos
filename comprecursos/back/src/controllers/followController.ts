import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Follow } from "../entities/Follow";
import { User } from "../entities/user";

export const seguirUsuario = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { userId } = req.params;

    if (Number(userId) === user.id)
      return res.status(400).json({ erro: "Você não pode seguir você mesmo." });

    const userRepo = AppDataSource.getRepository(User);
    const alvo = await userRepo.findOne({ where: { id: Number(userId) } });

    if (!alvo) return res.status(404).json({ erro: "Usuário não encontrado." });

    const followRepo = AppDataSource.getRepository(Follow);

    const existe = await followRepo.findOne({
      where: { seguidor: { id: user.id }, seguido: { id: alvo.id } },
    });

    if (existe)
      return res.status(400).json({ erro: "Você já segue este usuário." });

    const follow = followRepo.create({
      seguidor: user,
      seguido: alvo,
    });

    await followRepo.save(follow);

    return res.json({ mensagem: "Agora você segue o usuário." });
  } catch {
    return res.status(500).json({ erro: "Erro ao seguir usuário." });
  }
};

export const deixarDeSeguir = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { userId } = req.params;

    const followRepo = AppDataSource.getRepository(Follow);

    const relacao = await followRepo.findOne({
      where: { seguidor: { id: user.id }, seguido: { id: Number(userId) } },
    });

    if (!relacao)
      return res.status(404).json({ erro: "Você não segue este usuário." });

    await followRepo.remove(relacao);

    return res.json({ mensagem: "Você deixou de seguir o usuário." });
  } catch {
    return res.status(500).json({ erro: "Erro ao deixar de seguir." });
  }
};
