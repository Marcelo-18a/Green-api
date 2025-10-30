import Image from "../models/Image.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Upload image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const { originalname, filename, path: filePath, size } = req.file
    const { latitude, longitude } = req.body

    // Create new image record
    const newImage = new Image({
      fileName: filename,
      filePath: filePath,
      originalName: originalname,
      uploadedBy: req.userId, // Assuming middleware sets this
      location: {
        type: "Point",
        coordinates: [Number.parseFloat(longitude) || 0, Number.parseFloat(latitude) || 0],
      },
      metadata: {
        deviceInfo: req.body.deviceInfo || "Unknown",
        captureDate: req.body.captureDate || new Date(),
        imageSize: size,
      },
    })

    await newImage.save()
    res.status(201).json(newImage)
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error: error.message })
  }
}

// Get all images
export const getImages = async (req, res) => {
  try {
    const images = await Image.find().populate("uploadedBy", "name email")
    res.status(200).json(images)
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error: error.message })
  }
}

// Get image by ID
export const getImageById = async (req, res) => {
  try {
    const { id } = req.params
    const image = await Image.findById(id).populate("uploadedBy", "name email")

    if (!image) {
      return res.status(404).json({ message: "Image not found" })
    }

    res.status(200).json(image)
  } catch (error) {
    res.status(500).json({ message: "Error fetching image", error: error.message })
  }
}

// Update image metadata
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params
    const { latitude, longitude, deviceInfo, captureDate } = req.body

    const updatedImage = await Image.findByIdAndUpdate(
      id,
      {
        location: {
          type: "Point",
          coordinates: [Number.parseFloat(longitude) || 0, Number.parseFloat(latitude) || 0],
        },
        metadata: {
          deviceInfo: deviceInfo,
          captureDate: captureDate,
          imageSize: req.body.imageSize,
        },
        status: req.body.status,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" })
    }

    res.status(200).json(updatedImage)
  } catch (error) {
    res.status(500).json({ message: "Error updating image", error: error.message })
  }
}

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params
    const image = await Image.findById(id)

    if (!image) {
      return res.status(404).json({ message: "Image not found" })
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, "..", image.filePath)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete from database
    await Image.findByIdAndDelete(id)

    res.status(200).json({ message: "Image deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error: error.message })
  }
}

// Get images by user
export const getImagesByUser = async (req, res) => {
  try {
    const { userId } = req.params
    const images = await Image.find({ uploadedBy: userId }).populate("uploadedBy", "name email")
    res.status(200).json(images)
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error: error.message })
  }
}

// Get images by location (within radius)
export const getImagesByLocation = async (req, res) => {
  try {
    const { longitude, latitude, radius } = req.query

    if (!longitude || !latitude || !radius) {
      return res.status(400).json({ message: "Missing location parameters" })
    }

    const images = await Image.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number.parseFloat(longitude), Number.parseFloat(latitude)],
          },
          $maxDistance: Number.parseFloat(radius) * 1000, // Convert km to meters
        },
      },
    }).populate("uploadedBy", "name email")

    res.status(200).json(images)
  } catch (error) {
    res.status(500).json({ message: "Error fetching images by location", error: error.message })
  }
}
