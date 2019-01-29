// 这个方法用来储存每个圆圈对象
function rectcircle(x,y,width,height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.isSelected= false;
}
// 自定义颜色数组，后续可添加，改变涉及颜色的数组length
var colorarr = ["#920601", "#dde641", "#0380dd", "#3cdf2e", "#dc49ed"];
// 保存画布上所有的圆圈
var rects=[];
var canvas_rect;
var context;
function mouseRect() {
  canvas_rect = document.getElementById("canvas_rect");
  context = canvas_rect.getContext("2d");
  canvas_rect.onmousedown = canvasClick;
  canvas_rect.onmouseup = stopDragging;
  // canvas.onmouseout = stopDrag;
  canvas_rect.onmousemove = dragCircle;
};
function re(_arr,_obj) {
    var len = _arr.length;
    for(var i = 0; i < len; i++)
    {
        if(_arr[i] == _obj)
        {
            return parseInt(i);
        }
    }
    return -1;
};
//删除按钮
$("#deleteTool").on("click",function(){
  var z_index=parseInt($("#canvas_rect").get(0).style.zIndex)>parseInt($("#canvas_line").get(0).style.zIndex)?true:false;
  console.log(z_index);
 if (z_index) {
  if (previousSelectedCircle==null) {
    alert("请点击标注框，再点击删除按钮");
    return;
  }
  else {
    //删除制定元素
     previousSelectedCircle.isSelected = false;
     var index=re(rects,previousSelectedCircle);
     rects.splice(index, 1);
    //  sign_Information.splice(index, 1);
     var j=-1;
     //新版选择分类
     for (var i = 0; i < $(".classify").length; i++) {
        var select_id = $(".classify").eq(i).attr("id").substr($(".classify").eq(i).attr("id").length - 6, 6);
        if (select_id == "Rectes") {
            var index_id = parseInt($(".classify").eq(i).attr("id").slice(0, 1));
            if (index_id == index) {
                $(".classify").eq(i).remove();
            }
        }
    }
    //重写右侧select ID
    for (var i = 0; i < $(".classify").length; i++) {
        $(".classify").eq(i).attr("id", i + "Rectes");
        var color_index =i%5;
        if(color_index == 4){
            color_index = -1;
        }
        console.log(color_index);
        $(".classify").eq(i).css("border","solid 3px " + colorarr[color_index+1])
    }
     console.log(j);
       sign_context.items.splice(j, 1);
     //重绘
         context.clearRect(0, 0, canvas_rect.width, canvas_rect.height);
         for (var i = 0; i < rects.length; i++) {
             context.strokeRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
             var i_length = i % 5;
             context.fillStyle = colorarr[i_length + 1];/*设置填充颜色*/
             context.fillRect(rects[i].x - 5, rects[i].y - 5, 10, 10);
             context.fillRect(rects[i].x + rects[i].width - 5, rects[i].y + rects[i].height - 5, 10, 10);
         }
     }
     previousSelectedCircle = null;
}
else {
  console.log("circle");
  console.log(moveCircleLine_index);
  if (moveCircleLine_index==-1) {
    alert("请点击标注框，再点击删除按钮");
    return;
  }
  else {
     circle_array.splice(moveCircleLine_index, 1);
     polygon_array.splice(moveCircleLine_index, 1);
     var j=-1;
     for (var i = 0; i < sign_context.items.length; i++) {
       var circleid=sign_context.items[i].id.substr(sign_context.items[i].id.length-6,6);
       console.log(circleid)
       if (circleid=="Circle") {
            // //更新vue数组
            // sign_context.items.splice(index, 1);
            var index_id=parseInt(sign_context.items[i].id);
            console.log(123);
            if (index_id==moveCircleLine_index) {
                j=i;
            }
            if (index_id>moveCircleLine_index) {
              index_id-=1;
              sign_context.items[i].id=index_id+"Circle"
            }
       }
     }
     console.log(j);
       sign_context.items.splice(j, 1);
       refush_circleLineDisable();
  }
}
});


