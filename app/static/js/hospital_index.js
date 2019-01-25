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

function refresh_process_bar(_marked, _image_count) {
    $("#scroll_Thumb").css("margin-left", ((_marked / _image_count) * 100) + "%");
    $("#scroll_Track").css("width", ((_marked / _image_count) * 100) + "%");
    $("#scrollBarTxt").html(_marked + "/" + _image_count);
}

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

// 保存按钮
$("#H_signclass").on("click", function () {
    var classify = $("#type_select option:selected").val();
    var classify_str = $("#type_select option:selected").text();
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
                marked_and_types[current_index][0] = true;
                marked_and_types[current_index][1] = classify_str;
                $(".tagg_results")[current_index].textContent = '分类信息：' + classify_str;
                refreshImgStatus(get_img_status(marked_and_types));
                //刷新进度条
                _marked = _marked + 1;
                refresh_process_bar(_marked, _image_count);
                //下一张
                if (current_index < img_files.length) {
                    imgNaviNext();
                    if (current_index < img_files.length - 1) {
                        current_index += 1;
                    }
                    imageLoad(current_index);
                    // if (img_status.get(img_files[current_index].split('/')[2]) == "True") {
                    if (marked_and_types[current_index][0]) {
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
            }
        });
    }

})