function checkSubmitMobil(){
    if ($("#m_tel").val() == "手机号" || $("#m_tel").val() == "") {
        $("#e_mtel").html("手机号码不能为空！");
        $("#m_tel").focus();
        return false;
    }else if (!$("#m_tel").val().match(/^(((13[0-9]{1})|(14[5|7])|(15([0-3]|[5-9]))|(18[0,4-9]))+\d{8})$/)) {
        $("#e_mtel").html("手机号码格式不正确！");
        $("#m_tel").focus();
        return false;
    }else{
    	$("#e_mtel").html("");
    	return true;
    }
}