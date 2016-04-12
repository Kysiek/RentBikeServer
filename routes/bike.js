/**
 * Created by Kysiek on 13/10/15.
 */

var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');
var bikeService = require('../services/bikeService');
var userManagementService = require('../services/userManagementService');

exports.rentBike = function (req,res) {
    userManagementService.handleControllerUrl(req,res, function() {
        var bikeNumber = req.param("bikeNumber"),
            stationNumber = req.param("stationNumber");

        if(bikeNumber) {
            bikeService.rentBike(req.param("user"), bikeNumber, stationNumber, res);
        } else {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                470,
                {error: "You have to provide bike number"}
            );
        }
    });
};

exports.looseFromRack = function (req,res) {
    userManagementService.handleControllerUrl(req,res, function() {
        var bikeNumber = req.param("bikeNumber");
        if(bikeNumber) {
            bikeService.looseFromRack(req.param("user"), bikeNumber, res);
        } else {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                470,
                {error: "You have to provide bike number"}
            );
        }
    });

};

exports.getRented = function (req,res) {
    userManagementService.handleControllerUrl(req,res, function() {
        bikeService.getRentedBikes(req.param("user"), res);
    });

};

exports.returnBike = function (req,res) {
    userManagementService.handleControllerUrl(req,res, function() {
        var bikeNumber = req.param("bikeNumber"),
            stationNumber = req.param("stationNumber");

        console.log(bikeNumber, stationNumber);


        if(bikeNumber && stationNumber) {
            bikeService.returnBike(req.param("user"), bikeNumber, stationNumber, res);
        } else {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                480,
                {error: "You have to provide bike number and station number"}
            );
        }
    });
};