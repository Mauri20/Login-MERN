// Importing the mongoose module
const mongoose = require("mongoose");

// Creating a schema
const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quote: { type: String },
  },
  { collection: "users" }
);

const userModel = mongoose.model("User-Data", User);

// Exporting the model
module.exports = userModel;
