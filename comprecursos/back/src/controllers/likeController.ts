import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Like } from "../entities/Like";
import { Post } from "../entities/Post";
import { User } from "../entities/user";


export const darLike = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { postId } = req.params;

    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id: Number(postId) } });

    if (!post) return res.status(404).json({ erro: "Post não encontrado." });

    const likeRepo = AppDataSource.getRepository(Like);

    const existe = await likeRepo.findOne({
      where: { usuario: { id: user.id }, post: { id: post.id } },
    });

    if (existe) {
      return res.status(400).json({ erro: "Você já curtiu este post." });
    }

    const like = likeRepo.create({ usuario: user, post });
    await likeRepo.save(like);

    return res.status(201).json({ mensagem: "Post curtido.", likeId: like.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao curtir o post." });
  }
};


export const removerLike = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { postId } = req.params;

    const likeRepo = AppDataSource.getRepository(Like);

    const like = await likeRepo.findOne({
      where: { usuario: { id: user.id }, post: { id: Number(postId) } },
      relations: ["post", "usuario"],
    });

    if (!like) {
      return res.status(404).json({ erro: "Like não encontrado." });
    }

    await likeRepo.remove(like);

    return res.json({ mensagem: "Like removido." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao remover like." });
  }
};


export const listarLikesDoPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const likeRepo = AppDataSource.getRepository(Like);

    const likes = await likeRepo.find({
      where: { post: { id: Number(postId) } },
      relations: ["usuario"],
    });

    return res.json({ total: likes.length, likes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao listar likes." });
  }
};
