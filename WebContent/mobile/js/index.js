var conn = null;
var curUserId = "";
var curNickName = "";
var curRole = "";
var actUsrId = "";
var headImg = "";
$(function(){
	$('.content').css('height',$(window).height()-172);
    $(window).resize(function(){$('.content').css('height',$(window).height()-172);});
    //语音切换
    $('.eachjp_yuyin').click(function(){
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $('.chat02_content').hide();
            $('.yuyinviewbox').show();
        }else{
            $(this).addClass('on');
            $('.chat02_content').show();
            $('.yuyinviewbox').hide();
        }
    });
    //环信
	conn = new Easemob.im.Connection();
    //初始化连接
	conn.init({
		onOpened : function(){
			alert("成功登录");
			conn.setPresence();
		}
	});
    

});
var login = function(){
	 //curUserId = "ue6c497645";
    var pass = '123456';
    //根据用户名密码登录系统
    conn.open({
        apiUrl : Easemob.im.config.apiURL,
        user : curUserId,
        pwd : pass,
        //连接时提供appkey
        appKey : Easemob.im.config.appkey
    });
};
//加入群组
var joinGroup = function(){
    var wxcode = util.getUrlParam("code");
    var groupId = util.getUrlParam("groupId");
    alert("code:"+wxcode+"  groupid:"+groupId);
    if(wxcode){
        $.ajax({
            type : "post",
            dataType : "json",
            data : {
                groupId : groupId,
                code : wxcode
            },
            url : util.getServerUrl()+"groups/joinGroup",
            success : function(data){
                //返回用户信息，调用环信的js登录，进入聊天群组界面
                if(data.code == '0'){
                    curUserId = data.username;
                    curNickName = data.nickname;
                    curRole = data.role;
                    actUsrId = data.userid;
                    headImg = data.headimg;
                    login();
                }else if(data.code == '3001'){
                    //转到关注二维码页面
                }else{
                    alert(data.errorMSG);
                }
            }
        });
    }else{
        alert("请关注后在访问！");
    }
};
