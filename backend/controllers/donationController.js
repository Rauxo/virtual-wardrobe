// controllers/donationController.js
const Donation = require('../models/Donation');
const ClothingItem = require('../models/ClothingItem');
const User = require('../models/User');
const Notification = require('../models/Notification');

const sendDonation = async (req, res) => {
  try {
    const { itemId, recipientEmail, notes = '' } = req.body;
    const donorId = req.user._id;

    if (!itemId || !recipientEmail) {
      return res.status(400).json({ success: false, message: 'Item ID and email required' });
    }

    const item = await ClothingItem.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.user.toString() !== donorId.toString()) return res.status(403).json({ success: false, message: 'Not your item' });
    if (item.status === 'donated') return res.status(400).json({ success: false, message: 'Already donated' });

    const recipient = await User.findOne({ email: recipientEmail.toLowerCase() });
    if (!recipient) return res.status(404).json({ success: false, message: 'Recipient not found' });
    if (recipient._id.toString() === donorId.toString()) return res.status(400).json({ success: false, message: 'Cannot donate to yourself' });

    // Mark item as pending donation
    item.status = 'donated';
    await item.save();

    // Create TWO donation records: one for sender, one for receiver
    const donationData = {
      donor: donorId,
      recipientEmail: recipientEmail.toLowerCase(),
      recipientUser: recipient._id,
      item: itemId,
      itemName: item.name,
      itemCategory: item.category,
      itemColor: item.color,
      notes,
    };

    await Donation.create({ ...donationData, type: 'sent', status: 'pending' });
    await Donation.create({ ...donationData, type: 'received', status: 'pending' });

    // Notifications
    try {
      await Notification.create([
        { user: recipient._id, title: "New Donation!", message: `${req.user.name} sent you "${item.name}"`, type: 'donation_received', relatedDonation: null },
        { user: donorId, title: "Donation Sent", message: `You sent "${item.name}" to ${recipient.email}`, type: 'donation_sent' }
      ]);
    } catch (e) { console.log("Notification failed (non-critical)"); }

    res.status(201).json({ success: true, message: 'Donation sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getDonations = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};

    if (type === 'sent') query = { donor: req.user._id };
    else if (type === 'received') query = { recipientUser: req.user._id };
    else if (type === 'history') {
      query = {
        $or: [
          { donor: req.user._id },
          { recipientUser: req.user._id }
        ]
      };
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name email')
      .populate('recipientUser', 'name email')
      .populate('item', 'imageUrl')
      .sort({ createdAt: -1 });

    const formatted = donations.map(d => ({
      ...d.toObject(),
      type: d.donor._id.toString() === req.user._id.toString() ? 'sent' : 'received'
    }));

    res.json({ success: true, donations: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const acceptDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      recipientUser: req.user._id,
      status: 'pending'
    });

    if (!donation) return res.status(404).json({ success: false, message: 'Not found or not pending' });

    const item = await ClothingItem.findById(donation.item);
    if (!item) return res.status(404).json({ success: false, message: 'Item missing' });

    // Transfer ownership
    item.user = req.user._id;
    item.status = 'active';
    await item.save();

    // Update both records to completed
    await Donation.updateMany(
      { item: donation.item, status: 'pending' },
      { status: 'completed' }
    );

    // Notify donor
    await Notification.create({
      user: donation.donor,
      title: "Donation Accepted!",
      message: `${req.user.name} accepted your "${item.name}"`,
      type: 'donation_accepted'
    });

    res.json({ success: true, message: 'Donation accepted!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const rejectDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      recipientUser: req.user._id,
      status: 'pending'
    });

    if (!donation) return res.status(404).json({ success: false, message: 'Not found' });

    const item = await ClothingItem.findById(donation.item);
    if (item) {
      item.status = 'active'; // back to donor
      await item.save();
    }

    await Donation.updateMany(
      { item: donation.item, status: 'pending' },
      { status: 'rejected' }
    );

    res.json({ success: true, message: 'Donation rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const cancelDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      donor: req.user._id,
      status: 'pending'
    });

    if (!donation) return res.status(404).json({ success: false, message: 'Not found or not pending' });

    const item = await ClothingItem.findById(donation.item);
    if (item) {
      item.status = 'active';
      await item.save();
    }

    await Donation.updateMany(
      { item: donation.item, status: 'pending' },
      { status: 'cancelled' }
    );

    res.json({ success: true, message: 'Donation cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  sendDonation,
  getDonations,
  acceptDonation,
  rejectDonation,
  cancelDonation
};