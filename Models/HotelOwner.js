const mongoose = require("mongoose");

const hotelOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  upiId: { type: String, required: true }, // For payments
  password: { type: String, required: true }, // Store as hashed
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HotelOwner", hotelOwnerSchema);
