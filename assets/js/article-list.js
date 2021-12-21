$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
            var dt = new Date(date)
            var y = dt.getFullYear()
            var m = addZero(dt.getMonth() + 1)
            var d = addZero(dt.getDate())
            var hh = addZero(dt.getHours())
            var mm = addZero(dt.getMinutes())
            var ss = addZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零的方法
    function addZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义查询列表的参数对象
    var query = {
            pagenum: 1, //页码，默认请求第一页的数据
            pagesize: 2, //每页显示几条数据，默认煤业显示2条
            cate_id: '', //文章分类的id
            state: '' //文章的发布状态
        }
        // 获取文章列表数据
    function getArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章列表获取失败!', { icon: 2 })
                }
                var tableStr = template('tableData', res)
                $('tbody').html(tableStr)

                // 表格数据渲染完成后，渲染分页
                renderPage(res.total)
            }
        })
    }

    // 获取所有分类
    function getArticleClass() {
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
    }

    getArticleList();
    getArticleClass();

    // 为筛选表单绑定submit事件
    $('#selectForm').on('submit', (e) => {
        e.preventDefault()
        query.cate_id = $('[name=cate_id').val()
        query.state = $('[name=state').val()
            // 根据最新的筛选条件重新渲染表格的数据
        getArticleList();
    })

    // 为重置按钮绑定事件
    $('#resetBtn').on('click', function(e) {
        // 要转为DOM对象，jquery中没有重置表单的方法
        $('#selectForm')[0].reset();
        e.preventDefault()
        query.cate_id = $('[name=cate_id').val()
        query.state = $('[name=state').val()
            // 根据最新的筛选条件重新渲染表格的数据
        getArticleList();
    })


    // 定义渲染分页方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //数据总条数
            limit: query.pagesize, //每页显示的条数
            curr: query.pagenum, //设置默认选中页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //控制每页展示的条数
            // 分页发生切换的时候，触发jump回调
            // 触发jump回调的方式：1.点击页码值的时候会触发jump回调，2.只要调用了laypage.render()方法，就会触发jump回调
            jump: (obj, first) => {
                // 拿到最新的条目
                query.pagesize = obj.limit
                    // 可以拿到最新的页码值
                query.pagenum = obj.curr
                    // first值的作用，当通过方式二触发jump回调时，first的值为true，方式一时值为undefined
                    // 为防止jump回调的死循环，需要判断当点击页码值时才会触发jump回调
                if (!first) {
                    // 重新渲染表格
                    getArticleList();
                }
            }
        })
    }


    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '#delete', function() {
        // 获取到文章的id
        var id = $(this).attr('data-id')
            // 获取页面中删除按钮的个数
        var deleteBtn = $('#delete').length
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: (res) => {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!', { icon: 2 })
                    }
                    layer.msg('删除文章成功!', { icon: 1 })
                        // 当数据删除成功后，需要判断当前这一页中，是否还有剩余的数据，如果没有剩余的数据，则让页码值-1之后再重新获取列表的数据
                        // 如果删除按钮的个数为1时，则说明，删除当前文章后，页面中就没有数据了
                        // 页码值的最小必须是1
                    if (deleteBtn === 1) {
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
                    }
                    getArticleList();
                    layer.close(index)
                }
            })
        })
    })

    // 通过代理的形式，为编辑按钮绑定点击事件处理函数
    $('tbody').on('click', '#edit', function() {
        // 获取文章的id
        var id = $(this).attr('data-id')
            // 携带参数跳转页面
        location.href = `/article/publish.html?id=${id}`
            // 根据id获取文章详情
            // $.ajax({
            //     method: 'GET',
            //     url: '/my/article/' + id,
            //     success: (res) => {
            //         if (res.status !== 0) {
            //             return layer.msg('文章详情获取失败!', { icon: 2 })
            //         }
            //         location.href = '/article/publish.html'
            //     }
            // })
    })
})