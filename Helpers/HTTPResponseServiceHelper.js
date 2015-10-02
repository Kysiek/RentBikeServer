/**
 * Created by KMACIAZE on 01.10.2015.
 */

exports.responseWithStatusCodeAndObject = function(reponse,statusCode,responseObject) {
    reponse.status(statusCode).json(responseObject);
};