import express from 'express';
import * as tourController from '../controllers/tourController';
// const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkId);
// router.post('/'.tourController.checkBody);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createNewTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
