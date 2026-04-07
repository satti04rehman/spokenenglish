const express = require('express');
const router = express.Router();
const { createClass, getClasses, getClass, updateClass, joinClass, leaveClass } = require('../controllers/classController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// All routes require authentication
router.use(auth);

router.post('/', authorize('admin', 'teacher'), createClass);
router.get('/', authorize('admin', 'teacher', 'student'), getClasses);
router.get('/:id', authorize('admin', 'teacher', 'student'), getClass);
router.patch('/:id', authorize('admin', 'teacher'), updateClass);
router.get('/:id/join', authorize('admin', 'teacher', 'student'), joinClass);
router.post('/:id/leave', authorize('admin', 'teacher', 'student'), leaveClass);

module.exports = router;
