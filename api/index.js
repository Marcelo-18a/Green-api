import express from "express";
import mongoose from "mongoose";
import Analysis from "./models/Analysis.js";
import Heatmap from "./models/Heatmap.js";
import Image from "./models/Image.js";
// Importando o CORS
import cors from "cors"

const app = express();

// Importando as rotas (endpoints) de Games
import analysisRoutes from './routes/analyses.js'
import heatmapRoutes from './routes/heatmaps.js'
import imageRoutes from "./routes/images.js"
import userRoutes from "./routes/users.js"
// Importando as rotas (endpoints) de Usuários
import userRoutes from './routes/userRoutes.js'

// Configurações do Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurando o CORS
app.use(cors()) // Aberto

app.use('/', analysisRoutes )
app.use('/', heatmapRoutes)
app.use('/', imageRoutes)
app.use('/', userRoutes)

// Iniciando a conexão com o banco de dados do MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/GreenLeafDB")

// Iniciando o servidor
const port = 4000;
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`API rodando em http://localhost:${port}.`);
  }
});
