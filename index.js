var request = require("request");
var	cheerio = require('cheerio');
var	express = require("express");
var app = express();
var port = process.env.PORT || 1337;

var router = express.Router();

var uri = "https://secure.newegg.com.tw/";
var htmlData;

request({
	url: uri,
	method: "GET",
},function(e,r,b){
	if(!e) {

		dataProcess(b);

	}

});

router.get('/',function(req,res){
	res.sendfile(__dirname + '/app/index.html');
});

router.get('/:page',function(req,res){
	var pageName = req.params.page.split(".");
	if (pageName[1]=="html" || pageName[1] == null) {
		res.sendfile(__dirname + '/app/'+pageName[0]+'.html');
	}
});


var dataProcess = function(object){
	htmlData = object;
}

app.use('/', router);
app.listen(port, function(){
	console.log('server start');
});

console.log(htmlData);
