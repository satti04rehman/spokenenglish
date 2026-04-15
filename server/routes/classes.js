const express = require('express');
const router = express.Router();
const { createClass, getClasses, getClass, updateClass, joinClass, leaveClass } = require('../controllers/classController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// All routes require authentication
router.use(auth);

router.post('/', authorize('admin'), createClass);
router.get('/', authorize('admin'), getClasses);
router.get('/:id', authorize('admin'), getClass);
router.patch('/:id', authorize('admin'), updateClass);
router.get('/:id/join', authorize('admin'), joinClass);
router.post('/:id/leave', authorize('admin'), leaveClass);

module.exports = router;
