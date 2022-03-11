import mongoose from "mongoose"


const { Schema, model } = mongoose

const NewTripSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureDate: { type: String, required: true },
    arrivalDate: { type: String },
    transport: { type: String },
   
  },
  {
    timestamps: true,
  }
)

export default model("NewTrip", NewTripSchema)