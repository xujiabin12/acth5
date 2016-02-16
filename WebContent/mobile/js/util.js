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

    _util = {
        getServerUrl : getServerUrl,
        getUrlParam : getUrlParam
    };


    window._util = _util;

})();