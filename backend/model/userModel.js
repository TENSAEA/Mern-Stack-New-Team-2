const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["tenant", "landlord", "broker", "admin", "superadmin"],
      required: true,
    },
    photo: { type: String, default: "defaultuser.png" },
    isBlocked: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
