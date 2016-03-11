var request = require("request");
var	cheerio = require('cheerio');
var	express = require("express");
var fs = require('fs');
// var schedule = require("node-schedule");
var	superagent = require("superagent");
var	home = require("./home");
var	events = require("./events");

var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

var apiUri = "http://www.newegg.com.tw/";
var yelpApiUrl = "https://api.yelp.com/v2/search/?location=taipei&cc=TW&lang=zh";
var secret = "&oauth_consumer_key=xdU_aD0Qq4SnaWWJLkJnRQ&oauth_consumer_secret=75D1ZjvYYk1KhZD44byjldr-CF8&oauth_token=C8ODZt0QETpQFqDUTMBwWefIuEGVeSZ3&oauth_token_secret=mZsjhFUJSB51KWIp9Rux-gNqq60&oauth_signature_method=HMAC-SHA1&oauth_signature=&oauth_timestamp=&oauth_nonce=";


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
    console.log(eventFileName);
    if(eventFileName!=""){
        fs.readFile(__dirname + '/app/'+ eventFileName +'.html', "utf8", function(error,data){
            if (error) {
				return console.log(error);
			}
            res.send(events.control(data));
        });
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


router.get('/yelp',function(req,res){
    superagent.get(yelpApiUrl+secret).end(function(err,sres){
        res.send(sres);
    });
});

// router.get('/cates',function(req,res){
//     superagent.get(apiUri+"/Category/NextPageItemListMenu?CategoryID=3332&Page=2&ItemsQty=36").end(function (err, sres) {
//         if (err) { return next(err); }
//         var contents = cheerio.load(sres.text);
//
//         console.log(sres.text);
//     });
// });

app.use('/', router);
app.listen(port, function(){
	console.log('server start http://localhost:3000/');
});
