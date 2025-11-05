const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);

// update user - protect and allow only self-update
router.put('/:id', verifyToken, async (req, res, next) => {
  if (parseInt(req.params.id, 10) !== req.user.id) {
    return res.status(403).json({ message: 'You can only update your own user' });
  }
  next();
}, userController.updateUser);

// delete user - allow only self-delete
router.delete('/:id', verifyToken, async (req, res, next) => {
  if (parseInt(req.params.id, 10) !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete your own user' });
  }
  next();
}, userController.deleteUser);

module.exports = router;
