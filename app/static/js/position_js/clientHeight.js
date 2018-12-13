function inclientHeight(a){
  var clientheight=document.documentElement.clientHeight;
  var clientwidth=document.documentElement.clientWidth;
  //
  $(".left_Tool").get(0).style.height=clientheight-52+"px";
  $(".right_context").get(0).style.height=clientheight-52+"px";
  //宽度
  // $(".canvas_model").get(0).style.width=clientwidth-100+"px";
  // $(".thumb_model").get(0).style.width=clientwidth-100+"px";
  //canvas高度 缩略图高度默认150
  $(".canvas_model").get(0).style.height=clientheight-150-52+"px";
  var padding;
  // //工具的高度
  // var divHeight=$('.move_Tool').height();
  // //总高度-div*数量   除2 =总是在中间位置
  // if (((clientheight-52-divHeight*a)/2)>=50) {
  //   padding=(clientheight-52-divHeight*a)/2+"px";
  // }
  // else {
  //   padding=50+"px";
  // }
  // $(".move_Tool").css("margin-top",padding);

  //画布
  var canvas = document.getElementById("canvas");
  canvas.width=clientwidth-100-200;
  //-2 border
  canvas.height=clientheight-150-52-2;

  var canvas_rect = document.getElementById("canvas_rect");
  canvas_rect.width=clientwidth-100-200;
  canvas_rect.height=clientheight-150-52-2;

  var canvas_line = document.getElementById("canvas_line");
  canvas_line.width=clientwidth-100-200;
  canvas_line.height=clientheight-150-52-2;

  var canvas_bezier = document.getElementById("canvas_bezier");
  canvas_bezier.width=clientwidth-100-200;
  canvas_bezier.height=clientheight-150-52-2;
};
