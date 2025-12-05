const ClothingItem = require('../models/ClothingItem');
const Donation = require('../models/Donation');
const path = require('path');
const fs = require('fs');

const addItem = async (req, res) => {
  try {
    const { name, category, gender, color } = req.body;

    if (!name || !category || !gender || !color) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const imageUrl = `/uploads/images/${req.file.filename}`;

    const item = await ClothingItem.create({
      user: req.userId,
      name,
      category,
      gender,
      color,
      imageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      item
    });
  } catch (error) {
    console.error('Add item error:', error);
    
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error adding item',
      error: error.message
    });
  }
};

const getItems = async (req, res) => {
  try {
    const { 
      category, 
      gender, 
      color, 
      sortBy = 'newest',
      page = 1,
      limit = 20,
      status
    } = req.query;

    const query = { user: req.userId };

    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (color) query.color = { $regex: color, $options: 'i' };
    if (status) query.status = status;

    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const items = await ClothingItem.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await ClothingItem.countDocuments(query);
    const activeItems = await ClothingItem.countDocuments({ 
      user: req.userId, 
      status: 'active' 
    });
    const inactiveItems = await ClothingItem.countDocuments({ 
      user: req.userId, 
      status: 'inactive' 
    });
    const pendingDonations = await Donation.countDocuments({ 
      donor: req.userId, 
      status: 'pending' 
    });
    const activeRate = total > 0 ? Math.round((activeItems / total) * 100) : 0;

    res.status(200).json({
      success: true,
      items,
      stats: {
        total,
        active: activeItems,
        inactive: inactiveItems,
        pendingDonations,
        activeRate
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message
    });
  }
};

const getItem = async (req, res) => {
  try {
    const item = await ClothingItem.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error.message
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { name, category, gender, color, status } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (gender) updateData.gender = gender;
    if (color) updateData.color = color;
    if (status) updateData.status = status;

    if (req.file) {
      updateData.imageUrl = `/uploads/images/${req.file.filename}`;
      
      const oldItem = await ClothingItem.findById(req.params.id);
      if (oldItem && oldItem.imageUrl) {
        const oldPath = path.join(__dirname, '..', oldItem.imageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const item = await ClothingItem.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item error:', error);
    
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.imageUrl) {
      const imagePath = path.join(__dirname, '..', item.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message
    });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (active/inactive)'
      });
    }

    const item = await ClothingItem.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Item marked as ${status}`,
      item
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item status',
      error: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalItems = await ClothingItem.countDocuments({ user: req.userId });
    const activeItems = await ClothingItem.countDocuments({ 
      user: req.userId, 
      status: 'active' 
    });
    const inactiveItems = await ClothingItem.countDocuments({ 
      user: req.userId, 
      status: 'inactive' 
    });
    const pendingDonations = await Donation.countDocuments({ 
      donor: req.userId, 
      status: 'pending' 
    });
    const activeRate = totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0;

    const recentItems = await ClothingItem.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const categories = await ClothingItem.aggregate([
      { $match: { user: req.userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalItems,
        activeItems,
        inactiveItems,
        pendingDonations,
        activeRate
      },
      recentItems,
      categories
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

module.exports = {
  addItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  updateItemStatus,
  getDashboardStats
};