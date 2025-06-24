const e = require('express');
const express = require('express');
const TourRouter = require('./Routers/TourRouter');
const UserRouter = require('./Routers/UserRouter');
const reviewRoute = require('./Routers/ReviewRouter');
const appError = require('./utilities/appError');
const globelErrorConrtoller = require('./Controller/errorController');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongooseSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

app.use(express.json());

// Globel MiddleWare

// secureing HtTP header

app.use(helmet());

// Limiting the Request of same api

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests Please Try Again, After an Hour',
});
app.use('/api', limiter);

// body parser in Req.Body

app.use(express.json({ limit: '10kb' }));

// Data sanitizing against NoSQL query

app.use(mongooseSanitize());

// Data sanitizing xss Attacl

app.use(xss());

// Prevent Paremeter Pollution

app.use(
  hpp({
    whitelist: ['duration', 'ratingQuantitu', 'ratingAverage'],
  })
);
// app.post('/api/v1/tours', createNewTours);
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getToursByID);
// app.patch('/api/v1/tours/:id', updateTours);
// app.delete('/api/v1/tours/:id', deleteTours);

//MIDDLEWARE

app.use('/api/v1/tours', TourRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/reviews', reviewRoute);

app.all('*', (req, res, next) => {
  next(
    new appError(`Requested Page : ${req.originalUrl} not on this server`, 404)
  );
});
app.use(globelErrorConrtoller);
module.exports = app;
