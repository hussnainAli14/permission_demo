const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNCATCHED ACCEPTION >>> Shutting down....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DataBase COnnection Successfull');
  });

// const testTour = new Tour({
//   name: 'Bilal Rehman',
//   duration: 23,
//   price: 500,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//     console.log('Record inserted Succesfully');
//   })
//   .catch((err) => {
//     console.log('THEERES+ IS ERROR ' + err);
//   });

const port = 3000;
const server = app.listen(port, () => {
  console.log('App os runing /.....');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDELD REJECTION >>> Shutting down');
  server.close(() => {
    process.exit(1);
  });
});
