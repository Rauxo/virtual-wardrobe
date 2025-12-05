const Notification = require('../models/Notification');

const createNotification = async ({ userId, title, message, type = 'info', relatedDonation = null, data = {} }) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      relatedDonation,
      data,
      read: false
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Create notification failed:', error.message);
    throw error;
  }
};
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });

    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

const clearAll = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

module.exports = { getNotifications,createNotification, markAsRead, markAllAsRead, clearAll };