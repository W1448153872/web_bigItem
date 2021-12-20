$(function() {
    var layer = layui.layer
        // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
        // 为上传按钮绑定点击事件
    $('#uploadImg').on('click', function() {
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

    // 将裁剪后的图片上传到服务器
    $('#confirmBtn').on('click', function() {
        // 拿到用户剪裁之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败!')
                }
                layer.msg('更换头像成功')
                    // 重新渲染首页中的头像
                window.parent.getUserInfo()
            }
        })
    })
})