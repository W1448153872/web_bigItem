$(function() {
    var layer = layui.layer
        // 为表单制定规则
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 新密码与原密码必须不一致
        samePwd: function(value) {
            var oldPwd = $('[name=oldPwd]').val();
            if (value === oldPwd) {
                return '新旧密码不能相同！'
            }
        },
        // 检验两次密码是否一致
        repwd: function(value) {
            var newPwd = $('[name=newPwd]').val();
            if (value !== newPwd) {
                return '两次密码不一致'
            }
        }
    })

    // 修改密码表单的提交事件
    $('#edit-pwd').on('submit', (e) => {
        // 阻止表单的默认提交事件
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败', { icon: 2 })
                }
                layer.msg('更新密码成功！', { icon: 1 })
                    // 重置表单
                $('#edit-pwd')[0].reset()
            }
        })
    })
})