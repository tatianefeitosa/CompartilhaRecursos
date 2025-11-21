import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Favorite } from "../entities/Favorite";
import { Post } from "../entities/Post";
import { User } from "../entities/user";

export const adicionarFavorito = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { postId } = req.params;

    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id: Number(postId) } });

    if (!post) return res.status(404).json({ erro: "Post não encontrado!" });

    const favRepo = AppDataSource.getRepository(Favorite);

    const existe = await favRepo.findOne({
      where: { usuario: { id: user.id }, post: { id: post.id } },
    });

    if (existe)
      return res.status(400).json({ erro: "Post já está nos favoritos!" });

    const fav = favRepo.create({ usuario: user, post });

    await favRepo.save(fav);

    return res.json({ mensagem: "Post salvo!" });
  } catch {
    return res.status(500).json({ erro: "Erro ao salvar post." });
  }
};

export const removerFavorito = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { postId } = req.params;

    const favRepo = AppDataSource.getRepository(Favorite);

    const favorito = await favRepo.findOne({
      where: { usuario: { id: user.id }, post: { id: Number(postId) } },
    });

    if (!favorito)
      return res.status(404).json({ erro: "Favorito não encontrado." });

    await favRepo.remove(favorito);

    return res.json({ mensagem: "Favorito removido." });
  } catch {
    return res.status(500).json({ erro: "Erro ao remover favorito." });
  }
};

export const listarFavoritos = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    const favRepo = AppDataSource.getRepository(Favorite);

    const favoritos = await favRepo.find({
      where: { usuario: { id: user.id } },
      relations: ["post", "post.autor"],
    });

    const postsFavoritos = favoritos.map((fav) => fav.post);

    return res.json({ favoritos: postsFavoritos });
  } catch {
    return res.status(500).json({ erro: "Erro ao listar favoritos." });
  }
}; 
