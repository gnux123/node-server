var itemSingle = {
	dataUri: "http://localhost:3000",
	target: $(".itemBox"),
	itemsID: [],
	itemsDataCollect: [],
	getData: function(itemID){
		return $.ajax({
			async: true,
			cache: true,
			url: itemSingle.dataUri+"/postData/",
			type: "post",
			data: {itemID},
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
		return itemSingle.itemsID;
	},
	collectData: function(){
		var collectIDS = itemSingle.collectItemsID();
		// console.log(collectIDS);
		var queus = [];

		$.each(collectIDS, function(key,value){
			queus[key] = itemSingle.getData(value);

		});

		$.when.apply($,queus).then(function(data){
			for (var i = 0; i < arguments.length; i++) {
				var dataLen = arguments[i][0].length;

				for(var j=0; j < dataLen; j++){
					var itemData = arguments[i][0][j],
						itemID = itemData.Id.toString();
					itemSingle.itemsDataCollect[itemID] = itemData;
				}
			}

			console.log(itemSingle.itemsDataCollect);

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

						if(!!dataShow["ImgUrlList"][0]){
							return ctemp.replace(tempStr,dataShow["ImgUrlList"][0]);
						}else{
							return ctemp.replace(tempStr,"");
						}
					break;
					case "itemLink":
						return ctemp.replace(tempStr,"https://secure.newegg.com.tw/item?itemid="+nowId);
					break;
					case "itemName":
						var ItemName = textStringProcess(value, dataShow["Name"]).toString();
						if(!!ItemName){
							return ctemp.replace(tempStr, ItemName);
						}else{
							return ctemp.replace(tempStr,"");
						}
					break;
					case "itemSubTitle":
						var subTitle = subTitleFilter(dataShow["Title"]);
						return ctemp.replace(tempStr,subTitle);
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

			//subltitle Remove html tag
			function subTitleFilter(obj){
				return obj.replace(/(<([^>]+)>)/ig, "");
			}

		}).fadeIn();
	}
};
