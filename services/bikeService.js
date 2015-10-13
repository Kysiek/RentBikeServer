/**
 * Created by Kysiek on 13/10/15.
 */
var request = require('request');
var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');
var accountHistoryHtmlParser = require('../Helpers/AccountHistoryHtmlParser');
var config = require("../config/config");
var userManagementService = require('./userManagementService');

exports.rentBike = function(username, authKey, bikeNumber, res) {
    if(userManagementService.isUserAuthenticated(username,authKey)) {
        var formData = {};
        formData['quick'] = 1;
        formData['bike_no'] = 12332123;
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
            console.log(body);
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                200,
                body
            );
        });
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            401,
            {error: "You are not authenticated"}
        );
    }
};

exports.looseFromRack = function(username, authKey, bikeNumber, res) {
    if(userManagementService.isUserAuthenticated(username,authKey)) {

        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            200,
            "Not implemented"
        );

    }
};