const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const authController = require('../Controller/authController');

router.get(
  '/getMe',
  authController.protect,
  userController.getMe,
  userController.getUserByID
);

router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
// Protect all Routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router
  .route('/:id')
  .get(userController.getUserByID)
  .patch(userController.updateUser)
  .delete(
    authController.restrictTo('admin', 'lead-guide'),
    userController.deleteUser
  );

module.exports = router;
