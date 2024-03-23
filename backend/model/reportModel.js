const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    house: { type: mongoose.Schema.Types.ObjectId, ref: "House" }, // Optional, only if related to a specific house
    type: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending resolution", "resolved"],
      default: "pending resolution",
    },
    // Add other relevant report details here
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
