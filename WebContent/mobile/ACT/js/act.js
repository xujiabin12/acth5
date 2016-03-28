var url = "";
$(function(){
	getJoinGroupUrl();
	listenerShare();
});

//监听微信分享朋友圈
function listenerShare(){
	initWxJsAndDo(['checkJsApi','onMenuShareTimeline'],function(){
		wx.ready(function () {
		        wx.onMenuShareTimeline({
		            title: document.title,     //分享后自定义标题
		            imgUrl: 'http://mobile.u-ef.cn/img/act.jpg',  //分享的LOGO
		            success: function (res) {
						var ta = "<a href='"+url+"'>点击连接进入</a>";
						var ps = $("#js_content").find("p");
						$(ps[1]).html(ta);
		            },
		            cancel: function (res) {
		            	
		            }
		        });
		    });
		    wx.error(function (res) {
		        alert("加载错误！");
		    });
	});
}


var serverUrl = "http://101.201.209.109/act/";

//初始化微信jsapi接口，调用微信js用
var initWxJsAndDo = function(jsApi,callMethod){
	$.ajax({
		type : "post",
		dataType : "json",
		async:false,
		data : {
			url : location.href
		},
		url : serverUrl+"wx/initWxJsApi",
		success : function(data){
			if(data.code=="0"){
                wx.config({
                    debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId : data.appId, // 必填，公众号的唯一标识
                    timestamp : data.timestamp, // 必填，生成签名的时间戳
                    nonceStr : data.noncestr, // 必填，生成签名的随机串
                    signature : data.signature,// 必填，签名，见附录1
                    jsApiList : jsApi// 必填，需要使用的JS接口列表
                });
                
                callMethod();
			}else{
				alert("操作失败");
			}
		}
	});
};

var getJoinGroupUrl = function () {
	$.ajax({
		type : "post",
		dataType : "json",
		url : serverUrl+"groups/getJoinGroupUrl",
		success : function(data){
			if(data.code=="0"){
				url = data.url;
			}else{
				alert("获取连接失败");
			}
		}
	});
};