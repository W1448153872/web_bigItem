$(function() {
    var layer = layui.layer
    var form = layui.form
        // 获取文章类别列表
    function getClassList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章类别获取失败！', { icon: 2 })
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    getClassList()

    // 添加类别按钮
    var indexAdd = null
    $('#addBtn').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的形式，为form表单绑定submit事件
    // 给页面中已经存在的元素绑定事件
    $('body').on('submit', '#addForm', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败', { icon: 2 })
                }
                getClassList();
                layer.msg('新增文章分类成功!', { icon: 1, time: 1000 })
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式为编辑按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '#edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败!', { icon: 2 })
                }
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的方式，为修改分类表单绑定submit事件
    $('body').on('submit', '#editForm', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: form.val('form-edit'),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章分类更新失败!', { icon: 2 })
                }
                layer.msg('文章分类更新成功!', { icon: 1, time: 1000 })
                getClassList()
                layer.close(indexEdit)
            }
        })
    })

    // 为删除按钮绑定点击事件
    $('tbody').on('click', '#delete', function() {
        var id = $(this).attr('data-id')
        console.log(id);
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, (index) => {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败!', { icon: 2 })
                    }
                    layer.msg('删除文章分类成功!', { icon: 1, time: 1000 })
                    getClassList()
                    layer.close(index)
                }
            })

        })
    })
})