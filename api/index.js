import express from "express";
import mongoose from "mongoose";
import Games from "./models/LeafSample.js";
import User from "./models/Users.js";
// Importando o CORS
import cors from "cors";

const app = express();

// Importando as rotas (endpoints) de Games
import gameRoutes from "./routes/leafRoutes.js";
// Importando as rotas (endpoints) de Usuários
import userRoutes from "./routes/userRoutes.js";

// Configurações do Express
// Permitir payloads maiores (ex.: imagens em base64) — ajuste conforme necessário
// Aumenta limite para aceitar payloads maiores (ex.: imagens em base64)
app.use(
  express.urlencoded({
    extended: false,
    limit: "50mb",
  })
);
app.use(
  express.json({
    limit: "50mb",
  })
);

// Configurando o CORS
app.use(cors()); // Aberto

app.use("/", gameRoutes);
app.use("/", userRoutes);

// Iniciando a conexão com o banco de dados do MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/BD_green");

// Iniciando o servidor
const port = 4000;
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`API rodando em http://localhost:${port}.`);
  }
});
