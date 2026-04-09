const express = require('express');
const router = express.Router();
const { createStudent, getUsers, getUser, toggleUserStatus, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// All routes require authentication
router.use(auth);

router.post('/', authorize('admin', 'teacher'), createStudent);
router.get('/', authorize('admin', 'teacher'), getUsers);
router.get('/:id', authorize('admin', 'teacher'), getUser);
router.patch('/:id/status', authorize('admin', 'teacher'), toggleUserStatus);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
