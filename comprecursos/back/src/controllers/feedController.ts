// Posts de quem o usuário segue
// Posts recentes
//Ordenados por data

import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { In } from "typeorm";
import { Post } from "../entities/Post";
import { Follow } from "../entities/Follow";
import { User } from "../entities/user";

export const obterFeed = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    const followRepo = AppDataSource.getRepository(Follow);
    const seguidos = await followRepo.find({
      where: { seguidor: { id: user.id } },
      relations: ["seguido"],
    });

    const idsSeguidos = seguidos.map((f) => f.seguido.id);

    const postRepo = AppDataSource.getRepository(Post);

    const feed = await postRepo.find({
      where: [{ autor: { id: user.id } }, { autor: { id: In(idsSeguidos) } }],
      relations: ["autor", "comentarios", "likes"],
      order: { criadoEm: "DESC" },
    });

    return res.json(feed);
  } catch {
    return res.status(500).json({ erro: "Erro ao carregar feed." });
  }
};
