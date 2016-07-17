/**
 * Created by Kysiek on 13/10/15.
 */
var request = require('request');
var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');
var currentBikesHtmlParser = require('../Helpers/CurrentBikesHtmlParser');
var config = require("../config/config");
var userManagementService = require('./userManagementService');
var stationService = require('./stationService');

var bikeRentalToStartStation = {}

function proceedWithErrorInBikeRenting(res) {
    httpResponseServiceHelper.responseWithStatusCodeAndObject(
        res,
        471,
        {error: "Bike number not found"}
    );
}

function handleResponseFromRentingBike(res, body, bikeNumber, stationNumber) {
    if(body.indexOf(config.BikeNumberNotFoundError) > -1
        && body.indexOf(config.BikeNumberNotFound) > -1) {
        proceedWithErrorInBikeRenting(res);
    } else if(body.indexOf(config.BikeNumberNotFoundError) == -1) {
        var lockNumberRegex = /<div style="text-align:center;font-size:16pt;font-weight:bold;">(\d{4,4})<\/div>Zwrot roweru/g;
        var matchedLockNumber = lockNumberRegex.exec(body);
        if(matchedLockNumber && matchedLockNumber[1]) {
            var lockNumber = parseInt(matchedLockNumber[1]);
            if (!isNaN(matchedLockNumber[1])) {
                bikeRentalToStartStation[bikeNumber + "_" + lockNumber] = stationNumber;
                httpResponseServiceHelper.responseWithStatusCodeAndObject(
                    res,
                    200,
                    {"lockNumber": lockNumber}
                );
            } else {
                proceedWithErrorInBikeRenting(res);
            }
        } else {
            proceedWithErrorInBikeRenting(res);
        }
    } else {
        proceedWithErrorInBikeRenting(res);
    }
}
exports.rentBike = function(username, bikeNumber, stationNumber, res) {
        var formData = {};
        formData['quick'] = 1;
        formData['bike_no'] = bikeNumber;
        formData[config.ActionStringKeyFormData] = 'look_up';
        formData["PHPSESSID"] = userManagementService.getPHPSessionIDForUser(username);

        var j = request.jar();
        var cookie = request.cookie(userManagementService.getCookieForUser(username));
        j.setCookie(cookie, "https://nextbike.net/pl/m/home", function(error, cookie) {});

        request({
            url: "https://nextbike.net/pl/m/home",
            jar: j,
            method:"POST",
            formData:formData
        }, function (error, response, body) {
            handleResponseFromRentingBike(res, body, bikeNumber, stationNumber);
        });
};

exports.returnBike = function(username, bikeNumber, stationNumber, comment, res) {
    var formData = {};
    formData['new_return_street'] = stationNumber;
    formData['bike_no'] = bikeNumber;
    formData[config.ActionStringKeyFormData] = 'return';
    formData['return_place_id'] = stationService.getStationUIDByNumber(stationNumber);
    formData['cityId'] = 148;
    formData['end_street2'] = comment == undefined ? "test" : comment;
    formData["PHPSESSID"] = userManagementService.getPHPSessionIDForUser(username);

    var j = request.jar();
    var cookie = request.cookie(userManagementService.getCookieForUser(username));
    j.setCookie(cookie, "https://nextbike.net/pl/m/home", function(error, cookie) {});

    request({
        url: "https://nextbike.net/pl/m/home",
        jar: j,
        method:"POST",
        formData:formData
    }, function (error, response, body) {
        console.log(body);
        if(body.indexOf(config.ReturnBike) > -1) {

            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                200,
                {message:"success"}
            );
        } else {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                481,
                {message:"error"}
            );
        }


    });
};

exports.looseFromRack = function(username, bikeNumber, res) {

    var formData = {};
    formData['open_rack'] = 1;
    formData['bike_no'] = bikeNumber;
    formData[config.ActionStringKeyFormData] = 'look_up';
    formData["PHPSESSID"] = userManagementService.getPHPSessionIDForUser(username);

    var j = request.jar();
    var cookie = request.cookie(userManagementService.getCookieForUser(username));
    j.setCookie(cookie, "https://nextbike.net/pl/m/home", function(error, cookie) {});

    request({
        url: "https://nextbike.net/pl/m/home",
        jar: j,
        method:"POST",
        formData:formData
    }, function (error, response, body) {
        handleResponseFromRentingBike(res, body, bikeNumber);
    });
};
exports.getRentedBikes = function(username, res) {
    var j = request.jar();
    var cookie = request.cookie(userManagementService.getCookieForUser(username));
    j.setCookie(cookie, "https://nextbike.net/pl/m/home", function(error, cookie) {});

    request({
        url: "https://nextbike.net/pl/m/home",
        jar: j,
        method:"GET"
    }, function (error, response, body) {
        if(body.indexOf(config.CurrentBikesRecognizer) > -1) {
            console.log(body);
            currentBikesHtmlParser.parseCurrentBikesHtml(
                body,
                function(currentBikes) {
                    for (var i = 0; i < currentBikes.length; i++) {
                        currentBikes[i]["startStationNumber"] = bikeRentalToStartStation[currentBikes[i]["bikeNumber"] + "_" + currentBikes[i]["lockNumber"]]
                        currentBikes[i]["startStationName"] = stationService.getStationNameByNumber([currentBikes[i]["bikeNumber"] + "_" + currentBikes[i]["lockNumber"]])
                    }
                    httpResponseServiceHelper.responseWithStatusCodeAndObject(
                        res,
                        200,
                        currentBikes
                    );
                });

        } else {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                200,
                []
            );
        }
    });
};