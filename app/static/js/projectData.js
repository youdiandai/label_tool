// 设置切换标签，下边根据标签设置ajax具体传输的contentright数值
var content_class = 1;
//需要加上切换其余text为空，避免bug
$("#list_01").click(function () {
    openMatter(1, 3);
});
$("#list_02").click(function () {
    openMatter(2, 3);
});
$("#list_03").click(function () {
    openMatter(3, 3);
});

var temp = "none";
var color = "#312d2d"

function openMatter(obj, length) {
    if (obj > length) {
        return;
    }
    content_class = obj;
    for (var i = 1; i <= length; i++) {
        if (i == obj) {
            temp = "inline-block";
            color = "#6e79c1"
        } else {
            temp = "none";
            color = "#312d2d";
        }
        document.getElementById("content" + i).style.display = temp;
        document.getElementById("list_0" + i).style.backgroundColor = color;
    }
};

// 数据
var paras = {};
//创建项目
$("#creat_project").on("click", function () {


    switch (content_class) {
        case 1:
            if ($("#upload_name").val() == "" || $("#image_classify").val() == "") {
                alert("名称或部位信息未填写,请填写好再创建新的项目！");
                return;
            }
            ;
            paras = {
                project_type: '图像分类',
                project_name: $("#upload_name").val(),//项目名称
                types: $("#sign_classify1").val()//分类选择项的名称
            };
            break;
        case 2:
            paras = {
                project_type: '位置标注',
                project_name: $("#signname").val(),//项目名称
                types: $("#sign_classify2").val()//分类选择项的名称
            };
            break;
        case 3:
            paras = {
                name: "text"//文字标注
            };
            break;
    }
    ;

    $.ajax({
        type: 'POST',
        url: ajax_url,
        data: JSON.stringify(paras),
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        success: function (data) {
            //传递成功就刷新页面，然后根据数据库重绘项目div
            window.location.reload();
        }
    });
})
