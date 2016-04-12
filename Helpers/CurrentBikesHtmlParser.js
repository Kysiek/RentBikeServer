/**
 * Created by Kysiek on 12/04/16.
 */

var htmlparser = require("htmlparser2");


exports.parseCurrentBikesHtml = function (htmldata, callback) {
    var inCurrentBikesListTag = false,
        inCurrentBikesTag = false,
        inCurrentBikeTag = false,
        inCurrentBikeATag = false,
        currentBikesData = [],
        parser = new htmlparser.Parser({
            onopentag: function(name, attribs){

                if(name === "ul" && attribs["data-role"] === "listview"){
                    inCurrentBikesListTag = true;
                } else if(inCurrentBikesListTag && name === "li" && attribs["data-role"] === "list-divider") {
                    inCurrentBikesTag = true;
                } else if(inCurrentBikesTag && name === "li") {
                    inCurrentBikeTag = true;
                } else if(inCurrentBikeTag && name === "a") {
                    inCurrentBikeATag = true;
                }
            },
            ontext: function(text){
                if(inCurrentBikeATag) {
                    var currentBikeEntry = exports.convertStringToCurrentBikeObj(text);
                    if(currentBikeEntry) {
                        currentBikesData.push(currentBikeEntry);
                    }
                }
            },
            onclosetag: function(tagname){
                if(inCurrentBikeATag && tagname === "a"){
                    inCurrentBikeATag = false;
                } else if(inCurrentBikeTag && tagname === "li"){
                    inCurrentBikeTag = false;
                } else if(inCurrentBikesListTag && inCurrentBikesTag && tagname === "ul") {
                    inCurrentBikesListTag = false;
                    inCurrentBikesTag = false;
                } else if(tagname === "html") {

                }
            },
            onend: function() {
                if(callback) {
                    callback(currentBikesData);
                }
            }
        }, {decodeEntities: true});
    parser.write(htmldata);
    parser.end();
};
exports.convertStringToCurrentBikeObj = function (currentBikeString) {
    // 57091 (4567)

    var currentBikeRegExp = /(\d{1,5})\s{1,3}\((\d\d\d\d)\)/g;

    var matchedCurrentBike = currentBikeRegExp.exec(currentBikeString);
    if(matchedCurrentBike) {
        return {
            bikeNumber: matchedCurrentBike[1],
            lockNumber: matchedCurrentBike[2]
        };
    }
    return false;
};