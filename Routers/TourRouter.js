const express = require('express');
const router = express.Router();
const tourController = require('../Controller/tourController');
const authController = require('./../Controller/authController');
const revieRouter = require('./ReviewRouter');

router.param('id', tourController.checkID);

router.use('/:tourId/reviews', revieRouter);

// /tour-within/:distance/center/:latlng/unit/:unit
router
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithIn);

router
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getTourDistances);

router
  .route('/top-5-tours')
  .get(tourController.topCheapTours, tourController.getAllTours);

router.route('/alternation').get(tourController.alternation);
router
  .route('/busyestMonth/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getBusyestMonthOfYear
  );

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createNewTours
  );

router
  .route('/:id')
  .get(tourController.getToursByID)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTours
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTours
  );

module.exports = router;
