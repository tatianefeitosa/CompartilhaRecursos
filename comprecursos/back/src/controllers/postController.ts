import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Post } from "../entities/Post";
import { User } from "../entities/user";

// Criar post
export const criarPost = async (req: Request, res: Response) => {
  try {
    const { conteudo } = req.body;

    const postRepo = AppDataSource.getRepository(Post);
    const user = req.user as User;

    if (!conteudo) {
      return res.status(400).json({ erro: "Conteúdo é obrigatório." });
    }

    const novoPost = postRepo.create({
      conteudo,
      autor: user,
    });

    await postRepo.save(novoPost);

    return res.status(201).json({ mensagem: "Post criado!", post: novoPost });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao criar post." });
  }
};

// Editar post
export const editarPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { conteudo } = req.body;

    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({
      where: { id: Number(id) },
      relations: ["autor"],
    });

    if (!post) return res.status(404).json({ erro: "Post não encontrado." });

    const user = req.user as User;

    if (post.autor.id !== user.id) {
      return res.status(403).json({ erro: "Você só pode editar seus posts." });
    }

    post.conteudo = conteudo ?? post.conteudo;

    await postRepo.save(post);

    return res.json({ mensagem: "Post atualizado!", post });
  } catch {
    return res.status(500).json({ erro: "Erro ao editar post." });
  }
};

// Deletar post
export const deletarPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({
      where: { id: Number(id) },
      relations: ["autor"],
    });

    if (!post) return res.status(404).json({ erro: "Post não encontrado." });

    const user = req.user as User;

    if (post.autor.id !== user.id) {
      return res.status(403).json({ erro: "Você só pode excluir seus posts." });
    }

    await postRepo.remove(post);

    return res.json({ mensagem: "Post removido!" });
  } catch {
    return res.status(500).json({ erro: "Erro ao excluir post." });
  }
};
