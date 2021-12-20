$(function() {
    // 获取用户基本信息
    getUserInfo();
    var layer = layui.layer
        // 实现退出功能
    $('#logout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('是否退出登录?', { icon: 3, title: '提示' }, (index) => {
            // 清空本都存储的token
            sessionStorage.removeItem('token')
                // 跳转到登录页面
            location.href = '/login.html'

            // 关闭confirm询问框
            layer.close(index)
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message, { icon: 2 })
            }

            // 渲染用户头像
            $('.welcome').html('欢迎&nbsp;&nbsp;' + res.data.nickname || res.data.username)
            var firstName = res.data.nickname.slice(0, 1) || res.data.username.slice(0, 1)
            $('.worduser').html(firstName.toUpperCase())
            if (res.data.user_pic !== null) {
                $('.layui-nav-img').attr('src', res.data.user_pic).show();
                $('.worduser').hide();
            } else {
                $('.layui-nav-img').hide();
                $('.worduser').show();
            }
        },
        // 无论成功还是失败，都会调用complete回调函数
        // complete: function(res) {
        //     // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空token
        //         localStorage.removeItem('token')
        //             // 强制调转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}