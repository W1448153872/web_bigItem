$(function() {
    // 点击去注册账号
    $('#go-reg').on('click', function() {
            $('.log-box').hide();
            $('.reg-box').show();
        })
        // 点击去登录
    $('#go-login').on('click', function() {
        $('.reg-box').hide();
        $('.log-box').show();
    })

    // 从layui中获取form对象
    var form = layui.form
        // 获取弹窗对象
    var layer = layui.layer
        // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 自定义一个校验两次密码是否一致的的校验规则
        repwd: function(value) {
            // 通过形参value拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            var pwd = $('.reg-pwd').val();
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册按钮的提交事件
    $('#reg-form').on('submit', function(e) {
        // 阻止表单的默认提交事件
        e.preventDefault();
        // 接口参数
        var data = { username: $('.reg-username').val(), password: $('.reg-pwd').val() }
            // 调用注册的接口
        $.post('/api/reguser', data, (res) => {
            if (res.status != 0) {
                return layer.msg(res.message, { icon: 2 })
            }
            layer.msg('注册成功，请登录', { icon: 1, time: 1000 }, function() {
                // 重置表单
                $('#reg-form')[0].reset();
                $('#go-login').click()
            })
        })
    })

    // 监听登录按钮的提交事件
    $('#log-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(), //快速获取表单的全部数据
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！', { icon: 2 })
                }
                layer.msg('登录成功!', { icon: 1, time: 1000 }, function() {
                    // 将后续调用接口所需的token存储在localStorage中
                    sessionStorage.setItem('token', res.token)
                        // 登录成功以后跳转到后台首页
                    location.href = '/index.html'
                })
            }
        })
    })
})