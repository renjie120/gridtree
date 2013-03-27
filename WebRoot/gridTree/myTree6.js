$(document).ready(function() {
	for (var i = 0, j = chartResults.length; i < j; i++) {
		$("#grid").append("<div id='gridtree" + i
				+ "' style='float:left' ></div>");
		var json = [{
					"disId" : "2200",
					"disName" : "吉林省",
					"disParent" : "",
					isparent:1
				}, {
					"disId" : "2201",
					"disName" : "长春市",
					"disParent" : "2200",
					isparent:0
				}, {
					"disId" : "2201-1",
					"disName" : "长春市某个区",
					"disParent" : "2201",
					isparent:1
				}];
		var GridColumnType = [{
					header : '标示列',
					headerIndex : 'disid',
					width : '200'
				}, {
					header : '名称',
					headerIndex : 'disname',
					width : '200px'
				}, {
					header : '上级标示',
					headerIndex : 'disParent',
					width : '200px'
				}];
		_setGridTree(GridColumnType, json, i);
	}
});

function _setGridTree(model, json, id) {
	var content = {
		columnModel : model,
		data : json,
		idColumn : 'disId',
		parentColumn : 'disParent',
		height : '300px',
		width : '600px',
		debug : true,
		cnsoleJsonStr : function(s) {
			s = s.replace(/\\/g, '_');
			return s;
		},
		setArguments : function(nd) {
			return param;
		},
		lazyLoadUrl : '<%=basePath%>hvming/getSub',
		dynamicColumn : 'isparent',
		tableId : 'reportTable' + id,
		onSuccess : function(et) {
			$('.tableRegion tr td div', et).each(function() {
						if ($(this).html() == '')
							$(this).html(0);
					});
		}
	};
	$('#gridtree' + id).gridTree(content);
}