import mongoose from "mongoose"


const { Schema, model } = mongoose


const PakingListsSchema = new Schema( 
  {
      nameOfItem: { type: String, required: true },
      category: { type: String, required: true, enum: ["other", "clothing"," toiletries", "medications", "accessories", "electronics", "documents"] }
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
    pakingLists: { type: [PakingListsSchema], default: [] },  
    itineraries:{ type: [ItinerarySchema], default: [] },
    accommodations: [ {
      placeToStay: { type: String, required: true },
      address: { type: String },
      checkIn: { type: Date },
      checkInTime: {type: Number},
      checkOut: {type: Date},
      checkOutTime: {type: Number},
      contact: {type: Number},
  }]

  },
  {
    timestamps: true,
  }
)

export default model("NewTrip", NewTripSchema)