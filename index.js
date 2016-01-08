//var request = require("request");
var	cheerio = require('cheerio');
var	express = require("express");
// var schedule = require("node-schedule");
var	superagent = require("superagent");

var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

var apiUri = "http://www.newegg.com.tw/";

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

    superagent.get(apiUri+gates+"/"+zone).end(function (err, sres) {
        if (err) { return next(err); }
        var contents = cheerio.load(sres.text);

        if(zone == "GetLeftMenu") {
            res.send(init.homeMenu(contents));
        }else if(zone == "GetTopAdvertise") {
            res.send(init.ADLists(contents));
        }

    });
});


// router.get('/item/:itemID',function(req,res){
//     var items = req.params.itemID;
//
//     superagent.get(apiUri+"/item?itemid="+items).end(function (err, sres) {
//         if (err) { return next(err); }
//         console.log(sres.text);
//         res.send(sres.text);
//     });
// });
//
// router.get('/weather',function(req,res){
//     superagent.get(weatherUri).end(function (err, sres) {
//         if (err) { return next(err); }
//         res.send(sres.text);
//     });
// });

app.use('/', router);
app.listen(port, function(){
	console.log('server start');
});


var init = {
    homeMenu: function(object) {
        var $ = object;
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
                });
            });

            for (var j = 0; j < secLists[i].length; j++) {
                thirdLists[j] = [];

                var thirdMenus = $(".yMenuColLCinList > div[parentid='"+secLists[i][j]["CategoryId"]+"']"),
                    adImg = thirdMenus.find(".MenuListImg").find("img").attr("src"),
                    adImgLink = thirdMenus.find(".MenuListImg").find("a").attr("href");

                thirdMenus.find("p > a").each(function(index, element){
                    thirdLists[j].push({
                        link: $(element).attr("href"),
                        desc: $(element).text()
                    });
                });

                var secID = secLists[i][j]["CategoryId"],
                    secCateName = secLists[i][j]["secName"];

                secLists[i][j] = [];

                secLists[i][j].push({
                    CategoryId: secID,
                    secName: secCateName,
                    ImgAD: adImg,
                    ImgADLink: adImgLink,
                    thirtCates: thirdLists[j]
                });

            };

            lists.push({
                className: newData[i]["_class"],
                cateslink: newData[i]["_links"],
                catesName: newData[i]["_texts"],
                subCates: secLists[i]
            });
        };

        return lists;
    },
    ADLists: function(object){
        var $ = object;
        var lists = [];
        var imgShow = $(".banner-img"),
            tab = $(".tab ul"),
            colors = $(".banner-bg");

        imgShow.find("a").each(function(index,element){
            lists.push({
                mainImg: $(element).find("img").attr("src"),
                mainImgLink: $(element).attr("href"),
                mainImgBgColor: colors.find("div").eq(index).text(),
                mainActiveName: tab.find("li").eq(index).text().trim()
            });
        });


        return lists;
    }
}
