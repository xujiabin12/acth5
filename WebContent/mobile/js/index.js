var util = window._util;
var groupId = "";
var conn = null;
var curUserId = "";
var curNickName = "";
var curRole = "";
var actUsrId = "";
var headImg = "";
var curChatUserId = null;
var groupFlagMark = "group--";
var msgCardDivId = "chat01";
var talkInputId = "talkInputId";
var curRoomId = null;
var onlyTeacher = "1";
$(function(){
	$('.content').css('height',$(window).height()-172);
    $(window).resize(function(){$('.content').css('height',$(window).height()-172);});
    $('#talkInputId').focus(function(){
        $('.content').css('height',$(window).height()-172);}
    ).blur(function(){
            $('.content').css('height',$(window).height()-172);
        });
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
    $("#onlyTeacher").click(onlyTeacher);
    //环信
	conn = new Easemob.im.Connection();
    //初始化连接
	conn.init({
        wait : '1800',
        //当连接成功时的回调方法
		onOpened : function(){
            handleOpen(conn);
		},
        //当连接关闭时的回调方法
        onClosed : function() {
            handleClosed();
        },
        //收到文本消息时的回调方法
        onTextMessage : function(message) {
            handleTextMessage(message);
        },
        //异常时的回调方法
        onError : function(message) {
            handleError(message);
        }
	});

    joinGroup();

//    login();
});

//登录成功回调
var handleOpen = function(conn) {
    //从连接中获取到当前的登录人注册帐号名
    curUserId = conn.context.userId;
    conn.getRoster({
        success : function(roster) {
            //获取当前登录人的群组列表
            conn.listRooms({
                success : function(rooms) {
                    if (rooms && rooms.length > 0) {
                        for(var i=0;i<rooms.length;i++){
                            if(rooms[i].roomId == groupId){
                                var room = rooms[i];
                                curRoomId = room.roomId;
                                $("#talkto").html("与"+room.name+"聊天中")
                                setCurrentContact(groupFlagMark + room.roomId);
                            }
                        }

                    }
                    conn.setPresence();//设置用户上线状态，必须调用
                },
                error : function(e) {
                }
            });
        }
    });
    //启动心跳
    if (conn.isOpened()) {
        conn.heartBeat(conn);
    }
};

//连接中断时的处理，主要是对页面进行处理
var handleClosed = function() {
    login();
};
//收到文本消息回调
var handleTextMessage = function(message) {
    var from = message.from;//消息的发送者
    var fromNickName = message.ext.nickName;
    var headImg = message.ext.headImg;
    var role = message.ext.role;
    var serverId = message.ext.serverId;
    if(onlyTeacher == '0' && role != '1'){
        return;
    }
    //var mestype = message.type;//消息发送的类型是群组消息还是个人消息
    var messageContent = message.data;//文本消息体
    //TODO  根据消息体的to值去定位那个群组的聊天记录
    var fromNickname = fromNickName?fromNickName:message.from;
    var fname = fromNickname + getRoleName(role);

    appendMsg(from, message.to, messageContent, null,fname,headImg);
};

//异常情况下的处理方法
var handleError = function(e) {
    if (curUserId == null) {
        alert("连接超时，请退出重新进入...");
    } else {
        var msg = e.msg;
        if (e.type == EASEMOB_IM_CONNCTION_SERVER_CLOSE_ERROR) {
            login();
        } else if (e.type === EASEMOB_IM_CONNCTION_SERVER_ERROR) {
            if (msg.toLowerCase().indexOf("user removed") != -1) {
                alert("用户已经在管理后台删除");
            }
        } else {
            login();
        }
    }
    //conn.stopHeartBeat(conn);
};

//发送消息
var sendText = function(serverId) {
    if(!isStopSpeak()){
    	alert("你已被禁言10分钟");
        return;
    }
    var msgInput = document.getElementById(talkInputId);
    var msg = msgInput.value;
    if(serverId){
        msg = "<label onclick='playVoice(\""+serverId+"\")'>点击播放</label>";
    }

    if (msg == null || msg.length == 0) {
        return;
    }
    var to = curRoomId;
    if (to == null) {
        return;
    }
    var options = {
        to : to,
        msg : msg,
        type : "groupchat",
        ext : {"nickName":curNickName,"headImg":headImg,"role":curRole,"serverId":serverId}
    };
    //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
    conn.sendTextMessage(options);

    //当前登录人发送的信息在聊天窗口中原样显示
    var msgtext = msg.replace(/\n/g, '<br>');
    var nickName = curNickName?curNickName + getRoleName(curRole):curUserId;
    appendMsg(curUserId, to, msgtext,null,nickName);
    //turnoffFaces_box();
    msgInput.value = "";
    msgInput.focus();
};

