/**
 * Created by KMACIAZE on 01.10.2015.
 */


var htmlparser = require("htmlparser2");
var stationsService = require("../services/stationService");
var config = require("../config/config");


exports.parseAccountHistoryHtml = function (htmldata, callback) {
    var inAccountHistoryListTag = false,
        inAccountHistoryTag = false,
        accountHistoryEntry = false,
        accountHistoryPriceEntry = false,
        currentAccountHistoryEntry = {},
        accountHistoryData = [],
         parser = new htmlparser.Parser({
            onopentag: function(name, attribs){

                if(name === "ul" && attribs["data-role"] === "listview"){
                    inAccountHistoryListTag = true;
                } else if(inAccountHistoryListTag && name === "li" && attribs["data-role"] !== "list-divider") {
                    console.log("inAccountHistoryListTag   ");
                    inAccountHistoryTag = true;
                } else if(inAccountHistoryTag && name === "span" && attribs.class === "ui-li-aside") {
                    accountHistoryPriceEntry = true;
                } else if(inAccountHistoryTag && name === "span") {
                    accountHistoryEntry = true;
                }
            },
            ontext: function(text){
                if(accountHistoryEntry) {
                    var currentAccountHistoryEntry = exports.convertStringToAccountHistoryObj(text);
                    if(currentAccountHistoryEntry) {
                        accountHistoryData.push(currentAccountHistoryEntry);
                    }
                } else if(accountHistoryPriceEntry) {
                    //TODO: do something with the cost
                }
            },
            onclosetag: function(tagname){
                if(accountHistoryPriceEntry && tagname === "span"){
                    accountHistoryPriceEntry = false;
                } else if(accountHistoryEntry && tagname === "span"){
                    accountHistoryEntry = false;
                } else if(inAccountHistoryTag && tagname === "li") {
                    inAccountHistoryTag = false;
                } else if(!inAccountHistoryTag && inAccountHistoryListTag && tagname === "ul") {
                    inAccountHistoryListTag = false;
                } else if(tagname === "html") {

                }
            },
            onend: function() {
                if(callback) {
                    callback(accountHistoryData);
                }
            }
        }, {decodeEntities: true});
    parser.write(htmldata);
    parser.end();
};
exports.convertStationsIntoNumbers = function (accountHistoryString) {
    var stationNumbersMap = config.stationsNameNumberMap;
    for (var stationName in stationNumbersMap) {
        if (stationNumbersMap.hasOwnProperty(stationName)) {
            accountHistoryString = accountHistoryString.replace(stationName,stationNumbersMap[stationName]);
        }
    }
    return accountHistoryString;
};
function convertStationIdToStationName(stationId) {

}
exports.convertStringToAccountHistoryObj = function (accountHistoryString) {
    // 19.09.15 04:23 Rower 57091 do  04:29:11 (Plac Nowy Targ  - Plac Grunwaldzki - Polaka)
    var accountHistoryStationsConvertedString = exports.convertStationsIntoNumbers(accountHistoryString);

    var accountHistoryRegExp = /(\d\d\.\d\d\.\d\d)\s{1,3}(\d\d\:\d\d)\s{1,3}([a-z|A-Z]{1,10})\s{1,3}(\d{1,6})\s{1,3}\w{1,3}\s{1,3}(\d\d:\d\d:\d\d)\s{1,3}\((\d{1,6})\s{1,3}\-\s{1,3}(\d{1,6})\)/g;

    var matchedAccountHistory = accountHistoryRegExp.exec(accountHistoryStationsConvertedString);
    if(matchedAccountHistory) {
        var startDay = matchedAccountHistory[1];
        startDay = startDay.replace(".13",".2013");
        startDay = startDay.replace(".14",".2014");
        startDay = startDay.replace(".15",".2015");
        startDay = startDay.replace(".16",".2016");
        return {
            startDay: startDay,
            startTime: matchedAccountHistory[2],
            endTime: matchedAccountHistory[5],
            bikeNumber: matchedAccountHistory[4],
            stationFrom: convertStationIdToStationName(matchedAccountHistory[6]),
            stationTo: matchedAccountHistory[7]
        };
    }
    return false;
};