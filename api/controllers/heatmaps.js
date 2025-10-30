import Heatmap from "../models/Heatmap.js"
import Analysis from "../models/Analysis.js"

// Create a new heatmap
export const createHeatmap = async (req, res) => {
  try {
    const { name, description, region, dataPoints } = req.body

    // Create new heatmap
    const newHeatmap = new Heatmap({
      name,
      description,
      region,
      dataPoints: dataPoints || [],
      createdBy: req.userId, // Assuming middleware sets this
    })

    await newHeatmap.save()
    res.status(201).json(newHeatmap)
  } catch (error) {
    res.status(500).json({ message: "Error creating heatmap", error: error.message })
  }
}

// Get all heatmaps
export const getHeatmaps = async (req, res) => {
  try {
    const heatmaps = await Heatmap.find().populate("createdBy", "name email").populate("dataPoints.source")

    res.status(200).json(heatmaps)
  } catch (error) {
    res.status(500).json({ message: "Error fetching heatmaps", error: error.message })
  }
}

// Get heatmap by ID
export const getHeatmapById = async (req, res) => {
  try {
    const { id } = req.params
    const heatmap = await Heatmap.findById(id).populate("createdBy", "name email").populate("dataPoints.source")

    if (!heatmap) {
      return res.status(404).json({ message: "Heatmap not found" })
    }

    res.status(200).json(heatmap)
  } catch (error) {
    res.status(500).json({ message: "Error fetching heatmap", error: error.message })
  }
}

// Update heatmap
export const updateHeatmap = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, region, dataPoints } = req.body

    const updatedHeatmap = await Heatmap.findByIdAndUpdate(
      id,
      {
        name,
        description,
        region,
        dataPoints,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!updatedHeatmap) {
      return res.status(404).json({ message: "Heatmap not found" })
    }

    res.status(200).json(updatedHeatmap)
  } catch (error) {
    res.status(500).json({ message: "Error updating heatmap", error: error.message })
  }
}

// Delete heatmap
export const deleteHeatmap = async (req, res) => {
  try {
    const { id } = req.params
    const deletedHeatmap = await Heatmap.findByIdAndDelete(id)

    if (!deletedHeatmap) {
      return res.status(404).json({ message: "Heatmap not found" })
    }

    res.status(200).json({ message: "Heatmap deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting heatmap", error: error.message })
  }
}

// Add data point to heatmap
export const addDataPoint = async (req, res) => {
  try {
    const { id } = req.params
    const { location, intensity, source, date } = req.body

    const heatmap = await Heatmap.findById(id)
    if (!heatmap) {
      return res.status(404).json({ message: "Heatmap not found" })
    }

    heatmap.dataPoints.push({
      location,
      intensity,
      source,
      date: date || new Date(),
    })

    heatmap.updatedAt = new Date()
    await heatmap.save()

    res.status(200).json(heatmap)
  } catch (error) {
    res.status(500).json({ message: "Error adding data point", error: error.message })
  }
}

// Remove data point from heatmap
export const removeDataPoint = async (req, res) => {
  try {
    const { id, pointId } = req.params

    const heatmap = await Heatmap.findById(id)
    if (!heatmap) {
      return res.status(404).json({ message: "Heatmap not found" })
    }

    heatmap.dataPoints = heatmap.dataPoints.filter((point) => point._id.toString() !== pointId)

    heatmap.updatedAt = new Date()
    await heatmap.save()

    res.status(200).json(heatmap)
  } catch (error) {
    res.status(500).json({ message: "Error removing data point", error: error.message })
  }
}

// Generate heatmap from analyses
export const generateHeatmap = async (req, res) => {
  try {
    const { name, description, region, minProbability } = req.body

    // Find all analyses with infection probability above threshold
    const analyses = await Analysis.find({
      infectionProbability: { $gte: Number.parseFloat(minProbability) || 0.5 },
    }).populate({
      path: "image",
      select: "location",
    })

    // Create data points from analyses
    const dataPoints = analyses.map((analysis) => ({
      location: analysis.image.location,
      intensity: analysis.infectionProbability,
      source: analysis._id,
      date: analysis.analysisDate,
    }))

    // Create new heatmap
    const newHeatmap = new Heatmap({
      name,
      description,
      region,
      dataPoints,
      createdBy: req.userId, // Assuming middleware sets this
    })

    await newHeatmap.save()
    res.status(201).json(newHeatmap)
  } catch (error) {
    res.status(500).json({ message: "Error generating heatmap", error: error.message })
  }
}
