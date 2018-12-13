/*
工具栏。保存与显示隐藏的功能
*/
var clear=false;
// 矩形与多边形切换
$("#RectEdit").on("click",function(){
isRectEdit=true;
isLineEdit=false;
document.getElementById("canvas_rect").style.zIndex="2";
document.getElementById("canvas_line").style.zIndex="1";
// points=[];
// circles=[];
// rects=[];
refush_circleLineDisable();
});
//编辑线
$("#LineEdit").on("click",function(){
  isRectEdit=false;
  isLineEdit=true;
  document.getElementById("canvas_rect").style.zIndex="1";
  document.getElementById("canvas_line").style.zIndex="2";
  // points=[];
  // circles=[];
  // rects=[];
  refush_circleLineDisable();
});
//保存按钮 保存坐标信息到数组内，临时的数组清空
$("#save_as").on("click",function(){
  var imgname=img_files[current_index];
  var today = new Date();
  var month=today.getMonth()+1;
  var times = today.getFullYear() + "-"+month+"-"+today.getDate()+" "+today.getHours()+":"+today.getMinutes();
  //转换
  var rect01=objDeepCopy(rects);
  var polygon01=objDeepCopy(polygon_array);
  // var polygon01=polygon_array.concat()
  var circle01=objDeepCopy(circle_array);
  console.log(scale);


   array_transform(rect01,polygon01,circle01,scale,img_Paddingleft,img_PaddingTop);

  sign_Information.push(rect01.slice(0))
  sign_Information.push([].concat(polygon01));
  sign_Information.push([].concat(circle01));
  history_model.items.push({ imgname:imgname,sign:sign_Information,time:times});
  sign_Information.push(imgname);
  sign_Information.push(times);

  dictionary.push([].concat(sign_Information));
});
//数组转换
function array_transform(rects,polygon_array,circle_array,scale,img_Paddingleft,img_PaddingTop){
  for (var i = 0; i < rects.length; i++) {
    var offsetX=rects[i].x-img_Paddingleft;
    var offsetY=rects[i].y-img_PaddingTop;
    var newOffsetx=offsetX/scale;
    var newOffsety=offsetY/scale;
    rects[i].x=newOffsetx;
    rects[i].y=newOffsety;
    rects[i].width=(rects[i].width)/scale;
    rects[i].height=(rects[i].height)/scale;
  }
  /*多边形操作 circle_array[[circles],[circles],[circles]]*/
  for (var i = 0; i < circle_array.length; i++) {
    for (var j = 0; j < circle_array[i].length; j++)
    {
      var offsetX=circle_array[i][j].x-img_Paddingleft;
      var offsetY=circle_array[i][j].y-img_PaddingTop;
      var newOffsetx=offsetX/scale;
      var newOffsety=offsetY/scale;
      circle_array[i][j].x=newOffsetx;
      circle_array[i][j].y=newOffsety;
    }
  }
  /*画线*/
  for (var i = 0; i < polygon_array.length; i++) {
    for (var j = 0; j < polygon_array[i].length; j++) {
      var offsetX01=polygon_array[i][j].x-img_Paddingleft;
      var offsetY01=polygon_array[i][j].y-img_PaddingTop;
      var newOffsetx=offsetX01/scale;
      var newOffsety=offsetY01/scale;
      polygon_array[i][j].x=newOffsetx;
      polygon_array[i][j].y=newOffsety;
    }
  }
  /*    */
};
//对象数组深拷贝的方法，与一般数组深拷贝不一样，普通数组的深拷贝并不能应用
var objDeepCopy = function (source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
};
$("#if_Draw").on("click",function(){
  if (clear==false) {
    this.innerHTML="显示";
    clear=true;
    var canvas_rect = document.getElementById("canvas_rect");
    var context_rect = canvas_rect.getContext("2d");
    context_rect.clearRect(0 , 0 , canvas.width , canvas.height);
    var canvas_line = document.getElementById("canvas_line");
    var context_line = canvas_line.getContext("2d");
    context_line.clearRect(0 , 0 , canvas.width , canvas.height);
  }
  else if (clear) {
    this.innerHTML="隐藏";
    clear=false;
    refush(rects);
    refush_circleLineDisable();
  }
});
