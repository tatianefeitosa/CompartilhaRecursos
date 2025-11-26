import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/user";
import { TokenBlacklist } from "../entities/TokenBlacklist";
import { registroSchema, loginSchema } from "../validators/userSchema";

const SECRET_KEY = process.env.JWT_SECRET || "sua-chave-secreta-super-segura";

// --------------------- REGISTRO ---------------------
export const registro = async (req: Request, res: Response) => {
  try {
    const dadosValidados = registroSchema.parse(req.body);

    const userRepository = AppDataSource.getRepository(User);

    const usuarioExistente = await userRepository.findOne({
      where: { email: dadosValidados.email },
    });

    if (usuarioExistente) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(dadosValidados.senha, 10);

    const role: UserRole = dadosValidados.role
      ? (dadosValidados.role as UserRole) // validar input antes de criar
      : UserRole.ESTUDANTE;

    const novoUsuario = userRepository.create({
      nome: dadosValidados.nome,
      email: dadosValidados.email,
      senha: hashedPassword,
      role,
    });

    await userRepository.save(novoUsuario);

    return res.status(201).json({
      mensagem: "Usuário registrado com sucesso",
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        role: novoUsuario.role,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError")
      return res.status(400).json({ erro: error.errors });

    return res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
};

// --------------------- LOGIN ---------------------
export const login = async (req: Request, res: Response) => {
  try {
    const dadosValidados = loginSchema.parse(req.body);

    const userRepository = AppDataSource.getRepository(User);

    const usuario = await userRepository.findOne({
      where: { email: dadosValidados.email },
    });

    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(
      dadosValidados.senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    // Criar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError")
      return res.status(400).json({ erro: error.errors });

    return res.status(500).json({ erro: "Erro ao fazer login" });
  }
};

// --------------------- LOGOUT ---------------------
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ erro: "Token não fornecido" });
    }

    const decoded: any = jwt.decode(token);

    if (!decoded?.exp) {
      return res.status(400).json({ erro: "Token inválido" });
    }

    const expiracao = new Date(decoded.exp * 1000);

    const blacklistRepository = AppDataSource.getRepository(TokenBlacklist);
    await blacklistRepository.save({ token, expiracao });

    return res.json({ mensagem: "Logout realizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao fazer logout" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // O passport já coloca o usuário dentro de req.user
    const user = req.user as User; 
    
    return res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar perfil." });
  }
};