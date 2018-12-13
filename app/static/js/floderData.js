/*
文件夹页面交互部分，点击上传等
*/
// 高度
var clientheight = document.documentElement.clientHeight;
$(".body_container").get(0).style.height = clientheight - 52 + "px";
$("#returntitle").on("click", function () {
    // window.location.href="project.html";
});

// 数据
var paras = {};
//创建项目
$(function () {
    $(".input-fileup").on("change", "input[type='file']", function () {
        var files = this.files;

        var fd = new FormData();
        for (var i = 0; i < files.length; i++) {
            fd.append("file", files[i]);
        }

        paras = {
            project_name: $("#upload_name").val(),//项目名称
            file: fd//图像文件夹
        };

        $.ajax({
            url: upload_url,
            method: "POST",
            data: fd,
            contentType: false,
            processData: false,
            cache: false,
            beforeSend: function () {
                //   $('#upload_floder').attr('disabled',"true");
                //  $(".showFileName1").html("图像上传中..");
                console.log("上传中")
                $(".load-div").css("display","block");
            },
            success: function (data) {
                console.log(data);
                //传递成功就刷新页面，然后根据数据库重绘项目div
                if (data.flag == 0) {
                    alert("上传未成功，请刷新页面后重试");
                }
                else {
                    $(".load-div").css("display","none");
                    
                    $(".showFileName1").html(files.length + "张文件上传完成");
                    $('#upload_floder').removeAttr("disabled");
                    $("#record_id").val("病历号:" + data.record_id);
                    $("#check_id").val("检查号:" + data.check_id);
                    window.location.reload();
                }
            }
        });
    })
});
$("#upload_floder").on("click", function () {
    //传递成功就刷新页面，然后根据数据库重绘项目div
    window.location.reload();
});
