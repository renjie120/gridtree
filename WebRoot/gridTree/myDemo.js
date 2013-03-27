function openNode(o){ 
	var id  =$(o).next('input').val(); 
	$('#newtableTree').open(id+'');
} 

function closeNode(o){ 
	var id  =$(o).next('input').val(); 
	$('#newtableTree').close(id+'');
} 

function expandAllNodes(){ 
	$('#newtableTree').expandAll();
} 

function closeAllNodes(){ 
	$('#newtableTree').closeAll();
} 

function reloadTree(){ 
	$('#newtableTree').reload();
} 

function setHeight(num){ 
	$('#newtableTree').resetHeight(num);
}  
 
function setWidth(num){  
	$('#newtableTree').resetWidth(num);
} 

function searchTree(){ 
	 $('#newtableTree').disabled(v);
} 
function setJsonData(){ 
	 $('#newtableTree').setJsonData('[{"disId": "1","disName": "����","disParent": "",rddisbled: 1,rdvisabled: 1,rd: "1",radi: "2",multi: "1"}'
	 +',{"disId": "2","disName": "����","disParent": "1",rddisbled: 0,rdvisabled: 1,rd: "2",radi: "1",multi: "1"}'
	 +',{"disId": "3","disName": "�й�","disParent": "2",rddisbled: 0,rdvisabled: 1,rd: "2",radi: "1",multi: "1"}'
	 +',{"disId": "4","disName": "����ʡ","disParent": "3",rddisbled: 0,rdvisabled: 1,rd: "2",radi: "1",multi: "1"}'
	 +',{"disId": "5","disName": "������","disParent": "4",rddisbled: 0,rdvisabled: 1,rd: "2",radi: "1",multi: "1"}'
	 +',{"disId": "6","disName": "ʯ����","disParent": "5",rddisbled: 0,rdvisabled: 1,rd: "2",radi: "1",multi: "1"}'
	 +',{"disId": "7","disName": "������","disParent": "6",rddisbled: 0,rdvisabled: 1,rd: "2",radi: "1",multi: "1"}'
	 +',{"disId": "8","disName": "��Ž�","disParent": "7",rddisbled: 0,rdvisabled: 1,rd: "2",radi: "1",multi: "1"},{"disId": "9","disName": "�Ϻ��ֶ�","disParent": "",rddisbled: 0,rdvisabled: 1,rd: "2",radi: "1",multi: "1"}]');
}  
function reload(){ 
	location.reload();
} 

function setdisable(v){ 
	$('#newtableTree').disabled(v);
} 

function getPara(){ 
	var p = $('#newtableTree').getPara();
	var str = '';
	for(pp in p){
		if(typeof p[pp] =='string')
			str +="arg["+pp+"]="+p[pp]+"\n";
	}
	alert(str);
} 