var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

// connection to mongodb
mongoose.connect('mongodb://localhost:27017/kicker');

var port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

// add router
require('./controllers/routes')(app);

app.listen(port);
console.log('Listening on port ' + port);

exports = module.exports = app;
