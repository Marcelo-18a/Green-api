import express from "express"
import { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser } from "../controllers/users.js"
import auth from "../middleware/Auth.js"
import roleCheck from "../middleware/roleCheck.js"

const router = express.Router()

// Public routes
router.post("/register", createUser)
router.post("/login", loginUser)

// Protected routes
router.get("/", auth, roleCheck(["admin"]), getUsers)
router.get("/:id", auth, getUserById)
router.patch("/:id", auth, updateUser)
router.delete("/:id", auth, roleCheck(["admin"]), deleteUser)

export default router
