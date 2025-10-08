const Notification = require('../models/notificationModel');

const sendNotification = async (userId, message, type) => {
  await Notification.create({
    userId,
    message,
    type,
    isRead: false,
  });
};

module.exports = sendNotification;