import express from 'express';
import * as userController from  '../controllers/userController';
import * as authController from  '../controllers/authController';

const router = express.Router();

// router.param('id', userController.checkId);

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.logIn);
router.route('/verifyjwt').post(authController.verifyJwt);

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
