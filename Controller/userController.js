// const fs = require('fs');
const express = require('express');
const appError = require('../utilities/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utilities/catchAsync');
const factory = require('./handlerFactory');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const filterObj = (obj, ...allowedFields) => {
  const NewObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      NewObj[el] = obj[el];
    }
  });
  return NewObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user Post password
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new appError(
        'This Route is not For Password, Please go to /updateMyPassword route',
        400
      )
    );
  }

  // 2) Filtering out Unwanted Fieldds
  const filterBody = filterObj(req.body, 'name', 'email');

  // 3) Update user Documents

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUserByID = factory.getOne(User);
// Do not Update Password Using this Fucntion
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.createNewUser = factory.createOne(User);
