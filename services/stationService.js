var http = require('http');
var parseString = require('xml2js').parseString;
var PeriodicTask = require('periodic-task');

var stationsInMemory;

function makeStationsFromObj(obj) {
    var placesArray = obj["markers"]["country"][0]["city"][0]["place"];
    var resultArray = [];
    //console.log(placesArray);
    for(var i = 0, x = placesArray.length; i < x; i++) {
        var place = placesArray[i]['$'];
        var listOfBikesString = place["bike_numbers"] && place["bike_numbers"].indexOf(",") > -1 ? place.bike_numbers.split(",") : ["0"],
            listOfBikes = [];
        listOfBikesString.forEach(function(entry) {
            if(entry !== "0") {
                listOfBikes.push(parseInt(entry));
            }
        });
        resultArray.push({
            "stationName": place.name,
            "stationNumber": parseInt(place.number),
            "numberOfAvailableBikes":listOfBikes.length,
            "bikeRacks":parseInt(place.bike_racks),
            "listOfBikes": listOfBikes,
            "latitude": Number(place.lat),
            "longitude": Number(place.lng)
        });
    }
    stationsInMemory = resultArray;
}
function downloadAndParseXMLStation() {
    var options = {
        host: 'nextbike.net',
        path: '/maps/nextbike-official.xml?city=148'
    };
    var callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            parseString(str, function (err, result) {
                makeStationsFromObj(result);
            });
        });
    };
    http.request(options, callback).end();
}
exports.init = function(delayTime) {
    var task = new PeriodicTask(delayTime, downloadAndParseXMLStation);
    task.run();
};
exports.getStations = function() {
    return stationsInMemory;
};