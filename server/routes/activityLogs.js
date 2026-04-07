const express = require('express');
const router = express.Router();
const { getActivityLogs, createActivityLog, getActivityStats } = require('../controllers/activityLogController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.use(auth);

router.get('/stats', authorize('admin', 'teacher'), getActivityStats);
router.get('/', authorize('admin', 'teacher', 'student'), getActivityLogs);
router.post('/', authorize('admin', 'teacher', 'student'), createActivityLog);

module.exports = router;
