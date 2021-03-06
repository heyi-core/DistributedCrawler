var entityNamecode;

$(function () {
	vm.getProjects();
	$("#jqGrid").jqGrid({
		url: baseURL + 'public/searchByQuery',
		datatype: "json",
		postData:{'keyWord':"",'entity':vm.q.entitySelected,'begindate':vm.q.begindate,'enddate':vm.q.enddate},
		colModel: [			
	           { label: '采集源ID', name: '_id', index: "_id", hidden:true,width: 45, key: true },
	           { label: '压缩包名称', name: 'zipname', width: 100},
	           { label: '压缩文件路径', name: 'filestorePath', width: 100},
	           { label: '所属项目', name: 'project', width: 50},
	           { label: '打包时间', name: 'createTime', width: 50},
	           { label: '压缩包路径', name: 'zipPath', width: 50, formatter: function(value, options, row){
	        	   return "<a href='javascript:vm.openpath(\""+row.zipPath+"\")'>打开路径</a>";
	           }},
	           ],
	           viewrecords: true,
	           height: 385,
	           rowNum: 10,
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
			entitySelected: ""
		},
		entitys:{},
		project:{},
		showList:true,
		info: {
            status: 1,
            type: 0,
            domain: '',
            roleIdList: [],
            jsonData: ''
        },
	},
	methods: {
		query: function () {
			queryGrid();
		},
		getProjects: function(){
			$.get(baseURL + "public/getProjects", function(r){
				vm.entitys = r.list;
			});
		},
		openpath: function(path) {
			$.ajax({
				type: "POST",
			    url: baseURL + "public/openpath",
			    contentType: "application/json",
			    data: {'path':path},
			    success: function(info){
			    	if(info.code === 0) {
			    		alert("打包成功!!!");
			    	} else {
			    		alert("打包失败,请联系管理员...");
			    	}
			    }
			});
		},
		reload:function(){
			queryGrid();
			
		},
		validateDate: function () {
            if (isBlank(vm.q.begindate)) {
                alert("开始时间不能为空!");
                return true;
            }
            if (isBlank(vm.q.enddate)) {
                alert("结束时间不能为空!");
                return true;
            }
            if(vm.q.enddate < vm.q.begindate) {
            	alert("结束时间不能小于开始时间!");
            	return true;
            }

        }
	}
});