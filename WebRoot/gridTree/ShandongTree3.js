$(document).ready(function() {
			var GridColumnType = [{
						header : '�ڵ�',
						headerIndex : 'nodeId',
						width : '200'
					}, {
						header : 'ͼ��',
						headerIndex : 'tuHao',
						width : '200'
					}, {
						header : '��̨��',
						headerIndex : 'danTai',
						width : '200'
					}, {
						header : '�ƻ���',
						headerIndex : 'jiHua',
						width : '200'
					}, {
						header : '�����',
						headerIndex : 'kuCun',
						width : '200'
					}, {
						header : '������',
						headerIndex : 'zaiZhi',
						width : '200'
					}, {
						header : '��;��',
						headerIndex : 'zaiTu',
						width : '200'
					}, {
						header : 'ȱ����',
						headerIndex : 'queJian',
						width : '200'
					}, {
						header : '��ע',
						headerIndex : 'beizhu',
						width : '200'
					}];
			var content = {
				columnModel : GridColumnType,
				dataUrl : appPath + "/initlazy.do",
				lazyLoadUrl : appPath + "/lazy.do",
				idColumn : 'nodeId',// id���ڵ���,һ��������(��һ��Ҫ��ʾ����) 
				parentColumn : 'parentId',//���и��Ӹ��²��ҵ���Ҫ��֮һ��
				height : '500px',
				width : '100%',
				multiChooseMode : 5,// ѡ��ģʽ������1��2��3��4��5�֡� 
				tableId : 'testTable',
				checkOption : 'multi',// radio:���ֵ�ѡ��ť,multi:���ֶ�ѡ��ť,����:������ѡ��ť
				rowCount : true, // ����������ʾ
				countColumnDesc : '���',
				lazy : true,
				leafColumn : 'isLeaf'// �����жϽڵ��ǲ�����Ҷ
			};
			$('#newtableTree').gridTree(content);
		});