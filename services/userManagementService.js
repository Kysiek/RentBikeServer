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

function makeAuthId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.isUserAuthenticated = function(username, authKey) {
    return userNameAuthInfoMap[username].authKey === authKey;
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
                401,
                {error: "Cannot sign in"}
            );
        }
        var headers = httpResponse.headers;
        if (httpResponse.statusCode === 302 &&
            httpResponse.body.indexOf(config.LoginSuccessfulRecognizer)) {

            userNameAuthInfoMap[username] = {
                cookie: getRightCookie(headers["set-cookie"]),
                authKey: makeAuthId()
            };

            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                response,
                251,
                {authKey: userNameAuthInfoMap[username].authKey, username: username}
            );

        } else {
            httpResponseServiceHelper.responseWithStatusCodeAndObject(
                response,
                401,
                {error: "Something has gone wrong"}
            );
        }
    });
};

exports.logoutUser = function(username, authKey, response) {
    if(exports.isUserAuthenticated(username, authKey)) {
        delete userNameAuthInfoMap[username];
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            response,
            252,
            {success: "Successfully logout"}
        );
    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            response,
            401,
            {error: "You are not authenticated"}
        );
    }
};

exports.getAccountHistory = function(username, authKey, response) {
    if(exports.isUserAuthenticated(username, authKey)) {
        var j = request.jar();
        var cookie = request.cookie(userNameAuthInfoMap[username].cookie);
        j.setCookie(cookie, config.AccountUrl, function(error, cookie) {});
        request({
            url: config.AccountUrl,
            jar: j,
            method:"GET"
        }, function (error, response, body) {

            if(body.indexOf(config.AccountHistoryRecognizer) > -1) {

                accountHistoryHtmlParser.parseAccountHistoryHtml(

                    body,
                    function(accountHistory) {
                        httpResponseServiceHelper.responseWithStatusCodeAndObject(
                            response,
                            200,
                            accountHistory
                        );
                });

            } else {
                httpResponseServiceHelper.responseWithStatusCodeAndObject(
                    response,
                    401,
                    {error: "You are not authenticated"}
                );
            }
        });

    } else {
        httpResponseServiceHelper.responseWithStatusCodeAndObject(
            response,
            401,
            {error: "You are not authenticated"}
        );
    }
};
