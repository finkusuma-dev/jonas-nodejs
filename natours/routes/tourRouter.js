const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkId);
// router.post('/'.tourController.checkBody);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createNewTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
