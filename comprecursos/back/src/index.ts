import "reflect-metadata";
import express from "express";
import passport from "./config/passport";
import { initializeDatabase } from "./config/database";

// Importar rotas
import authRoutes from "./routes/auth";

/*import categoriaRoutes from "./routes/categorias";
import produtoRoutes from "./routes/produtos";
import favoritoRoutes from "./routes/favoritos";*/

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(passport.initialize());

// Rotas
app.use("/auth", authRoutes);
/*
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/favoritos", favoritoRoutes);*/

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    mensagem: "API REST - Sistema de Compartilhamento de Recursos com TypeORM",
    versao: "2.0.0",
    endpoints: {
      auth: "/auth (registro, login, logout)",
      
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
