const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Property = require('../models/Property');
const redisClient = require('../config/redis');

router.get('/', async (req, res) => {
  try {
    const query = {};
    for (const [key, value] of Object.entries(req.query)) {
      if (['amenities', 'tags'].includes(key)) {
        query[key] = { $regex: value, $options: 'i' };
      } else if (key === 'price' || key === 'areaSqFt' || key === 'bedrooms' || key === 'bathrooms' || key === 'rating') {
        query[key] = Number(value);
      } else {
        query[key] = value;
      }
    }
    const properties = await Property.find(query);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const cacheKey = `property:${req.params.id}`;
  try {
    const cachedProperty = await redisClient.get(cacheKey);
    if (cachedProperty) return res.json(JSON.parse(cachedProperty));
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    await redisClient.set(cacheKey, JSON.stringify(property), 'EX', 3600);
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const propertyData = { ...req.body, createdBy: req.user.userId };
    const property = new Property(propertyData);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await redisClient.del(`property:${req.params.id}`);
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }
    await Property.findByIdAndDelete(req.params.id);
    await redisClient.del(`property:${req.params.id}`);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;