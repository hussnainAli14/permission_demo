const mongoose = require('mongoose');
const User = require('./userModel');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      minLength: [10, 'A tour must hace name with character more then 10'],
      maxlength: [40, 'A tour must have name with character more then 40'],
    },
    duration: Number,
    maxGroupSize: {
      type: Number,
      required: [true, 'A Group must have MaxNumber'],
    },
    difficulty: {
      type: String,
      required: [true, 'A Group must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be Easy,Medium and Hard',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Min ratting must be 1'],
      max: [5, 'Max rating no more then 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have image cover'],
    },
    image: [String],
    createAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    rating: {
      type: Number,
      default: 4.5,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    price: {
      type: Number,
      required: [true, 'a tuor must have price'],
    },
    priceDiscount: Number,
    // guides: Array,
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//Virtual pupulates

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre('save', async function (next) {
  const guidPromise = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidPromise);
  next();
});

tourSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('tours', tourSchema);

module.exports = Tour;
