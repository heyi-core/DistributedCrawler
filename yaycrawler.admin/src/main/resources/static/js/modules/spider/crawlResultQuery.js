var entityNamecode;

$(function () {
	vm.getEntitys();
	
	$("#jqGrid").jqGrid({
		url: baseURL + 'newsquery/searchByQuery',
		datatype: "json",
		postData:{'keyWord':"",'entity':vm.q.entitySelected,'begindate':vm.q.begindate,'enddate':vm.q.enddate},
		colModel: [			
	           { label: '采集源ID', name: '_id', index: "_id", hidden:true,width: 45, key: true },
	           { label: '标题', name: 'title', width: 180 ,formatter: function(value, options, row){
	        	   return "<a  href='javascript:vm.querybyid(\""+row._id+"\")'>" + row.title + "</a>";
	           }},
	           { label: '发布时间', name: 'pubDate', width: 50},
	           { label: '网站', name: 'crawler_site', width: 25},
	           { label: '项目', name: 'crawler_project', width: 20},
	           { label: '状态', name: 'status', index: 'status', width: 20,formatter: "select", editoptions:{value:"0:未通过;1:通过"}},
	           { label: '采集时间', name: 'crawler_date', index: 'crawler_date', width: 40 ,formatter: function (value, options, row) {
	                 if(!row.crawler_date) return "未知";
	                 var timestamp = row.crawler_date*1;
	                 var date = new Date(timestamp);    // 根据时间戳生成的时间对象
	                 return dateFtt("yyyy-MM-dd hh:mm:ss",date);
	             }}
	           ],
	           viewrecords: true,
	           height: 600,
	           rowNum: 30,
	           rowList : [10,30,50],
	           rownumbers: true, 
	           rownumWidth: 25, 
	           autowidth:true,
	           multiselect: true,
	           pager: "#jqGridPager",
	           jsonReader : {
	        	   root: "page.list",
	        	   page: "page.currPage",
	        	   total: "page.totalPage",
	        	   records: "page.totalCount"
	           },
	           prmNames : {
	        	   page:"page", 
	        	   rows:"limit", 
	        	   order: "order"
	           },
	           gridComplete:function(){
	        	   // 隐藏grid底部滚动条
	        	   $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
	           },

	});
	
});
function queryGrid(){
	
	vm.showList = true;
	var page = $("#jqGrid").jqGrid('getGridParam','page');
	$("#jqGrid").jqGrid('setGridParam',{ 
        postData:{'keyWord': vm.q.key,'entity':vm.q.entitySelected,'begindate':vm.q.begindate,'enddate':vm.q.enddate},
        page:page
    }).trigger("reloadGrid");
};

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
			key: "",
			begindate: "",
			enddate: "",
			entitySelected: "news"
		},
		entitys:{},
		showList:true,
		info: {
            status: 1,
            type: 0,
            domain: '',
            roleIdList: [],
            jsonData: ''
        },
        ue:null,
        ue2:null
	},
	methods: {
		query: function () {
			
			queryGrid();
		},
		getEntitys: function(){
			$.get(baseURL + "newsquery/select", function(r){
				vm.entitys = r.list;
			});
		},
		reload:function(){
			UE.delEditor("container");
			UE.delEditor("container2");
			queryGrid();
		},
		querybyid:function(id){
			var iddb = {'id':id,'entity':vm.q.entitySelected};
			var str = JSON.stringify(iddb);
			var url = "newsquery/searchByid";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
		        contentType: "application/json",
			    data: str,
			    success: function(info){
			    	$("div#content_main").html("");
			    	if(info.content_tr != null) {
		                //$("div#content_main").append("<div class=\"content_main_con\">"+info.contentTr+"</div>");
		                $("div#content_main").append("<div class=\"con-eng col-md-6\"><p style=\"text-align: center;\">" + info.title_tr + "</p>" + info.content_tr + "</div>");
		                $("div#content_main").append("<div class=\"con-chin col-md-6\">" + info.content + "</div>");
		            } else {
		                $("div#content_main").append("<div class=\"content_main_title\" >"+info.title+"</div>");
		                $("div#content_main").append("<div class=\"content_main_dis\" >"+info.pubdate+"</div>");
		                $("div#content_main").append("<div class=\"content_main_con\">"+info.content+"</div>");
			    	}
				}
			});
			$("#mymodal").modal('show');
		},
		down2local:function(){
			var params = {'ids':getSelectedRows(), 'entity':vm.q.entitySelected};
			var str = JSON.stringify(params);
			var url = "newsquery/down2local";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
		        contentType: "application/json",
			    data: str,
			    success: function(info){
			    	if(info === 1) {
			    		alert("下载成功");
			    	} else {
			    		alert("下载失败");
			    	}
				}
			});
		},
		view: function() {
			var id = getSelectedRow();
			
			if(id) {
				var iddb = {'id':id,'entity':vm.q.entitySelected};
				var str = JSON.stringify(iddb);
				var url = "newsquery/searchByid";
				$.ajax({
					type: "POST",
				    url: baseURL + url,
			        contentType: "application/json",
				    data: str,
				    success: function(info){
				    	vm.info = info;
					}
				});
				   // 实例化编辑器
			   ue = new baidu.editor.ui.Editor(
                       {
                           //initialFrameWeight:100%,
                           initialFrameHeight:400,
                           textarea: 'editorContent',      //设置提交时编辑器内容的名字
                           autoFloatEnabled: false,
                           focus:false,
                           autoHeightEnabled: false,
                           sourceEditor: true,
                           wordCount: false,               //关闭字数统计
                           elementPathEnabled: false,      //关闭elementPath
                           //maximumWords: 10240
                       });
			   ue.render("container");
				ue.ready(function(){
					// 设置初始化的内容
					var content = $("#newscontent").val();
					initialFrameHeight:350,
					ue.setContent(content);
					
				});
					ue2 = new baidu.editor.ui.Editor(
	                           {
	                               //initialFrameWeight:100%,
	                               initialFrameHeight:400,
	                               textarea: 'editorContent',      //设置提交时编辑器内容的名字

	                               autoFloatEnabled: false,
	                               focus:false,
	                               autoHeightEnabled: false,
	                               sourceEditor: true,
	                               wordCount: false,               //关闭字数统计
	                               elementPathEnabled: false,      //关闭elementPath
	                               //maximumWords: 10240
	                           });
					   ue2.render("container2");
					ue2.ready(function(){
						// 设置初始化的内容
						var content = $("#newscontenttr").val();
						initialFrameHeight:350,
						ue2.setContent(content);
						vm.info.content_tr = ue2.getContent();
						
					});
				//}
				
				vm.showList=false;
			}
		},
		saveOrUpdate: function() {
			var url = "newsquery/update";
			// 特殊字符需要转义
			vm.info.content = ue.getContent().replace(/</g,'&lt;').replace(/>/g,'&gt;');
			vm.info.content_tr = ue2.getContent().replace(/</g,'&lt;').replace(/>/g,'&gt;');
			vm.info.entity = vm.q.entitySelected;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.info),
                success: function (r) {
                    if (r.code === 0) {
                        alert('更新成功', function () {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
		},
		back: function() {
	          vm.reload();
		},
		through: function() {
			vm.check("1");
		},
		out: function() {
			vm.check("0");
		},
		check: function(status) {
			var iddb = {'id':getSelectedRow(),'entity':vm.q.entitySelected,'status':status};
			var str = JSON.stringify(iddb);
			var url = "newsquery/check";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
		        contentType: "application/json",
			    data: str,
			    success: function(r){
			    	if (r.code === 0) {
                        alert('审核成功', function () {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
				}
			});
		},
		checkAllSelectedTrue: function() {
			vm.checkAllSelected("1");
		},
		checkAllSelectedFalse: function() {
			vm.checkAllSelected("0");
		},
		checkAllSelected: function(status) {
			if(vm.validateBeginDate()) {
				return;
			}
			var ids = getSelectedRows();
			if(ids) {
				var iddb = {'ids':ids,'entity':vm.q.entitySelected,'status':status};
				var str = JSON.stringify(iddb);
				var url = "newsquery/multiCheck";
				$.ajax({
					type: "POST",
				    url: baseURL + url,
			        contentType: "application/json",
				    data: str,
				    success: function(r){
				    	if (r.code === 0) {
	                        alert('审核成功', function () {
	                            vm.reload();
	                        });
	                    } else {
	                        alert(r.msg);
	                    }
					}
				});
			}
			
		},
		validateBeginDate: function () {
            if (isBlank(vm.q.begindate)) {
                alert("开始时间不能不能为空");
                return true;
            }

        }
	}
});