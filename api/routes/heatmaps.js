import express from "express"
import {
  createHeatmap,
  getHeatmaps,
  getHeatmapById,
  updateHeatmap,
  deleteHeatmap,
  addDataPoint,
  removeDataPoint,
  generateHeatmap,
} from "../controllers/heatmaps.js"
import auth from "../middleware/Auth.js"
import roleCheck from "../middleware/roleCheck.js"

const router = express.Router()

// Routes
router.post("/", auth, roleCheck(["admin", "researcher"]), createHeatmap)
router.post("/generate", auth, roleCheck(["admin", "researcher"]), generateHeatmap)
router.get("/", auth, getHeatmaps)
router.get("/:id", auth, getHeatmapById)
router.patch("/:id", auth, roleCheck(["admin", "researcher"]), updateHeatmap)
router.delete("/:id", auth, roleCheck(["admin"]), deleteHeatmap)
router.post("/:id/datapoint", auth, roleCheck(["admin", "researcher"]), addDataPoint)
router.delete("/:id/datapoint/:pointId", auth, roleCheck(["admin", "researcher"]), removeDataPoint)

export default router
