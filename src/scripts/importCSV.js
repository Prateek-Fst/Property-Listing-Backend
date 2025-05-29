const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const User = require('../models/User');
const path = require('path');

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI||"mongodb+srv://choudharyprateek131:9927729187@cluster0.nkeq4ce.mongodb.net/property_listings?retryWrites=true&w=majority&appName=Cluster0", {
  });
  console.log('MongoDB connected for import');
};

const importData = async () => {
  await connectDB();
  let dummyUser = await User.findOne({ email: 'prateek132@gmail.com' });
  if (!dummyUser) {
    dummyUser = new User({ email: 'prateek132@gmail.com', password: '123456' });
    await dummyUser.save();
  }
  const properties = [];
  const csvFilePath = path.resolve(__dirname, '../../properties.csv');
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const property = {
        _id: row.id,
        title: row.title,
        type: row.type,
        price: parseFloat(row.price),
        state: row.state,
        city: row.city,
        areaSqFt: parseInt(row.areaSqFt),
        bedrooms: parseInt(row.bedrooms),
        bathrooms: parseInt(row.bathrooms),
        amenities: row.amenities,
        furnished: row.furnished,
        availableFrom: new Date(row.availableFrom),
        listedBy: row.listedBy,
        tags: row.tags,
        colorTheme: row.colorTheme,
        rating: parseFloat(row.rating),
        isVerified: row.isVerified === 'True',
        listingType: row.listingType,
        createdBy: dummyUser._id,
      };
      properties.push(property);
    })
    .on('end', async () => {
      try {
        await Property.insertMany(properties);
        console.log('Data imported successfully');
        mongoose.connection.close();
      } catch (error) {
        console.error('Error importing data:', error);
        mongoose.connection.close();
      }
    });
};

importData();