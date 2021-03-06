const createError = require('http-errors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('../config/logger');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(helmet());
app.use(morgan('combined', { stream: logger.stream.write }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  logger.error(
    `${req.method} ${err.status || 500} ${req.originalUrl} ${req.ip} \n${
      err.stack
    }`,
  );

  // render the error page
  res.status(err.status || 500);
  res.json(res.locals.error);
});

module.exports = app;
