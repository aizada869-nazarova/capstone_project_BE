import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PakingListsSchema = new Schema(
  {
    nameOfItem: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "other",
        "clothing",
        "toiletries",
        "medications",
        "accessories",
        "electronics",
        "documents",
      ],
    },
  },
  { timestamps: true }
);

const NewTripSchema = new Schema(
  {
    fromCityName: { type: String, required: true },
    fromCountryName: { type: String, required: true },
    toCityName: { type: String, required: true },
    toCountryName: { type: String, required: true },
    departureDate: { type: Date },
    departureTime: { type: String },
    arrivalDate: { type: Date },
    arrivalTime: { type: String },
    transport: [{ type: String }],
    travelWith: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pakingLists: { type: [PakingListsSchema], default: [] },
    accommodations: [
      {
        placeToStay: { type: String, required: true },
        address: { type: String },
        checkIn: { type: Date },
        checkInTime: { type: String },
        checkOut: { type: Date },
        checkOutTime: { type: String },
        contact: { type: String },
        websiteUrl: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("NewTrip", NewTripSchema);
