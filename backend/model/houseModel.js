const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    city: { type: String, required: true },
    subCity: { type: String, required: true },
    wereda: { type: String, required: true },
    specialLocation: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "one-room",
        "OneBedroom",
        "TwoBedroom",
        "ThreeBedroom",
        "Studio",
        "G+1",
        "G+2",
        "G+3",
      ],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Villa",
        "Apartment",
        "Condominium",
        "Service",
        "Penthouse",
        "others",
      ],
      required: true,
    },
    price: { type: Number, required: true },
    comision: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    imageCover: {
      type: String,
      required: [true, "A House must have a cover image"],
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "rented", "unavailable"],
      default: "available",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Add a method to the houseSchema for checking availability if it doesn't exist
houseSchema.methods.isAvailable = function () {
  return this.status === "available";
};

module.exports = mongoose.model("House", houseSchema);
