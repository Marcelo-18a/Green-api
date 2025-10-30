import Analysis from "../models/Analysis.js"
import Image from "../models/Image.js"

// Create a new analysis
export const createAnalysis = async (req, res) => {
  try {
    const { imageId, infectionProbability, infectionSeverity, detectedAreas, modelVersion, notes } = req.body

    // Check if image exists
    const image = await Image.findById(imageId)
    if (!image) {
      return res.status(404).json({ message: "Image not found" })
    }

    // Create new analysis
    const newAnalysis = new Analysis({
      image: imageId,
      infectionProbability,
      infectionSeverity,
      detectedAreas: detectedAreas || [],
      modelVersion,
      notes,
      analysisDate: new Date(),
    })

    await newAnalysis.save()

    // Update image status
    await Image.findByIdAndUpdate(imageId, { status: "analyzed" })

    res.status(201).json(newAnalysis)
  } catch (error) {
    res.status(500).json({ message: "Error creating analysis", error: error.message })
  }
}

// Get all analyses
export const getAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find().populate("image").populate("verifiedBy", "name email")

    res.status(200).json(analyses)
  } catch (error) {
    res.status(500).json({ message: "Error fetching analyses", error: error.message })
  }
}

// Get analysis by ID
export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params
    const analysis = await Analysis.findById(id).populate("image").populate("verifiedBy", "name email")

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" })
    }

    res.status(200).json(analysis)
  } catch (error) {
    res.status(500).json({ message: "Error fetching analysis", error: error.message })
  }
}

// Update analysis
export const updateAnalysis = async (req, res) => {
  try {
    const { id } = req.params
    const { infectionProbability, infectionSeverity, detectedAreas, notes, verifiedBy } = req.body

    const updatedAnalysis = await Analysis.findByIdAndUpdate(
      id,
      {
        infectionProbability,
        infectionSeverity,
        detectedAreas,
        notes,
        verifiedBy,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!updatedAnalysis) {
      return res.status(404).json({ message: "Analysis not found" })
    }

    res.status(200).json(updatedAnalysis)
  } catch (error) {
    res.status(500).json({ message: "Error updating analysis", error: error.message })
  }
}

// Delete analysis
export const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params
    const analysis = await Analysis.findById(id)

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" })
    }

    // Update image status back to pending
    await Image.findByIdAndUpdate(analysis.image, { status: "pending" })

    // Delete analysis
    await Analysis.findByIdAndDelete(id)

    res.status(200).json({ message: "Analysis deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting analysis", error: error.message })
  }
}

// Get analyses by image
export const getAnalysesByImage = async (req, res) => {
  try {
    const { imageId } = req.params
    const analyses = await Analysis.find({ image: imageId }).populate("verifiedBy", "name email")

    res.status(200).json(analyses)
  } catch (error) {
    res.status(500).json({ message: "Error fetching analyses", error: error.message })
  }
}

// Get analyses by severity
export const getAnalysesBySeverity = async (req, res) => {
  try {
    const { severity } = req.params
    const analyses = await Analysis.find({ infectionSeverity: severity })
      .populate("image")
      .populate("verifiedBy", "name email")

    res.status(200).json(analyses)
  } catch (error) {
    res.status(500).json({ message: "Error fetching analyses", error: error.message })
  }
}

// Get analyses by probability range
export const getAnalysesByProbability = async (req, res) => {
  try {
    const { min, max } = req.query

    if (!min || !max) {
      return res.status(400).json({ message: "Missing probability range parameters" })
    }

    const analyses = await Analysis.find({
      infectionProbability: { $gte: Number.parseFloat(min), $lte: Number.parseFloat(max) },
    })
      .populate("image")
      .populate("verifiedBy", "name email")

    res.status(200).json(analyses)
  } catch (error) {
    res.status(500).json({ message: "Error fetching analyses", error: error.message })
  }
}
