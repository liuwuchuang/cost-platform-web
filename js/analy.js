var token=localStorage.getItem(ACCESS_TOKEN);
var myChart1 = echarts.init(document.getElementById('main1'));
var myChart2 = echarts.init(document.getElementById('main2'));

window.onload=function(){
	initDate();
	
	initChart();
};

function initDate(){
	var now=new Date();
	var month=now.getMonth()+1;
	$("#date2").val(now.getFullYear()+"-"+month+"-"+now.getDate());
	now.setMonth(now.getMonth()-1);
	month=now.getMonth()+1;
	$("#date1").val(now.getFullYear()+"-"+month+"-"+now.getDate());
	layui.use(['laydate'], function(){
		laydate = layui.laydate;
		laydate.render({
	      elem: '#date1'
	    });
		laydate.render({
	      elem: '#date2'
	    });
	});
}

function initChart(){
	var start=$("#date1").val();
	var end=$("#date2").val();
	
	$.ajax({
		   type: "GET",
		   url: BASE_API+"cost/analyDict",
		   headers:{
			   "access_token":token
		   },
		   data:{
			   start:start,
		   	   end:end
		   },
		   success: function(data){
			   if(data.code==200){
				   myChart1.setOption({
						tooltip:{
							show: true,
							trigger: 'item'
						},
						title: {
							text: ''
						},
						series: [{
							type: 'pie',
							data: data.result.datas
						}]
					});
			   }else{
				   bootbox.alert(data.msg,function(){
					   location.href = "../login.html";
				   });
			   }
		   }
		});
	
	$.ajax({
		   type: "GET",
		   url: BASE_API+"cost/analyType",
		   headers:{
			   "access_token":token
		   },
		   data:{
			   start:start,
		   	   end:end
		   },
		   success: function(data){
			   if(data.code==200){
				   myChart2.setOption({
						tooltip:{
							show: true,
							trigger: 'item'
						},
						title: {
							text: ''
						},
						series: [{
							type: 'pie',
							data: data.result.datas
						}]
					});
			   }else{
				   bootbox.alert(data.msg,function(){
					   location.href = "../login.html";
				   });
			   }
		   }
		});
}