function drawCircles(rect,rects) {
  // 清除画布，准备绘制
  context.clearRect(0, 0, canvas_rect.width, canvas_rect.height);
    var rect = rect;
    var rects = rects;
    var rects_length = rects.length % 5;
    if (rects_length + 1 == 5) {
        rects_length = -1;
    }
    // 绘制圆圈
    context.strokeStyle = "#000";
    context.strokeRect(rect.x,rect.y,rect.width,rect.height);
    context.fillStyle = colorarr[rects_length + 1];/*设置填充颜色*/
    context.fillRect(rect.x-5,rect.y-5,10,10);
    context.fillRect(rect.x+rect.width-5,rect.y+rect.height-5,10,10);
    for (var i = 0; i < rects.length; i++) {
      //选中颜色
    if (rects[i].isSelected) {
      context.fillStyle="rgba(100,150,185,0.5)";/*设置填充颜色*/
      context.fillRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
    }

    context.strokeRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
    context.fillStyle="#F00";/*设置填充颜色*/
    var i_length = i % 5;
    if (i_length == 4) {
        i_length = -1;
    }
    context.fillStyle = colorarr[i_length + 1];/*设置填充颜色*/
    context.fillRect(rects[i].x - 5, rects[i].y - 5, 10, 10);
    context.fillRect(rects[i].x + rects[i].width - 5, rects[i].y + rects[i].height - 5, 10, 10);
    }
    context.lineWidth = 1;
}

function refush(rects) {
  // 清除画布，准备绘制
  context.clearRect(0, 0, canvas_rect.width, canvas_rect.height);
    for (var i = 0; i < rects.length; i++) {
    if (rects[i].isSelected) {
      context.fillStyle="rgba(100,150,185,0.5)";/*设置填充颜色*/
      context.fillRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
    }
    context.strokeRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
    // context.fillStyle="#F00";/*设置填充颜色*/
    var i_length = i % 5;
    if (i_length == 4) {
        i_length = -1;
    }
    context.fillStyle = colorarr[i_length + 1];/*设置填充颜色*/
    context.fillRect(rects[i].x-5,rects[i].y-5,10,10);
    context.fillRect(rects[i].x+rects[i].width-5,rects[i].y+rects[i].height-5,10,10);
    }
    context.lineWidth = 1;
}
var x1;
var y1;
var clickX;
var clickY;
var previousSelectedCircle;
var widthstart,widthend;
var heightstartheightend;

function canvasClick(e) {
  // 取得画布上被单击的点
  clickX = e.pageX - canvas_rect.offsetLeft;
  clickY = e.pageY - canvas_rect.offsetTop;
  for(var i=rects.length-1; i>=0; i--) {
    var rect = rects[i];

        widthstart=rect.x;
        widthend=rect.x+rect.width;

        heightstart=rect.y;
        heightend=rect.y+rect.height;

    // 判断这个点是否在矩形中
    if ((clickX>(widthstart+10)&&clickX<(widthend-10))&&(clickY>(heightstart+10))&&(clickY<(heightend-10))) {
      // 清除之前选择的圆圈
      if (previousSelectedCircle != null) {
       previousSelectedCircle.isSelected = false;
     }
      previousSelectedCircle = rect;
      //鼠标距离矩形
      x_rect=clickX-previousSelectedCircle.x;
      y_rect=clickY-previousSelectedCircle.y;
      //选择新圆圈
      rect.isSelected = true;
      // 使圆圈允许拖拽
      isDragging = true;
      //更新显示
    drawCircles(previousSelectedCircle,rects);

      //停止搜索
      return;
    };
    if ((clickX>=(widthend-10))&&(clickX<=(widthend+10))&&(clickY>=(heightend-10))&&(clickY<=(heightend+10))) {
      previousSelectedCircle =rect;
      bol_edit_BOTTOM=true;
      return;
    }
    if ((clickX>=widthstart-10)&&(clickX<=(widthstart+10))&&(clickY>=(heightstart-10))&&(clickY<=(heightstart+10))) {
      previousSelectedCircle =rect;
      bol_edit_top=true;
      return;
    }
  }
  var width=1;
  var height=1;
  var rect=new rectcircle(clickX,clickY,width,height);
  // drawCircles(rect,rects);
  isDraw=true;
}

