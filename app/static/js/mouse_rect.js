/*
绘制矩形，包括提示框与删除按钮的功能
*/

// 这个方法用来储存每个圆圈对象
function rectcircle(x,y,width,height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.isSelected= false;
}
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
//查找数组中的相同项
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
     for (var i = 0; i < sign_context.items.length; i++) {
       var rectid=sign_context.items[i].id.substr(sign_context.items[i].id.length-6,6);
       console.log(rectid)
       if (rectid=="Rectes") {
            // //更新vue数组
            // sign_context.items.splice(index, 1);
            var index_id=parseInt(sign_context.items[i].id);
            console.log(123);
            if (index_id==index) {
                j=i;
            }
            if (index_id>index) {
              index_id-=1;
              sign_context.items[i].id=index_id+"Rectes"
            }
       }
     }
     console.log(j);
       sign_context.items.splice(j, 1);
     //重绘
     context.clearRect(0, 0, canvas_rect.width, canvas_rect.height);
     for (var i = 0; i < rects.length; i++) {
     // if (rects[i].isSelected) {
     //   context.fillStyle="rgba(100,150,185,0.5)";/*设置填充颜色*/
     //   context.fillRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
     // }
     context.strokeRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
     context.fillStyle="#F00";/*设置填充颜色*/
     context.fillRect(rects[i].x-5,rects[i].y-5,10,10);
     context.fillRect(rects[i].x+rects[i].width-5,rects[i].y+rects[i].height-5,10,10);
     }
  }
  previousSelectedCircle=null;
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
    // 绘制圆圈
    context.strokeStyle="#FF0000";
    context.strokeRect(rect.x,rect.y,rect.width,rect.height);
    context.fillStyle="#F00";/*设置填充颜色*/
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
    context.fillRect(rects[i].x-5,rects[i].y-5,10,10);
    context.fillRect(rects[i].x+rects[i].width-5,rects[i].y+rects[i].height-5,10,10);
    }
    context.lineWidth = 3;
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
    context.fillStyle="#F00";/*设置填充颜色*/
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
  if (tooltip&&isDragging==false&&bol_edit_top==false&&bol_edit_BOTTOM==false) {
    // console.log()
    $(".tool_tip").get(0).style.display="block";
    $(".theme-popover-mask").get(0).style.display="block";
    if (clickY<=(canvas_rect.height/2)) {
       $(".tool_tip").addClass("top");
       //-20 25是三角的大小 可修改
       $(".tool_tip").get(0).style.left=clickX+canvas_rect.offsetLeft-20+"px";
       $(".tool_tip").get(0).style.top=clickY+canvas_rect.offsetTop+25+"px";
    }
    else {
      //-20+25 -300位置调节 可修改
      $(".tool_tip").get(0).style.left=clickX+canvas_rect.offsetLeft-20+"px";
      $(".tool_tip").get(0).style.top=clickY+canvas_rect.offsetTop+25-300+"px";
     }
    // $()
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
  var classify=$("#classify").val();
  var name=$("#sign_name").val();
  if ((classify==null)) {
    alert("您没有设置病例属性，请设置");
    return;
  }
  if ((classify.length<3)) {
    alert("请依次设置病例属性，共三项(必选)");
    return;
  }
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
  // $("#classify").val("");
  $('#classify').selectpicker('val', ' ');
  $("#sign_name").val("");
   points=[];
   circles=[];
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
    // $("#classify").val("");
    $('#classify').selectpicker('val', ' ');
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
 $("#export_coordinate").on("click",function(){
   var text=JSON.stringify(dictionary)
    alert(text);
   // console.log(JSON.stringify(dictionary));
   //  for (var i = 0; i <50; i++) {
   //    console.log(text[i]);
   //  }

 })
