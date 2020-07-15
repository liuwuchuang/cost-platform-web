var token=localStorage.getItem(ACCESS_TOKEN);

window.onload=function(){
	initTable();
	
	initDate();
}

function initDate(){
	layui.use(['laydate'], function(){
		laydate = layui.laydate;
		laydate.render({
	      elem: '#date1'
	    });
		laydate.render({
	      elem: '#date2'
	    });
		laydate.render({
	      elem: '#date3'
	    });
	});
}

function initTable(){
	layui.use('table', function(){
	  var table = layui.table;
	  //第一个实例
	  table.render({
	    elem: '#bill-list'
	    ,height: 550
	    ,id: 'bill-list-reload'
	    ,toolbar: '#bill-list-tool-bar'
	    ,defaultToolbar: ['filter']
	    ,url: BASE_API+'cost/page' //数据接口
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
	      ,{field: 'id', title: 'ID',width:'20%'}
	      ,{field: 'createTime', title: '发生时间',width:'10%'}
	      ,{field: 'money', title: '发生金额',width:'10%'}
	      ,{field: 'typeName', title: '收入/支出',width:'10%'}
	      ,{field: 'dictName', title: '收支分类',width:'15%'}
	      ,{field: 'comments', title: '备注说明',width:'35%'}
	    ]]
	  });
	  
	  //头工具栏事件
	  table.on('toolbar(bill-list-filter)', function(obj){
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
	 			   url: BASE_API+"cost/delete/"+myData[0].id,
	 			   headers:{
	 				   "access_token":token
	 			   },
	 			   success: function(data){
	 				   if(data.code==200){
	 					  layer.open({
	 						  title: '删除'
	 						 ,content: '删除成功'
	 					  });
	 					 table.reload('bill-list-reload',{page:{curr:1}});
	 					 initDate();
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
	      
	      case 'reloadData':
	    	  var startTime=$("#date1").val();
	    	  var endTime=$("#date2").val();
	    	  table.reload('bill-list-reload',
	    		  {
	    		   page:{curr:1},
	    		   where:{start:startTime,end:endTime}
	    		  },
	    	  );
	    	  initDate();
	    	  $("#date1").val(startTime);
	    	  $("#date2").val(endTime);
	      break;
	      
	      case 'addBillWeb':
	    	  layer.open({
	    		  type: 1, 
	    		  title: '添加分类',
	    		  btn: ['保存'],
	    		  btnAlign: 'c',
	    		  area: ['900px', '550px'],
	    		  content: $("#saveBillForm"),
	    		  yes: function(index, layero){
	    			    var createTime=$("#date3").val();
	    			    var money=$("#cost").val();
	    			    var type=$('input:radio:checked').val();
	    			    var dictId=$("#dictId").val();
	    			    var comments=$("#billComments").val();
	    				$.ajax({
	    				   type: "POST",
	    				   url: BASE_API+"cost/add",
	    				   contentType:'application/json',
	    				   data:JSON.stringify({
	    					   createTime:createTime,
	    					   money:money,
	    					   type:type,
	    					   dictId:dictId,
	    					   comments:comments
	    			       }),
	    				   headers:{
	    					   "access_token":token
	    				   },
	    				   success: function(data){
	    					   if(data.code==200){
	    						   $("#saveBillForm")[0].reset()
	    						   layer.close(index);
	    						   table.reload('bill-list-reload',{page:{curr:1}});
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