const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Top', 'Bottom', 'Dress', 'Jacket', 'Shoes', 'Accessories', 'Bag', 'Outerwear']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Men', 'Women', 'Unisex', 'Kids (Boy)', 'Kids (Girl)']
  },
  color: {
    type: String,
    required: [true, 'Color is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'donated'],
    default: 'active'
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  lastWorn: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
clothingItemSchema.index({ user: 1, category: 1 });
clothingItemSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('ClothingItem', clothingItemSchema);