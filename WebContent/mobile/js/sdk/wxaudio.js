var util = window._util;

$(function(){
	util.initWxJsAndDo(['checkJsApi','startRecord','stopRecord','uploadVoice','onVoiceRecordEnd'],null);
});


wx.ready(function(){
	$("#audio").on('touchend',function(){
		var oc = $(this).attr('o');
		if(oc == '0'){//点击开始录音了
			$(this).attr('o','1');
			$(this).text('结束 录音');
			startRecord();
		}else{
			$(this).attr('o','0');
			stopRecordAndSend();
			$(this).text('点击开始录音');
		}
	});
});

wx.error(function (res) {
	alert('录音功能已准备好，请重试！');
});
//开始录音
var startRecord = function(){
	wx.startRecord();
	voiceRecordEnd();
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

//监听录音自动停止接口
var voiceRecordEnd = function(){
		wx.onVoiceRecordEnd({
		    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
		    complete: function (res) {
		      //上传语音
		    	uploadVoice(res.localId);
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
         audio.volume = 0.9;
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

