const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');

router.post('/', auth, async (req, res) => {
  const { recipientEmail, propertyId } = req.body;
  try {
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
    const recommendation = new Recommendation({
      recommenderId: req.user.userId,
      recipientId: recipient._id,
      propertyId,
    });
    await recommendation.save();
    res.status(201).json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/received', auth, async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ recipientId: req.user.userId })
      .populate('propertyId')
      .populate('recommenderId', 'email');
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;