import express from 'express';
import * as userController from  '../controllers/userController';
import * as authController from  '../controllers/authController';

const router = express.Router();

// router.param('id', userController.checkId);

router.post('/signup',authController.signUp);
router.post('/login',authController.logIn);
// router.route('/verifyjwt').post(authController.verifyJwt);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.verifyJwt, 
    authController.restrictTo('admin', 'lead-guide'),
    userController.deleteUser
  );

module.exports = router;
