import express from "express"
import multer from "multer"
import path from "path"
import {
  uploadImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
  getImagesByUser,
  getImagesByLocation,
} from "../controllers/images.js"
import auth from "../middleware/Auth.js"

const router = express.Router()

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Not an image! Please upload only images."), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// Routes
router.post("/", auth, upload.single("image"), uploadImage)
router.get("/", auth, getImages)
router.get("/user/:userId", auth, getImagesByUser)
router.get("/location", auth, getImagesByLocation)
router.get("/:id", auth, getImageById)
router.patch("/:id", auth, updateImage)
router.delete("/:id", auth, deleteImage)

export default router
