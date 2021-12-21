$(function() {
    var form = layui.form
    var layer = layui.layer
    var isEdit = false
        // 富文本编辑器
        // 初始化富文本编辑器
    initEditor()
        // 文章封面
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        // 为选择封面按钮添加点击事件
    $('#selectImg').on('click', function(e) {
        $('#file').click()
    })
    $('#file').on('change', (e) => {
            // 拿到用户上传的文件
            var fileImgs = e.target.files
            if (fileImgs.length === 0) {
                return layer.msg('请选择照片！')
            }
            // 拿到用户选择的图片文件
            var img = e.target.files[0]
                // 将文件转化为路径
            var newImgURL = URL.createObjectURL(img)
                // 重新初始化裁剪区域
            $image
                .cropper('destroy') //销毁旧的裁剪区域
                .attr('src', newImgURL) //重新设置图片路径
                .cropper(options) //重新初始化裁剪区域
        })
        // 获取文章类别的下拉选项
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('文章分类数据获取失败!', { icon: 2 })
            }
            // 调用模板引擎渲染分类的可选项
            var selectStr = template('selectData', res)
            $('[name=cate_id]').html(selectStr)
                // 通知layui重新渲染表单区域的UI结构
            form.render()
        }
    })


    // 发布文章
    // 定义文章的发布状态
    var artStatus = '已发布'
        // 为存为草稿的按钮绑定点击事件
    $('#save').on('click', function() {
            artStatus = '草稿'
        })
        // 为表单绑定submit事件
    $('#articlData').on('submit', function(e) {
        e.preventDefault()
            // 基于form表单快速创建一个FormData对象
            // 转化为原生的dom对象
        var fd = new FormData($(this)[0])
            // 将文章的发布状态存到fd中
        fd.append('state', artStatus)
            // 将封面裁剪之后的文件，转化为对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob)
                if (isEdit === true) {
                    // 调用更新文章的接口
                    fd.append('Id', id)
                    $.ajax({
                        method: 'POST',
                        url: '/my/article/edit',
                        data: fd,
                        contentType: false,
                        processData: false,
                        success: (res) => {
                            if (res.status !== 0) {
                                return layer.msg('文章更新失败!', { icon: 2 })
                            }
                            layer.msg('文章更新成功!', { icon: 1, time: 1000 }, function() {
                                // 文章更新成功之后跳转到文章列表页面
                                location.href = '/article/artList.html'
                            })
                        }
                    })
                } else {
                    // 调用接口发布文章
                    $.ajax({
                        method: 'POST',
                        url: '/my/article/add',
                        data: fd,
                        // 如果向服务器提交的是FormData格式的数据，必须要添加以下两个配置项
                        contentType: false,
                        processData: false,
                        success: (res) => {
                            if (res.status !== 0) {
                                return layer.msg('文章发布失败!', { icon: 2 })
                            }
                            layer.msg('文章发布成功!', { icon: 1, time: 1000 }, function() {
                                // 文章发布成功之后跳转到文章列表页面
                                location.href = '/article/artList.html'
                            })
                        }
                    })
                }
            })
    })


    // 获取当前页面的url地址
    var url = window.location.href;
    // 编辑接口进来的文章id
    var id = null
    getParams(url);
    // 获url后面携带的参数
    function getParams(url) {
        if (url.indexOf('?') !== -1) { //说明地址后面携带了参数
            isEdit = true
            var index = url.indexOf('=')
                // 截取到id
            id = url.substr(index + 1)
            getDetail(id)
        }
    }

    function getDetail(data) {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + data,
            success: (res) => {
                if (res.status !== 0) {
                    layer.msg('文章详细信息获取失败!', { icon: 2 })
                }
                console.log(res);
                // 快速给表单赋值
                form.val('publishForm', res.data)
            }
        })
    }

})