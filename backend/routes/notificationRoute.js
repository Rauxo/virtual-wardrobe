const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getNotifications, markAsRead, markAllAsRead, clearAll } = require('../controllers/notificationController');


router.get('/notifications', authMiddleware, getNotifications);
router.put('/notifications/:id/read', authMiddleware, markAsRead);
router.put('/notifications/read-all', authMiddleware, markAllAsRead);
router.delete('/notifications/clear', authMiddleware, clearAll);


module.exports = router;