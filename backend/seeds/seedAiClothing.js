const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const AiClothing = require('../models/AiClothing');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const seed = async () => {
  try {
    await AiClothing.deleteMany({});
    console.log('Cleared old AI clothing data');

    const filePath = path.join(__dirname, '../data/clothing_dataset_full.json');
    const raw = fs.readFileSync(filePath);
    const items = JSON.parse(raw);

    await AiClothing.insertMany(items);
    console.log(`Successfully seeded ${items.length} AI clothing items!`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();