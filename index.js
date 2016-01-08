//var request = require("request");
var	cheerio = require('cheerio');
var	express = require("express");
// var schedule = require("node-schedule");
var	superagent = require("superagent");
var	home = require("./home");

var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

var apiUri = "http://www.newegg.com.tw/";

//client UI design
router.get('/',function(req,res){
    res.sendfile(__dirname + '/app/index.html');
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

app.use('/', router);
app.listen(port, function(){
	console.log('server start');
});
