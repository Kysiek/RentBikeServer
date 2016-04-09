/**
 * Created by Kysiek on 02/10/15.
 */
var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');
var stationsService = require('../services/stationService');
var userManagementService = require("../services/userManagementService");

exports.getAllStations = function (req,res) {
    userManagementService.handleControllerUrl(req,res,function() {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            200,
            stationsService.getAllStations()
        );
    })
};

exports.getBikesForStation = function (req,res) {
    var stationNumber =  req.params.number;
    if(stationNumber) {
        userManagementService.handleControllerUrl(req,res,function() {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                200,
                stationsService.getBikesForStation(stationNumber)
            );
        })
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            463,
            []
        );
    }
};