//设置当前显示的聊天窗口div，如果有联系人则默认选中联系人中的第一个联系人
var setCurrentContact = function(defaultUserId) {
    showContactChatDiv(defaultUserId);
    curChatUserId = defaultUserId;
};

//显示当前选中联系人的聊天窗口div，并将该联系人在联系人列表中背景色置为蓝色
var showContactChatDiv = function(chatUserId) {
    var contentDiv = getContactChatDiv(chatUserId);
    if (contentDiv == null) {
        contentDiv = createContactChatDiv(chatUserId);
        document.getElementById(msgCardDivId).appendChild(contentDiv);
    }
    contentDiv.style.display = "block";
};

//构造当前聊天记录的窗口div
var getContactChatDiv = function(chatUserId) {
    return document.getElementById(curUserId + "-" + chatUserId);
};
//如果当前没有某一个联系人的聊天窗口div就新建一个
var createContactChatDiv = function(chatUserId) {
    var msgContentDivId = curUserId + "-" + chatUserId;
    var newContent = document.createElement("div");
    $(newContent).attr({
        "id" : msgContentDivId,
        "class" : "content",
        "className" : "content"
    });
    return newContent;
};

//显示聊天记录的统一处理方法
/**
 * @param who  消息发送者
 * @param contact  消息接受者
 * @param message 内容
 * @param chattype 消息类型
 * @param nickName 昵称
 * @param headImages 头像
 * @returns {Element}
 */
var appendMsg = function(who, contact, message, chattype,nickName,headImages) {
    var contactDivId =  groupFlagMark + contact;

    // 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
    //var localMsg = null;
    //if (typeof message == 'string') {
    //    localMsg = Easemob.im.Helper.parseTextMessage(message);
    //    localMsg = localMsg.body;
    //} else {
    //    localMsg = message.data;
    //}
    //如果没有头像，则默认是当前登陆人的头像
    headImages = headImages?headImages:headImg;

    //owner,headimg,nickname,msg
    createMsg(who==curUserId,headImages,nickName,message,contactDivId);

    if (curChatUserId == null) {
        setCurrentContact(contactDivId);
    }

    var msgContentDiv = getContactChatDiv(contactDivId);
    msgContentDiv.scrollTop = msgContentDiv.scrollHeight;

};

var createMsg = function(owner,headimg,nickname,content,contactDivId){
    var cn = owner?"rightContent":"leftContent";
    var msg = "<div class='"+cn+"'>";
            msg +="<div class='sanjiaobox'>";
                msg += "<img src='img/sj.png'>";
            msg +="</div>";
            msg +="<div class='userheadpic'>";
                msg +="<img src='"+headimg+"'>";
            msg +="</div>";
            msg +="<p1>"+nickname+"</p1>";
            msg +="<p3 class='chat-content-p3' classname='chat-content-p3'>"+content+"</p3>";
        msg +="</div>";
    $("#"+curUserId + "-" + contactDivId).append(msg);
};

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
     groupId = util.getUrlParam("groupId");
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
                    window.location.href = "touch.html";
                }else{
                    alert(data.errorMSG);
                }
            }
        });
    }else{
        alert("请授权后在访问！");
    }
};

//是否禁言
var isStopSpeak = function(){
	var flag = true;
    $.ajax({
        type : "post",
        dataType : "json",
        async : false,
        data : {
            userId : actUsrId+""
        },
        url : util.getServerUrl()+"users/isStopSpeak",
        success : function(data){
            if(data.isStopSpeak == '0'){
            	flag = false;
            }
        }
    });
    return flag;
};

var getRoleName = function(role){
    if(!role){
        return "";
    }
    switch (role){
        case '0':return "(管理员)";
        case '1':return "(老师)";
        default : return "";
    }
};

var onlyTeacher = function(){
  if(onlyTeacher == '0'){
      onlyTeacher = "1";
      $("#onlyTeacher").html("只看导师");
  }else{
      onlyTeacher = "0";
      $("#onlyTeacher").html("看全部");
  }
};