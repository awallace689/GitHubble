var createError = require('http-errors');
var express = require('express');
var app = express();
var githubRouter = require('./routes/gitHubble');
var environment = require('./environment.js');
var cors = require('cors')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.options('*', cors(environment.corsOptions))
// controller route prefixes
app.use('/api', githubRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   next(createError(500));
// });

module.exports = app;
