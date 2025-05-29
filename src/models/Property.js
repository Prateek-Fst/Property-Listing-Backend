const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  areaSqFt: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: { type: String },
  furnished: { type: String, required: true },
  availableFrom: { type: Date, required: true },
  listedBy: { type: String, required: true },
  tags: { type: String },
  colorTheme: { type: String },
  rating: { type: Number },
  isVerified: { type: Boolean, required: true },
  listingType: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;