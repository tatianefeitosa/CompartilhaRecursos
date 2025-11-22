import "reflect-metadata";
import express from "express";
import passport from "./config/passport";
import { initializeDatabase } from "./config/database";
import cors from "cors";

// Importar rotas
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import likeRoutes from "./routes/like.routes";
import favoriteRoutes from "./routes/favorite.routes";
import followRoutes from "./routes/follow.routes";
import reportRoutes from "./routes/report.routes";



const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Rotas
app.use("/uploads", express.static("uploads")); // Servir arquivos estáticos da pasta uploads
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/likes", likeRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/follow", followRoutes);
app.use("/reports", reportRoutes);
app.use("/feed", postRoutes); // Rota para feed de posts



// Rota raiz
app.get("/", (req, res) => {
  res.json({
    mensagem: "API REST - Sistema de Compartilhamento de Recursos com TypeORM",
    versao: "2.0.0",
    endpoints: {
      auth: "/auth (registro, login, logout)",
      posts: "/posts (criar, editar, deletar, listar)",
      comments: "/comments (adicionar, editar, deletar comentários)",
      likes: "/likes (curtir, descurtir posts)",
      favorites: "/favorites (adicionar, remover favoritos)",
      follows: "/follows (seguir, deixar de seguir usuários)",
      reports: "/reports (reportar conteúdo impróprio)",
      feed: "/feed (obter feed de posts dos usuários seguidos)",
      
    },
    roles: {
      estudante: "Compartilha, cria e interage com publicações",
      professor: "Compartilha e cria publicações",
      admin: "Gerencia categorias",
    },
  });
});

// Inicializar banco e servidor
const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Use o arquivo tests/api.http para testar os endpoints`);
  });
};

startServer();
