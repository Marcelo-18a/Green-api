import express from "express"

import {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  updateAnalysis,
  deleteAnalysis,
  getAnalysesByImage,
  getAnalysesBySeverity,
  getAnalysesByProbability,
} from "../controllers/analyses.js"

import auth from "../middleware/Auth.js"
import roleCheck from "../middleware/roleCheck.js"

const router = express.Router()

// Routes
router.post("/", auth, createAnalysis)
router.get("/", auth, getAnalyses)
router.get("/image/:imageId", auth, getAnalysesByImage)
router.get("/severity/:severity", auth, getAnalysesBySeverity)
router.get("/probability", auth, getAnalysesByProbability)
router.get("/:id", auth, getAnalysisById)
router.patch("/:id", auth, updateAnalysis)
router.delete("/:id", auth, roleCheck(["admin", "researcher"]), deleteAnalysis)

export default router
