const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  recipientUser: {  // ← this is correct
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem',
    required: true
  },
  type: {
    type: String,
    enum: ['sent', 'received'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  itemName: String,
  itemCategory: String,
  itemColor: String,
  notes: { type: String, default: '' }
}, { timestamps: true });

// Indexes
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ recipientEmail: 1, createdAt: -1 });
donationSchema.index({ status: 1 });

module.exports = mongoose.model('Donation', donationSchema);