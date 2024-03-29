﻿/*
 * GridTree2.0  
 *
 * Copyright (c) 2011 lishuiqing(renjie120)
 * 版权声明:任意公司或者个人可以免费使用本程序,并可以修改和传播本程序,但是不得去掉本段版权声明.
 * Note:Everyone or company use the code free,also can change this program or distribute the code,but can't remove this declaration.
 *
 * Date: 2012-01-01 12:50:31 
 * email:renjie120@gmail.com 
 * QQ群:135633957
 * Google code:
 */
(function($) {  
    $.addGt = function(t, p) {   
        if (t.gt) {  
			return false;
		}
        p = $.extend({
            columnModel: {},
            idColumn: null,
            parentColumn: null,
            tableId: null,
            title: '', 
            exchangeColor: true,
            closeImg: './images/minus.gif',
            openImg: './images/plus.gif',
            lazyLoadImg: './images/plus2.gif',
            blankImg: './images/blank.gif',
            noparentImg: './images/tv-item.gif',
            lastLeafImg: './images/tv-item-last.gif',
            morePageImg: './images/morePage.gif',
            pageBarId: 'pageBarTable',
            countCellWd: 100,
            pageSize: 10,
            pageBar: false,
            lazyPage: false,
            lazyMorePage: false,
            lazyPageSize: 10, 
            rowCount: false,
            countColumnDesc: '序列',
			countColumnNm: null,
			expandColumnNm: null,//展开,关闭按钮所在的列,默认为第一个headerIndex的位置.
            pageAtServer: true,
            analyzeAtServer: false, 
            dataUrl: null,
            showMenu: true,
            contextMenu: null,
            disabled: false,
            debug: false,
            height: '400px',
            width: '100%',
            checkOption: null,
            checkColumnNm: null,
            hidddenProperties: null,
            handleCheck: null,
            data: null, 
            lazy: false,
            lazyLoadUrl: null,
            handler: null,
            leafColumn: null,
            rowCountOption: 1,
            expandAll: false,
            allCheck: true,
            disableOptionColumn: null,
            onSuccess: null,
            onPagingSuccess: null,
            onLazyLoadSuccess: null,
            chooesdOptionColumn: null,
            multiChooseMode: 1,
			beforeAjax:null,
			onError:null,
			afterAjax:null 
        },
        p);
        var g = {
            _e: function(msg) {  
				if(p.onError&&$.isFunction(p.onError)){
					p.onError(msg);
				}else{
					g._clearContent();  
					$('.gridTbody',$(elct)).html(_errortemp.replace(/\$/g, msg)); 
				}
            }, 
            _resetBasePageBtns: function() {
                g._resetPageBtns(pagingInfo, "_firstPageBtn", "_prePageBtn", "_lastPageBtn", "_nextPageBtn"); 
                if (pagingInfo.pagesCount == 1 || pagingInfo.pagesCount == 0) {
                    if (pagingInfo.pagesCount == 0) {
                        $('#_toPageBtn').removeClass("nextPage").addClass("disFirstPage").attr("disabled", true); 
                    } 
                } 
            },
            _resetLazyPageBtns: function(pid) {
                var ll = _lazypgInfoMap.get(pid);
                g._resetAllLazyPageBtns(ll, "_fstbtn_" + pid, "_prebtn_" + pid, "_lstbtn_" + pid, "_nxtbtn_" + pid); 
            },
			_setJsonData:function(str){
				var json = (new Function("return " + str))();
				$('.gridTbody',$(elct)).html(''); 
				g._makeTable(json);
			},
            _makeTable: function(data) {  
                var o = new Date(); 
                g._analyseData(data);
                g._initPageInfo();   
                var tree = g._getTree(); 
                $('#_content_div').append(tree);
                g._setLastLeaf();
                var _title_width = $('#_title_Div th');
                var __len = _title_width.size();
                var hasAdded = false;
                var isthere = 0;
                $('#_changePageSizeSel option').each(function(i) {
                    if (this.value == p.pageSize) {
                        hasAdded = true;
                        return;

                    } else if (this.value < p.pageSize) {
                        isthere = i;

                    }

                });
                if (!hasAdded) {
                    if (isthere != 0) $('#_changePageSizeSel option:eq(' + isthere + ')').after("<option value='" + p.pageSize + "' selected='selected'>" + p.pageSize + "</option>");
                    else {
                        $('#_changePageSizeSel').prepend("<option value='" + p.pageSize + "' selected='selected'>" + p.pageSize + "</option>");

                    }

                }
                if (p.expandAll) g.expandAll(); 
                g._showMsg(0);
                var gotime = new Date() - o;
                g._d('第一次显示前台消耗时间:' + gotime);
                if (p.pageSize) {
                    var pgdiv = $('#_pagebar_pagesdiv');
                    var a_btns = pgdiv.find('a');
                    $(a_btns[0]).bind('click',function() {
                         g._toPage('first');
                    });
                    $(a_btns[1]).bind('click',function() {
                         g._toPage('pre');
                    });
                    $(a_btns[2]).bind('click',function() {
                         g._toPage('next');
                    });
                    $(a_btns[3]).bind('click',function() {
                        g._toPage('last');
                    });
                    $(pgdiv.find('.goto')).bind('click',function() { 
                        g._toPage('any');
                    });
                    $('#_changePageSizeSel').bind('change',function() {
                        g._reMakeTable(this.value);
                    });
                    $('#_changePageSizeSel option[value=' + p.pageSize + ']').attr('selected', 'selected');

                }
                if (p.disabled) g.setDisabled(1);
                //将表格缓存起来到g.tableTree中
                g.tableTree = $('#' + p.tableId);
				g._resetBasePageBtns();
                g._resetCurrentPageSize();
                if (p.exchangeColor) g._setColor();
                if ($.isFunction(p.onSuccess)) p.onSuccess(elct);

            },
            scroll: function() {   
				if(isIE)
					g._title_Div.scrollLeft(g._scroller_div.scrollLeft()); 
				else
					g._title_table.scrollLeft(g._content_div.scrollLeft());  
				
			},
			//组装树的核心方法.
            _getTree: function() {  
                var tree = document.createElement("table");
                $(tree).attr('id', "" + p.tableId).addClass('tableRegion'); 
                if (p.pageBar != true) {
                    if (p.lazy) g._showLazyTable(tree, p.allDataInfoWithPageInfo.data);
                    else {
                        g._showTable(tree, 0, firstLevelNodes.length);

                    }

                } else {
                    if (!p.lazy) {
                        if (p.pageSize > firstLevelNodes.length) {
                            g._showTable(tree, 0, firstLevelNodes.length);

                        } else {
                            g._showTable(tree, 0, p.pageSize);

                        }

                    } else { 
                        g._showLazyTable(tree, p.allDataInfoWithPageInfo.data);

                    }

                }
                return tree;

            },
            _analyseData: function(msg) {
                var data = []; 
                if (_serverPagingMode == 'server') {
                    g._e("怎么进来了?出现bug了!");

                } else {
                    if (_serverPagingMode == 'client') {
                        data = msg;

                    } else {
                        eval("p.allDataInfoWithPageInfo=" + msg);
                        data = p.allDataInfoWithPageInfo.data;
                        if (typeof data == 'undefined') {
                            data = p.allDataInfoWithPageInfo;

                        }
                        pagingInfo.currentPage = p.allDataInfoWithPageInfo.page;
                        pagingInfo.allCount = p.allDataInfoWithPageInfo.total;

                    }

                } 
				firstLevelNodes = [];
				firstLevelParentIds = [];
				parents = [];
				parentToChildMap = new HashMap();
				childToFatherMap = new HashMap();
				nodeMap = new HashMap();
                if (!p.lazy) {
                    var len = data.length; 
                    for (var i = 0; i < len; i++) {   
                        var _id = data[i][p.idColumn];  
                        var _parent = data[i][p.parentColumn];  
                        if (findInArray(parents, '_node' + _parent) == -1) parents.push('_node' + _parent);
                        if (parentToChildMap.containsKey('_node' + _parent)) {
                            var arr = parentToChildMap.get('_node' + _parent);
                            arr.push('_node' + _id);
                            parentToChildMap.put('_node' + _parent, arr);

                        } else {
                            var arr = [];
                            arr.push('_node' + _id);
                            parentToChildMap.put('_node' + _parent, arr);

                        } 
                        childToFatherMap.put('_node' + _id, '_node' + _parent);
                        nodeMap.put('_node' + _id, data[i]); 
                    } 
                    firstLevelParentIds = removeArrayFromOtherArray(parents, nodeMap.keys());
                    parents = removeArrayFromOtherArray(parents, firstLevelParentIds);
                    for (var ii = 0; ii < firstLevelParentIds.length; ii++) {
                        firstLevelNodes = firstLevelNodes.concat(parentToChildMap.get(firstLevelParentIds[ii]));

                    } 
                }
            },
            setDisabled: function(val) {
                var tabregion = $(elct); 
                if (val) {
                    $('input,button,select,a', tabregion).attr('disabled', 'true');  
					$('a:not(.pgb)',tabregion).bind('click',function(eee){
						var theEvent = window.event || arguments.callee.caller.arguments[0];
						theEvent.returnValue=false;}); 
					var disall = {pagesCount:1,pagesCount:0};
					g._resetPageBtns(disall);

                } else {
                    $('a,input:not([userSetDisabled=disabled]),button:not([userSetDisabled=disabled]),select:not([userSetDisabled=disabled])').removeAttr('disabled');
					$('a:not(.pgb)',tabregion).unbind('click');
					g._resetPageBtns(pagingInfo);
                }

            },
            getSelectedRow: function() {
                return _$(_lastSelectRowId);

            },
            getRowObjById: function(nid) {
                return $('#_node' + nid)[0];

            },
            getNodePath: function(nid) {
                var allParents = [];
                if (!p.lazy) {
                    while (1) {
                        var pId;
                        pId = childToFatherMap.get(nid);
                        if (pId != null) {
                            allParents.push(pId); 
                            if (findInArray(parents, pId) != -1) {
                                nid = pId;

                            } else {
                                break;

                            }

                        } else {
                            break;

                        }

                    }
                    return allParents.reverse();

                }

            },
            appendChild: function(parentId, jsonStr) {
                if (!p.lazy) {
                    g._e('只在懒加载模式下面可动态添加子节点！');
                    return false;

                } else {
                    var parentNode = _$('_node' + parentId);
                    var img = _$('img_' + parentId);
                    g.dynamicAdd(parentId, parentNode, img, jsonStr);

                }

            },
            _reload: function() { 
                if (!p.dataUrl) {
                    g._e('只在后台表格树下面才可使用reload方法！');
                    return false;

                }
                g._showMsg(1); 
                var mcel = _$('msgCell');
                var param = {
                    idColumn: p.idColumn,
                    analyze: p.analyzeAtServer,
                    parentColumn: p.parentColumn,
                    gtlimit: p.pageSize,
                    lazy: p.lazy

                }; 
                $.ajax({
                    type: "POST",
                    url: p.dataUrl,
                    async: true,
                    data: param,
                    success: function(msg) { 
                        var tb = _$(p.tableId);
                        var o = new Date();
                        g._newPagingServerMakeTable(tb, msg);
                        g._showMsg(0);
                        g._setLastLeaf();
                        mcel.innerHTML = ["当前第", pagingInfo.currentPage, "页/总共", pagingInfo.pagesCount, "页"].join('');
                        var gotime = new Date() - o;
                        g._d('重新加载显示前台消耗时间:' + gotime);

                    }

                });

            },
            dynamicAdd: function(parentId, parentNode, imgNode, childNodeStrs, prebotherindex) { 
                if (!imgNode) { 
                    g._e('动态添加表格行出现错误,可能是没有找到pId对应的img！');
                    return false;

                } 
				$(imgNode).unbind('click').bind('click',function(e) { 
                    g.closeChildrenTable('img_' + parentId,null,e) ;
                }); 
                var level = parseInt(parentNode.getAttribute('_node_level')) + 1;
                var rownumstr = parentNode.getAttribute('rownum').split('.'); 
                var startIndex = 1;
                for (var i = 0, 
                j = rownumstr.length; i < j; i++) {
                    startIndex += parseInt(rownumstr[i]); 
                } 
                var datas = [];
                if (!(p.lazyPage || p.lazyMorePage)) { 
					g._d("!(p.lazyPage || p.lazyMorePage) = true");
                    eval('p.repaintDataInfoDatas = ' + childNodeStrs);
                    datas = p.repaintDataInfoDatas;

                } else {  
                    if (p.allDataInfoWithLazyPageInfo) {
                        if (p.allDataInfoWithLazyPageInfo.data) datas = p.allDataInfoWithLazyPageInfo.data;
                        else {
                            datas = p.allDataInfoWithLazyPageInfo; 
                        } 
                    } else {
                        p._dynamicAddByUse = 1;
                        eval('p.repaintDataInfoDatas = ' + childNodeStrs);
                        datas = p.repaintDataInfoDatas;

                    }

                }   
                var temp = document.createDocumentFragment();
                for (var i = 0; i <= datas.length - 1; i++) { 
                    if (!prebotherindex) {
                        prebotherindex = 0;

                    }
                    var newRow = g._addOneLazyRowByData(startIndex, datas[i], level, i + 1 + prebotherindex * 1, null);   
                    if (p.lazyPage && (i == datas.length - 1) && !p._dynamicAddByUse) {  
                        newRow.setAttribute('_lazy_paging_pId', parentId);
                        $('td[_td_pro]:eq(0) img:eq(' + (level - 2) + ')', newRow).attr('src', p.morePageImg).mouseover(function() {
                            $(this).attr({
                                'id': '_lazypagingimg_' + parentId

                            });
                            g._createLazyPagingDiv(parentId);
                            g._showLazyPagingDiv(parentId, this.id, true, 1);
                            //isIE ? stopBubble() : stopBubble(e); 
                        });

                    } else if (p.lazyMorePage && (i == datas.length - 1) && !p._dynamicAddByUse) {  
                        $('tr[_lazy_paging_pId=' + parentId + ']:last img:eq(' + (level - 2) + ')').attr('src', p.blankImg);
                        $('tr[_lazy_paging_pId=' + parentId + ']').removeAttr('_lazy_paging_pId');
                        $('#_lazypagingimg_' + parentId).removeAttr('id').unbind('mouseover').unbind('click').unbind('mouseout');
                        newRow.setAttribute('_lazy_paging_pId', parentId);
                        var lazypaging_info = _lazypgInfoMap.get(parentId);
                        if (lazypaging_info.currentPage * lazypaging_info.pageSize < lazypaging_info.allCount)
						$('td[_td_pro]:eq(0) img:eq(' + (level - 2) + ')', newRow).attr({
                            'src': p.morePageImg,
                            'title': '点击查看更多'

                        }).css('cursor', 'pointer').mouseover(function() {
                            $(this).attr({
                                'id': '_lazypagingimg_' + parentId

                            });
                            g._createMoreLazyPagingDiv(parentId);
                            g._showLazyPagingDiv(parentId, this.id, true, 2);
                            //isIE ? stopBubble() : stopBubble(e);

                        }).mouseout(function() {
                            $('[id^=_lazyPagingDiv_]').hide();

                        }).click(function() {
                            g._toLazyPage(parentId, '_morepage');
                            $('[id^=_lazyPagingDiv_]').hide(); 
                        }); 
                    } 
                    temp.appendChild(newRow);
                    startIndex++;

                }
                if (p.lazyPage || (p.lazyMorePage && p._dynamicAddByUse)) {
                    $(parentNode).after(temp).attr('_expaned', 'true');

                } else {
                    if ($('tr[_node_parent=_node' + parentId + ']').size() > 0) {
                        $('tr[_node_parent=_node' + parentId + ']:last').after(temp);

                    } else $(parentNode).after(temp).attr('_expaned', 'true');

                }
                imgNode.src = p.closeImg;
                if (p.exchangeColor) g._setColor();
                p.repaintDataInfoDatas = null;
                p.allDataInfoWithLazyPageInfo = null;
                p._dynamicAddByUse = null;

            },
			_open:function(id){  
				g.openChildrenTable(id);
			},
			_close:function(id){
				g.closeChildrenTable(id);
			},
			openChildrenTable: function(imgid, node, e) {  
                var _id = imgid.replace('img_', '').replace('_node', ''); 
                var img = _$('img_' + _id); 
				if(!img) return false;
				var pN = $('#_node' + _id+":visible"); 
				if(pN.length<1 ){
					return false;
				}
				if(pN.attr('_open') == 'true'){
					return false;
				}
                if (!p.lazy) { 
                    $(img).unbind('click').attr('src',p.closeImg).bind('click',function(ee){
							 g.closeChildrenTable(imgid, node, ee) 
					});   
                    $('tr[_node_parent=_node' + _id + ']').each(function(i,ee) {
						var $this = $(this);
                        if ($this.attr('_node_isparent') == '1') {
                            g.openChildrenTable(this.id, this, ee);

                        } 
                        $this.show();
                    });
                    pN.attr('_open','true');
                    $('tr[_node_parent=_node' + _id + ']').show(); 
                    if (p.exchangeColor) g._setColor(); 

                } else {  
                    var param = {
                        pId: _id

                    }; 
					if (img.src.indexOf(p.lazyLoadImg) == -1) {
							img.src = p.lazyLoadImg;
					} else {
						return false;
					} 
                    if ( pN.attr('_expaned') != 'true') { 
                        if (p.lazyPage || p.lazyMorePage) {
                            param = {
                                pId: _id,
                                page: true,
                                gtlimit: p.lazyPageSize,
                                analyze: p.analyzeAtServer

                            };

                        }
                        $.ajax({
                            type: "POST",
                            url: p.lazyLoadUrl,
                            async: true,
                            data: param,
                            success: function(msg) { 
                                if (msg != null && msg != "") {
                                    try {
                                        var o = new Date();
                                        if (p.lazyPage || p.lazyMorePage) {
                                            g._initLazyPageInfo(_id, '父亲节点id', msg);
                                            g.dynamicAdd(_id, pN[0], img, msg);

                                        } else {
                                            g.dynamicAdd(_id, pN[0], img, msg);

                                        }
                                        g._setLastLeaf();
                                        var gotime = new Date() - o;
										pN.attr('_expaned','true');
                                        g._d('懒加载显示前台消耗时间:' + gotime);
                                        if (p.onLazyLoadSuccess) p.onLazyLoadSuccess(elct);

                                    } catch(ee) {
                                        g._e('541行...不该出现...');
                                    }

                                } else {
									g._e("没有数据."); 
                                }

                            }

                        });

                    } else {
							$('tr[_node_parent=_node' + _id + ']').show();  
							 $(img).unbind('click').attr('src',p.closeImg).bind('click',function(ee){
									 g.closeChildrenTable('img_' + _id, img, ee) 
							});    
                    }
                    if (p.exchangeColor) g._setColor();

                }

            },
			_hideByPath:function(ppth,e){
				$('tr[_node_path^=' + ppth + ']',elct).each(function(){
					var $this = $(this);
					var id = $this.attr('id').replace('_node','');  
					if($this.attr('_node_isparent')=='1'){  
						$('#img_'+id).attr('src',p.openImg).unbind('click').bind('click',function(ee){ 
							g.openChildrenTable(id,null,ee); 
						});
						$this.attr('_open','false');
					}
					$this.hide();
				});  
			},
            closeChildrenTable: function(imgid, node, e) {  
				var _id = imgid.replace('img_', '').replace('_node', '');
                var img = _$('img_' + _id);
				if(!img) return false;
                img.src = p.openImg;
                $(img).unbind('click').bind('click',function(ee) { 
					g.openChildrenTable(imgid, node, ee) ;
                });  
				var pN = $('#_node'+_id);
				pN.attr('_open','false');
				var npth = pN.attr('_node_path');
				var ppth = npth+',_node'+_id;  
				if(npth=='_node-1')
				{  
					g._hideByPath('_node'+_id,e)
				}  
				g._hideByPath(ppth,e); 
                if (p.exchangeColor) g._setColor(); 
            },
            select: function(nodeId) {
                $('input[name=_chks][value=' + nodeId + ']:not([userSetDisabled=disabled])').attr('checked', true);
                isIE ? stopBubble() : stopBubble(window.Event);

            },
            closeAll: function() {
                if (!p.lazy) { 
					$('tr[_node_isparent=1]').each(function(){
						var _$this = $(this);
						var id = _$this.attr('id').replace('_node','');  
						_$this.find('img[id=img_'+id+']').attr('src',p.openImg).unbind('click').bind('click',function(e) { 
							g.openChildrenTable('img_' + id,null,e) ;
						}); 
						_$this.attr('_open','false');
					});   
					 $('tr[id^=_node][_node_level!=1]').hide();
                } else {
                    g._e('懒加载模式下全部关闭不可用.'); 
                }

            },
            expandAll: function() {
                if (!p.lazy) { 
					$('tr[id^=_node]').show();
					$('tr[_node_isparent=1]').each(function(){
						var _$this = $(this);
						var id = _$this.attr('id').replace('_node','');  
						_$this.find('img[id=img_'+id+']').attr('src',p.closeImg).unbind('click').bind('click',function(e) { 
							g.closeChildrenTable('img_' + id,null,e) ;
						}); 
						_$this.attr('_open','true');
					});   

                } else {
                    g._e('懒加载模式下全部展开不可用.'); 
                }

            },
            _searchTable: function(data) {
                if (!data.url) {
                    g._e('查询表格树必须传入参数url!');
                    return false;

                }
                if (!data.param) {
                    data.param = '';

                }
                var _url = data.url;
                if (_url.indexOf('?') == -1) {
                    _url = data.url + '?' + data.param;

                } else {
                    _url = data.url + "&" + data.param;

                }
                p.dataUrl = _url;
                g._showMsg(1);
                var param = {
                    idColumn: p.idColumn,
                    analyze: p.analyzeAtServer,
                    parentColumn: p.parentColumn,
                    gtlimit: p.pageSize,
                    lazy: p.lazy

                };
                g._postGetTable(_url, param);
                g._resetCurrentPageSize();
                if (p.disabled) {
                    g.setDisabled(true);

                }

            },
			_consoleJson:function(msg){ 
				$('#_content_div').html('');
				if (msg != null && msg != "") {
					try {
						var _verify_ans = g._verifyAjaxAns(msg);
						if (!_verify_ans) {
							_isValid = false;
							g._showMsg(0);
							return;

						} 
						if (_verify_ans != 'nodataes') {
							g._makeTable(msg);

						}

					} catch(e) {
						g._showMsg(0);

					}

				} else {
					g._showMsg(0);

				}
			},
            _postGetTable: function(u, p) {
                $.ajax({
                    type: "POST",
                    url: u,
                    async: true,
                    data: p,
                    error: function(m) {  
					   g._consoleJson(data.responseText) 
                    },
                    success: function(msg) {   
						g._consoleJson(msg);
                    }

                });

            },
            _setLastLeaf: function() {   
                if (lastLeafMap.size() > 0) {
                    var allLeaf = lastLeafMap.values();
                    for (__i = 0; __i < allLeaf.length; __i++) {
						var _lastLeafId = 'img_' + (allLeaf[__i].replace('_node', ''));  
						var src = $('#' + _lastLeafId).attr('src');
						if(src)
							if(src.indexOf(p.minNoparentImg)!=-1)
							$('#' + _lastLeafId).attr('src', p.lastLeafImg);  
                    }

                }

            },
            _parseLazyData: function(data) {
                var allId = [];
                var _lev = [];
                var allp = [];
                var pc = p.parentColumn;
                var ic = p.idColumn;
                var lev = 1
                var idToNumMap = new HashMap();
                var pToNumMap = new HashMap();
                for (var i = 0, 
                j = data.length; i < j; i++) {
                    var _p = data[i][pc];
                    var _id = data[i][ic];
                    allId.push(_id);
                    if (findInArray(allp, _p) == -1) {
                        allp.push(_p);

                    }
                    if (!pToNumMap.get(_p)) {
                        pToNumMap.put(_p, 1);

                    } else {
                        pToNumMap.put(_p, pToNumMap.get(_p) * 1 + 1)

                    }
                    if (findInArray(allId, _p) == -1) idToNumMap.put(_id, pToNumMap.get(_p));
                    else {
                        idToNumMap.put(_id, idToNumMap.get(_p) + '.' + pToNumMap.get(_p));

                    }

                }
                return {
                    'specPids': removeArrayFromOtherArray(allp, removeArrayFromOtherArray(allp, allId)),
                    'idToNumMap': idToNumMap

                };

            },
            _showLazyTable: function(tableTree, data) {    
                g._clearContent();
                var datas = p.allDataInfoWithPageInfo.data; 
                var rowCount = 0;
                var parseAns = g._parseLazyData(datas);
                var specP = parseAns['specPids'];
                var idToNumMap = parseAns['idToNumMap'];  
                for (var i = 0, 
                j = datas.length; i < j; i++) { 
                    var oneObj = datas[i];
                    if (typeof oneObj == 'string') {
                        eval("oneObj=" + oneObj);

                    } 
                    var _num = idToNumMap.get(oneObj[p.idColumn]);  
                    var newRow = g._addOneLazyRowByData(rowCount, oneObj, 1, null, specP, _num); 
                    if ($('tbody', tableTree).size() > 0) $(tableTree).children('tbody').append(newRow);
                    else $(tableTree).append(newRow); 
                    rowCount = rowCount + 1;

                }

            },
            //使用递归的方式添加树和孩子节点.
            _showTable: function(tableTree, startParentIndex, endParentIndex) {  
                g._clearContent(); 
                var rowCount = 1;  
                var lenlen = firstLevelNodes.length;
				 for (var ind = startParentIndex; ind < endParentIndex && ind < lenlen; ind++) {
                    var _parentId = firstLevelNodes[ind];  
				     if (findInArray(parents, _parentId) == -1) {
                        lastLeafMap.put('level1', _parentId);

                    }
                    var oneObj = nodeMap.get(_parentId);
                    if (typeof oneObj == 'string') {
                        eval("oneObj=" + oneObj);

                    }
                    g._addOneRowByData(tableTree, rowCount, oneObj, 1); 
                    rowCount = rowCount + 1; 
                    addChildByParentNode(oneObj, 2);

                }
                function addChildByParentNode(parentNode, level) {
                    var _id = parentNode[p.idColumn];
                    var _parent = parentNode[p.parentColumn];
                    var _isP = g.isParent(parentNode);
                    var _children = parentToChildMap.get('_node' + _id); 
                    if (_children != null) {
                        for (var i = 0; i < _children.length; i++) {
                            var oneObj;
                            var _node_id = _children[i];
                            oneObj = nodeMap.get(_node_id); 
                            if (findInArray(parents, _node_id) == -1) { 
                                 lastLeafMap.put('level' + level + _id, _node_id); 
                            }
                            if (typeof oneObj == 'string') {
                                eval("oneObj=" + oneObj);

                            } 
                            g._addOneRowByData(tableTree, rowCount, oneObj, level);
                            rowCount = rowCount + 1;
                            if (g.isParent(oneObj) == '1') {
                                addChildByParentNode(oneObj, level + 1);

                            }

                        }

                    }

                }

            },
            _addEventToObj: function(obj, funObj) {
                if (isIE) {
                    for (eventName in funObj) {
                        var fun = funObj[eventName];
                        obj.attachEvent(eventName, 
                        function() {
                            fun(obj);

                        });

                    }

                } else {
                    for (eventName in funObj) {
                        var fun = funObj[eventName];
                        var len = eventName.length;
                        var newfun = fun.bind(null, obj);
                        obj.addEventListener(eventName.substring(2, len), newfun, false);

                    }

                }

            },
            _getSelectRowId: function() {
                return _lastSelectRowId;

            },
            _chooseParentNode: function(checkboxDom) {
                var nodeId = checkboxDom.value;
                if (checkboxDom.checked) {
                    while (1) {
                        var parentId = _$('_node' + nodeId)._node_parent;
                        if (_$(parentId) != null) {
                            nodeId = parentId.replace('_node', '');
                            var obj = _$('_chk' + nodeId).firstChild;
                            if (_notBindDisabled(obj)) obj.checked = 1;

                        } else {
                            break;

                        }

                    }

                }

            },
            _chooseChildrenNode: function(checkboxDom) {
                var nodeId = checkboxDom.value;
                if (checkboxDom.checked) {
                    g._chooseAllChildrenNode('_node' + nodeId, true); 
                } 
            },
            _cancleChildrenNode: function(checkboxDom) {
                var nodeId = checkboxDom.value;
                if (!checkboxDom.checked) {
                    g._chooseAllChildrenNode('_node' + nodeId, false);

                }

            },
            _chooseAllChildrenNode: function(nodeId, v) {
                var children = g.seeChildren(nodeId);
                if (children) {
                    var len = children.length;
                    for (var i = 0; i < len; i++) {
                        var nodeId = children[i].replace('_node', '');
                        var obj = _$('_chk' + nodeId).firstChild;
                        if (_notBindDisabled(obj)) obj.checked = v;
                        if (findInArray(parents, children[i]) != -1) {
                            g._chooseAllChildrenNode(children[i], v);

                        } 
                    }

                }

            },
            _cancelFaher: function(checkboxDom) {
                var nodeId = checkboxDom.value;
                if (!checkboxDom.checked) {
                    while (1 == 1) {
                        var parentId = _$('_node' + nodeId)._node_parent;
                        if (_$(parentId)) {
                            nodeId = parentId.replace('_node', '');
                            if (!g._anyChildChoosed(parentId)) {
                                var obj = _$('_chk' + nodeId).firstChild;
                                if (_notBindDisabled(obj)) obj.checked = 0;
 
                            }

                        } else {
                            break;

                        }

                    }

                }

            },
            _anyChildChoosed: function(parentId) {
                var children = g.seeChildren(parentId);
                var len = children.length;
                for (var i = 0; i < len; i++) {
                    var nodeId = children[i].replace('_node', '');
                    if (_$('_chk' + nodeId).firstChild.checked) {
                        return true;

                    }

                }
                return false;

            },
            _createContent: function(showTypeDesc, onerow, dataColumn, idValue,rowobj) {
                var tp = showTypeDesc.inputtype;
                var cssName = showTypeDesc.style;
                var allvalues = showTypeDesc.values;
                var texts = [];
                var value = onerow[dataColumn]; 
                value = trim(value);
                var inputName = showTypeDesc.nameId + idValue;
                var setVisible = showTypeDesc.visibledIndex;
                var setDisabled = showTypeDesc.disabledIndex;
                var node = document.createElement("div"); 
                if (setVisible == null || onerow[setVisible] + '' == '1') {
                    if (onerow[setDisabled] + '' == '1') {
                        setDisabled = 'disabled';

                    } else {
                        setDisabled = '';

                    }
                    node.style.textAlign = 'center';
                    if (tp == 'textbox') {
                        node.innerHTML = ["<input type='text' class='", cssName, "'  value='", value, "' name='", inputName, "' ", setDisabled, " userSetDisabled='", setDisabled, "'/>"].join('');

                    } else if (tp == 'html') {
                        texts = showTypeDesc.htmlStr;
                        node.setAttribute('id', inputName); 
                        node.innerHTML = texts.replace(/[$]/g, value); 
                    } else if (tp == 'function') { 
                       if(showTypeDesc.func){
                         	$(node).html("<div>"+showTypeDesc.func(onerow,rowobj)+"</div>");
						}
                    }else if (tp == 'select') {
                        texts = showTypeDesc.texts;
                        var ans = [];
                        ans.push("<select>");
                        for (var i = 0; i < allvalues.length; i++) {
                            if (allvalues[i] == value) {
                                ans.push(["<option value='", allvalues[i], "' selected>", texts[i], "</option>"].join(''));

                            } else {
                                ans.push(["<option value='", allvalues[i], "'>", texts[i], "</option>"].join(''));

                            }

                        }
                        ans.push("</select>");
                        node.innerHTML = ans.join('');

                    } else if (tp == 'radiobox') {
                        texts = showTypeDesc.texts;
                        node.appendChild(createHidden(inputName, inputName, value));
                        var f = function() {
                            if (showTypeDesc.onclick) showTypeDesc.onclick();
                            _$(inputName).value = this.value;

                        };
                        for (var i = 0; i < allvalues.length; i++) {
                            if (value == allvalues[i]) {
                                createRadio(node, setDisabled, '', 'rd_' + inputName, allvalues[i], f, texts[i], cssName, 'checked');

                            } else {
                                createRadio(node, setDisabled, '', 'rd_' + inputName, allvalues[i], f, texts[i], cssName, '');

                            }

                        }

                    } else if (tp == 'checkbox') {
                        texts = showTypeDesc.texts;
                        var chArry = value.split(',');
                        var f = function(e) {
                            if (showTypeDesc.onclick) showTypeDesc.onclick();

                        };
                        for (var i = 0; i < allvalues.length; i++) {
                            if (findInArray(chArry, allvalues[i]) != -1) {
                                createCheckbox(node, setDisabled, '', inputName, allvalues[i], f, texts[i], cssName, 'checked');

                            } else {
                                createCheckbox(node, setDisabled, '', inputName, allvalues[i], f, texts[i], cssName, '');

                            }

                        }

                    } else {
                        node.innerHTML = '<font color="red">配置表格树的列类型出错.</font>';

                    }

                }
                return node;

            },
            _resetAllLazyPageBtns: function(pginfo, fstBtnId, preBtnId, lastBtnId, nxtBtnId) {
                var f1t = _$(fstBtnId),
                pre = _$(preBtnId),
                lst = _$(lastBtnId),
                nex = _$(nxtBtnId); 
                if (pginfo.pagesCount == 1 || pginfo.pagesCount == 0) { 
                    $(f1t).removeClass("firstPage").addClass("disFirstPage").attr("disabled", true);
                    $(pre).removeClass("prevPage").addClass("disPrevPage").attr("disabled", true);
                    $(lst).removeClass("lastPage").addClass("disLastPage").attr("disabled", true);
                    $(nex).removeClass("nextPage").addClass("disNextPage").attr("disabled", true);

                } else {
                    if (pginfo.currentPage == 1) { 
                        $(f1t).removeClass("firstPage").addClass("disFirstPage").attr("disabled", true);
                        $(pre).removeClass("prevPage").addClass("disPrevPage").attr("disabled", true);
                        $(lst).removeClass("disLastPage").addClass("lastPage").attr("disabled", false);
                        $(nex).removeClass("disNextPage").addClass("nextPage").attr("disabled", false);

                    } else if (pginfo.currentPage == pginfo.pagesCount) {
                        $(f1t).removeClass("disFirstPage").addClass("firstPage").attr("disabled", false);
                        $(pre).removeClass("disPrevPage").addClass("prevPage").attr("disabled", false);
                        $(lst).removeClass("lastPage").addClass("disLastPage").attr("disabled", true);
                        $(nex).removeClass("nextPage").addClass("disNextPage").attr("disabled", true);

                    } else {
                        $(f1t).removeClass("disFirstPage").addClass("firstPage").attr("disabled", false);
                        $(pre).removeClass("disPrevPage").addClass("prevPage").attr("disabled", false);
                        $(lst).removeClass("disLastPage").addClass("lastPage").attr("disabled", false);
                        $(nex).removeClass("disNextPage").addClass("nextPage").attr("disabled", false);

                    }

                }

            },
            _resetPageBtns: function(pginfo) { 
                function setPageBtn(div, v) {
                    if (v) {
                        div.removeClass('disabled');
                        div.children('a').show();
                        div.children('span').hide();

                    } else {
                        div.addClass('disabled');
                        div.children('a').hide();
                        div.children('span').show(); 
                    }

                }
                var _pagebar_div = $('#_pagebar_pagesdiv');
                if (pginfo.pagesCount == 1 || pginfo.pagesCount == 0) { 
                    setPageBtn($('li:eq(0)', _pagebar_div), false);
                    setPageBtn($('li:eq(1)', _pagebar_div), false);
                    setPageBtn($('li:eq(2)', _pagebar_div), false);
                    setPageBtn($('li:eq(3)', _pagebar_div), false);

                } else { 
                    if (pginfo.currentPage == 1) {
                        setPageBtn($('li:eq(0)', _pagebar_div), false);
                        setPageBtn($('li:eq(1)', _pagebar_div), false);
                        setPageBtn($('li:eq(2)', _pagebar_div), true);
                        setPageBtn($('li:eq(3)', _pagebar_div), true);

                    } else if (pginfo.currentPage == pginfo.pagesCount) {
                        setPageBtn($('li:eq(0)', _pagebar_div), true);
                        setPageBtn($('li:eq(1)', _pagebar_div), true);
                        setPageBtn($('li:eq(2)', _pagebar_div), false);
                        setPageBtn($('li:eq(3)', _pagebar_div), false);

                    } else {
                        setPageBtn($('li:eq(0)', _pagebar_div), true);
                        setPageBtn($('li:eq(1)', _pagebar_div), true);
                        setPageBtn($('li:eq(2)', _pagebar_div), true);
                        setPageBtn($('li:eq(3)', _pagebar_div), true);

                    }

                }

            },
			_beforeAjax:function(){ 
				 if(!$.isFunction(p.beforeAjax)){ 
				 var _d = $('#_centerMsg');
                    var _bd = $(document.body);
                    _d.css({
                        'top': (_bd.scrollTop() + (_bd.height() - _d.height()) / 2),
                        'left': (_bd.scrollLeft() + (_bd.width() - _d.width()) / 2)
                    });
                    $('#showmsg').width(_bd.width()).height(_bd.height()).css({
                        'top': 0,
                        'left': 0
                    }).show();
				}else{
					p.beforeAjax();
				} 
			},
			_endAjax:function(){ 
				if(!$.isFunction(p.afterAjax))
					 $('#showmsg').hide();
				else
					p.afterAjax(); 
			},
            _showMsg: function(v) { 
                if (v) {
                   g._beforeAjax(); 
                }
                else {
                   g._endAjax();
                }  
            },
            _showLazyPagingDiv: function(pid, imgId, v, way) { 
                var lazyPageDiv = _$("_lazyPagingDiv_" + pid);
                var offset = $('#' + imgId).offset();
                if (v) {
                    var lazypaging_info = _lazypgInfoMap.get(pid);
                    $('[id^=_lazyPagingDiv_]').hide();
                    $('#_lazy_page_count_' + pid).text(lazypaging_info.allCount);
                    g._resetLazyPageBtns(pid);
                    if (way == 1) {
                        lazyPageDiv.style.top = offset.top;
                        $('#_lazy_page_currentpage_' + pid).text(lazypaging_info.currentPage);

                    } else {
                        var lastcount = lazypaging_info.currentPage * lazypaging_info.pageSize;
                        if (lastcount > lazypaging_info.allCount) {
                            lastcount = lazypaging_info.allCount;

                        }
                        lazyPageDiv.style.top = offset.top - $('#' + imgId).height();
                        $('#_lazy_page_currentpage_' + pid).text(lastcount);

                    }
                    lazyPageDiv.style.left = offset.left;
                    lazypagex = offset.left;
                    lazypagex2 = offset.left + $(lazyPageDiv).width();
                    lazypagey = offset.top;
                    lazypagey2 = offset.top + $(lazyPageDiv).height();
                    lazyPageDiv.style.display = 'inline';
                    lazyPageDiv.focus();

                } else lazyPageDiv.style.display = 'none';

            }, 
            _createLazyPagingDiv: function(pid) {
                if (_$("_lazyPagingDiv_" + pid) != null) {
                    return true;

                }
                var lazyPagingDiv = document.createElement("div");
                $(lazyPagingDiv).attr('id', '_lazyPagingDiv_' + pid).addClass("lazyPagediv").html(lzpagetabletemp.replace(/\$/g, pid)).mouseout(function(e) {
					g._showLazyPagingDiv(pid, 'null', false);
                    e = e || window.event;
                    var mousePos = mousePosition(e);
					g._d("lazypagex="+lazypagex+",lazypagey="+lazypagey+",lazypagex2="+lazypagex2+",lazypagey2="+lazypagey2);
					g._d("mousePos.x="+mousePos.x+",mousePos.y="+mousePos.y);
                    if (mousePos.x < lazypagex || mousePos.y < lazypagey || mousePos.x >= lazypagex2 || mousePos.y >= lazypagey2) {
                        g._showLazyPagingDiv(pid, 'null', false);

                    }
					isIE ? stopBubble() : stopBubble(e); 
                });
                document.body.appendChild(lazyPagingDiv);
            },
            _createMoreLazyPagingDiv: function(pid) {
                if (_$("_lazyPagingDiv_" + pid) != null) {
                    return true;

                }
                var lazyPagingDiv = document.createElement("div");
                $(lazyPagingDiv).attr('id', '_lazyPagingDiv_' + pid).addClass("lazyPagediv").html(lzmorepagetemp.replace(/\$/g, pid));
                document.body.appendChild(lazyPagingDiv);
                var lazypaging_info = _lazypgInfoMap.get(pid);
                $('#_lazy_page_count_' + pid).text(lazypaging_info.allCount);
                $('#_lazy_page_currentpage_' + pid).text(lazypaging_info.currentPage * lazypaging_info.pageSize);

            },
            _initPageInfo: function() {  
                if (_serverPagingMode == 'client') {
                    pagingInfo.allCount = firstLevelNodes.length;
                    pagingInfo.pageSize = p.pageSize;
                    pagingInfo.pagesCount = Math.ceil(pagingInfo.allCount / pagingInfo.pageSize * 1.0);
                    pagingInfo.currentPage = 1;
					g._d('处理分页:pagingInfo.allCount='+pagingInfo.allCount+",pagingInfo.pageSize="+pagingInfo.pageSize
						+",pagingInfo.pagesCount="+pagingInfo.pagesCount+",pagingInfo.currentPage="+pagingInfo.currentPage);

                } else if (_serverPagingMode == 'analyzeAtPage') {
                    pagingInfo.allCount = p.allDataInfoWithPageInfo.total;
                    pagingInfo.pageSize = p.pageSize;
                    pagingInfo.pagesCount = Math.ceil(pagingInfo.allCount / pagingInfo.pageSize * 1.0);
                    pagingInfo.currentPage = p.allDataInfoWithPageInfo.page;

                } else {
                    g._e("怎么进来了?出现bug了!");

                }

            },
            _initLazyPageInfo: function(pid, pName, msg) {
                eval("p.allDataInfoWithLazyPageInfo=" + msg);
                var lazypgInfo = {};
                lazypgInfo.parentId = pid;
                lazypgInfo.parentName = pName;
                lazypgInfo.allCount = p.allDataInfoWithLazyPageInfo.total;
                lazypgInfo.pageSize = p.lazyPageSize;
                lazypgInfo.pagesCount = Math.ceil(lazypgInfo.allCount / lazypgInfo.pageSize * 1.0);
                lazypgInfo.currentPage = p.allDataInfoWithLazyPageInfo.page;
                _lazypgInfoMap.put(pid, lazypgInfo);

            },
            _d: function(msg) {
                if (p.debug == 1&&window.console) {  
						window.console.info(new Date()+":"+msg); 
                } 
            },
            _newPagingServerMakeTable: function(tree, msg) {				
                g._analyseData(msg); 
                pagingInfo.pageSize = p.pageSize;
                pagingInfo.pagesCount = Math.ceil(pagingInfo.allCount / pagingInfo.pageSize * 1.0);
                if (!p.lazy) g._showTable(tree, 0, firstLevelNodes.length + 1);
                else g._showLazyTable(tree, p.allDataInfoWithPageInfo.data);
                g._resetBasePageBtns();
                if (p.exchangeColor) g._setColor();
                if (p.expandAll) {
                    g.expandAll(); 
                }
                if (p.onPagingSuccess) p.onPagingSuccess(elct);

            },
            _setColor: function() {
                var num = 1; 
                $("tr[id^=_node]", g.tableTree).each(function(i) {
                    if (this.style.display != 'none') {
                        if (num++%2 == 0) {
                            $(this).removeClass('TrEven').addClass('TrOdd');

                        } else {
                            $(this).removeClass('TrOdd').addClass('TrEven');

                        }

                    }

                })

            },
			_getColumnWidthArr:function(){ 
				 $('div.gridCol[cmtitle=1]').each(function(){
					headColumnWidths.push($(this).width());
				 });  
			},
            _addTitleHead: function() {
                var cms = p.columnModel;
                var tableHeaderTable = document.createElement("table");
                tableHeaderTable.style.overflow = 'hidden';
               // tableHeaderTable.style.width = '100%';
                var tableHeadRow = tableHeaderTable.createTHead();
                var newRow = document.createElement("tr");
                newRow.setAttribute('id', '_trhead');
                var checkAllButton;
                if (p.checkOption == 'radio' || p.checkOption == 'multi') {
                    if (p.checkOption == 'multi' && p.allCheck) {
                        checkAllButton = $("<input type='checkbox' style='width:20px;border:0px;' id='_checkAll'>").click(function(){
							g._chooseAll();
						}); 
                    }

                }
                if (p.rowCount&&p._countColumnIndex==-2) {
					var jcdiv = $('<div class="gridCol"></div>').html(p.countColumnDesc).width(p.countCellWd);
                    $("<th>").attr('id', 'countCell').addClass('center').addClass('countCell').width(p.countCellWd).append(jcdiv).appendTo(newRow);

                }
                var i = 0;
                var lenlen = cms.length; 
                for (var ii = 0; ii < lenlen; ii++) {
                    var oneColumn = cms[ii];
                    var newCell = document.createElement("th");
                    newCell.style.width = '';
					var j_cell = $(newCell);
					var jcdiv = $('<div class="gridCol" cmtitle=1></div>')
					//lsq
                    if (p.columnModel[i].width != null && p.columnModel[i].width != '*'){
						jcdiv.width(p.columnModel[i].width).html(oneColumn.header); 
						j_cell.width(p.columnModel[i].width);
					}  
                    i = i + 1;
                    if (p._checkColumnIndex == -1 && p.checkColumnNm == oneColumn.headerIndex) {
                        p._checkColumnIndex = ii; 
                    }
					if (p._countColumnIndex == -1 && p.countColumnNm == oneColumn.headerIndex) {
                        p._countColumnIndex = ii;  
                    }
					if (p._expandColumnIndex == -1 && p.expandColumnNm == oneColumn.headerIndex) {
                        p._expandColumnIndex = ii;  
                    }					
                    if ((p.checkOption == 'multi' && p.allCheck) && p._checkColumnIndex == ii) {
                        jcdiv.prepend(checkAllButton); 
                    }
					j_cell.addClass('center').attr('id', oneColumn.headerIndex).append(jcdiv).appendTo(newRow);
                    headColumns.push(oneColumn.headerIndex);
                }
				 
                var _emptyTitleHead = document.createElement("th");
                $(_emptyTitleHead).addClass('emptyTh').appendTo(newRow);
                if (p._checkColumnIndex == -1) p._checkColumnIndex = 0;
                tableHeadRow.appendChild(newRow);
                return tableHeaderTable;

            },
            _chooseAll: function() {
                if (_$('_checkAll').checked) {
                    _checkedAll("_chks", true);

                } else {
                    _checkedAll("_chks", false);

                }

            },
            _getFirstIndexInThisPage: function() {
                var _firstIndex = 0;
                if (p.pageBar) _firstIndex = (pagingInfo.currentPage - 1) * pagingInfo.pageSize;
                return _firstIndex;

            },
            _clearContent: function() { 
				 $('#' + p.tableId).children().remove(); 
            },
            _makePageBar: function(div) {
                var msgCell = document.createElement("div");
                $(msgCell).attr('id', '_pagebar_msgCell').addClass('pages').width(200).html(['<span>每页</span><span><select ', ' id="_changePageSizeSel"><option value="5">5</option><option value="10" selected>10</option>', '<option value="20">20</option><option value="40">40</option><option value="100">100</option></select></span><span>条</span>', "<span id='msgCell'>当前第", pagingInfo.currentPage, "页/总共", pagingInfo.pagesCount, "页</span>"].join('')).appendTo(div);
                var pagesDiv = document.createElement("div");
                $(pagesDiv).attr('id', '_pagebar_pagesdiv').addClass('pagination2').html('<ul> <li class="j-first disabled"> <a style="display: none;" class="first pgb" href="javascript:;"><span>首页</span></a> <span class="first"><span>首页</span></span> </li> <li class="j-prev disabled"> <a style="display: none;" class="previous pgb" href="javascript:;"><span>上一页</span></a> <span class="previous"><span>上一页</span></span> </li> <li class="j-next"> <a style="display: block;" class="next pgb" href="javascript:;"><span>下一页</span></a> <span style="display: none;" class="next"><span>下一页</span></span> </li> <li class="j-last"> <a style="display: block;" class="pgb last" href="javascript:;"><span>末页</span></a> <span style="display: none;" class="last"><span>末页</span></span> </li> <li class="jumpto"><input class="textInput" size="4" value="1" type="text"><input class="goto"  type="button"></li> </ul>'); 
                div.appendChild(pagesDiv);

            },
            _reMakeTable: function(pageSize) {
                if (pagingInfo.pagesCount != 0) {
                    if (_serverPagingMode == 'client') {
                        pagingInfo.pageSize = pageSize;
                        pagingInfo.pagesCount = Math.ceil(pagingInfo.allCount / pagingInfo.pageSize * 1.0);
                        pagingInfo.currentPage = 1;
                        _$('msgCell').innerHTML = "当前第" + pagingInfo.currentPage + "页/总共" + pagingInfo.pagesCount + "页";
                        g._toPage(1);
                        _$(p.tableId).focus();

                    } else {
                        pagingInfo.pageSize = pageSize;
                        p.pageSize = pageSize;
                        g._toPage("repaging");
                        _$(p.tableId).focus();

                    }

                }

            }, 
            //懒加载的添加行对象
            _addOneLazyRowByData: function(index, rowData, level, nth, sp, _num) { 
                var newRow = document.createElement('tr');
                var _id = rowData[p.idColumn];
                var _parent = rowData[p.parentColumn];
                var _id_p = _parent;
                _parent = _parent == "" ? '-1': _parent;
                var _isP = g.isParent(rowData);
                var pnode = g.getRowObjById(_parent);
                if (_num) {
                    level += ('' + _num).split('.').length - 1;

                }
                if (_isP != '1') lastLeafMap.put('level' + level + _parent, _id);
                _parent = '_node' + _parent;
                var parentRowNum = '';
                var parentPath = '';
                if (pnode) {
                    var __p = $(pnode);
                    parentRowNum = __p.attr('rownum') + '.';
                    parentPath = __p.attr('_node_path') + ',';

                }
                if (!_num) {
                    if (!nth) nth = index;
                    var _nth = 0;
                    if (level == 1) {
                        _nth = nth + 1;

                    } else {
                        _nth = nth;

                    }

                } else {
                    _nth = _num;

                }
                $(newRow).attr({
                    rownum: parentRowNum + _nth,
                    id: '_node' + _id,
                    _node_parent: _parent,
                    _node_path: parentPath + _parent,
                    _node_isparent: _isP,
                    _node_level: level

                });
                if (_isP == '1') {
                    if (sp) if (findInArray(sp, _id) != -1) {
                        newRow.setAttribute('_open', 'true');
                        newRow.setAttribute('_expaned', 'true');

                    } else {
                        newRow.setAttribute('_open', 'false');

                    } else newRow.setAttribute('_open', 'false');

                }
                g._userSetPros(rowData, newRow);
                var checkSpan = g._addCheckOptionCell(rowData, newRow);
				var countV = '';
				if(p.rowCount)
				 countV = g._getCountVal(rowData, newRow, index, level);
                g._addOneLazyRowContent(rowData, newRow, _id, _isP, level, checkSpan, sp,countV);
                g._addOneRowListerners(newRow); 
                var _emptyTitleHead = document.createElement("td");
                $(_emptyTitleHead).addClass('emptyTh').appendTo(newRow);
                return newRow;

            }, 
            _addOneRowByData: function(tableObj, index, rowData, level) {
                var newRow = tableObj.insertRow(index - 1);
                var _id = rowData[p.idColumn];
                var _parent = rowData[p.parentColumn];
                var _isP = g.isParent(rowData);
                newRow.setAttribute('id', '_node' + _id);
                _parent = _parent == "" ? '-1': _parent;
                _parent = '_node' + _parent;
                newRow.setAttribute('_node_parent', _parent);
                if (level == 1) newRow.setAttribute('_node_path', '_node-1');
                else {
					var ar = g.getNodePath('_node' + _id);
					ar = $.map(ar,function(n){
						if(n=='_node'){
							return '_node-1';
						}else{
							return n;
						}
					}); 
                    newRow.setAttribute('_node_path', ar.join(','));

                }
                newRow.setAttribute('_node_isparent', _isP);
                newRow.setAttribute('_node_level', level);
                if (_isP == '1') newRow.setAttribute('_open', 'false');
                g._userSetPros(rowData, newRow); //lsq
                var checkSpan = g._addCheckOptionCell(rowData, newRow);
				var countV = '';
				if(p.rowCount)
					countV = g._getCountVal(rowData, newRow, index, level);
                g._addOneRowContent(rowData, newRow, _id, _isP, level, checkSpan,countV);
                g._addOneRowListerners(newRow);
                var _emptyTitleHead = document.createElement("td");
                $(_emptyTitleHead).addClass('emptyTh').appendTo(newRow);

            },
			_genrateExpandImg:function(level,_isP,_id,newRow,cdiv){
				var ct = level - 1;
				var ans = [];
				for (var ii = 0; ii < ct; ii++) {
					ans.push(['<IMG ', 'src="', p.blankImg, '"/>'].join(''));
				} 
				cdiv.html(ans.join('')); 
				if (_isP == '1') {
					cdiv.append(g._createOpenImg(_id));
					if (findInArray(firstLevelNodes, '_node' + _id) == -1) {
						newRow.style.display = 'none'; 
					} 
				} else {
					if (findInArray(firstLevelNodes, '_node' + _id) == -1) {
						cdiv.append(g._createLeafImg(_id));
						newRow.style.display = 'none'; 
					} else {
					   cdiv.append(g._createLeafImg(_id));
					}  
				} 
			},
			_addOneRowContent: function(rowData, newRow, _id, _isP, level, checkSpan,countV) {
				g._d(1545+"----添加节点...")
                var i = 0;   
				if(p._countColumnIndex==-2){
					var ctCell = $('<td></td>').css('padding','0').width(p.countCellWd);
					var jdiv = $('<div></div>').width(p.countCellWd).html(countV).appendTo(ctCell);
					$(newRow).append(ctCell); 
				}else if(p._countColumnIndex){
					countV+="&nbsp;";
				}
                for (; i < headColumns.length; i++) { 
                    var newSmallCell = newRow.insertCell(newRow.cells.length); 
					$(newSmallCell).attr('_td_pro',headColumns[i]).css('padding','0').width(headColumnWidths[i]); 
					var cdiv = $('<div></div>').width(headColumnWidths[i]);//lsq
                    var _t = rowData[headColumns[i]];
                    if(p._expandColumnIndex==i)	g._genrateExpandImg(level,_isP,_id,newRow,cdiv); 
				    if (p._checkColumnIndex == i) cdiv.append(checkSpan);
					if(p._countColumnIndex==i)    cdiv.append(countV);                   
					if (_t != '') {
						var showTypeDesc = p.columnModel[i].columntype;
						if (showTypeDesc != null) {
							cdiv.append(g._createContent(showTypeDesc, rowData, headColumns[i], _id,newRow).firstChild);

						} else {
							cdiv.append(_t);
						}
					}
					cdiv.appendTo(newSmallCell);
                } 
            },
			_genrateExpandImg2:function(level,_isP,_id,sp,cdiv){
				var ct = level - 1;
				var ans = [];
				for (var ii = 0; ii < ct; ii++) {
					ans.push(['<IMG ', 'src="', p.blankImg, '"/>'].join(''));
				} 
				cdiv.html(ans.join('')); 
				if (_isP == '1') {
					if (findInArray(sp, _id) == -1)
						cdiv.append(g._createOpenImg(_id));
					else
						cdiv.append(g._createCloseImg(_id));
				} else {
					cdiv.append(g._createLeafImg(_id)); 
				}
			},
            _addOneLazyRowContent: function(rowData, newRow, _id, _isP, level, checkSpan, sp,countV) {
                var i = 0;
				//如果要添加序列所在的单独列.
				if(p._countColumnIndex==-2){
					var ctCell = $('<td></td>').css('padding','0').width(p.countCellWd);
					var jdiv = $('<div></div>').width(p.countCellWd).html(countV).appendTo(ctCell);
					$(newRow).append(ctCell); 
				}else if(p._countColumnIndex){
					countV+="&nbsp;";
				}
                for (; i < headColumns.length; i++) { 
                    var newSmallCell = document.createElement("td"); 
                    $(newSmallCell).attr('_td_pro', headColumns[i]).css('padding','0').width(headColumnWidths[i]); 
					var cdiv = $('<div></div>').width(headColumnWidths[i]);//lsq 
                    var _t = rowData[headColumns[i]];
                    if(p._expandColumnIndex==i)	g._genrateExpandImg2(level,_isP,_id,sp,cdiv);                    
					if(p._checkColumnIndex == i)  cdiv.append(checkSpan); 
					if(p._countColumnIndex==i)    cdiv.append(countV);
					if (_t != ''){ 
						var showTypeDesc = p.columnModel[i].columntype;
						if (showTypeDesc != null) {
							//lsq   下面的firstChild可能有问题!!
							cdiv.append(g._createContent(showTypeDesc, rowData, headColumns[i], _id,newRow));
						} else {
							cdiv.append(_t);
						}
					}
					cdiv.appendTo(newSmallCell);
                    newRow.appendChild(newSmallCell); 
                }

            },
            _createOpenImg: function(id) {
                var _i = $(["<IMG id='img_", id, "' style='CURSOR: hand' ", " ' src='", p.openImg, "'/>"].join(''));
				_i.unbind('click');
				_i.bind('click',function(e) {   
					g.openChildrenTable(this.id, this, e);
                });
                return _i[0];

            },
            _createLeafImg: function(id) { 
                return $(["<IMG id='img_", id, "' src='", p.noparentImg, "'/>"].join(''))[0]; 
            },
            _createCloseImg: function(id) {
                return $(["<IMG id='img_", id, "' style='CURSOR: hand' ", " ' src='", p.closeImg, "'/>"].join(''))
                .click(function(e) {
					//var theEvent = window.event || arguments.callee.caller.arguments[0];
                    g.closeChildrenTable(this.id, this, e);
                })[0];

            },
			_debugOnce:function(msg){
				if(!window.aaa)
					alert(msg)
				window.aaa = 1;
			}, 
            _getCurrentPage: function(pginfo, pageNumId, operCode) {
                if (operCode == 1) operCode = 'first';
                switch (operCode) {
                    case 'first':
                    pginfo.currentPage = 1;
                    break;
                    case 'pre':
                    pginfo.currentPage = (pginfo.currentPage - 1) < 1 ? 1: (pginfo.currentPage - 1);
                    break;
                    case 'next':
                    pginfo.currentPage = (pginfo.currentPage + 1) > pginfo.pagesCount ? pginfo.pagesCount: (pginfo.currentPage + 1);
                    break;
                    case 'last':
                    pginfo.currentPage = pginfo.pagesCount;
                    break;
                    case 'repaging':
                    pginfo.currentPage = '1';
                    break;
                    default:  
					var pnum = $('li.jumpto input.textInput')[0]; 
                    if (pnum) {
                        var n = pnum.value;
                        var reg = /^\d+$/;
                        if (n == '' || !reg.test(n) || n > pginfo.pagesCount) {
                            g._e("输入页码有误或者为空，请重新输入！");
                            pnum.value = "";
                            pnum.focus();
                            return - 1;

                        }
                        pginfo.currentPage = n;

                    } else {
                        g._d('出现bug,跳转页面没有正确处理.');

                    }
                    break;

                }

            },
			_addChild:function(pid,data){
				var pNode = _$('_node'+pid);
				alert(pNode.innerHTML);
				var img = $('#img_'+pid)[0];
				p._dynamicAddByUse = 1;
				g.dynamicAdd(pid, pNode, img, data);
				g._setLastLeaf();
			},
            _toLazyPage: function(pid, operCode) {
                var pnum = _$('_pageNum'),
                mcel = _$('msgCell'),
                tb = _$(p.tableId);
                var lazypaing_info = _lazypgInfoMap.get(pid);
                var temp = 0;
                if (operCode == '_morepage') lazypaing_info.currentPage += 1;
                else temp = g._getCurrentPage(lazypaing_info, '', operCode);
                if (temp == -1) return;
                var param = {
                    analyze: p.analyzeAtServer,
                    gtlimit: lazypaing_info.pageSize,
                    gtpage: lazypaing_info.currentPage,
                    pId: pid

                };
                g._showLazyPagingDiv(pid, 'null', false);
                g._showMsg(1);
                $.ajax({
                    type: "POST",
                    url: p.lazyLoadUrl,
                    data: param,
                    async: 1,
                    success: function(msg) {
						g._d('查询懒加载指定页_toLazyPage():'+msg)
                        var parentNode = _$('_node' + pid);
                        var img = _$('img_' + pid);
                        var o = new Date();
                        if (operCode != '_morepage') {
                            g._removeChildrenTable(pid);
                            g._initLazyPageInfo(pid, '父亲节点id', msg);
                            g.dynamicAdd(pid, parentNode, img, msg);

                        } else {
                            var numstrs = $('[_node_parent=_node' + pid + ']:last').attr('rownum').split('.');
                            var lastnum = numstrs[numstrs.length - 1];
                            g._initLazyPageInfo(pid, '父亲节点id', msg);
                            g.dynamicAdd(pid, parentNode, img, msg, lastnum);

                        }
                        g._setLastLeaf();
                        var gotime = new Date() - o;
                        g._d('翻页显示前台消耗时间:' + gotime);
                        g._showMsg(0);

                    }

                });

            },
            _removeChildrenTable: function(pid) {
                $('tr[_node_parent=_node' + pid + ']').each(function(i) {
                    if (this.getAttribute('_node_isparent') == '1') {
                        g._removeChildrenTable(this.id.replace('_node', ''));

                    }

                }).remove();

            },
            _resetCurrentPageSize: function() {
                var mcel = _$('msgCell');  
                mcel.innerHTML = ["当前第", pagingInfo.currentPage, "页/总共", pagingInfo.pagesCount, "页"].join('');

            }, 
            _toPage: function(operCode) {  
                tb = _$(p.tableId);
                var temp = 0;
                temp = g._getCurrentPage(pagingInfo, '_jumpto', operCode); 
                if (temp == -1) return;
                var num = pagingInfo.currentPage;
                if (_serverPagingMode == 'client') {
                    pagingInfo.currentPage = num;
                    var end = pagingInfo.currentPage * pagingInfo.pageSize > pagingInfo.allCount ? pagingInfo.allCount: pagingInfo.currentPage * pagingInfo.pageSize;
                    g._showTable(document.getElementById(p.tableId), (pagingInfo.currentPage - 1) * pagingInfo.pageSize, end);
                    g._resetCurrentPageSize();
                    if (p.expandAll) {
                        g.expandAll();

                    } 
                    g._resetBasePageBtns();
                    if (p.exchangeColor) g._setColor(tb);
					g._setLastLeaf();
                } else {
                    var param = {
                        idColumn: p.idColumn,
                        analyze: p.analyzeAtServer,
                        parentColumn: p.parentColumn,
                        gtlimit: pagingInfo.pageSize,
                        gtpage: pagingInfo.currentPage

                    };
                    g._showMsg(1);
                    $.ajax({
                        type: "POST",
                        url: p.dataUrl,
                        data: param,
                        async: 1,
                        success: function(msg) { 
                            var o = new Date();
                            g._newPagingServerMakeTable(tb, msg);
                            g._showMsg(0);
                            g._setLastLeaf();
                            g._resetCurrentPageSize();
                            var gotime = new Date() - o;
                            g._d('翻页显示前台消耗时间:' + gotime);

                        }

                    });

                }

            },
            _userSetPros: function(rowData, newRow) {
                if (p.hidddenProperties) {
                    for (var i = 0; i < p.hidddenProperties.length; i++) {
                        var proName = p.hidddenProperties[i];
                        newRow.setAttribute(proName, rowData[proName]);

                    }

                }

            },
            _getCountVal: function(rowData, newRow, index, level) {
                var _id = rowData[p.idColumn]; 
                var _parent = rowData[p.parentColumn];
                _parent = _parent == "" ? '-1': _parent;
                _parent = '_node' + _parent;  
                    var indexNum = 0;
                    if (p.rowCountOption + '' == '3') {
                        if (!p.lazy) indexNum = index;
                        else {
                            indexNum = newRow.getAttribute('rownum');
                        }
                    } else if (p.rowCountOption + '' == '2') {
                        if (findInArray(parents, _parent) != -1) {
                            var brothers = g.seeChildren(_parent);
                            var parentIndex = _idToNumMap.get(_parent);
                            indexNum = parentIndex + '.' + (1 + findInArray(brothers, '_node' + _id));
                            newRow.setAttribute('_node_num', indexNum);
                            _idToNumMap.put('_node' + _id, indexNum);

                        } else {
                            indexNum = 1 + findInArray(firstLevelNodes, '_node' + _id);
                            newRow.setAttribute('_node_num', indexNum);
                            _idToNumMap.put('_node' + _id, indexNum);

                        }

                    } else {
                        if (findInArray(parents, _parent) != -1) {
                            var brothers = g.seeChildren(_parent);
                            var parentIndex = _idToNumMap.get(_parent);
                            indexNum = parentIndex + '.' + (1 + findInArray(brothers, '_node' + _id));
                            newRow.setAttribute('_node_num', indexNum);
                            _idToNumMap.put('_node' + _id, indexNum);

                        } else {
                            indexNum = 1 + findInArray(firstLevelNodes, '_node' + _id);
                            if (_serverPagingMode == 'client') {
                                indexNum = indexNum - g._getFirstIndexInThisPage();

                            }
                            newRow.setAttribute('_node_num', indexNum);
                            _idToNumMap.put('_node' + _id, indexNum);

                        }

                    } 
					return indexNum; 

            },
            _addCheckOptionCell: function(rowData, newRow) {
                var _id = rowData[p.idColumn];
                var setOptionDisabled = '';
                if (p.disableOptionColumn) {
                    if (rowData[p.disableOptionColumn] + '' == '1') {
                        setOptionDisabled = 'disabled';

                    }

                }
                var setChoosedColumn = p.chooesdOptionColumn;
                var defalutChoose = 0;
                if (p.checkOption == 'multi' && setChoosedColumn != null) {
                    defalutChoose = rowData[setChoosedColumn];
                    if (defalutChoose + '' == '1') {
                        defalutChoose = 'checked';

                    } else {
                        defalutChoose = '';

                    } 
                } 
                if (p.checkOption == 'radio') {
                    var checkCell = document.createElement("span");
                    checkCell.className = 'checkCell';
                    checkCell.setAttribute('id', '_chk' + _id);
                    createRadio(checkCell, setOptionDisabled, 'width:20px;border:0px;', '_chks', _id, p.handleCheck, '', '', '');
                    return checkCell;

                } else if (p.checkOption == 'multi') {
                    var checkCell = document.createElement("span");
                    checkCell.className = 'checkCell';
                    checkCell.setAttribute('id', '_chk' + _id); 
                    if (p.multiChooseMode == 5) {
                        createCheckbox(checkCell, setOptionDisabled, 'width:20px;border:0px;', '_chks', _id, 
                        function() {
                            g._chooseChildrenNode(this);
                            g._cancleChildrenNode(this);
                            g._chooseParentNode(this);
                            g._cancelFaher(this);
                            if (p.handleCheck) p.handleCheck(this);

                        },
                        '', '', defalutChoose);

                    } else if (p.multiChooseMode == 4) {
                        createCheckbox(checkCell, setOptionDisabled, 'width:20px;border:0px;', '_chks', _id, 
                        function() {
                            g._chooseChildrenNode(this);
                            g._cancleChildrenNode(this);
                            g._cancelFaher(this);
                            if (p.handleCheck) p.handleCheck(this);

                        },
                        '', '', defalutChoose);

                    } else if (p.multiChooseMode == 3) {
                        createCheckbox(checkCell, setOptionDisabled, 'width:20px;border:0px;', '_chks', _id, 
                        function() {
                            g._chooseChildrenNode(this);
                            g._chooseParentNode(this);
                            g._cancelFaher(this);
                            if (p.handleCheck) p.handleCheck(this);

                        },
                        '', '', defalutChoose);

                    } else if (p.multiChooseMode == 2) {
                        createCheckbox(checkCell, setOptionDisabled, 'width:20px;border:0px;', '_chks', _id, 
                        function() {
                            g._chooseParentNode(this);
                            g._cancelFaher(this);
                            if (p.handleCheck) p.handleCheck(this);

                        },
                        '', '', defalutChoose);

                    } else {
                        createCheckbox(checkCell, setOptionDisabled, 'width:20px;border:0px;', '_chks', _id, p.handleCheck, '', '', defalutChoose);

                    }
                    return checkCell;

                }
                return null;

            },
			_hideColumns:function(coloumns){
			
			},
            _addOneRowListerners: function(newRow) {
				var $row = $(newRow);
                if (p.handler) {
                    var lenlen = p.handler.length;
                    for (var i = lenlen - 1; i >= 0; i--) {
                        g._addEventToObj(newRow, p.handler[i]);
                    }					
                    if (!_usHandler.length) {
                        for (var i = lenlen - 1; i >= 0; i--) {
                            for (eventName in p.handler[i]) _usHandler.push(eventName);
                        }
                        if (findInArray(_usHandler, 'onclick') == -1) {
							$row.click(function() {
								if (_$(_lastSelectRowId)) {
									$(_$(_lastSelectRowId)).removeClass("selectlight");

								}
								$row.addClass("selectlight");
								_lastSelectRowId = newRow.id;
							 });
                        }
                        if (findInArray(_usHandler, 'onmouseout') == -1) {
                           $row.mouseout(function() {
								$row.removeClass('highlight')
							});
                        }
                        if (findInArray(_usHandler, 'onmouseover') == -1) {
                             $row.mousemove(function() {
								$row.addClass('highlight')
							});
                        }
                    }
                } else {
                    $row.mousemove(function() {
						$row.addClass('highlight')
					}).mouseout(function() {
						$row.removeClass('highlight')
					}).click(function() {
						if (_$(_lastSelectRowId)) {
							$(_$(_lastSelectRowId)).removeClass("selectlight");

						}
						$row.addClass("selectlight");
						_lastSelectRowId = newRow.id;
					 });
                }

            },
            _verifyAjaxAns: function(msg) {
                eval(" tempData=" + msg);
                var data = tempData.data;
                var columnName = p['idColumn']; 
                if (typeof data[0] == 'undefined' || tempData.total == 0) {
                    return false;

                } 
                if (typeof data[0][columnName] == 'undefined') {
                    g._d("配置的属性[idColumn]值有误,请检查!");
                    return false;

                } 
                var columnName = p['parentColumn'];
                if (typeof data[0][columnName] == 'undefined') {
                    g._d("配置的属性[parentColumn]值有误,请检查!");
                    return false;

                } 
			    var leafName = p['leafColumn']; 
				if(p.lazy&&typeof data[0][leafName] == 'undefined'){
					g._d("懒加载必须含有[leafColumn]的指定值,请检查!");
                    return false;
				}
                return true;

            },
            seeChildren: function(nodeid) {
                var ansArr = parentToChildMap.get(nodeid);
                return ansArr;

            },
			setHeight: function(h) {  
				g._content_div.height(h);
				g._scroller_div.height(h); 
				g.allTreeDiv.height(h+53);
            },
			setWidth: function(w) {
				g._content_div.width(w);
				g._scroller_div .width(w); 
				g.allTreeDiv.width(w);
            },
            isParent: function(rowobj) {
                if (!p.lazy) {
                    var nid = '_node' + rowobj[p.idColumn];
                    if (findInArray(parents, nid) != -1) {
                        return '1';

                    } else return '0';

                } else {
                    return rowobj[p.leafColumn];

                }

            },
			_getPara:function(){
				return p;
			} 
        };
        //下面初始化全局变量. 
        var elct = t;
        var parentToChildMap = new HashMap();
        var lastLeafMap = new HashMap();
        var nodeMap = new HashMap();
        var firstLevelNodes = [];
        var firstLevelParentIds = [];
        var childToFatherMap = new HashMap();
        var _idToNumMap = new HashMap();
        var parents = [];
        var _usHandler = [];
        var _lastSelectRowId = "";
        var pagingInfo = {};
        var _lazypgInfoMap = new HashMap();
        var _usnoclick = 0;
        var _usnomsover = 0;
        var _usnomsout = 0;
        var _serverPagingMode = null;
        if (document.all) {
            isIE = true;

        } else {
            isIE = false;

        } 
        var lazypagex = 0,
        lazypagey = 0,
        lazypagex2 = 0,
        lazypagey2 = 0;
		//lsq
        var lzpagetabletemp = ['<table cellspacing=0 cellpadding=0  class="lazyPageTable"><tr><td>', '<button class=" lazypagebarbtn firstPage" onclick="g._toLazyPage(\'$\', \'first\')" id="_fstbtn_$" title="第一页"/></td>', '<td><button class=" lazypagebarbtn prevPage" onclick="g._toLazyPage(\'$\',\'pre\')" title="前一页" id="_prebtn_$"/></td>', '<td><button class=" lazypagebarbtn nextPage" id="_nxtbtn_$"  onclick="g._toLazyPage(\'$\',\'next\')" title="后一页"/></td>', '<td><button class=" lazypagebarbtn lastPage" onclick="g._toLazyPage(\'$\',\'last\')"  id="_lstbtn_$" title="最后一页"/></td>', '<td class="splitbar"><td  class="lazyPagingMsg" >总共<span id="_lazy_page_count_$" class="lazyPagingNum">', '</span>条 当前显示第<span id="_lazy_page_currentpage_$"	class="lazyPagingNum"></span>页</td></table>'].join('');
        var lzmorepagetemp = ['<table cellspacing=0 cellpadding=0  class="lazyPageTable"><tr>', '<td  class="lazyPagingMsg2" >当前层次总共<span id="_lazy_page_count_$" class="lazyPagingNum">', '</span>条 当前显示第<span class="lazyPagingNum">1</span> - <span id="_lazy_page_currentpage_$"	class="lazyPagingNum"></span>条</td></table>'].join('');
        var _errortemp = '表格树出现错误,请仔细检查!<br><br>错误信息:<br><font color="red">$</font>';
        var headColumns = [];
        var headColumnWidths = [];
        var _isValid = true;
        var _errorInfo = ''; 
		p.minNoparentImg = getImgName(p.noparentImg); 
        if (p.lazy && p.lazyPage && p.lazyMorePage) {
			g._e('懒加载模式下不可以同时设置[lazyPage=true]和[lazyMorePage=true]!'); 
            return false;

        }
        if (p.pageBar == null || p.pageBar == false) {
            p.pageSize = -1;

        }
        if (p.checkOption   == 'radio' || p.checkOption  == 'multi') {
            if (p.checkColumnNm == null) p._checkColumnIndex = 0;
            else p._checkColumnIndex = -1;

        }
		if (p.rowCount) {
            if (p.countColumnNm == null) p._countColumnIndex = -2;
            else p._countColumnIndex = -1;

        }

		if (p.expandColumnNm) p._expandColumnIndex = -1;
        else p._expandColumnIndex = 0;//默认为0 

        p.analyzeAtServer = false;
        if (p.dataUrl != null) {
            _serverPagingMode = 'analyzeAtPage';
            if (p.lazy) {
                p.analyzeAtServer = false;
                p.rowCountOption = '3';
                p.multiChooseMode = 1;
                p.expandAll = false;
                if (!p.lazyLoadUrl) {
					g._e("懒加载模式,必须配置属性[lazyLoadUrl]!");  
                    return;

                }
                if (!p.leafColumn) {
					g._e("懒加载模式,必须配置属性[leafColumn ]!");   
                    return;

                }

            }

        } else {
			
            _serverPagingMode = 'client';

        }   
        if (!_isValid) {
            g._e(_errorInfo);
            return false;

        }
        //下面组装一个空的表格树.
        pagingInfo.allCount = 0;
        pagingInfo.pageSize = 0;
        pagingInfo.pagesCount = 0;
        pagingInfo.currentPage = 0;
        var _h = p.height; 
        if (_h.indexOf('px')) {
            _h = _h.substring(0, _h.indexOf('px')) * 1 + 51;

        } 
 
		//设置最外层表格树的高度和宽度.
        g.allTreeDiv = $("<div style='display:none' id='allTreeDiv' class='gridTree'></div>").height(_h).width(p.width);
		var testButton = $("<button >关闭全部</button>").bind('click',function(){
			 g.closeAll();
		});
		var testButton2 = $("<button >展开全部</button>").bind('click',function(){
			 g.expandAll();
		});
        g._tool_Div = $("<div cellspacing=0 cellpadding=0 width='100%' height=30 bgcolor=B8D0D6></div>");//.append(testButton);//.append(testButton2);  
        g._title_table = $("<div id='_title_Div' class='gridThead'  ></div>").append($('<div class="myhDivBox"></div>').append(g._addTitleHead()));
        g._title_Div = $("<div id='_header_Div' class='gridHeader'></div>").append(g._title_table);
        g._content_div = $('<div id="_content_div" class="gridTbody"></div>').height(p.height).scroll(function() {
            g.scroll(); 
        });
        g._scroller_div = $("<div id='_scroller_div' class='gridScroller'></div>").height(p.height).append(g._content_div).scroll(function() {
            g.scroll(); 
        });
		 g.allTreeDiv.append(g._tool_Div).append(g._title_Div).append(g._scroller_div); 
        if (p.pageBar) {
            var _panel_div = $("<div id='_panel_div' class='panelBar' height='25'></div>")[0];
            g._makePageBar(_panel_div);
            g.allTreeDiv.append(_panel_div);

        }
        elct.innerHTML = '';
        //添加等待条
        $('<div class="showprogress" id="showmsg"><div id="_centerMsg" class="centerMsg" align="top"><img src="' + p.lazyLoadImg + '">正在加载,请稍候!</div></div>').appendTo(elct);
        g.allTreeDiv.appendTo(elct).show();  
		//得到实际的列宽数组.
		g._getColumnWidthArr(); 
        if (p.data != null) {
            g._makeTable(p.data);

        } else {
            var param = {
                idColumn: p.idColumn,
                analyze: p.analyzeAtServer,
                parentColumn: p.parentColumn,
                gtlimit: p.pageSize,
                lazy: p.lazy

            }; 
            g._showMsg(1); 
            g._postGetTable(p.dataUrl, param);

        } 
        t.gt = g;

    }; 
    var docloaded = false;
    $(document).ready(function() {
        docloaded = true;
    });
    $.fn.open = function(id) { 
        return this.each(function() {
            if (this.gt) this.gt._open(id);

        });

    };
    $.fn.close = function(id) {
        return this.each(function() {
            if (this.gt) this.gt._close(id);

        });

    };

    $.fn.closeAll = function() {
        return this.each(function() {
            if (this.gt) this.gt.closeAll();

        });

    };

	 $.fn.expandAll = function() {
        return this.each(function() {
            if (this.gt) this.gt.expandAll();

        });

    };

	$.fn.reload = function() {
        return this.each(function() {
            if (this.gt) this.gt._reload(); 
        }); 
    };

	$.fn.resetHeight = function(height) {
        return this.each(function() {
            if (this.gt) this.gt.setHeight(height); 
        }); 
    };
	
	$.fn.resetWidth = function(width) {
        return this.each(function() {
            if (this.gt) this.gt.setWidth(width); 
        }); 
    }; 

	$.fn.disabled = function(v) {
        return this.each(function() {
            if (this.gt) this.gt.setDisabled(v); 
        }); 
    };

	$.fn.addChild = function(pid,data) {
        return this.each(function() {
            if (this.gt) this.gt._addChild(pid,data); 
        }); 
    };

	$.fn.hideColumns = function(columns) {
        return this.each(function() {
            if (this.gt) this.gt._hideColumns(columns); 
        }); 
    };

	$.fn.setJsonData = function(data) {
        return this.each(function() {
            if (this.gt) this.gt._setJsonData(data); 
        }); 
    };

	$.fn.search = function(data) {
        return this.each(function() {
            if (this.gt) this.gt._searchTable(data); 
        }); 
    };

	$.fn.getPara = function() {
		if(this.size()==1){ 
			var $this = this[0];
			if ($this.gt) {
				
				return $this.gt._getPara();
			}
			else
				return null;
		}else{
			var ans=  [];
			this.each(function() {
				if (this.gt) {
					ans.push(this.gt._getPara()); 
				}else{
					ans.push(null);
				}
			}); 
			return ans;
		} 
    };
	
    $.fn.gridTree = function(p) {
        return this.each(function() { 
            if (!docloaded) {
                $(this).hide();
                var t = this;
                $(document).ready(function() {
                    $.addGt(t, p); 
                });

            } else {
                $.addGt(this, p);

            }

        });

    }
    
function getImgName(imgStr){
	while(imgStr.indexOf("/")>0){
		var i = imgStr.indexOf("/");
		imgStr = imgStr.substring(i+1,imgStr.length);
	}
	return imgStr;
} 

function _$(id) {
    return document.getElementById(id);

}
function toArray(ary) {
    var result = new Array(ary.length);
    for (var i = 0; i < ary.length; i++) {
        result[i] = ary[i]

    }
    return result;

}
Function.prototype.bind = function() {
    var args = toArray(arguments);
    var owner = args.shift();
    var _this = this;
    return function(owner) {
        return _this.apply(owner, args.concat(toArray(arguments)));

    }

}
function jsonMapToJsHashMap(jsonMap) {
    var mapObj = new HashMap();
    for (var obj in jsonMap) {
        mapObj.put(obj, jsonMap[obj]);

    }
    return mapObj;

}
function removeArrayFromOtherArray(arr1, arr2) {
    var tempArr = [];
    var bingo = [];
    var len1 = arr2.length;
    for (var ii = 0; ii < len1; ii++) {
        bingo.push(findInArray(arr1, arr2[ii]));

    }
    var len2 = arr1.length;
    for (var ii = 0; ii < len2; ii++) {
        if (findInArray(bingo, ii) == -1) {
            tempArr.push(arr1[ii]);

        }

    }
    return tempArr;

}
function findInArray(arr, obj) {
    if (!arr) return - 1;
    return $.inArray(obj, arr);

}


function _checkedAll(checkName, v) {
    $('[name=' + checkName + "][userSetDisabled!=disabled]").attr('checked', v);

}
function _notBindDisabled(o) {
    return $(o).attr('userSetDisabled') != 'disabled';

}
function disableDom(obj, val) {
    if (obj) obj.disabled = val;

}
function trim(str) {
	return $.trim(str);

}
function disableDomByName(domName, val) {
    $('[name=' + domName + ']').each(function() {
        if ($(this).attr('userSetDisabled') != 'disabled') {
            $(this).attr('disabled', val);

        }

    });

}
function stopBubble(e) {
    if (!isIE) {
        e.preventDefault();
        e.stopPropagation();

    } else {
        window.event.cancelBubble = true; 
    } 
}
function getAllCheckValue() {
    var ans = '';
    $('[name=_chks]:checked').each(function() {
        ans += this.value + ',';

    });
    return ans.substring(0, ans.length - 1);

}

function crtCk(dis, sty, name, v, c, t, cssname, chk,tp){
	var newCk = $("<input type='"+tp+"' name='" + name + "'>").attr({
        'style': sty,
        'userSetDisabled': dis,
        'value': v,
        'disabled': dis 
    }).addClass(cssname).bind('click',function(){
		if($.isFunction(c))
			c(this);
	}).append(t);
	if (chk==1) {
		newCk.attr('checked','true');
	} 
	return newCk;
}
function createRadio(el, dis, sty, name, v, c, t, cssname, chk) {
   $(el).append(crtCk( dis, sty, name, v, c, t, cssname, chk,'radio')); 
}
function createCheckbox(el, dis, sty, name, v, c, t, cssname, chk) {  
	$(el).append(crtCk(dis, sty, name, v, c, t, cssname, chk,'checkbox')); 
}
function createHidden(id, name, val) {
    return $('<input type="hidden" name="' + name + '">').attr({
        'id': id,
        "value": val 
    })[0]; 
}
function createImg(imgsrc) { 
    return $('<img src="+imgsrc+"></img>')[0];

}
function _$(id) {
    return document.getElementById(id);

}
Function.prototype.attachAfter = function(closure, functionOwner) {
    var _this = this;
    return function() {
        this.apply(functionOwner, arguments);
        closure();

    }

}
function attachEvent(obj, eventName, handler) {
    obj[eventName] = (obj[eventName] || 
    function() {}).attachAfter(handler, obj);

}
function mousePosition(ev) {
    if (ev.pageX || ev.pageY) {
        return {
            x: ev.pageX,
            y: ev.pageY 
        };

    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop

    }; 
} 
})(jQuery);   