/**
 * Created by KMACIAZE on 01.10.2015.
 */
var expect = require("chai").expect;
var should = require("should");
var accountHistoryParser = require("../Helpers/AccountHistoryHtmlParser");

describe("HTML parser", function() {
   describe("Making account history object from string", function() {
       it("Should return account history string with station numbers", function () {
           var accountHistory = accountHistoryParser.convertStationsIntoNumbers("02.08.15 15:45 Rower 57525 do  15:58:19 (Teatralna - Piotra Skargi  - Plac Grunwaldzki - Polaka)");
           accountHistory.should.be.exactly("02.08.15 15:45 Rower 57525 do  15:58:19 (5941  - 5932)");
       });
       it("Should create account history object", function () {
           var accountHistory = accountHistoryParser.convertStringToAccountHistoryObj("02.08.15 15:45 Rower 57525 do  15:58:19 (Teatralna - Piotra Skargi  - Plac Grunwaldzki - Polaka)");
           accountHistory.bikeNumber.should.be.defined;
           accountHistory.endTime.should.be.defined;
           accountHistory.startDay.should.be.defined;
           accountHistory.stationTo.should.be.defined;
           accountHistory.stationFrom.should.be.defined;
           accountHistory.startTime.should.be.defined;
       });
       it("Should convert to the account history correctly", function () {
           var accountHistory = accountHistoryParser.convertStringToAccountHistoryObj("02.08.15 15:45 Rower 57525 do  15:58:19 (Teatralna - Piotra Skargi  - Plac Grunwaldzki - Polaka)");
           accountHistory.bikeNumber.should.be.exactly("57525");
           accountHistory.endTime.should.be.exactly("15:58:19");
           accountHistory.startDay.should.be.exactly("02.08.15");
           accountHistory.stationTo.should.be.exactly("5932");
           accountHistory.stationFrom.should.be.exactly("5941");
           accountHistory.startTime.should.be.exactly("15:45");
       });
   })
});