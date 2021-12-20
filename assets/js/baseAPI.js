// 注意：每次调用$.get()或$.post()或$.ajax()的时候，会先自动调用ajaxPrefilter()这个函数，在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter((option) => {
    // 在发起真正的Ajax请求之前，统一拼接请求的根路径
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url

    // 统一为有权限的接口加headers请求头
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    option.complete = (res) => {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空token
            localStorage.removeItem('token')
                // 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})