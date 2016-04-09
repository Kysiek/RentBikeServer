var userManagementService = require("../services/userManagementService");

var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');

exports.loginUser = function(req, res) {
    var username = req.body["user"],
        password = req.body["pass"];
    if(username && password) {
        userManagementService.authenticateUser(username, password, res);
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            460,
            {error: "You have provide a phone number and a pin number"}
        );
    }
};

exports.logoutUser = function (req, res) {
    userManagementService.handleControllerUrl(req,res, function() {
        userManagementService.logoutUser(req.param("user"),res);
    });
};
exports.checkIfLogged = function (req, res) {
    userManagementService.handleControllerUrl(req,res, function() {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            200,
            {success: "You are authenticated"}
        );
    });
};


exports.getAccountHistory = function (req, res) {
    userManagementService.handleControllerUrl(req,res, function() {
        userManagementService.getAccountHistory(req.param("user"),res);
    });

};