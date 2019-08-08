var baseUrl = 'https://api.wallet.hsn.link/api';
var sentCode = baseUrl + "/app/verify/sendVerify";
var registerUrl = baseUrl + "/app/user/register";
$(()=>{
  var hsnHash = window.location.search;
  if(hsnHash){
    var hsnInv = hsnHash.split("?ref=")[1];
    if(hsnInv && hsnInv.indexOf("&")>-1){
      hsnInv = hsnInv.split("&")[0]; //处理微信扫描问题
    }
    $(".hsnUser").text(hsnInv);
  }

  var ua = window.navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    document.getElementById("homeMsgMask").style.display="block";
  }

});

function toRegister() {
  var phone = $("#phone").val();
  var checkCode = $("#checkCode").val();
  var password = $("#password").val();
  var checkPassword = $("#checkPassword").val();

  if(!phone){
    showMessage("手机号码不可为空！");
    $("#phone").focus();
    return;
  }else if(phone.length!==11){
    showMessage("请输入11位手机号码！");
    $("#phone").focus();
    return;
  }
  if(!checkCode){
    showMessage("验证码不可为空！");
    $("#checkCode").focus();
    return;
  }
  if(!password){
    showMessage("登录密码不可为空！");
    $("#checkCode").focus();
    return;
  }else if(String(password).length<6 || String(password).length>12){
    showMessage("登录密码长度为6-12位");
    $("#checkCode").focus();
    return;
  }

  if(password!==checkPassword){
    showMessage("两次输入密码不一致！");
    $("#checkCode").focus();
    return;
  }

  var sendData = {
    "mobile":phone,
    "code":checkCode,
    "password": password,
    "confirmPassword": checkPassword,
    "inviteCode": $("#hsnGetUser").text()
  };
  $.ajax({
    url:registerUrl,
    type:'POST',
    data:JSON.stringify(sendData),
    dataType:'json',
    contentType:"application/json;charset=UTF-8",
    success:res=>{
      if(res.msg === "success"){
        showMessage('注册成功！');
        goDownload('./download.html');
      }else{
        showMessage(res.msg);
      }
      console.log(res);

    }
  })



}

function getCode() {
  var phone = $("#phone").val();
  if(!phone){
    showMessage("手机号码不可为空！");
    $("#phone").focus();
    return;
  }else if(phone.length!==11){
    showMessage("请输入11位手机号码！");
    $("#phone").focus();
    return;
  }

  var sendData = {
    "mobile":phone,
    "type":"register"
  };
  $.ajax({
    url:sentCode,
    type:'POST',
    data:JSON.stringify(sendData),
    dataType:'json',
    contentType:"application/json;charset=UTF-8",
    success:res=>{
      if(res.msg==='success'){
        setCountdown(60);
      }else {
        showMessage(res.msg);
      }
      console.log(res);

    }
  })
}

function setCountdown(st){
  $("#hsnCodeBtn").text(st+"s");
  var dor = setInterval(()=>{
    st--;
    $("#hsnCodeBtn").text(st+"s");
    if(st<1){
      clearInterval(dor);
      $("#hsnCodeBtn").text("获取验证码");
    }
  },1000)
}

function showMessage(msg){
  $(".hsn_message").css('height','32pt');
  $(".hsn_message p").text(msg);
  setTimeout(()=>{$(".hsn_message p").css('display','block')},150);
  setTimeout(()=>{hideMessage()},2000)
}

function hideMessage() {
  $(".hsn_message").css('height','0pt');
  $(".hsn_message p").css('display','none');
}

function goDownload(url) {
  window.location.href=url;
}
