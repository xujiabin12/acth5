var util = window._util;

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
wx.error(function (res) {
	alert("错误："+JSON.stringify(res));
});
//开始录音
var startRecord = function(){
	util.initWxJsAndDo(['checkJsApi','startRecord','stopRecord','uploadVoice'],function(){
		wx.startRecord();
	});
};



//停止录音并且上传
var stopRecordAndSend = function(){
		wx.stopRecord({
		    success: function (res) {
		    	//上传语音
		    	uploadVoice(res.localId);
		    }
		});
};

//上传语音接口
var uploadVoice = function(localId){
		wx.uploadVoice({
		    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
		    isShowProgressTips: 0, // 默认为1，显示进度提示
		        success: function (res) {
		         // 返回音频的服务器端ID
					if(res.serverId){
						sendVoice(res.serverId);
					}

		    }
		});
};

//播放语音接口
var playVoice = function(serverId){
	$.ajax({
        type : "post",
        dataType : "json",
        data : {
       	 voiceId : serverId
        },
        url : util.getServerUrl()+"wx/placeVoice",
        success : function(data){
	       	if(data.code == '0'){
	       		toAudio(data.url);
	       	}else{
	       		alert("下载语音失败");
	       	}
        }
    });
};

var toAudio = function(url){
	 var audio = document.getElementById("actAudio");
         audio.src = url;
         audio.play();
};




//发送语音
var sendVoice = function(serviceId){
	 $.ajax({
         type : "post",
         dataType : "json",
         data : {
        	 voiceId : serviceId
         },
         url : util.getServerUrl()+"wx/uploadVoiceId",
         success : function(data){
        	//发送到界面
        		sendText(serviceId);
         }
     });
	
	
};

//wx.ready(function(){
//	alert("正在加载...");
//	util.initWxJsAndDo(['checkJsApi','downloadVoice','playVoice'],function(){
//		wx.downloadVoice({
//			serverId: serverId,
//			isShowProgressTips: 0, // 默认为1，显示进度提示
//			success: function (res) {
//				alert(res.localId);
//				wx.playVoice({
//					localId: res.localId // 需要播放的音频的本地ID，由stopRecord接口获得
//				});
//			}
//		});
//	});
//});
