/**
 * Created by Kysiek on 13/10/15.
 */

var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');
var bikeService = require('../services/bikeService');
var userManagementService = require('../services/userManagementService');

exports.rentBike = function (req,res) {
    userManagementService.handleControllerUrl(req,res, function() {
        var bikeNumber = req.body["bikeNumber"];
        if(bikeNumber) {
            bikeService.rentBike(req.param("user"), bikeNumber, res);
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
        var bikeNumber = req.body["bikeNumber"];
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
