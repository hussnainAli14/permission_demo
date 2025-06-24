const express = require('express');
const catchAsync = require('./../utilities/catchAsync');
const appError = require('../utilities/appError');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.nestedFun = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.tourId;
  next();
};

exports.createNewReview = factory.createOne(Review);

exports.getReviewByID = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReviews = factory.deleteOne(Review);
