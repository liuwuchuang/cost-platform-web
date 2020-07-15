var token=localStorage.getItem(ACCESS_TOKEN);

window.onload=function(){
	initTable();
}

function initTable(){
	layui.use('table', function(){
	  var table = layui.table;
	  //第一个实例
	  table.render({
	    elem: '#user-list'
	    ,height: 550
	    ,id: 'user-list-reload'
	    ,toolbar: '#user-list-tool-bar'
	    ,defaultToolbar: ['filter']
	    ,url: BASE_API+'user/page' //数据接口
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
	       {field: 'id', title: 'ID',width:'25%'}
	      ,{field: 'username', title: '用户名',width:'20%'}
	      ,{field: 'password', title: '密码',width:'20%'}
	      ,{field: 'role', title: '用户角色',width:'15%'}
	      ,{field: 'createTime', title: '注册时间',width:'20%'}
	    ]]
	  });
	});
}