const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    // Add other relevant feedback details here
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
