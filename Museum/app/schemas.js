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
    name :{type: String, required : true, index : true},
    address : String,
});


var Hall = new Schema({
    name: String,
    museum:  { type: Schema.ObjectId, ref: 'Museum' }
});

var Expo = new Schema({
    name: { type : String,index : true},
    startDate: Date,
    endDate: Date,
    museum: { type: Schema.ObjectId, ref: 'Museum' },
    hall: { type: Schema.ObjectId, ref: 'Hall' }
});

Expo.path('startDate').validate(function (value) {
    return value > new Date(2000,1,1);
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

var Tickets = new Schema({
    name: {type: String, required : true},
    price: Number
});

var TicketSale = new Schema({
    date: {type:Date, default: Date.now},
    number: { type: Number, required:true, unique : true},
    staffId:  { type: Schema.ObjectId, ref: 'Staff' },
    ticket: { type: Schema.ObjectId, ref: 'Ticket' }
});
TicketSale.path('number').validate(function (value) {
    return (value > 0);
});


var Excursion = new Schema({
    name: { type : String,index : true},
    time: Number,
    price : Number,
    maxPeople: Number,
    date: { type : Date, index : true},
    staff:  { type: Schema.ObjectId, ref: 'Staff' }
});

var Staff = new Schema({
    name: {type: String, required: true, index : true},
    surname: {type: String, required: true, index : true},
    second_name: String,
    age: Number,
    contact: {
        phone : Number,
        email : String,
        linkedin : String
    },
    created_at: Date,
    updated_at: Date
});



Staff.method.get_full_name = function () {
    return this.name + ' ' + this.second_name + ' ' + this.surname;
}

module.exports.ExcursionModel = mongoose.model('Excursion', Excursion);
module.exports.TicketsModel = mongoose.model('Tickets', Tickets);
module.exports.TicketSaleModel = mongoose.model('TicketSale', TicketSale);
module.exports.ExhibitModel = mongoose.model('Exhibit', Exhibit );
module.exports.ExpoModel = mongoose.model('Expo', Expo);
module.exports.HallModel = mongoose.model('Hall', Hall );
module.exports.MuseumModel = mongoose.model('Museum', Museum);
module.exports.StaffModel = mongoose.model('Staff', Staff);