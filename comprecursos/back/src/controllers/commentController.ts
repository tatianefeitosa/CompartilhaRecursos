import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { User } from "../entities/user";

export const criarComentario = async (req: Request, res: Response) => {
  try {
    const { texto } = req.body;
    const { postId } = req.params;
    const user = req.user as User;

    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id: Number(postId) } });

    if (!post) return res.status(404).json({ erro: "Post não encontrado." });

    const commentRepo = AppDataSource.getRepository(Comment);

    const novoComentario = commentRepo.create({
      texto,
      autor: user,
      post,
    });

    await commentRepo.save(novoComentario);

    return res.status(201).json({
      mensagem: "Comentário criado!",
      comentario: novoComentario,
    });
  } catch {
    return res.status(500).json({ erro: "Erro ao comentar." });
  }
};

export const deletarComentario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as User;

    const commentRepo = AppDataSource.getRepository(Comment);
    const comentario = await commentRepo.findOne({
      where: { id: Number(id) },
      relations: ["autor"],
    });

    if (!comentario)
      return res.status(404).json({ erro: "Comentário não encontrado." });

    if (comentario.autor.id !== user.id)
      return res
        .status(403)
        .json({ erro: "Você só pode excluir seus próprios comentários." });

    await commentRepo.remove(comentario);

    return res.json({ mensagem: "Comentário removido." });
  } catch {
    return res.status(500).json({ erro: "Erro ao excluir comentário." });
  }
};

// listar comentarios de um post
export const listarComentarios = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const commentRepo = AppDataSource.getRepository(Comment);
    const comentarios = await commentRepo.find({
      where: { post: { id: Number(postId) } },
      relations: ["autor"],
      order: { criadoEm: "ASC" },
    });

    return res.json(comentarios);
  } catch {
    return res.status(500).json({ erro: "Erro ao listar comentários." });
  }
};
