//var request = require("request");
var	cheerio = require('cheerio');
var	express = require("express");
// var schedule = require("node-schedule");
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

//client UI design
router.get('/',function(req,res){
    res.sendfile(__dirname + '/app/index.html');
});

router.get('/:gates/:zone',function(req,res){
    var gates = req.params.gates;
    var zone = req.params.zone;

    //jobwork timing.
    // var rule = new schedule.RecurrenceRule();
    // rule.second = 30;
    // var job = new schedule.scheduleJob(rule, function(){
    //     console.log(new Date(), 'The 30th second of the minute.');
    // });


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

        var newData = [];
        //主選單
        $(".pullDownList li").each(function(){
            newData.push({
                _index:$(this).attr("categoryid"),
                _texts:$(this).find("a").text(),
                _links:$(this).find("a").attr("href"),
                _class:$(this).find("i").attr("class")
            })
        });

        for (var i = 0; i < newData.length; i++) {
            secLists[i] = [];
            $("#SecMenu > ul[parentid='"+ newData[i]["_index"] +"'] > li").each(function(index, element){
                secLists[i].push({
                    CategoryId: $(element).attr("categoryid"),
                    secName: $(element).find("a").text()
                    // thirdCates: thirdLists
                });
            });

            console.log();

            lists.push({
                className: newData[i]["_class"],
                cateslink: newData[i]["_links"],
                catesName: newData[i]["_texts"],
                subCates: secLists[i]
            });

        };
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
