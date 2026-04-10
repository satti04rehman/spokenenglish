const express = require('express');
const router = express.Router();
const { createClass, getClasses, getClass, updateClass, joinClass, leaveClass } = require('../controllers/classController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// All routes require authentication
router.use(auth);

router.post('/', authorize('admin', 'admin'), createClass);
router.get('/', authorize('admin', 'admin', 'student'), getClasses);
router.get('/:id', authorize('admin', 'admin', 'student'), getClass);
router.patch('/:id', authorize('admin', 'admin'), updateClass);
router.get('/:id/join', authorize('admin', 'admin', 'student'), joinClass);
router.post('/:id/leave', authorize('admin', 'admin', 'student'), leaveClass);

module.exports = router;