//鼠标拖动绘制矩形
var isDraw = false;
//移动矩形
var isDragging = false;
var bol_edit_BOTTOM=false;
var bol_edit_top=false;
function stopDragging() {
  console.log(previousSelectedCircle);
  //当处于移动矩形的状态时，此时onmousemoved,
  //如果不判断，那么你鼠标点击移动的xy也会被加入数组，
  //所以只有在不是移动状态下的鼠标离开画布，才加入点数组

    if (tooltip && isDragging == false && bol_edit_top == false && bol_edit_BOTTOM == false) {
        if (isRectEdit && !isLineEdit) {
            var rect = new rectcircle(clickX, clickY, x1 - clickX, y1 - clickY);
            console.log(rect.width);
            if (rect.width > 0) {
                rects.push(rect);
                var select_option = $("#classify").html();
                console.log(select_option);
                var select_index = (rects.length - 1) + "Rectes";
                $(".right_select").append('<select id="' + select_index + '" class="classify" placeholder="手动输入或下拉选择分类">' + select_option + '</select>');
                var color_index = rects.length % 5;
                $("#" + select_index).css("border", "solid 3px " + colorarr[color_index])
            }
        }
    }



  isDraw = false;
  isDragging = false;
  bol_edit_BOTTOM=false;
  bol_edit_top=false;
  tooltip=false;
  console.log(rects);
}
$("#success").on("click",function(){
  //是否需要判断不为空的情况
  var classify=$("#classify option:selected").text();
  var name=$("#sign_name").val();
  if (isRectEdit&&!isLineEdit) {
    //鼠标移开，最终的点加入点数组
    var rect=new rectcircle(clickX,clickY,x1-clickX,y1-clickY);
    // var signinfo=new sign_info(classify,name,clickX,clickY,x1-clickX,y1-clickY);
    //点也已对象的形式保存
    // var abc=new points_abc(clickX,clickY,x1-clickX);
    //点击多边形设置为true,矩形为false
    //判断，谁为true，就创建哪种对象。
    //为每一种工具设置一个type，根据type绘制矩形或点。
    if (rect.width>0) {
      rects.push(rect);
      indexRectesofVue=(rects.length-1)+"Rectes";
      //更新vue数组
      sign_context.items.push({ name:name,id:indexRectesofVue,classify:classify});
      console.log(sign_context)
    }
  }
  else if (!isRectEdit&&isLineEdit) {
    if (points.length>=3) {
        polygon_array.push([].concat(points));
        circle_array.push([].concat(circles));
        //push一项，那么这一项对应poly索引就是length-1,根据vue动态绑定找到id也就是indexofVue，也就找到了具体polygon_array【indexCircesofVue】，然后变色
        indexCircesofVue=(polygon_array.length-1)+"Circle";
        //更新vue数组
        sign_context.items.push({ name:name,id:indexCircesofVue,classify:classify});
      }
  }
//   $("#classify").val("");
  $("#classify option").eq(0).attr("selected","true");
  $("#sign_name").val("");
   points=[];
   circles=[];
   boolcomplete=false;
   refush_circleLineDisable();
  $(".tool_tip").get(0).style.display="none";
  $(".theme-popover-mask").get(0).style.display="none";
  $(".tool_tip").removeClass("top");
});
$("#remove_rect").on("click",function(){
    refush(rects);
    points=[];
    circles=[];
    refush_circleLineDisable();
    $("#classify").val("");
    $("#sign_name").val("");
    $(".tool_tip").get(0).style.display="none";
    $(".theme-popover-mask").get(0).style.display="none";
    $(".tool_tip").removeClass("top");
});
//根据hover元素的name 找到对应id index；
function fillSelectRect(signinfo,name){
  for (var i = 0; i < signinfo.length; i++) {
    if (signinfo[i].name==name) {
       return i;
    }
    // else
    // return -1;
  }

};

