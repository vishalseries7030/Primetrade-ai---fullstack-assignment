const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/analytics:
 *   get:
 *     summary: Get analytics dashboard (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 */
router.get('/', protect, restrictTo('admin'), getAnalytics);

module.exports = router;
