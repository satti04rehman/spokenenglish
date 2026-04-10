const express = require('express');
const router = express.Router();
const { createStudent, getUsers, getUser, toggleUserStatus, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// All routes require authentication
router.use(auth);

router.post('/', authorize('admin', 'admin'), createStudent);
router.get('/', authorize('admin', 'admin'), getUsers);
router.get('/:id', authorize('admin', 'admin'), getUser);
router.patch('/:id/status', authorize('admin', 'admin'), toggleUserStatus);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
