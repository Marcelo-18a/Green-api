import mongoose from "mongoose"

const heatmapSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  region: {
    type: {
      type: String,
      enum: ["Polygon"],
      required: true,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
  dataPoints: [
    {
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      intensity: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
      source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Analysis",
      },
      date: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
})

// Index for geospatial queries
heatmapSchema.index({ region: "2dsphere" })
heatmapSchema.index({ "dataPoints.location": "2dsphere" })

export default mongoose.model("Heatmap", heatmapSchema)
