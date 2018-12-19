var a = 0;
var b = "00";
var c = "00";
var d = 0;
var e = 0;
var f = 0;
var g = 0;
var serial01 = "";
//  var serial_dictionary=new Array();
var serial_dictionary = {};

function sign_serial(classify, weij, bl) {
    if (classify.length < 3) {
        alert("请将分类填写完整");
        return;
    }
    for (var i = 0; i < classify.length; i++) {
        var serial = Number(classify[i].split('-')[0]);
        switch (i) {
            case 0:
                a = serial;
                break;
            case 1:
                d = serial;
                break;
            case 2:
                f = serial;
                break;
        }
    }
    var serial0 = weij.split('-')[0];
    e = serial0
    g = Number(bl)
    //detect_type
    serial_dictionary.classify = a;
    //g_record_type
    serial_dictionary.case_class = d;
    //position
    serial_dictionary.part = e;
    //g_photo_type
    serial_dictionary.image_class = f;
    //record_type
    serial_dictionary.state = g;
}

$("#success").on("click", function () {
    var classify = $("#classify").val();
    var weij = $("#weij").val();
    var bing = $("#radio").sfcheckbox('getVal');
    if (!bing) {
        alert('请选择分类信息')
    }
    else {
        if (classify == null || weij == null) {
            alert("请选择分类信息");
            return;
        }
        console.log(classify)
        paras = {
            project_name: $("#upload_name").val(),//项目名称
            // file:fd//图像文件夹
        };
        sign_serial(classify, weij, bing);
        console.log(serial01);
        console.log(serial_dictionary);
        console.log(JSON.stringify(serial_dictionary));
        var paras = {
            data: serial_dictionary
        };
        $.ajax({
            type: 'POST',
            url: mark_url,
            data: JSON.stringify(paras),
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            async: false,
            beforeSend: function () {
            },
            success: function (data) {
                //下一张
                if (current_index < img_files.length - 1) {
                    current_index += 1;
                    imageLoad(current_index);
                    $.ajax({
                        url: '/folder/mark_count/' + folder_id,
                        type: 'get',
                        dataType: 'json',
                        success: function (data) {
                            _track = document.getElementById("scroll_Track")
                            _thump = document.getElementById('scroll_Thumb')
                            _barText = document.getElementById('scrollBarTxt')
                            _track.style.width = ((data.marked / data._count) * 100) + '%'
                            _thump.style.marginLeft = ((data.marked / data._count) * 100) + '%'
                            _barText.textContent = data.marked + '/' + data._count
                        },
                        error: function (xhr) {
                            //console.error('出错了');
                        }
                    });
                    if (img_status.get(img_files[current_index].split('/')[2]) == "True") {
                        document.getElementById("H_signclass").style.display = "none";
                        document.getElementById("type_select").style.display = "none";
                    }
                    else {
                        document.getElementById("H_signclass").style.display = "";
                        document.getElementById("type_select").style.display = "";
                    }
                    var to_get_img = img_files[current_index].split('/');
                    var img_id = to_get_img[to_get_img.length - 1];
                    mark_url = "/mark/" + img_id;
                    img_status.set(img_files[current_index - 1].split('/')[2], "True")
                }
            }

        });
    }
});
// 保存按钮
$("#H_signclass").on("click", function () {
    var classify = $("#type_select option:selected").val();
    // console.log(classify);
    if (classify == '') {
        alert("请选择分类信息");
        return;
    } else {
        $.ajax({
            type: 'POST',
            url: mark_url,
            data: classify,
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            async: false,
            beforeSend: function () {
            },
            success: function (data) {
                //下一张
                if (current_index < img_files.length - 1) {
                    imgNaviNext();
                    current_index += 1;
                    imageLoad(current_index);
                    if (img_status.get(img_files[current_index].split('/')[2]) == "True") {
                        document.getElementById("H_signclass").style.display = "none";
                        document.getElementById("type_select").style.display = "none";
                        document.getElementById("red_tips").style.display = "none";
                    }
                    else {
                        document.getElementById("H_signclass").style.display = "";
                        document.getElementById("type_select").style.display = "block";
                        document.getElementById("red_tips").style.display = "block";
                    }
                    var to_get_img = img_files[current_index].split('/');
                    var img_id = to_get_img[to_get_img.length - 1];
                    mark_url = "/mark/" + img_id;
                    img_status.set(img_files[current_index - 1].split('/')[2], "True")
                }
                //更新进度条
                $.ajax({
                    url: '/folder/mark_count/' + folder_id,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        refreshImgStatus(data.images);
                        var _track = document.getElementById("scroll_Track");
                        // _thump = document.getElementById('scroll_Thumb');
                        var _barText = document.getElementById('scrollBarTxt');
                        _track.style.width = ((data.marked / data._count) * 100) + '%';
                        // _thump.style.marginLeft = ((data.marked / data._count) * 100) + '%';
                        _barText.textContent = data.marked + '/' + data._count;
                        $("#scrollBarTxt").html(data.marked + "/" + data._count);
                    },
                    error: function (xhr) {
                        //console.error('出错了');
                    }
                });
            }
        });
    }

})