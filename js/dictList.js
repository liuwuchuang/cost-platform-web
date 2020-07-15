var token=localStorage.getItem(ACCESS_TOKEN);

window.onload=function(){
	initTable();
}

function initTable(){
	layui.use('table', function(){
	  var table = layui.table;
	  //第一个实例
	  table.render({
	    elem: '#dict-list'
	    ,height: 550
	    ,id: 'dict-list-reload'
	    ,toolbar: '#dict-list-tool-bar'
	    ,defaultToolbar: ['filter']
	    ,url: BASE_API+'dict/page' //数据接口
	    ,request: {
	    	pageName: 'pageNum' //页码的参数名称，默认：page
	       ,limitName: 'limit' //每页数据量的参数名，默认：limit
	    }
	    ,headers: {access_token: token}
	    ,parseData: function(res){ //res 即为原始返回的数据
		    return {
		      "code": res.code, //解析接口状态
		      "msg": res.msg, //解析提示文本
		      "count": res.result.totalCount, //解析数据长度
		      "data": res.result.rows //解析数据列表
		    };
		 }
	    ,page: true //开启分页
	    ,cols: [[ //表头
	       {type:'radio'}
	      ,{field: 'id', title: 'ID',width:'30%'}
	      ,{field: 'name', title: '分类名称',width:'20%'}
	      ,{field: 'comments', title: '备注说明',width:'50%'}
	    ]]
	  });
	  
	  //头工具栏事件
	  table.on('toolbar(dict-list-filter)', function(obj){
	    var checkStatus = table.checkStatus(obj.config.id); //获取选中行状态
	    switch(obj.event){
	      case 'deleteData':
	        var myData = checkStatus.data;//获取选中行数据
	        if(myData.length==0){
	        	layer.open({
        		  title: '删除'
        		  ,content: '请选择要删除的记录'
        		});
	        	return;
	        }
	        layer.confirm('确定删除吗？',{title:'删除'},function(index){
	          
	        	$.ajax({
	 			   type: "DELETE",
	 			   url: BASE_API+"dict/delete/"+myData[0].id,
	 			   headers:{
	 				   "access_token":token
	 			   },
	 			   success: function(data){
	 				   if(data.code==200){
	 					  layer.open({
	 						  title: '删除'
	 						 ,content: '删除成功'
	 					  });
	 					 table.reload('dict-list-reload',{page:{curr:1}});
	 				   }else{
	 					   bootbox.alert(data.msg,function(){
	 						   location.href = "../login.html";
	 					   });
	 				   }
	 			   }
	 			});
	        	
        	  layer.close(index);
        	  
        	});
	      break;
	      
	      case 'addDictWeb':
	    	  layer.open({
	    		  type: 1, 
	    		  title: '添加分类',
	    		  btn: ['保存'],
	    		  btnAlign: 'c',
	    		  area: ['500px', '350px'],
	    		  content: $("#saveDictForm"),
	    		  yes: function(index, layero){
	    			    var dictName=$("#dictName").val();
	    			    var dictComments=$("#dictComments").val();
	    				$.ajax({
	    				   type: "POST",
	    				   url: BASE_API+"dict/add",
	    				   contentType:'application/json',
	    				   data:JSON.stringify({
	    			           name:dictName,
	    			           comments:dictComments
	    			       }),
	    				   headers:{
	    					   "access_token":token
	    				   },
	    				   success: function(data){
	    					   if(data.code==200){
	    						   $("#saveDictForm")[0].reset()
	    						   layer.close(index);
	    						   table.reload('dict-list-reload',{page:{curr:1}});
	    					   }else if(data.code==400){
	    						   $("#msgError").text(data.msg);
	    						   return;
	    					   }else{
	    						   bootbox.alert(data.msg,function(){
	    							   location.href = "./login.html";
	    						   });
	    					   }
	    				   }
	    				});
	    		  }
	    		});
	      break;
	    };
	  });
	  
	});
}