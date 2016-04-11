/**
 * Created by Kysiek on 13/10/15.
 */
var request = require('request');
var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');
var accountHistoryHtmlParser = require('../Helpers/AccountHistoryHtmlParser');
var config = require("../config/config");
var userManagementService = require('./userManagementService');

function proceedWithErrorInBikeRenting(res) {
    httpResponseServiceHelper.responseWithStatusCodeAndObject(
        res,
        471,
        {error: "Bike number not found"}
    );
}

function handleResponseFromRentingBike(res, body) {
    if(body.indexOf(config.BikeNumberNotFoundError) > -1
        && body.indexOf(config.BikeNumberNotFound) > -1) {
        proceedWithErrorInBikeRenting(res);
    } else if(body.indexOf(config.BikeNumberNotFoundError) == -1) {
        var lockNumberRegex = /<div style="text-align:center;font-size:16pt;font-weight:bold;">(\d{4,4})<\/div>Zwrot roweru/g;
        var matchedLockNumber = lockNumberRegex.exec(body);
        if(matchedLockNumber && matchedLockNumber[1]) {
            var lockNumber = matchedLockNumber[1];
            if (!isNaN(matchedLockNumber[1])) {
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
exports.rentBike = function(username, bikeNumber, res) {
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
            handleResponseFromRentingBike(res, body);
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
        handleResponseFromRentingBike(res, body);
    });
};