import mongoose from "mongoose"


const { Schema, model } = mongoose


const PakingListsSchema = new Schema( 
  {
      nameOfItem: { type: String, required: true },
      category: { type: String, required: true, enum: ["other", "clothes"] }
      }
 ,
  { timestamps: true }
)

const ItinerarySchema = new Schema(
  {
    itinerary: { type: String, required: true },
    
  },
  { timestamps: true }
)

const NewTripSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureDate: { type: Date },
    arrivalDate: { type: Date },
    transport: [{ type: String }],
    time: { type: String},
    travelWith: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pakingLists: [ {
      nameOfList: { type: String, required: true },
      category: { type: String, required: true, enum: ["other", "clothes"] }
     }],  
    itineraries:{ type: [ItinerarySchema], default: [] }
  },
  {
    timestamps: true,
  }
)

export default model("NewTrip", NewTripSchema)