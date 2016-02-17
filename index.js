var request = require("request");
var	cheerio = require('cheerio');
var	express = require("express");
var fs = require('fs');
// var schedule = require("node-schedule");
var	superagent = require("superagent");
var	home = require("./home");

var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

var apiUri = "http://www.newegg.com.tw/";


//images and js folder
app.use('/img/Activity', express.static(__dirname + '/app/public'));



//client UI design
router.get('/',function(req,res){
    res.sendfile(__dirname + '/app/index.html');
});


router.get('/getData/:itemID',function(req,res){
    res.setHeader('Content-Type', 'application/json');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    var items = req.params.itemID;
    var itemsDetail = [];
    request({
        url: apiUri+"/api/Item/getItemDetailByItemId?itemid="+items,
        method: "GET"
    }, function(e,r,b) {
        if(!e) {
            // b = b.replace(/\\/g,"");
            res.send(b);
        }
    });
});

router.get('/votes',function(req,res){
    res.sendfile(__dirname + '/app/votingAnayltics.html');

});

router.get('/date',function(req,res){
    res.sendfile(__dirname + '/app/aboutme.html');

});


router.get('/events/:eventName',function(req,res){
    var eventFileName = req.params.eventName;

    // console.log(req.params.eventName);

    if(eventFileName!=""){
        // res.send(__dirname + '/app/'+ eventFileName +'.html');
        var eventContent;
        fs.readFile(__dirname + '/app/'+ eventFileName +'.html', "utf8", function(error,data){

            if (error) {
                return console.log(error);
            }

            processEventFile(data);
        });

        function processEventFile(eventContent){
            //splice
            String.prototype.splice = function( idx,rem,s) {
                return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
            };

            var chartNums = eventContent.indexOf('/title');
            var test = eventContent.splice(chartNums+7,0, "<script src='https://code.jquery.com/jquery-1.12.0.min.js' charset='utf-8'></script>");
            var bodyChartNums = test.indexOf('/body');
            var test2 = test.splice(bodyChartNums+7,0, "<script src='/img/Activity/js/itemRender.js' charset='utf-8'></script><script type='text/javascript'>$(function(){ itemSingle.collectData(); });</script>");
            res.send(test2);
        }
        // console.log(content.indexOf("head"));
        // res.send(content);

    }else if(eventFileName==""){
        res.sendfile(__dirname + '/app/event.html');
    }
});




//server side parse data
router.get('/Home/:zone',function(req,res){
    var zone = req.params.zone;

    superagent.get(apiUri+"/Home/"+zone).end(function (err, sres) {
        if (err) { return next(err); }
        var contents = cheerio.load(sres.text);

        if(zone == "GetLeftMenu") {
            res.send(home.menu(contents));
        }else if(zone == "GetTopAdvertise") {
            res.send(home.events(contents));
        }

    });
});

router.get('/cates',function(req,res){
    superagent.get(apiUri+"/Category/NextPageItemListMenu?CategoryID=3332&Page=2&ItemsQty=36").end(function (err, sres) {
        if (err) { return next(err); }
        var contents = cheerio.load(sres.text);

        console.log(sres.text);

        // if(zone == "GetLeftMenu") {
        //     res.send(home.menu(contents));
        // }else if(zone == "GetTopAdvertise") {
        //     res.send(home.events(contents));
        // }

    });
});

app.use('/', router);
app.listen(port, function(){
	console.log('server start');
});
