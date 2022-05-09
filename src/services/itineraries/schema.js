
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ItinerarySchema = new Schema(
  {
    itinerary: { type: String, required: true },
    travelId:{ type: Schema.Types.ObjectId, ref: "NewTrip" },
    placesToVisit:[{place:{type: String, required: true }}],
    todoLists:[{todo:{type: String, required: true }}]
  },
  { timestamps: true }
);

export default model("Itinerary", ItinerarySchema)