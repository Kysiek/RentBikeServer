/**
 * Created by KMACIAZE on 01.10.2015.
 */

var request = require('request');
var httpResponseServiceHelper = require('../Helpers/HTTPResponseServiceHelper');
var accountHistoryHtmlParser = require('../Helpers/AccountHistoryHtmlParser');
var config = require("../config/config");


var userNameAuthInfoMap = {};

function getRightCookie(cookieArray) {
    for(var i = cookieArray.length - 1; i > -1; i-- ) {
        if(cookieArray[i].indexOf(config.RightCookieRecognizer) > -1) {
            return cookieArray[i];
        }
    }
}
function getPHPSessionID(cookieArray) {
    var cookieString = cookieArray[0];
    return cookieString.split(";")[0].split("=")[1];
}
function makeAuthId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.isUserAuthenticated = function(username, authKey) {
    return userNameAuthInfoMap[username] && userNameAuthInfoMap[username].authKey === authKey;
};

exports.authenticateUser = function (username, password, response) {
    var formData = {};
    formData[config.UsernameStringKeyFormData] = username;
    formData[config.PinStringFormKeyData] = password;
    formData[config.ActionStringKeyFormData] = config.ActionLoginStringValueForm;

    request.post(

        {url:config.AccountUrl, formData: formData},
        function optionalCallback(err, httpResponse) {

        if (err) {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                response,
                461,
                {error: "Cannot sign in"}
            );
        }
        var headers = httpResponse.headers;
        if (httpResponse.statusCode === 302 &&
            httpResponse.body.indexOf(config.LoginSuccessfulRecognizer)) {
            console.log(headers["set-cookie"]);
            userNameAuthInfoMap[username] = {
                cookie: getRightCookie(headers["set-cookie"]),
                authKey: makeAuthId(),
                phpSessionID: getPHPSessionID(headers["set-cookie"])
            };
            console.log(userNameAuthInfoMap[username].phpSessionID);
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                response,
                200,
                {authKey: userNameAuthInfoMap[username].authKey, username: username}
            );

        } else {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                response,
                461,
                {error: "Cannot sign in"}
            );
        }
    });
};

exports.logoutUser = function(username,res) {
    delete userNameAuthInfoMap[username];
    httpResponseServiceHelper.responseWithStatusCodeAndObject(
        res,
        200,
        {success: "Successfully logout"}
    );
};
exports.getCookieForUser = function(username) {
    return userNameAuthInfoMap[username].cookie;
};
exports.getPHPSessionIDForUser = function(username) {
    return userNameAuthInfoMap[username].phpSessionID;
};
exports.getAccountHistory = function(username, res) {
    var j = request.jar();
    var cookie = request.cookie(userNameAuthInfoMap[username].cookie);
    j.setCookie(cookie, config.AccountHistoryUrl, function(error, cookie) {});
    request({
        url: config.AccountHistoryUrl,
        jar: j,
        method:"GET"
    }, function (error, response, body) {

        if(body.indexOf(config.AccountHistoryRecognizer) > -1) {

            accountHistoryHtmlParser.parseAccountHistoryHtml(

                body,
                function(accountHistory) {
                    httpResponseServiceHelper.responseWithStatusCodeAndObject(
                        res,
                        200,
                        accountHistory
                    );
            });

        } else {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                401,
                {error: "You are not authenticated"}
            );
        }
    });
};
exports.checkIfLogged = function(username, authKey, response) {
    httpResponseServiceHelper.responseWithStatusCodeAndObject(
        response,
        253,
        {success: "You are authenticated"}
    );
};
exports.handleControllerUrl = function (req,res, callback) {
    var username = req.param("user"),
        authKey = req.param("authKey");
    if(username && authKey) {
        if(exports.isUserAuthenticated(username, authKey)) {
            callback()
        } else {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                res,
                401,
                {error: "You are not authenticated"}
            );
        }
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            res,
            462,
            {error: "You have to provide username and authKey"}
        );
    }

};

