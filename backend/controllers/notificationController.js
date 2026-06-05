const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
  const existing = await prisma.notification.findUnique({
    where: { id: req.params.id }
  });

  if (!existing) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (existing.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to mark this notification as read');
  }

  const notification = await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true }
  });
  res.json(notification);
});

// @desc    Create notification
// @access  Internal
exports.createNotification = async (userId, message) => {
  try {
    await prisma.notification.create({
      data: { userId, message }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
