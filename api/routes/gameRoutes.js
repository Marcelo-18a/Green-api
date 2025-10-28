import express from "express";
const gameRoutes = express.Router();
import gameController from "../controllers/gameController.js";
// Importando o middleware de autenticação
import Auth from '../middleware/Auth.js'

// Endpoint para listar todos os games (rota)
gameRoutes.get("/games", gameController.getAllGames);

// Endpoint para cadastrar um jogo
gameRoutes.post("/games", gameController.createGame);

// Endpoint para excluir um jogo
gameRoutes.delete("/games/:id", gameController.deleteGame);

// Endpoint para alterar um jogo
gameRoutes.put("/games/:id", gameController.updateGame)

// Endpoint para listar um único jogo
gameRoutes.get("/games/:id", gameController.getOneGame)

export default gameRoutes;
