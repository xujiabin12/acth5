/**
 * Created by jiabin on 2016/2/2.
 */
(function($){

    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].name == val.name)
                return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    /**
     * �滻�����ַ�
     */
    String.prototype.replaceAll = function(s1,s2) {
        return this.replace(new RegExp(s1,"gm"),s2);
    };
    var _util = {};

    var serverUrl = "http://101.201.209.109/act/";
    
//    var serverUrl = "http://124.192.206.155:8080/act/";
    
    
    


    var getServerUrl = function(){
        return serverUrl;
    };

    //��ȡurl����ֵ
    var getUrlParam = function (name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    };
    
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

    _util = {
        getServerUrl : getServerUrl,
        getUrlParam : getUrlParam,
        initWxJsAndDo : initWxJsAndDo
    };


    window._util = _util;

})($);