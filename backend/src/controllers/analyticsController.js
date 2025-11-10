const Task = require('../models/Task');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get analytics (Admin only)
// @route   GET /api/v1/analytics
// @access  Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    // Task statistics by status
    const tasksByStatus = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Task statistics by priority
    const tasksByPriority = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    // Total users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Total tasks
    const totalTasks = await Task.countDocuments();

    // Tasks created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTasks = await Task.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json(new ApiResponse(200, {
      tasksByStatus,
      tasksByPriority,
      overdueTasks,
      totalUsers,
      activeUsers,
      totalTasks,
      recentTasks
    }, 'Analytics retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
