const appError = require('./../utilities/appError');

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new appError(message, 400);
};

const handleDublicateValues = (err) => {
  const value = err.keyValue.name;
  const message = `The value is dublicate : ${value}, Please Try Another Value.`;
  return new appError(message, 400);
};

const handleDatabaseValidationError = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Error: ${error.join('. ')}`;
  return new appError(message, 400);
};
const handleJWTExpiredError = () => {
  return new appError('This token is expired..Please Login Again!!', 401);
};

const handleJWTError = () => {
  return new appError('Invalid Token..Please Login Again!!', 401);
};

const sendErrorToDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrorToProd = (err, res) => {
  //Operational, tursted error :send messae to client

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programing   or other error : dont leak error deatils
    //1 . log error
    console.log('ERROR', err);

    //2 . send generic message
    res.status(500).json({
      status: 'Error',
      message: 'Something went very Wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    var error = err;
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDublicateValues(error);
    if (error.name === 'ValidationError')
      error = handleDatabaseValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenErrorExpired') error = handleJWTExpiredError();

    sendErrorToProd(error, res);
  }
};
