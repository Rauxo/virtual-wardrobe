const cron = require('node-cron');
const { getSmartOutfit } = require('../services/smartOutfitAI');
const { createNotification } = require('../controllers/notificationController');
const User = require('../models/User');

console.log('AI Outfit Notifier Started');

cron.schedule('0 8 * * *', async () => {
  try {
    const users = await User.find().limit(10);
    const outfit = await getSmartOutfit();
    if (!outfit) return;

    for (const user of users) {
      await createNotification({
        userId: user._id,
        title: outfit.title,
        message: outfit.message,
        type: 'outfit_suggestion',
        data: {
          top: { name: outfit.top.name, color: outfit.top.color, category: outfit.top.category },
          bottom: { name: outfit.bottom.name, color: outfit.bottom.color, category: outfit.bottom.category },
          matchScore: outfit.isGoodMatch ? 'Perfect' : 'Bold'
        }
      });
    }
    console.log('Outfit notification sent!');
  } catch (err) {
    console.log('Error:', err.message);
  }
});