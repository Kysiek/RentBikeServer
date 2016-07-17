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
                listOfBikes.push({"number": parseInt(entry)});
            }
        });
        resultArray.push({
            "stationName": place.name,
            "stationUID": place.uid,
            "stationNumber": parseInt(place.number),
            "numberOfAvailableBikes":listOfBikes.length,
            "bikeRacks":parseInt(place.bike_racks),
            "listOfBikes": listOfBikes,
            "location": {
                "latitude":Number(place.lat),
                "longitude": Number(place.lng)
            }
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

exports.getStationUIDByNumber = function(stationNumber) {
    for(var i = 0; i < stationsInMemory.length; i++) {
        if(stationsInMemory[i].stationNumber == stationNumber) {
            return stationsInMemory[i].stationUID;
        }
    }
};
exports.getStationNameByNumber = function(stationNumber) {
    for(var i = 0; i < stationsInMemory.length; i++) {
        if(stationsInMemory[i].stationNumber == parseInt(stationNumber)) {
            return stationsInMemory[i].stationName;
        }
    }
};

exports.init = function(delayTime) {
    var task = new PeriodicTask(delayTime, downloadAndParseXMLStation);
    task.run();
};
exports.getAllStations = function() {
    var resultObj = [];
    for(var i = 0, x = stationsInMemory.length; i < x; i++) {
        resultObj.push({
            "stationName": stationsInMemory[i]["stationName"],
            "stationNumber": stationsInMemory[i]["stationNumber"],
            "numberOfAvailableBikes":stationsInMemory[i]["numberOfAvailableBikes"],
            "bikeRacks":stationsInMemory[i]["bikeRacks"],
            "location": stationsInMemory[i]["location"]
        });
    }
    return resultObj;
};
exports.getBikesForStation = function(stationNumber) {
    var bikeListToReturn = [];
    for(var i = 0, x = stationsInMemory.length; i < x; i++) {
        if(stationNumber == stationsInMemory[i]["stationNumber"]) {
            bikeListToReturn = stationsInMemory[i]["listOfBikes"];
            break;
        }
    }

    return bikeListToReturn;
};