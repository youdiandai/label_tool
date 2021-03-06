/*
 绘制图像脚本，用于共聚焦项目，和draw.js脚本基本相同，某些参数不同
*/
var width_scale = 1;
var height_scale = 1;
//在自适应canvas宽高的代码中，
//不能使用$("#canvas").get(0).style.width;这样获取到的是canvas默认的宽高300*150
//使用document.getElementById("canvas").width获取
var canvas_width = 0;
var canvas_height = 0;
//居中显示图像
var imgLoad = new Image();

function imageLoad(index) {
    //init
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

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


    for (let i = 0; i < img_files.length; i++) {
        document.getElementById("decete_info_" + img_files[i].split('/')[2]).style.display = "none";
    }

    if (marked_and_types[current_index][0]) {
        document.getElementById("decete_info_" + img_files[current_index].split('/')[2]).style.display = "";
    }
    else {
        document.getElementById("decete_info_" + img_files[current_index].split('/')[2]).style.display = "none";
    }


    scale = 1;
    img_PaddingTop = 0;
    img_Paddingleft = 0;
    current_index = index;

    canvas_width = canvas.width;
    canvas_height = canvas.height;
    imgLoad.src = img_files[current_index];
    imgLoad.onload = function () {
        var img_width = imgLoad.width;
        var img_height = imgLoad.height;
        var width_scale = canvas_width / img_width;
        var height_scale = canvas_height / img_height;

        if (((img_width > canvas_width) && (img_height > canvas_height))) {
            //取比例较小
            scale = width_scale <= height_scale ? width_scale : height_scale;
        }
        else if ((img_width >= canvas_width) && (img_height <= canvas_height)) {
            scale = width_scale;
        }
        else if ((img_width <= canvas_width) && (img_height >= canvas_height)) {
            scale = height_scale;
        }
        else if (((img_width < canvas_width) && (img_height < canvas_height))) {
            scale = 1;
        }
        img_PaddingTop = (canvas_height - img_height * scale) / 2;
        img_Paddingleft = (canvas_width - img_width * scale) / 2;
        context.clearRect(0, 0, canvas_width, canvas_height);
        context.drawImage(imgLoad, img_Paddingleft, img_PaddingTop, img_width * scale, img_height * scale);
        $("#vertical01").slider("setValue", -img_PaddingTop);
        $("#horizontal01").slider("setValue", -img_Paddingleft);
        console.log("scale:" + scale);
    }
};
$("#previous").on("click", function () {
    imgNaviPrev();
    if (current_index > 0) {
        current_index -= 1;
        imageLoad(current_index);
        //更新进度条
    } else {
        alert("已经是第一张了！");
    }

});
$("#next").on("click", function () {
    imgNaviNext();
    if (current_index < img_files.length - 1) {
        current_index += 1;
        imageLoad(current_index);
        //更新进度条
    } else {
        alert("已经是最后一张了！");
    }
});
//放大
$("#enlargement").on("click", function () {
    if (scale <= 3) {
        scale += 0.1;
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        /*    */
        img_Paddingleft = img_Paddingleft - imgLoad.width / 20;
        img_PaddingTop = img_PaddingTop - imgLoad.height / 20;
        //这里涉及img_Paddingleft、img_PaddingTop，并不是鼠标移动量，不能采用老的方法绘制
        //绘制图片写在最后是因为，先让img_PaddingTop，Left发生变化在放大缩小
        $("#vertical01").slider("setValue", -img_PaddingTop);
        $("#horizontal01").slider("setValue", -img_Paddingleft);
        context.drawImage(imgLoad, img_Paddingleft, img_PaddingTop, imgLoad.width * scale, imgLoad.height * scale);
    }
});
//缩小
$("#shrink").on("click", function () {
    if (scale >= 0.2) {
        scale -= 0.1;
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        /*        */
        img_Paddingleft = img_Paddingleft + imgLoad.width / 20;
        img_PaddingTop = img_PaddingTop + imgLoad.height / 20;
        $("#vertical01").slider("setValue", -img_PaddingTop);
        $("#horizontal01").slider("setValue", -img_Paddingleft);
        context.drawImage(imgLoad, img_Paddingleft, img_PaddingTop, imgLoad.width * scale, imgLoad.height * scale);
    }
});

//水平滑动条移动
function horizontal(value) {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    img_Paddingleft = -value;
    context.clearRect(0, 0, canvas_width, canvas_height);
    context.drawImage(imgLoad, img_Paddingleft, img_PaddingTop, imgLoad.width * scale, imgLoad.height * scale);
};

//垂直滑动条
function vertical(value) {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    img_PaddingTop = -value;
    context.clearRect(0, 0, canvas_width, canvas_height);
    context.drawImage(imgLoad, img_Paddingleft, img_PaddingTop, imgLoad.width * scale, imgLoad.height * scale);
}
