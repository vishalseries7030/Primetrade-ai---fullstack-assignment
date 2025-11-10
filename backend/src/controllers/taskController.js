const Task = require('../models/Task');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// @desc    Create task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // If assignedTo is not provided, assign to self
    const assignedUser = assignedTo || req.user.id;

    // Verify assigned user exists
    const userExists = await User.findById(assignedUser);
    if (!userExists) {
      return next(new ApiError(404, 'Assigned user not found'));
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: assignedUser,
      createdBy: req.user.id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(new ApiResponse(201, { task: populatedTask }, 'Task created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private (Admin gets all, User gets own)
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;

    let query = {};

    // Users can only see tasks assigned to them or created by them
    if (req.user.role !== 'admin') {
      query.$or = [
        { assignedTo: req.user.id },
        { createdBy: req.user.id }
      ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Task.countDocuments(query);

    res.status(200).json(new ApiResponse(200, {
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }, 'Tasks retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return next(new ApiError(404, 'Task not found'));
    }

    // Check authorization
    if (req.user.role !== 'admin' && 
        task.assignedTo._id.toString() !== req.user.id && 
        task.createdBy._id.toString() !== req.user.id) {
      return next(new ApiError(403, 'Not authorized to access this task'));
    }

    res.status(200).json(new ApiResponse(200, { task }, 'Task retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ApiError(404, 'Task not found'));
    }

    // Check authorization
    if (req.user.role !== 'admin' && 
        task.createdBy.toString() !== req.user.id && 
        task.assignedTo.toString() !== req.user.id) {
      return next(new ApiError(403, 'Not authorized to update this task'));
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('assignedTo', 'name email').populate('createdBy', 'name email');

    res.status(200).json(new ApiResponse(200, { task }, 'Task updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ApiError(404, 'Task not found'));
    }

    // Only admin or task creator can delete
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return next(new ApiError(403, 'Not authorized to delete this task'));
    }

    await task.deleteOne();

    res.status(200).json(new ApiResponse(200, null, 'Task deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
