const Donation = require('../models/Donation');
const ClothingItem = require('../models/User');
const User = require('../models/User');
const { sendDonationNotification } = require('../utils/emailService');

// Send Donation
const sendDonation = async (req, res) => {
  try {
    const { itemId, recipientEmail, notes } = req.body;

    if (!itemId || !recipientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and recipient email are required'
      });
    }

    // Check if item exists and belongs to user
    const item = await ClothingItem.findOne({
      _id: itemId,
      user: req.userId
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found or does not belong to you'
      });
    }

    // Check if user is trying to donate to themselves
    const donor = await User.findById(req.userId);
    if (donor.email === recipientEmail.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot donate to yourself'
      });
    }

    // Check if recipient exists in system
    const recipientUser = await User.findOne({ 
      email: recipientEmail.toLowerCase() 
    });

    // Create donation record
    const donation = await Donation.create({
      donor: req.userId,
      recipientEmail: recipientEmail.toLowerCase(),
      recipientUser: recipientUser ? recipientUser._id : null,
      item: itemId,
      type: 'sent',
      status: 'pending',
      itemName: item.name,
      itemCategory: item.category,
      itemColor: item.color,
      notes: notes || ''
    });

    // Update item status
    item.status = 'donated';
    await item.save();

    // Send notification email if recipient exists
    if (recipientUser) {
      await sendDonationNotification(
        donor.email,
        recipientEmail,
        item.name
      );
    }

    res.status(201).json({
      success: true,
      message: 'Donation sent successfully',
      donation
    });
  } catch (error) {
    console.error('Send donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending donation',
      error: error.message
    });
  }
};

// Get Donations (with type filter)
const getDonations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { type } = req.query;
    console.log('Getting donations for user:', req.user.email, 'Type:', type);

    let query = {};
    
    if (type === 'sent') {
      query = { donorEmail: req.user.email };
    } else if (type === 'received') {
      query = { receiverEmail: req.user.email };
    }

    const donations = await Donation.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Donations fetched successfully',
      donations
    });

  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Pending Donations
const getPendingDonations = async (req, res) => {
  try {
    const pendingDonations = await Donation.find({
      donor: req.userId,
      status: 'pending'
    })
    .populate('item', 'name category color imageUrl')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      donations: pendingDonations
    });
  } catch (error) {
    console.error('Get pending donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending donations',
      error: error.message
    });
  }
};

// Accept Donation
const acceptDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      recipientEmail: req.user.email
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found or not authorized'
      });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Donation cannot be accepted'
      });
    }

    donation.status = 'accepted';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation accepted successfully',
      donation
    });
  } catch (error) {
    console.error('Accept donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting donation',
      error: error.message
    });
  }
};

// Cancel Donation
const cancelDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      donor: req.userId
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found or not authorized'
      });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Donation cannot be cancelled'
      });
    }

    // Restore item status
    const item = await ClothingItem.findById(donation.item);
    if (item) {
      item.status = 'active';
      await item.save();
    }

    donation.status = 'cancelled';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling donation',
      error: error.message
    });
  }
};

module.exports = {
  sendDonation,
  getDonations,
  getPendingDonations,
  acceptDonation,
  cancelDonation
};