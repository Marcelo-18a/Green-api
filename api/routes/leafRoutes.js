import express from "express";
const leafRoutes = express.Router();
import leafController from "../controllers/leafController.js";
import authMiddleware from "../middleware/Auth.js";

// Endpoint para listar todas as amostras (do usuário logado)
leafRoutes.get(
  "/leafsamples",
  authMiddleware.Authorization,
  leafController.getAllSamples
);

// Endpoint para cadastrar uma amostra
leafRoutes.post(
  "/leafsamples",
  authMiddleware.Authorization,
  leafController.createSample
);

// Endpoint para excluir uma amostra (apenas do usuário logado)
leafRoutes.delete(
  "/leafsamples/:id",
  authMiddleware.Authorization,
  leafController.deleteSample
);

// Endpoint para atualizar uma amostra (apenas do usuário logado)
leafRoutes.put(
  "/leafsamples/:id",
  authMiddleware.Authorization,
  leafController.updateSample
);

// Endpoint para listar uma amostra específica (apenas do usuário logado)
leafRoutes.get(
  "/leafsamples/:id",
  authMiddleware.Authorization,
  leafController.getOneSample
);

export default leafRoutes;
