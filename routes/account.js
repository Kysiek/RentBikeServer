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
            401,
            {error: "You have provide a phone number and a pin number"}
        );
    }
};

exports.logoutUser = function (req, res) {
    var username = req.param("user"),
        authKey = req.param("authKey");
    if(username && authKey) {
        userManagementService.logoutUser(username, authKey, res);
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            401,
            {error: "You have provide a phone number and authKey"}
        );
    }
};
exports.checkIfLogged = function (req, res) {
    var username = req.param("user"),
        authKey = req.param("authKey");
    if(username && authKey) {
        userManagementService.checkIfLogged(username, authKey, res);
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            401,
            {error: "You have provide a phone number and authKey"}
        );
    }
};
exports.getAccountHistory = function (req, res) {
    var username = req.param("user"),
        authKey = req.param("authKey");
    if(username && authKey) {
        userManagementService.getAccountHistory(username, authKey, res);
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            401,
            {error: "You have provide a phone number and authKey"}
        );
    }
};