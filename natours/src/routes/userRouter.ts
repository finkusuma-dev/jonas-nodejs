import express from 'express';
import * as userController from  '../controllers/userController';
import * as authController from  '../controllers/authController';

const router = express.Router();

// router.param('id', userController.checkId);

router.route('/signup').post(authController.signUp);
router.route('/signin').post(authController.signIn);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
