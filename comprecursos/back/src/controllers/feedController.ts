// Posts de quem o usuário segue
// Posts recentes
//Ordenados por data

import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Post } from "../entities/Post";
import { Follow } from "../entities/Follow";
import { User } from "../entities/user";

export const obterFeed = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    if (!user) return res.status(401).json({ erro: "Não autorizado." });

    const followRepo = AppDataSource.getRepository(Follow);

    const seguidos = await followRepo.find({
      where: { seguidor: { id: user.id } },
      relations: ["seguido"],
    });

    const idsSeguidos = seguidos
      .map((f) => f.seguido?.id)
      .filter((id): id is number => typeof id === "number");

    // não incluir posts do próprio usuário no feed
    const ids = idsSeguidos;

    if (ids.length === 0) return res.json([]);

    const postRepo = AppDataSource.getRepository(Post);

    const feed = await postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.autor", "autor")
      .leftJoinAndSelect("post.comentarios", "comentarios")
      .leftJoinAndSelect("post.likes", "likes")
      .where("autor.id IN (:...ids)", { ids })
      .orderBy("post.criadoEm", "DESC")
      .getMany();

    return res.json(feed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao carregar feed." });
  }
};
