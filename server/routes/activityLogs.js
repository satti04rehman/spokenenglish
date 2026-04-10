const express = require('express');
const router = express.Router();
const { getActivityLogs, createActivityLog, getActivityStats } = require('../controllers/activityLogController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.use(auth);

router.get('/stats', authorize('admin', 'admin'), getActivityStats);
router.get('/', authorize('admin', 'admin', 'student'), getActivityLogs);
router.post('/', authorize('admin', 'admin', 'student'), createActivityLog);

module.exports = router;
