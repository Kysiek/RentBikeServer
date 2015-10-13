/**
 * Created by Kysiek on 13/10/15.
 */

var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');
var bikeService = require('../services/bikeService');

exports.rentBike = function (req,res) {
    var username = req.param("user"),
        authKey = req.param("authKey"),
        bikeNumber = req.param("bikeNumber");

    if(username && authKey && bikeNumber) {
        bikeService.rentBike(username, authKey, bikeNumber, res);
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            401,
            {error: "You have to provide username, authKey and bikeNumber"}
        );
    }
};

exports.looseFromRack = function (req,res) {
    var username = req.param("user"),
        authKey = req.param("authKey"),
        bikeNumber = req.param("bikeNumber");

    if(username && authKey && bikeNumber) {
        bikeService.looseFromRack(username, authKey, bikeNumber, res);
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            401,
            {error: "You have to provide username, authKey and bikeNumber"}
        );
    }
};
