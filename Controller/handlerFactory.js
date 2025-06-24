const { Model } = require('mongoose');
const appError = require('./../utilities/appError');
const catchAsync = require('./../utilities/catchAsync');
const FeaturesAPI = require('./../utilities/features');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new appError('No doc found by this ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new appError('No doc found by this ID', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc) {
      return next(new appError('No doc found by this ID', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    // const tour = await Tour.findById(req.params.id).populate('guides');
    // const tour = await Tour.findOne({ _id: req.params.id });

    if (!doc) {
      return next(new appError('No doc found by this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });

    // const id = req.params.id * 1;
    // const tour = tours.find((el) => el.id == id);
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // for nested Routes
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const feature = new FeaturesAPI(Model.find(), req.query)
      .sorting()
      .filtering()
      .pagination()
      .limitingFields();

    const doc = await feature.queryy;

    res.status(200).json({
      status: 'success',
      length: doc.length,
      data: {
        doc,
      },
    });
  });
