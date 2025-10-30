import User from "../models/User.js"
import jwt from "jsonwebtoken"

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
      location,
    })

    await newUser.save()

    // Generate token
    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.status(201).json({ user: newUser, token })
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message })
  }
}

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message })
  }
}

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message })
  }
}

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role, location } = req.body

    // Don't allow password updates through this route for security
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, location, updatedAt: new Date() },
      { new: true },
    ).select("-password")

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message })
  }
}

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message })
  }
}

// User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.status(200).json({ user: { ...user._doc, password: undefined }, token })
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message })
  }
}
