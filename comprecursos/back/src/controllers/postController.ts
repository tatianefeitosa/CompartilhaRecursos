import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Post } from "../entities/Post";
import { User } from "../entities/user";
import fs from "fs";
import path from "path";

// Criar post
export const criarPost = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    const { texto, links } = req.body;

    const arquivos = req.files
      ? (req.files as Express.Multer.File[]).map((f) => f.filename)
      : [];

    const postRepo = AppDataSource.getRepository(Post);

    const novoPost = postRepo.create({
      texto: texto || null,
      links: links ? JSON.parse(links) : null, // deve vir como array no body
      arquivos,
      autor: user,
    });

    await postRepo.save(novoPost);

    return res.status(201).json({
      mensagem: "Post criado com sucesso",
      post: novoPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao criar post." });
  }
};

// Editar post
export const editarPost = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { id } = req.params;
    const { texto, links, removerArquivos } = req.body;

    const postRepo = AppDataSource.getRepository(Post);

    const post = await postRepo.findOne({
      where: { id: Number(id) },
      relations: ["autor"],
    });

    if (!post) {
      return res.status(404).json({ erro: "Post não encontrado." });
    }

    //  Garantir que só o autor edite
    if (post.autor.id !== user.id) {
      return res.status(403).json({ erro: "Você não pode editar este post." });
    }

    // ----- ATUALIZAR TEXTO -----
    if (texto !== undefined) {
      post.texto = texto;
    }

    // ----- ATUALIZAR LINKS -----
    if (links !== undefined) {
      post.links = links ? JSON.parse(links) : null;
    }

    // ----- REMOVER ARQUIVOS (OPCIONAL) -----
    if (removerArquivos) {
      const listaRemover: string[] = JSON.parse(removerArquivos);

      post.arquivos = post.arquivos?.filter((arq) => {
        if (listaRemover.includes(arq)) {
          // apagar arquivo físico
          const caminho = path.join("uploads", arq);
          if (fs.existsSync(caminho)) fs.unlinkSync(caminho);
          return false;
        }
        return true;
      }) || [];
    }

    // ----- ADICIONAR NOVOS ARQUIVOS DO UPLOAD -----
    const novosArquivos = req.files
      ? (req.files as Express.Multer.File[]).map((f) => f.filename)
      : [];

    if (novosArquivos.length > 0) {
      post.arquivos = [...(post.arquivos || []), ...novosArquivos];
    }

    await postRepo.save(post);

    return res.json({
      mensagem: "Post atualizado com sucesso",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao atualizar post." });
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
