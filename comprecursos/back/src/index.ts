import fs from "fs";
import "reflect-metadata";
import express from "express";
import passport from "./config/passport";
import { initializeDatabase } from "./config/database";
import cors from "cors";

// importar rotas
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import likeRoutes from "./routes/like.routes";
import favoriteRoutes from "./routes/favorite.routes";
import followRoutes from "./routes/follow.routes";
import reportRoutes from "./routes/report.routes";
import feedRoutes from "./routes/feed.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
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
app.use("/feed", feedRoutes);

// debug temporário — remova depois
console.log("feedRoutes export:", feedRoutes);
console.log("feedRoutes typeof:", typeof feedRoutes);
console.log(
  "feedRoutes.stack length:",
  (feedRoutes as any).stack?.length ?? "=== no stack ==="
);
console.log(
  "feedRoutes.routes:",
  (feedRoutes as any).stack
    ?.filter((l: any) => l.route)
    .map((l: any) => ({
      path: l.route.path,
      methods: Object.keys(l.route.methods),
    })) ?? []
);

// rota de teste direta para confirmar montagem do prefixo /feed
app.get("/feed/ping", (_req, res) => res.json({ ok: true }));

// DEBUG temporário: verificar objetos importados e rotas registradas
console.log("feedRoutes definido?", !!feedRoutes);
console.log("Tipo de feedRoutes:", typeof feedRoutes);
// @ts-ignore
console.log(
  "app._router presente após registrar rotas?",
  !!app._router,
  "stack length:",
  app._router?.stack?.length
);

// rota de depuração que lista rotas registradas
app.get("/__routes_debug", (req, res) => {
  // @ts-ignore
  const routes = app._router?.stack
    .filter((r: any) => r.route)
    .map((r: any) => ({
      methods: Object.keys(r.route.methods),
      path: r.route.path,
    }));
  res.json({ routes });
});

// rota raiz
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
      follow: "/follow (seguir, deixar de seguir usuários)",
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

const startServer = async () => {
  await initializeDatabase();

  // --- VERIFICAÇÃO DE SEGURANÇA ---
  // cria a pasta uploads se ela não existir
  if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
  }
  // --------------------------------

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    // debug: listar rotas registradas
    // @ts-ignore
    const routes = app._router?.stack
      .filter((r: any) => r.route)
      .map(
        (r: any) =>
          Object.keys(r.route.methods)[0].toUpperCase() + " " + r.route.path
      );
    console.log("Rotas:", routes);
    console.log(`Use o arquivo tests/api.http para testar os endpoints`);
  });
};

// só inicia o servidor se este arquivo for executado diretamente (node index.ts)
// se for importado pelos testes (jest), não inicia automaticamente
if (require.main === module) {
  startServer();
}

// exporta o app para ser usado nos testes de integração
export { app };
