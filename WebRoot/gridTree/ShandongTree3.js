$(document).ready(function() {
			var GridColumnType = [{
						header : '节点',
						headerIndex : 'nodeId',
						width : '200'
					}, {
						header : '图号',
						headerIndex : 'tuHao',
						width : '200'
					}, {
						header : '单台数',
						headerIndex : 'danTai',
						width : '200'
					}, {
						header : '计划数',
						headerIndex : 'jiHua',
						width : '200'
					}, {
						header : '库存数',
						headerIndex : 'kuCun',
						width : '200'
					}, {
						header : '在制数',
						headerIndex : 'zaiZhi',
						width : '200'
					}, {
						header : '在途数',
						headerIndex : 'zaiTu',
						width : '200'
					}, {
						header : '缺件数',
						headerIndex : 'queJian',
						width : '200'
					}, {
						header : '备注',
						headerIndex : 'beizhu',
						width : '200'
					}];
			var content = {
				columnModel : GridColumnType,
				dataUrl : appPath + "/initlazy.do",
				lazyLoadUrl : appPath + "/lazy.do",
				idColumn : 'nodeId',// id所在的列,一般是主键(不一定要显示出来) 
				parentColumn : 'parentId',//进行父子更新查找的主要键之一！
				height : '500px',
				width : '100%',
				multiChooseMode : 5,// 选择模式，共有1，2，3，4，5种。 
				tableId : 'testTable',
				checkOption : 'multi',// radio:出现单选按钮,multi:出现多选按钮,其他:不出现选择按钮
				rowCount : true, // 进行行数显示
				countColumnDesc : '序号',
				lazy : true,
				leafColumn : 'isLeaf'// 用于判断节点是不是树叶
			};
			$('#newtableTree').gridTree(content);
		});