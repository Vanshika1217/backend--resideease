const mongoose = require("mongoose");

const AccommodationSchema= new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["PG", "Flat", "Hotel"], required: true },
  description: { type: String, required: true },
  location: {
    address: String,
    city: String,
    state: String,
    latitude: Number,
    longitude: Number,
  },
  price: Number,
  amenities: [String],
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HotelOwner",
    required: true,
  },
  details: { type: mongoose.Schema.Types.ObjectId, refPath: 'detailsModel' },
  detailsModel: {
    type: String,
    enum: ["PGDetails", "FlatDetails"],
    required: function () {
      return this.type !== "Hotel";
    },
  },
}, { timestamps: true });
module.exports = mongoose.model("Accommodations", AccommodationSchema);
