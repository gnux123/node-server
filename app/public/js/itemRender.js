var itemSingle = {
	dataUri: "http://localhost:3000",
	target: $(".itemBox"),
	itemsID: [],
	itemsDataCollect: [],
	getData: function(itemID){
		return $.ajax({
			async: true,
			cache: true,
			url: itemSingle.dataUri+"/getData/"+itemID,
			datatype: 'json'
		});
	},
	collectItemsID: function(){
		//[case1]
		var $length = Math.ceil(itemSingle.target.length / 10)*10;
		for(i=10; i<= $length; i=i+10){
			var temp = [];
			var x = (i/10) - 1;

			for(j=i-10; j<i; j++){
				var ids = itemSingle.target.eq(j).attr("data-itemid");
				if(!!ids){
					temp.push(ids);
				}
				if(temp != 0){
					itemSingle.itemsID[x] = temp;
				}
			}
		}

		//[case2]
		// itemSingle.target.each(function(){
		//     var _ID = $(this).attr("data-itemid");
		//     itemSingle.itemsID.push(_ID);
		// }).hide();

		return itemSingle.itemsID;
	},
	collectData: function(){
		var collectIDS = itemSingle.collectItemsID();
		console.log(collectIDS);
		var queus = [];

		$.each(collectIDS, function(key,value){
			$.each(collectIDS[key],function(index, item){
				queus.push(itemSingle.getData(item));
			});
		});

		$.when.apply($,queus).then(function(data){

			for (var i = 0; i < arguments.length; i++) {
				var jdata = arguments[i][0];
				itemSingle.itemsDataCollect[jdata.Id] = jdata;
			}
			itemSingle.dataProcess(itemSingle.itemsDataCollect);
		});
	},
	dataProcess: function(array){
		itemSingle.target.each(function(index){
			var nowId = $(this).attr("data-itemid");
			var dataShow = array[nowId];
			var ctemp;
			var content = $(this).html();
			if (!ctemp){
				ctemp = content;
			}

			//get string value
			var regExPattern = /\{\{(.*?)\}\}/g;
			var regExStr = ctemp.match(regExPattern);
			// console.log(regExStr);
			for(i=0; i < regExStr.length; i++){
				regStr = regExStr[i].substr(2).replace("}}","");
				ctemp = dataBind(regStr,regExStr[i]);
				$(this).html(ctemp);
			}

			//data binding
			function dataBind(value, tempStr){
				var $var = value.split("_")[0];
				switch($var) {
					case "itemImgUrl":
						var pic = value.split("_")[1] - 1;
						return ctemp.replace(tempStr,dataShow["ImgUrlList"][pic]);
					break;
					case "itemLink":
						return ctemp.replace(tempStr,"https://secure.newegg.com.tw/item?itemid="+nowId);
					break;
					case "itemName":
						var ItemNanme = textStringProcess(value, dataShow["Name"]);
						return ctemp.replace(tempStr, ItemNanme);
					break;
					case "itemSubTitle":
						return ctemp.replace(tempStr,dataShow["Title"]);
					break;
					case "itemMarketPrice":
						return ctemp.replace(tempStr,"<span class='marketPrice'><span>NTD</span>"+numberWithCommas(dataShow["Price"])+"</span>");
					break;
					case "itemPrice":
						return ctemp.replace(tempStr,"<span class='price'><span>NTD</span>"+numberWithCommas(dataShow["PromotionPrice"])+"</span>");
					break;
					case "itemAddToSC":
						return ctemp.replace(tempStr,"<div class='buyNow' onclick='netw().buyNow("+nowId+");window.open(\"/Cart\");'>立即購買</div>");
					break;
				}
			}

			//currency dots
			function numberWithCommas(currency) {
				return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}

			//textStringProcess
			function textStringProcess(obj,string) {
				var _docsLength = obj.split("_")[1] - 3;
				var nameString = string.slice(0, _docsLength);
				return nameString+"...";
			}

		}).fadeIn();
	}
};
