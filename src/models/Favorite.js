const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: String, ref: 'Property', required: true },
}, { timestamps: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;