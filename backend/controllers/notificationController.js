const Notification = require('../models/notificationModel');

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

module.exports = { getNotifications, markAsRead };