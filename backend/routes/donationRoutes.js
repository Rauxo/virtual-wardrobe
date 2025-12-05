const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  sendDonation,
  getDonations,
  acceptDonation,
  rejectDonation,
  cancelDonation
} = require('../controllers/donationController');

router.use(authMiddleware);

router.post('/send', sendDonation);
router.get('/', getDonations);
router.put('/:id/accept', acceptDonation);
router.post('/:id/reject', rejectDonation);
router.post('/:id/cancel', cancelDonation);

module.exports = router;