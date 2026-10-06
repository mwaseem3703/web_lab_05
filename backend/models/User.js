const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, // Optional because Google OAuth users won't have a password
    },
    role: {
      type: String,
      enum: ["Employee", "Manager", "SuperAdmin"],
      default: "Employee",
    },
    googleId: {
      type: String, // Stores the Google profile ID
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
