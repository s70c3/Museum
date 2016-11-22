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
var ExpoModel    = require('./app/schemas').ExpoModel;
var HallModel    = require('./app/schemas').HallModel;
var ExhibitModel    = require('./app/schemas').ExhibitModel;
var ExcursionModel    = require('./app/schemas').ExcursionModel;
var StaffModel =  require('./app/schemas').StaffModel;
var TicketModel =  require('./app/schemas').TicketModel;
var TicketSaleModel =  require('./app/schemas').TicketSaleModel;
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

var get_function = function (req, res, model) {
    model.find(function(err, objects) {
        if (err)
            res.send(err);
        res.json(objects);
    });
};

var get_by_id_function = function (req, res, model) {
    model.findById(req.params.id, function(err, object) {
        if (err)
            res.send(err);
        res.json(object);
    });
};

var put_new_name_function = function (req, res, model) {
    model.findById(req.params.id, function(err, object) {

        if (err)
            res.send(err);

        object.name = req.body.name;  // update the bears info

        object.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Succefully updated!' });
        });

    });
};

var delete_function = function (req, res, model) {
   model.remove({
        _id: req.params.id
    }, function(err, object) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};

//museum
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
       get_function(req, res, MuseumModel)
    });

//do smb by id
router.route('/museums/:id')
    .get(function(req, res) {
        get_by_id_function(req, res, MuseumModel);
    })

    .put(function(req, res) {
        console.log(req.params.name);
        put_new_name_function(req, res, MuseumModel);
    })
    .delete(function(req, res) {
        delete_function(req, res, MuseumModel);
    });


//halls
router.route('/halls')
    .post(function (req, res) {

        var hall = new HallModel({
            name: req.body.name,
            museum: req.body.museum
        });
        hall.save(function (err) {
            if (err)
                res.send(err);
            else
                res.json({message: 'Hall created!'});
        });

    })

    .get(function (req, res) {
        get_function(req, res, HallModel)
    });

router.route('/halls/:id')
    .get(function (req, res) {
        get_by_id_function(req, res, HallModel);
    })

    .put(function (req, res) {
        put_new_name_function(req, res, HallModel);
    })
    .delete(function (req, res) {
        delete_function(req, res, HallModel);
    });
router.route('/halls/museum/:name')
    .get(function (req, res) {
        HallModel
            .findOne({ name: req.params.name })
            .populate('museum')
            .exec(function (err, hall) {
                if (err) res.send(err);
                res.json(hall.museum);
                console.log('The creator is %s', hall.museum.name);

            });
    })

    .get(function (req, res) {
        get_function(req, res, HallModel)
    });

//tickets
router.route('/tickets')
    .post(function (req, res) {

        var ticket = new TicketModel({
            name: req.body.name,
            museum: req.body.museum
        });
        console.log(req.body.name);
// save the bear and check for errors
        ticket.save(function (err) {
            if (err)
                res.send(err);
            else
                res.json({message: 'Ticket created!'});
        });

    })

    .get(function (req, res) {
        get_function(req, res, TicketModel)
    });

//do smb by id
router.route('/tickets/:id')
    .get(function (req, res) {
        get_by_id_function(req, res, TicketModel);
    })

    .put(function (req, res) {
        put_new_name_function(req, res, TicketModel);
    })
    .delete(function (req, res) {
        delete_function(req, res, TicketModel);
    });


//tickets
router.route('/sales')
    .post(function (req, res) {

        var sale = new TicketSaleModel({
            number: req.body.number,
            staff: req.body.staff,
            ticket: req.body.ticket
        });
// save the bear and check for errors
        sale.save(function (err) {
            if (err)
                res.send(err);
            else
                res.json({message: 'Ticket created!'});
        });

    })

    .get(function (req, res) {
        get_function(req, res, TicketSaleModel)
    });

//do smb by id
router.route('/sales/:id')
    .get(function (req, res) {
        get_by_id_function(req, res, TicketSaleModel);
    })

    .put(function (req, res) {
        put_new_name_function(req, res, TicketSaleModel);
    })
    .delete(function (req, res) {
        delete_function(req, res, TicketSaleModel);
    });



//staff
router.route('/staff')

    .post(function(req, res) {

        var staff = new StaffModel({
            name: req.body.name,
            surname : req.body.surname,

            second_name: req.body.second,
            age: req.body.age,
            contact: {
                phone : req.body.phone,
                email : req.body.mail,
                linkedin : req.body.linkedin
            }

        });

        // save the bear and check for errors
        staff.save(function(err) {
            if (err)
                res.send(err);
            else
                res.json({ message: 'Person created!' });
        });

    })

    .get(function(req, res) {
        get_function(req, res, StaffModel)
    });

//do smb by id
router.route('/museums/:id')
    .get(function(req, res) {
        get_by_id_function(req, res, StaffModel);
    })

    .put(function(req, res) {
        console.log(req.params.name);
        put_new_name_function(req, res, StaffModel);
    })
    .delete(function(req, res) {
        delete_function(req, res, StaffModel);
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
