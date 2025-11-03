import express from "express";
const leafRoutes = express.Router();
import leafController from "../controllers/leafController.js";

// Endpoint para listar todas as amostras
leafRoutes.get("/leafsamples", leafController.getAllSamples);

// Endpoint para cadastrar uma amostra
leafRoutes.post("/leafsamples", leafController.createSample);

// Endpoint para excluir uma amostra
leafRoutes.delete("/leafsamples/:id", leafController.deleteSample);

// Endpoint para atualizar uma amostra
leafRoutes.put("/leafsamples/:id", leafController.updateSample);

// Endpoint para listar uma amostra específica
leafRoutes.get("/leafsamples/:id", leafController.getOneSample);

export default leafRoutes;