//点击不弹窗
var tooltip=false;
//SelectedRect
function dragCircle(e) {
    if(isDraw)
    {
      tooltip=true;
      // 取得鼠标位置
     x1 = e.pageX - canvas_rect.offsetLeft;
     y1 = e.pageY - canvas_rect.offsetTop;
    var width=x1-clickX;
    var height=y1-clickY;
    var rect=new rectcircle(clickX,clickY,width,height);
    drawCircles(rect,rects);
  }
  else if (isDragging)
  {
    if (previousSelectedCircle != null) {
      // 取得鼠标位置
      var x = e.pageX-canvas_rect.offsetLeft;
      var y = e.pageY-canvas_rect.offsetTop;
      // 将圆圈移动到鼠标位置
      previousSelectedCircle.x= x-x_rect;
      previousSelectedCircle.y= y-y_rect;

     // 更新画布
    drawCircles(previousSelectedCircle,rects);
    }
  }
 else  if (bol_edit_BOTTOM) {
    if ((e.pageX-canvas_rect.offsetLeft-previousSelectedCircle.x)>20) {
      previousSelectedCircle.width=e.pageX-canvas_rect.offsetLeft-previousSelectedCircle.x;
    }
    else {
      previousSelectedCircle.width=20;
    }
    if ((e.pageY-canvas_rect.offsetTop-previousSelectedCircle.y)>20) {
       previousSelectedCircle.height=e.pageY-canvas_rect.offsetTop-previousSelectedCircle.y;
    }
    else {
      previousSelectedCircle.height=20;
    }
    drawCircles(previousSelectedCircle,rects);
  }
  else  if (bol_edit_top) {
     var end_x=previousSelectedCircle.x+previousSelectedCircle.width;
     var end_y=previousSelectedCircle.y+previousSelectedCircle.height;
     if (end_x-(e.pageX-canvas_rect.offsetLeft)>20) {
       previousSelectedCircle.x=(e.pageX-canvas_rect.offsetLeft);
       previousSelectedCircle.width=end_x-(e.pageX-canvas_rect.offsetLeft);
     }
     else {
       previousSelectedCircle.width=20;
     }
     if (end_y-(e.pageY-canvas_rect.offsetTop)>20) {
       previousSelectedCircle.y=e.pageY-canvas_rect.offsetTop;
        previousSelectedCircle.height=end_y-(e.pageY-canvas_rect.offsetTop);
     }
     else {
       previousSelectedCircle.height=20;
     }
     drawCircles(previousSelectedCircle,rects);
   }

};

//json转换
     function tojson(arr){
     if(!arr.length) return null;
     var i = 0,
     len = arr.length,
     array = [];
     for(;i<len;i++){
       array.push({"startx":arr[i].x,"starty":arr[i].y,"endx":arr[i].x+arr[i].width,"endy":arr[i].y+arr[i].height});
     }
     return JSON.stringify(array);
    };

 $("#history_dic").click(function(){
    var tbody = $("#history_model");
    tbody.empty();
    var row_data
    $.ajax({
        url: '/project/label_count/' + p_id,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            $("#export_coordinate").attr("href","/download/export_xml/"+ p_id)
            var lable_ed;
            for(var i=0; i<data._count;i++){
                if(data.images[i].labeled == true){
                    lable_ed = "已设置"
                }else{
                    lable_ed = "未设置"
                }
                row_data ='<tr>\
                    <td>'+data.images[i].name+'</td>\
                    <td id="history_model_sign">'+lable_ed+'</td>\
                </tr>';
                tbody.append(row_data);
            }
        },
        error: function (xhr) {
            //console.error('出错了');
        }
    });

});
// 右侧下拉鼠标移入事件
$(".right_select").delegate(".classify", "mouseover", function () {
    // console.log($(this).attr("id"));
    var index = re(rects, previousSelectedCircle);
    // rects.splice(index, 1);
    var hover_select_id = $(this).attr("id");
    var indexId = parseInt($(this).attr("id").slice(0, 1));
    rects[indexId].isSelected = true;
    refush(rects);
    for (var i = 0; i < rects.length; i++) {
        rects[i].isSelected = false;
    }
});
// 右侧下拉鼠标移出事件
$(".right_select").delegate(".classify", "mouseout", function () {
    for (var i = 0; i < rects.length; i++) {
        rects[i].isSelected = false;
    }
    refush(rects);
    refush_circleLineDisable();
});