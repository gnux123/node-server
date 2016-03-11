var events = {
	control: function(eventContent){
		//splice Text String
		String.prototype.splice = function( idx,rem,s) {
			return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
		};

		var chartNums = eventContent.indexOf('/title');
		var test = eventContent.splice(chartNums+7,0, "<script src='/img/Activity/js/jquery.min.js' charset='utf-8'></script><style>html,body { margin: 0; padding: 0; }</style>");
		var bodyChartNums = test.indexOf('/body');
		var test2 = test.splice(bodyChartNums+7,0, "<script src='/img/Activity/js/itemRender.js' charset='utf-8'></script><script type='text/javascript'>$(function(){ itemSingle.collectData(); });</script>");
		return test2;
	}
}

//modules settings
if (typeof module !== 'undefined' && 'exports' in module) {
    module.exports = events;
} else if (typeof(define) === 'function') {
    define(events);
}
