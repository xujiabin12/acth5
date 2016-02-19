var util = window._util;



var audio = {};

//开始录音
var startRecord = function(){
	util.initWxJsAndDo(['startRecord'],function(){
		wx.startRecord();
	});
};

var bofang = function(localId){
	util.initWxJsAndDo(['playVoice'],function(){
		wx.playVoice({
			localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
		});
	});
};

//停止录音并且上传
var stopRecordAndSend = function(){
	util.initWxJsAndDo(['stopRecord'],function(){
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
	util.initWxJsAndDo(['onVoiceRecordEnd'],function(){
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
	util.initWxJsAndDo(['downloadVoice'],function(){
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
	util.initWxJsAndDo(['uploadVoice'],function(){
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
			e.stopPropagation();
		},
		touchend: function(){
			//结束录音
			$("#audio").text("按住 说话");
			stopRecordAndSend();
			return false;
		}
	});
	
	
	
});

