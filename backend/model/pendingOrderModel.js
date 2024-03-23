const mongoose = require("mongoose");

const pendingOrderSchema = new mongoose.Schema(
  {
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bidPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "counter-offered"],
      default: "pending",
    },
    // Add other relevant pending order details here
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingOrder", pendingOrderSchema);
