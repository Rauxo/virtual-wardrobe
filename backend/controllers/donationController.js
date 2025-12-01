const Donation = require('../models/Donation');
const ClothingItem = require('../models/ClothingItem');
const User = require('../models/User');
const { sendDonationNotification } = require('../utils/emailService');

// Send Donation
// Send Donation - FIXED VERSION
const sendDonation = async (req, res) => {
  try {
    const { itemId, recipientEmail, notes } = req.body;
    const donorId = req.user._id;

    console.log('Send donation - User:', donorId, 'Item:', itemId);

    if (!itemId || !recipientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and recipient email are required'
      });
    }

    // Find the item
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    console.log('Item found:', item);

    // Check ownership
    if (item.user.toString() !== donorId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only donate your own items'
      });
    }

    // Find recipient
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found. They must be registered.'
      });
    }

    if (recipient._id.toString() === donorId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot donate to yourself'
      });
    }

    // Create donation with correct field names
    const donation = await Donation.create({
      donor: donorId,                    // ← ObjectId, not object
      recipientEmail: recipientEmail,
      recipientUser: recipient._id,      // optional, for easier queries later
      item: itemId,                      // ← "item", not "itemId"
      itemName: item.name,
      itemCategory: item.category,
      itemColor: item.color,
      notes: notes || '',
      type: 'sent',
      status: 'pending'
    });

    // Update item status
    item.status = 'donated';
    await item.save();

    // Optional: send email notification
    // await sendDonationNotification(recipient.email, req.user.name, item.name);

    res.status(201).json({
      success: true,
      message: 'Donation sent successfully',
      donation
    });

  } catch (error) {
    console.error('Send donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
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
      query = { donorId: req.user._id };
    } else if (type === 'received') {
      query = { recipientId: req.user._id };
    } else if (type === 'history') {
      query = {
        $or: [
          { donorId: req.user._id },
          { recipientId: req.user._id }
        ]
      };
    }

    const donations = await Donation.find(query)
      .populate('donorId', 'name email')
      .populate('recipientId', 'name email')
      .sort({ createdAt: -1 });

    // Determine type for each donation
    const donationsWithType = donations.map(donation => ({
      ...donation.toObject(),
      type: donation.donorId._id.toString() === req.user._id.toString() ? 'sent' : 'received'
    }));

    res.json({
      success: true,
      message: 'Donations fetched successfully',
      donations: donationsWithType
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
      donorId: req.user._id,
      status: 'pending'
    })
      .populate('itemId', 'name category color imageUrl')
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
      recipientId: req.user._id
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
      donorId: req.user._id
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
    const item = await ClothingItem.findById(donation.itemId);
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