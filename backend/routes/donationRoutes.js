const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const donationController = require('../controllers/donationController');

// All routes require authentication
router.use(authMiddleware);

// Donation routes
router.post('/send', donationController.sendDonation);
router.get('/', donationController.getDonations);
router.get('/pending', donationController.getPendingDonations);
router.post('/:id/accept', donationController.acceptDonation);
router.post('/:id/cancel', donationController.cancelDonation);

module.exports = router;