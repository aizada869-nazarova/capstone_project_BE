import mongoose from "mongoose"

const { Schema, model } = mongoose

const ItinerarySchema = new Schema(
  {
    itinerary: { type: String, required: true },
    
  },
  { timestamps: true }
)

export default model("comments", commentSchema)