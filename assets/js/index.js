$(function() {
    // 获取用户基本信息
    getUserInfo();
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message, { icon: 2 })
            }

            // 渲染用户头像
            $('.welcome').html('欢迎&nbsp;&nbsp;' + res.data.username || res.data.nickname)
            var firstName = res.data.username.slice(0, 1) || res.data.nickname.slice(0, 1)
            $('.worduser').html(firstName.toUpperCase())
            if (res.data.user_pic !== null) {
                $('.layui-nav-img').attr('src', res.data.user_pic).show();
                $('.worduser').hide();
            } else {
                $('.layui-nav-img').hide();
                $('.worduser').show();
            }
        }
    })
}