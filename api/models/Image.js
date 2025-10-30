import mongoose from "mongoose"

const imageSchema = mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  metadata: {
    deviceInfo: { type: String },
    captureDate: { type: Date, default: Date.now },
    imageSize: { type: Number },
  },
  status: {
    type: String,
    enum: ["pending", "analyzed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

// Index for geospatial queries
imageSchema.index({ location: "2dsphere" })

export default mongoose.model("Image", imageSchema)
