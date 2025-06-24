const express = require('express');
const reviewController = require('../Controller/reviewController');
const authController = require('../Controller/authController');

// router.param('id', tourController.checkID);

// router
//   .route('/top-5-tours')
//   .get(tourController.topCheapTours, tourController.getAllTours);

// router.route('/alternation').get(tourController.alternation);
// router.route('/busyestMonth/:year').get(tourController.getBusyestMonthOfYear);

const router = express.Router({ mergeParams: true });

router.unsubscribe(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.nestedFun,
    reviewController.createNewReview
  );

router
  .route('/:id')
  .get(reviewController.getReviewByID)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReviews
  );

module.exports = router;
