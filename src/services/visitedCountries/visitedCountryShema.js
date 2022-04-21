import mongoose from "mongoose"


const { Schema, model } = mongoose

const VisitedCountrySchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureDate: { type: Date },
    arrivalDate: { type: Date },
    transport: [{ type: String }],
    time: { type: String},
    travelWith: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
   
  },
  {
    timestamps: true,
  }
)

export default model("VisitedCountry", VisitedCountrySchema)