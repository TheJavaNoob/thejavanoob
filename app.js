var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Front page
app.use('/', express.static(path.join(__dirname, 'frontpage/public')));

//Footsteps module
app.use("/footsteps", express.static(path.join(__dirname, 'footsteps/public')));
const footstepsResponder = require('./footsteps/routes/responder');
app.use('/footsteps', footstepsResponder);

//ProgramNotes module
app.use("/programnotes", express.static(path.join(__dirname, 'programnotes/public')));
const programNotesResponder = require('./programnotes/routes/responder');
app.use('/programnotes', programNotesResponder);

//Posts module
app.use("/posts", express.static(path.join(__dirname, 'posts/public')));

//API module
const apiResponder = require('./api/responder');
app.use("/api", apiResponder);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    res.end();
});

app.listen(8080, () => {
    console.log('Server started on port 8080');
});

module.exports = app;
