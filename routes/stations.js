/**
 * Created by Kysiek on 02/10/15.
 */
var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');
var stationsService = require('../services/stationService');
var userManagementService = require("../services/userManagementService");

exports.getAllStations = function (req,res) {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            254,
            stationsService.getStations()
        );
};