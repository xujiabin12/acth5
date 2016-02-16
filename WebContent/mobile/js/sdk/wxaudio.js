var util = window._util;
//初始化微信jsapi接口，调用微信js用
function initWxJsAndDo(jsApi,callMethod){
	$.ajax({
		type : "post",
		dataType : "json",
		async:false,
		data : {
			url : location.href
		},
		url : util.getServerUrl()+"wx/initWxJsApi",
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
}


var audio = {};

//开始录音
var startRecord = function(){
	initWxJsAndDo(['startRecord'],function(){
		wx.startRecord();
	});
};

var bofang = function(localId){
	alert(localId);
	initWxJsAndDo(['playVoice'],function(){
		wx.playVoice({
			localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
		});
	});
};

//停止录音并且上传
var stopRecordAndSend = function(){
	initWxJsAndDo(['stopRecord'],function(){
		wx.stopRecord({
		    success: function (res) {
		    	//上传语音
		    	uploadVoice(res.localId);
		    }
		});
	});
};



//监听录音自动停止接口
var voiceRecordEnd = function(){
	initWxJsAndDo(['onVoiceRecordEnd'],function(){
		wx.onVoiceRecordEnd({
		    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
		    complete: function (res) {
		      //上传语音
		    	uploadVoice(res.localId);
		    }
		});
	});
};
//播放语音接口
var playVoice = function(serverId){
	initWxJsAndDo(['downloadVoice'],function(){
		wx.downloadVoice({
		    serverId: serverId,
			isShowProgressTips: 0, // 默认为1，显示进度提示
		    success: function (res) {
				bofang(res.localId);
		    }
		});
	});
	
};

//上传语音接口
var uploadVoice = function(localId){
	initWxJsAndDo(['uploadVoice'],function(){
		wx.uploadVoice({
		    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
		    isShowProgressTips: 0, // 默认为1，显示进度提示
		        success: function (res) {
		         // 返回音频的服务器端ID 
		        sendVoice(res.serverId);
		    }
		});
	});
};


//发送语音
var sendVoice = function(serviceId){
	//发送到界面
	sendText(serviceId);
};



$(function(){
	$("#audio").on({
		touchstart: function(e){
			//开始录音
			$("#audio").text("松开 结束");
			startRecord();
			e.preventDefault();
		},
		touchend: function(){
			//结束录音
			$("#audio").text("按住 说话")
			stopRecordAndSend();
			return false;
		}
	})
});

