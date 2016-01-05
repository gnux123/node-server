//var request = require("request");
var	cheerio = require('cheerio');
var	express = require("express");
var	superagent = require("superagent");

var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

var apiUri = "http://www.newegg.com.tw/";
var weatherUri = "http://www.cwb.gov.tw/V7/observe/real/ALLData.htm?_=1451961360440";

// request({
// 	url: apiUri,
// 	method: "GET",
// },function(error, response, body){
// 	if(!error) {
//         console.log(body);
// 	}
//
// });

router.get('/:gates/:zone',function(req,res){
    var gates = req.params.gates;
    var zone = req.params.zone;
    superagent.get(apiUri+gates+"/"+zone).end(function (err, sres) {
        if (err) { return next(err); }
        //console.log(sres);
        // res.send(sres.text);
        var $ = cheerio.load(sres.text);
        var content = $(".pullDownList");
        var secMenu = $("#SecMenu");
        var lists = [];
        var secLists = [];
        var thirdLists = [];

        //主選單
        $(".pullDownList li").each(function(){
            var _index = $(this).index();
            var _texts = $(this).find("a").text();
            var _links = $(this).find("a").attr("href");
            var _class = $(this).find("i").attr("class");

            //第二層選單
            secMenu.find("ul").eq(_index).find("li").each(function(){
                var _secIndex = $(this).index();
                var _secName = $(this).find("a").text(),
                    _secID = $(this).attr("categoryid");

                //第三層選單
                // $(".yMenuLCinList").eq(_secIndex).find("a").each(function(){
                //     var _thirdTit = $(this).text(),
                //         _thirdLink = $(this).attr("href");
                //
                //     thirdLists.push({
                //         Title: _thirdTit,
                //         Links: _thirdLink
                //     });
                // });


                secLists.push({
                    CategoryId: _secID,
                    secName: _secName
                    // thirdCates: thirdLists
                });
            });

            lists.push({
                className: _class,
                cateslink: _links,
                catesName: _texts,
                subCates: secLists
            });
        });

        res.send(lists);

    });
});

router.get('/item/:itemID',function(req,res){
    var items = req.params.itemID;

    superagent.get(apiUri+"/item?itemid="+items).end(function (err, sres) {
        if (err) { return next(err); }
        console.log(sres.text);
        res.send(sres.text);
    });
});

router.get('/weather',function(req,res){
    superagent.get(weatherUri).end(function (err, sres) {
        if (err) { return next(err); }
        res.send(sres.text);
    });
});

app.use('/', router);
app.listen(port, function(){
	console.log('server start');
});


// // 台南市的氣溫
// var apiUrl = "http://tw.yahoo.com/";
//
// // 取得網頁資料
// request(apiUrl, function (error, response, body) {
//   if (!error) {
// 	//console.log(body);
//     // 用 cheerio 解析 html 資料
//     var $ = cheerio.load(body);
// 	// var lists = $(".section").eq(0).html();
//     // 篩選有興趣的資料
//     // var temperature = $("[data-variable='temperature'] .wx-value").html();
//     // var humidity = $("[data-variable='humidity'] .wx-value").html();
//
//     // 輸出
//     // console.log("氣溫：攝氏 " + temperature + " 度");
//     // console.log("濕度：" + humidity + "%");
// 	console.log(body);
//
//   } else {
//     console.log("擷取錯誤：" + error);
//   }
// });
