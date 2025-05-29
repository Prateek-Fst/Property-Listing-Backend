const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Favorite = require('../models/Favorite');
const redisClient = require('../config/redis');

router.get('/', auth, async (req, res) => {
  const cacheKey = `favorites:${req.user.userId}`;
  try {
    const cachedFavorites = await redisClient.get(cacheKey);
    if (cachedFavorites) return res.json(JSON.parse(cachedFavorites));
    const favorites = await Favorite.find({ userId: req.user.userId }).populate('propertyId');
    await redisClient.set(cacheKey, JSON.stringify(favorites), 'EX', 3600);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { propertyId } = req.body;
  try {
    const favorite = new Favorite({ userId: req.user.userId, propertyId });
    await favorite.save();
    await redisClient.del(`favorites:${req.user.userId}`);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
    if (favorite.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Favorite.findByIdAndDelete(req.params.id);
    await redisClient.del(`favorites:${req.user.userId}`);
    res.json({ message: 'Favorite deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;