var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var index = require('./routes/index');
var users = require('./routes/users');


var MuseumModel    = require('./app/schemas').MuseumModel;
var HallModel    = require('./app/schemas').HallModel;
var ExpoModel    = require('./app/schemas').ExpoModel;
var HallModel    = require('./app/schemas').HallModel;
var ExhibitModel    = require('./app/schemas').ExhibitModel;
var ExcursionModel    = require('./app/schemas').ExcursionModel;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.listen(1337, function(){
    console.log('Magic happens on port 1337');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.route('/', function () {
    console.log('Running');
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', index);
app.use('/api', router);


router.route('/museums')

    .post(function(req, res) {

        var museum = new MuseumModel({
            name: req.body.name,
            address: req.body.address
        });
        console.log(req.body.name);
        // save the bear and check for errors
        museum.save(function(err) {
            if (err)
                res.send(err);
            else
            res.json({ message: 'Museum created!' });
        });

    })

    .get(function(req, res) {
        MuseumModel.find(function(err, museums) {
            if (err)
                res.send(err);
            res.json(museums);
        });
    });

//get museum by id
router.route('/museums/:id')
  .get(function(req, res) {
        MuseumModel.findById(req.params.id, function(err, museum) {
            if (err)
                res.send(err);
            res.json(museum);
        });
    })

    .put(function(req, res) {

        // use our bear model to find the bear we want
        MuseumModel.findById(req.params.id, function(err, museum) {

            if (err)
                res.send(err);

            museum.name = req.body.name;  // update the bears info

            // save the bear
            museum.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Museum updated!' });
            });

        });
    })
    .delete(function(req, res) {
        MuseumModel.remove({
            _id: req.params.id
        }, function(err, museum) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
