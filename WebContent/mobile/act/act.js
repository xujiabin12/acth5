var util = window._util;
$(function(){
	listenerShare();
});

//监听微信分享朋友圈
function listenerShare(){
	util.initWxJsAndDo(['onMenuShareTimeline'],function(){
		wx.onMenuShareTimeline({
		    title: '', // 分享标题
		    link: '', // 分享链接
		    imgUrl: '', // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});
	});
}
