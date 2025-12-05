const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../utils/upload');
const wardrobeController = require('../controllers/wardrobeController');

router.use(authMiddleware);

router.post('/items', upload.single('image'), wardrobeController.addItem);
router.get('/items', wardrobeController.getItems);
router.get('/items/:id', wardrobeController.getItem);
router.put('/items/:id', upload.single('image'), wardrobeController.updateItem);
router.delete('/items/:id', wardrobeController.deleteItem);
router.patch('/items/:id/status', wardrobeController.updateItemStatus);
router.get('/dashboard-stats', wardrobeController.getDashboardStats);

module.exports = router;