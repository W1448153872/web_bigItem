$(function() {
    var layer = layui.layer
        // 为表单制定规则
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间!'
            }
        }
    })

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败', { icon: 2 })
                }
                //  快速为表单赋值
                form.val('userInfoForm', res.data)
            }
        })
    }
    initUserInfo();

    // 重置表单的数据
    $('#resetBtn').on('click', (e) => {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 再次调用获取用户信息的接口，把用户信息填充到表单中
        initUserInfo();
    })

    // 监听表单的提交事件
    $('#edit-form').on('submit', (e) => {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: form.val('userInfoForm'),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败', { icon: 2 })
                }
                layer.msg('更新用户信息成功', { icon: 1 })
                    // 调用父页面中的方法，重新渲染用户的头像和信息
                window.parent.getUserInfo()
            }
        })
    })

})