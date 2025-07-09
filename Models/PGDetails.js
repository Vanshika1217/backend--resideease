const pgDetailsSchema = new mongoose.Schema({
    genderType: { type: String, enum: ["Boys", "Girls", "Unisex"], required: true },
    roomSharing: [{ type: String, enum: ["Single", "Double", "Triple"], required: true }],
    pricePerSharing: {
      single: Number,
      double: Number,
      triple: Number,
    },
    suitableFor: [{ type: String, enum: ["Students", "Professionals"] }],
    securityFee: Number,
  });
  
  module.exports = mongoose.model("PGDetails", pgDetailsSchema);
  