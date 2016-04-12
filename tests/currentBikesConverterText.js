/**
 * Created by Kysiek on 12/04/16.
 */

var expect = require("chai").expect;
var should = require("should");
var currentBikesHtmlParser = require("../Helpers/CurrentBikesHtmlParser");

describe("HTML parser", function() {
    describe("Making current bikes object from string", function() {
        it("Should create current bike object", function () {
            var currentBike = currentBikesHtmlParser.convertStringToCurrentBikeObj("56789 (1234)");
            currentBike.bikeNumber.should.be.defined;
            currentBike.lockNumber.should.be.defined;
        });
        it("Should convert to the current bike correctly", function () {
            var currentBike = currentBikesHtmlParser.convertStringToCurrentBikeObj("56789 (1234)");
            currentBike.bikeNumber.should.be.exactly("56789");
            currentBike.lockNumber.should.be.exactly("1234");
        });
        it("sasd", function (done) {
            var body = '<!DOCTYPE html><head><meta http-equiv="content-type" content="text/html; charset=utf-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" ><meta http-equiv="Cache-Control" content="no-cache" /><meta http-equiv="Pragma" content="no-cache" /><meta name="viewport" content="width=320" /><link rel="stylesheet"  href="/m/jquery.mobile-1.1.1/jquery.mobile-1.1.1.min.css" /><script type="text/javascript" src="/m/jquery-1.6.4.min.js"></script><link rel="stylesheet"  href="/pl/m/mobile.css?1460020296" /><script type="text/javascript">$(document).bind("mobileinit", function(){$.mobile.defaultDialogTransition = "none";$.mobile.defaultPageTransition = "none";$.mobile.buttonMarkup.hoverDelay = 0;$.event.special.swipe.scrollSupressionThreshold = 100;}).ready(function(){$("input, select, textarea").attr("autocomplete", "off");});$.ajaxSetup ({ cache: false });operamini.page.maxAge=0;</script><script type="text/javascript" src="/m/jquery.mobile-1.1.1/jquery.mobile-1.1.1.min.js"></script><link rel="icon" href="/office/favicon.ico" type="image/ico" /><title>Wrocławski Rower Miejski (WRM)</title></head><body><div data-role="page" data-theme="b"><div data-role="content"><div id="header"><img src="/pl/m/themes/logos/logo_mobile_pl_230.png" /></div><ul data-role="listview" data-theme="c" data-inset="true"><li data-role="list-divider">Aktualne wynajmy</li><li><a href="/pl/m/look_up?parameters%5Bbike_no%5D=57175&PHPSESSID=ke20j29ugnigm4b4r5cheohfl2" title="" target="_self">57175 (9511)</a></li></ul><form action="?" accept-charset="utf-8"  method="post" class="html_form  look_up" enctype="multipart/form-data" target="_self"><input type="hidden" name="action" value="look_up" /><div class=" required "><label for="bike_no">Numer roweru<span class="required">*</span>:</label><input type="text" style="-wap-input-format:5N" id="bike_no" name="bike_no" value="" data-theme="c" /></div><input type="hidden" id="quick" name="quick" value="1" /><div><input type="hidden" name="PHPSESSID" value="ke20j29ugnigm4b4r5cheohfl2" /><input type="submit" value="Wynajem/ zwrot" class="button hide_print" data-theme="b"/></div></form><ul data-role="listview" data-theme="c" data-inset="true"><li><a href="/pl/m/gmm?PHPSESSID=ke20j29ugnigm4b4r5cheohfl2" title="" target="_self">Lokalizacje</a></li><li><a href="/pl/m/account?PHPSESSID=ke20j29ugnigm4b4r5cheohfl2" title="" target="_self">Konto użytkownika</a></li><li><a href="/pl/m/redeem_coupon?PHPSESSID=ke20j29ugnigm4b4r5cheohfl2" title="" target="_self">Zrealizuj voucher</a></li><li><a href="http://m.youtube.com/watch?v=kcb-bmDMoOY&fulldescription=1&client=mv-google" target="_new">Video</a></li><li><a href="tel:+48717381111">Infolinia </a></li></li></ul><a href="/pl/m/logout?PHPSESSID=ke20j29ugnigm4b4r5cheohfl2" data-role="button" data-theme="c">Wyloguj</a></div></div></body></html>'
            currentBikesHtmlParser.parseCurrentBikesHtml(body,function(result) {
                console.log(result);
                result.length.should.be.exactly(1);
                done();
            });
        });
    })
});