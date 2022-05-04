import mongoose from "mongoose"


const { Schema, model } = mongoose

const VisitedCountrySchema = new Schema(
  {
   
    cityName: { type: String, required: true },
    countryName: { type: String, required: true },
    date: { type: Date },
    duration: { type: Date },
    
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
   
  },
  {
    timestamps: true,
  }
)

export default model("VisitedCountry", VisitedCountrySchema)