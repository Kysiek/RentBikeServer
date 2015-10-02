/**
 * Created by KMACIAZE on 01.10.2015.
 */
var expect = require("chai").expect;
var accountHistoryParser = require("../Helpers/AccountHistoryHtmlParser");

describe("HTML parser", function() {
   describe("Making account history object from string", function() {
       it("Should return account history string with station numbers", function () {
           var accountHistory = accountHistoryParser.convertStationsIntoNumbers("02.08.15 15:45 Rower 57525 do  15:58:19 (Teatralna - Piotra Skargi  - Plac Grunwaldzki - Polaka)");
           expect(accountHistory).to.equal("02.08.15 15:45 Rower 57525 do  15:58:19 (5941  - 5932)");
       });
   })
});