var request = require("request");
var	cheerio = require('cheerio');
var	express = require("express");
var	superagent = require("superagent");
var app = express();
var port = process.env.PORT || 3000;

var router = express.Router();

var apiUri = "https://secure.newegg.com.tw/";


// request({
// 	url: apiUri,
// 	method: "GET",
// },function(error, response, body){
// 	if(!error) {
//         console.log(body);
// 	}
//
// });

router.get('/',function(req,res){
    superagent.get(apiUri).end(function (err, sres) {
        if (err) { return next(err); }
        //console.log(sres);
        var $ = cheerio.load(sres.text);
        var contents = [];
        $(".box2").each(function(){
            var item = $(this).find(".pic").attr("cellitemid");
            var _link = $(this).find("a").attr("href");
            var _img = $(this).find(".itemImgCen").attr("src");
            var _push = $(this).find(".subTit").text();
            var _prodName = $(this).find(".caption").text();
            var _price = $(this).find(".price").html();
            var _marketPrice = $(this).find(".marketPrice").html();
            contents.push({
                "itemID": item,
                "link": _link,
                "imageUrl": _img,
                "pushText": _push,
                "productName": _prodName,
                "price": _price,
                "marketPrice": _marketPrice
            });
        });
        res.send(contents);

    });
    //res.sendfile(__dirname + '/app/index.html');
});

router.get('/item/:itemID',function(req,res){
    var items = req.params.itemID;
    superagent.get(apiUri+"/item?itemid="+items).end(function (err, sres) {
        if (err) { return next(err); }
        console.log(sres.text);
        res.send(sres.text);
    });
	// var pageName = req.params.page.split(".");
	// if (pageName[1]=="html" || pageName[1] == null) {
	// 	res.sendfile(__dirname + '/app/'+pageName[0]+'.html');
	// }
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
