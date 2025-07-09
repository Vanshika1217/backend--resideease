const flatDetailsSchema = new mongoose.Schema({
    bhkType: { type: String, enum: ["1BHK", "2BHK", "3BHK", "Studio"] },
    furnished: { type: Boolean },
    suitableFor: [{ type: String, enum: ["Students", "Professionals"] }],
    securityFee: Number,
  });
  
  module.exports = mongoose.model("FlatDetails", flatDetailsSchema);
  