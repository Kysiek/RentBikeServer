/**
 * Created by KMACIAZE on 01.10.2015.
 */

exports.responseWithStatusCodeAndObject = function(response,statusCode,responseObject) {
    response.status(statusCode).json(responseObject);
};