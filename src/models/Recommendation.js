const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  recommenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: String, ref: 'Property', required: true },
}, { timestamps: true });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;