import mongoose from "mongoose"

const analysisSchema = mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
  infectionProbability: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  infectionSeverity: {
    type: String,
    enum: ["none", "low", "medium", "high", "severe"],
    required: true,
  },
  detectedAreas: [
    {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      confidence: Number,
    },
  ],
  modelVersion: { type: String, required: true },
  analysisDate: {
    type: Date,
    default: new Date(),
  },
  notes: { type: String },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

export default mongoose.model("Analysis", analysisSchema)
