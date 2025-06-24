const fs = require('fs');
const express = require('express');
const Tour = require('./../models/tourModel');
const { query } = require('express');
const catchAsync = require('./../utilities/catchAsync');
const appError = require('../utilities/appError');
const factory = require('./handlerFactory');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fails',
      message: 'invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next, val) => {
  if (!req.body.name === '') {
    return res.status(404).json({
      status: 'fails',
      message: 'Name or Price is Missinggg',
    });
  }
  next();
};

exports.topCheapTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getBusyestMonthOfYear = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const stats = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    length: stats.length,
    data: {
      stats,
    },
  });
});
exports.alternation = catchAsync(async (req, res, next) => {
  // {
  //   $match: { ratingsAverage: { $gte: 4.5 } },
  // },
  // {
  //   $group: {
  //     // _id:null,
  //     // _id:'difficulty',
  //     _id: { $toUpper: 'difficulty' },
  //     numRatings: { $sum: '$ratingQuantity' },
  //     numTours: { $sum: 1 },
  //     avgRating: { $avg: '$ratingsAverage' },
  //     avgPrice: { $avg: '$price' },
  //     minPrice: { $min: '$price' },
  //     maxPrice: { $max: '$price' },
  //   },
  // },
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5,
        },
      },
    },
    {
      $group: {
        _id: '$difficulty',
        numTour: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// /tour-within/:distance/center/:latlng/unit/:unit

exports.getTourWithIn = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new appError(
        'Please provide latitude and longittude in formate lat,lng',
        400
      )
    );
  }

  const tour = await Tour.find({
    startLocatio: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    result: tour.length,
    data: {
      data: tour,
    },
  });
});
exports.getTourDistances = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(
      new appError(
        'Please provide latitude and longittude in formate lat,lng',
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: 0.001,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      distances,
    },
  });
});

exports.getAllTours = factory.getAll(Tour);
exports.getToursByID = factory.getOne(Tour, { path: 'reviews' });
exports.updateTours = factory.updateOne(Tour);
exports.deleteTours = factory.deleteOne(Tour);
exports.createNewTours = factory.createOne(Tour);
