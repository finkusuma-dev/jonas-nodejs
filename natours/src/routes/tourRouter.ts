import express from 'express';
import * as tourController from '../controllers/tourController';
// const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkId);
// router.post('/'.tourController.checkBody);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTop5Cheap, tourController.getAllTours);

router.route('/stats').get(tourController.getStats);
router.route('/monthly-plan').get(tourController.monthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createNewTour);

router
  // .param('id', tourController.checkId)
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
