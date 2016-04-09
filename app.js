var express = require('express');
var http = require('http');
var account = require('./routes/account');
var bodyParser  = require('body-parser');
var stations = require('./routes/stations');
var stationsService = require('./services/stationService');
var bikes = require('./routes/bike');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

stationsService.init(60000);

app.post('/account/login', account.loginUser);
app.get('/account/logged', account.checkIfLogged);
app.get('/account/logout', account.logoutUser);
app.get('/account/history', account.getAccountHistory);
app.post('/bike/rent', bikes.rentBike);
app.post('/bike/loose', bikes.looseFromRack);
app.get('/stations/all', stations.getAllStations);
app.get('/stations/:number/bikes',stations.getBikesForStation);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Starting HTTP server on port " + app.get('port'));
});