/**
 * Created by s70c3 on 21.11.16.
 */
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/museumDb');

var db = mongoose.connection;



db.on('error', function (err) {
    console.log.error('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});


var Schema = mongoose.Schema;

//Schemas

var Museum = new Schema({
    name :{type: String, required : true},
    address : String
});

var Hall = new Schema({
    name: String,
    museumId: Number
});

var Expo = new Schema({
    name: String,
    startDate: Number,
    endDate: Number,
    museumId: Number,
    hallId: Number
});

Expo.path('startDate').validate(function (value) {
    return value>Date(2000,1,1);
});

var Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

var Exhibit = new Schema({
    info : {
        name: String,
        images: [Images],
        author: String
    },
    hallId: Number
});

var TicketSale = new Schema({
    date: Number,
    number: Number,
    staffId: Number,
    ticket: Number
});

TicketSale.path('number').validate(function (value) {
    return value != null;
})

var Tickets = new Schema({
    name: String,
    price: Number
});

var Excursion = new Schema({
    time: Number,
    price : Number,
    maxPeople: Number,
    date: Number
});


module.exports.ExcursionModel = mongoose.model('Excursion', Excursion);
module.exports.TicketsModel = mongoose.model('Tickets', Tickets);
module.exports.TicketSaleModel = mongoose.model('TicketSale', TicketSale);
module.exports.ExhibitModel = mongoose.model('Exhibit', Exhibit );
module.exports.ExpoModel = mongoose.model('Expo', Expo);
module.exports.HallModel = mongoose.model('Hall', Hall );
module.exports.MuseumModel = mongoose.model('Museum', Museum);
