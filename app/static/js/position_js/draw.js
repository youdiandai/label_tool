var width_scale=1;
var height_scale=1;
//在自适应canvas宽高的代码中，
//不能使用$("#canvas").get(0).style.width;这样获取到的是canvas默认的宽高300*150
//使用document.getElementById("canvas").width获取
var canvas_width=0;
var canvas_height=0;
//居中显示图像
var imgLoad=new Image();


function imageLoad(index){
  //init
  var canvas = document.getElementById("canvas");
  var context=canvas.getContext("2d");
  var canvas_rect = document.getElementById("canvas_rect");
  var context_rect=canvas_rect.getContext("2d");
  var canvas_line = document.getElementById("canvas_line");
  var context_line=canvas_line.getContext("2d");
  scale=1;
  img_PaddingTop=0;
  img_Paddingleft=0;
  current_index=index;

  canvas_width=canvas.width;
  canvas_height=canvas.height;
  imgLoad.src =img_files[current_index];
  imgLoad.onload = function (){
  var img_width=imgLoad.width;
  var img_height=imgLoad.height;
  var width_scale=canvas_width/img_width;
  var height_scale=canvas_height/img_height;

  if (((img_width>canvas_width)&&(img_height>canvas_height))) {
    //取比例较小
    scale=width_scale <= height_scale ? width_scale : height_scale;
  }
  else if ((img_width>=canvas_width)&&(img_height<=canvas_height)) {
      scale=width_scale;
  }
  else if ((img_width<=canvas_width)&&(img_height>=canvas_height)) {
      scale=height_scale;
  }
  else if (((img_width<canvas_width)&&(img_height<canvas_height))) {
      scale=1;
  }
  img_PaddingTop=(canvas_height-img_height*scale)/2;
  img_Paddingleft=(canvas_width-img_width*scale)/2
  context.clearRect (0 , 0 , canvas_width , canvas_height ) ;
  context_rect.clearRect (0 , 0 , canvas_width , canvas_height ) ;
  context_line.clearRect (0 , 0 , canvas_width , canvas_height ) ;
  context.drawImage (imgLoad,img_Paddingleft,img_PaddingTop,img_width*scale,img_height*scale) ;
  // slider_horizontal.value=img_Paddingleft;
  // slider_vertical.value=img_PaddingTop;
$("#vertical01").slider("setValue",-img_PaddingTop);
$("#horizontal01").slider("setValue",-img_Paddingleft);
//更新进度条
$.ajax({
    url: '/folder/label_count/' + folder_id,
    type: 'get',
    dataType: 'json',
    success: function (data) {
        _track = document.getElementById("scroll_Track");
        _track.style.width = ((data.labeled / data._count) * 100) + '%';
        $("#scrollBarTxt").html(data.labeled + "/" + data._count);
        // console.log(JSON.stringify(data));
        // console.log(JSON.stringify(data));
        console.log(JSON.stringify(data.images[current_index]));
        if(data.images[current_index].labeled == true){
            // $(".tagg_results").html("分类信息:"+data.images[current_index].type);
            canvas_rect = document.getElementById("canvas_rect");
            ctx = canvas_rect.getContext("2d");
            canvas_rect.height=canvas_rect.height;

            for(var i=0; i<data.images[current_index].labels.length;i++){
                ctx.strokeStyle="red";
                ctx.rect(data.images[current_index].labels[i].x,data.images[current_index].labels[i].y,data.images[current_index].labels[i].width,data.images[current_index].labels[i].height);
                ctx.stroke();
                indexRectesofVue=(data.images[current_index].labels.length-1)+"Rectes";
                sign_context.items.push({ name:data.images[current_index].labels[i].name,id:indexRectesofVue,classify:data.images[current_index].labels[i].label_type});
            }
            $("#save_as").css("display","none");
        }else{
            $("#save_as").css("display","inline-block");

        }
    },
    error: function (xhr) {
        //console.error('出错了');
    }
});
  console.log("scale:"+scale);
    }
};
$("#previous").on("click",function(){
  if (current_index>0)
  {
   current_index-=1;
    imageLoad(current_index);
    sign_context.items.splice(0, sign_context.items.length);
    points=[];
    circles=[];
    rects=[];
  }else{
      alert("已经是第一张！")
  }

});
$("#next").on("click",function(){
  if (current_index<img_files.length-1)
  {
   current_index+=1;
    imageLoad(current_index);
    sign_context.items.splice(0, sign_context.items.length);
    points=[];
    circles=[];
    rects=[];

  }else{
    alert("已经是最后一张！")
}
});
$("#enlargement").on("click",function(){
  var widthpre=imgLoad.width*scale;
  var widthnext,shrinkscale;
  if (scale<=3) {
    scale+=0.1;
    widthnext=imgLoad.width*scale;
    shrinkscale=widthnext/widthpre;
    var canvas = document.getElementById("canvas");
    var context=canvas.getContext("2d");
    context.clearRect(0 , 0 , canvas.width , canvas.height);
    var canvas_rect = document.getElementById("canvas_rect");
    var context_rect = canvas_rect.getContext("2d");
    context_rect.clearRect(0 , 0 , canvas.width , canvas.height);
    var canvas_line = document.getElementById("canvas_line");
    var context_line = canvas_line.getContext("2d");
    context_line.clearRect(0 , 0 , canvas.width , canvas.height);
    // context.strokeRect(-20,-20,20,20);
    /*矩形操作--*/
    for (var i = 0; i < rects.length; i++) {
      //选中颜色
      var offsetX=rects[i].x-img_Paddingleft;
      var offsetY=rects[i].y-img_PaddingTop;
      var newOffsetx=offsetX*shrinkscale;
      var newOffsety=offsetY*shrinkscale;
      //img_Paddingleft-imgLoad.width/20是padding-width*0.1/2,因为每次都放大原图尺寸的0.1倍
      rects[i].x=newOffsetx+img_Paddingleft-imgLoad.width/20;
      rects[i].y=newOffsety+img_PaddingTop-imgLoad.height/20;
      rects[i].width=(rects[i].width)*shrinkscale;
      rects[i].height=(rects[i].height)*shrinkscale;
      context_rect.strokeRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
      context_rect.fillStyle="#F00";/*设置填充颜色*/
      context_rect.fillRect(rects[i].x-5,rects[i].y-5,10,10);
      context_rect.fillRect(rects[i].x+rects[i].width-5,rects[i].y+rects[i].height-5,10,10);
    }
    /*  */
    /*多边形操作 circle_array[[circles],[circles],[circles]]*/
    for (var i = 0; i < circle_array.length; i++) {
      for (var j = 0; j < circle_array[i].length; j++)
      {
        var offsetX=circle_array[i][j].x-img_Paddingleft;
        var offsetY=circle_array[i][j].y-img_PaddingTop;
        var newOffsetx=offsetX*shrinkscale;
        var newOffsety=offsetY*shrinkscale;
        circle_array[i][j].x=newOffsetx+img_Paddingleft-imgLoad.width/20;
        circle_array[i][j].y=newOffsety+img_PaddingTop-imgLoad.height/20;
        var circle = circle_array[i][j];
        // 绘制圆圈
        context_line.globalAlpha = 0.85;
        context_line.beginPath();
        context_line.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
        context_line.fillStyle = circle.color;
        context_line.strokeStyle = "black";
        context_line.fill();
        context_line.stroke();
      }
    }
    /*画线*/
    for (var i = 0; i < polygon_array.length; i++) {
      var offsetX=polygon_array[i][0].x-img_Paddingleft;
      var offsetY=polygon_array[i][0].y-img_PaddingTop;
      var newOffsetx=offsetX*shrinkscale;
      var newOffsety=offsetY*shrinkscale;
      polygon_array[i][0].x=newOffsetx+img_Paddingleft-imgLoad.width/20;
      polygon_array[i][0].y=newOffsety+img_PaddingTop-imgLoad.height/20;
      context_line.beginPath();
      context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
      for (var j = 1; j < polygon_array[i].length; j++) {
        var offsetX01=polygon_array[i][j].x-img_Paddingleft;
        var offsetY01=polygon_array[i][j].y-img_PaddingTop;
        var newOffsetx01=offsetX01*shrinkscale;
        var newOffsety01=offsetY01*shrinkscale;
        polygon_array[i][j].x=newOffsetx01+img_Paddingleft-imgLoad.width/20;
        polygon_array[i][j].y=newOffsety01+img_PaddingTop-imgLoad.height/20;
        context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
      }
      context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
      context_line.strokeStyle="#9d4dca";
      context_line.stroke();
    }
    /*    */
    img_Paddingleft=img_Paddingleft-imgLoad.width/20;
    img_PaddingTop=img_PaddingTop-imgLoad.height/20;
    context_rect.lineWidth = 1;
    //这里涉及img_Paddingleft、img_PaddingTop，并不是鼠标移动量，不能采用老的方法绘制
    //绘制图片写在最后是因为，先让img_PaddingTop，Left发生变化在放大缩小
    $("#vertical01").slider("setValue",-img_PaddingTop);
    $("#horizontal01").slider("setValue",-img_Paddingleft);
    context.drawImage (imgLoad,img_Paddingleft,img_PaddingTop,imgLoad.width*scale,imgLoad.height*scale) ;
  }
});
$("#shrink").on("click",function(){
  var widthpre=imgLoad.width*scale;
  var widthnext,shrinkscale;
  if (scale>=0.2) {
    scale-=0.1;
    widthnext=imgLoad.width*scale;
    shrinkscale=widthnext/widthpre;
    var canvas = document.getElementById("canvas");
    var context=canvas.getContext("2d");
    context.clearRect(0 , 0 , canvas.width , canvas.height);
    var canvas_rect = document.getElementById("canvas_rect");
    var context_rect = canvas_rect.getContext("2d");
    context_rect.clearRect(0 , 0 , canvas.width , canvas.height);
    var canvas_line = document.getElementById("canvas_line");
    var context_line = canvas_line.getContext("2d");
    context_line.clearRect(0 , 0 , canvas.width , canvas.height);
    /*矩形操作*/
    for (var i = 0; i < rects.length; i++) {
      //选中颜色
      var offsetX=rects[i].x-img_Paddingleft;
      var offsetY=rects[i].y-img_PaddingTop;
      var newOffsetx=offsetX*shrinkscale;
      var newOffsety=offsetY*shrinkscale;
      rects[i].x=newOffsetx+img_Paddingleft+imgLoad.width/20;
      rects[i].y=newOffsety+img_PaddingTop+imgLoad.height/20;
      rects[i].width=(rects[i].width)*shrinkscale;
      rects[i].height=(rects[i].height)*shrinkscale;
      context_rect.strokeRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
      context_rect.fillStyle="#F00";/*设置填充颜色*/
      context_rect.fillRect(rects[i].x-5,rects[i].y-5,10,10);
      context_rect.fillRect(rects[i].x+rects[i].width-5,rects[i].y+rects[i].height-5,10,10);
    }
    /*  */
    /*多边形操作 circle_array[[circles],[circles],[circles]]*/
    for (var i = 0; i < circle_array.length; i++) {
      for (var j = 0; j < circle_array[i].length; j++)
      {
        var offsetX=circle_array[i][j].x-img_Paddingleft;
        var offsetY=circle_array[i][j].y-img_PaddingTop;
        var newOffsetx=offsetX*shrinkscale;
        var newOffsety=offsetY*shrinkscale;
        circle_array[i][j].x=newOffsetx+img_Paddingleft+imgLoad.width/20;
        circle_array[i][j].y=newOffsety+img_PaddingTop+imgLoad.height/20;
        var circle = circle_array[i][j];
        // 绘制圆圈
        context_line.globalAlpha = 0.85;
        context_line.beginPath();
        context_line.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
        context_line.fillStyle = circle.color;
        context_line.strokeStyle = "black";
        context_line.fill();
        context_line.stroke();
      }
    }
    /*画线*/
    for (var i = 0; i < polygon_array.length; i++) {
      var offsetX=polygon_array[i][0].x-img_Paddingleft;
      var offsetY=polygon_array[i][0].y-img_PaddingTop;
      var newOffsetx=offsetX*shrinkscale;
      var newOffsety=offsetY*shrinkscale;
      polygon_array[i][0].x=newOffsetx+img_Paddingleft+imgLoad.width/20;
      polygon_array[i][0].y=newOffsety+img_PaddingTop+imgLoad.height/20;
      context_line.beginPath();
      context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
      for (var j = 1; j < polygon_array[i].length; j++) {
        var offsetX01=polygon_array[i][j].x-img_Paddingleft;
        var offsetY01=polygon_array[i][j].y-img_PaddingTop;
        var newOffsetx01=offsetX01*shrinkscale;
        var newOffsety01=offsetY01*shrinkscale;
        polygon_array[i][j].x=newOffsetx01+img_Paddingleft+imgLoad.width/20;
        polygon_array[i][j].y=newOffsety01+img_PaddingTop+imgLoad.height/20;
        context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
      }
      context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
      context_line.strokeStyle="#9d4dca";
      context_line.stroke();
    }
    /*        */
    img_Paddingleft=img_Paddingleft+imgLoad.width/20;
    img_PaddingTop=img_PaddingTop+imgLoad.height/20;
    context_rect.lineWidth = 1;
    $("#vertical01").slider("setValue",-img_PaddingTop);
    $("#horizontal01").slider("setValue",-img_Paddingleft);
    context.drawImage (imgLoad,img_Paddingleft,img_PaddingTop,imgLoad.width*scale,imgLoad.height*scale) ;
  }
});

//水平滑动条移动
function horizontal(value){
    var canvas = document.getElementById("canvas");
    var context=canvas.getContext("2d");
    var canvas_rect = document.getElementById("canvas_rect");
    var context_rect = canvas_rect.getContext("2d");
    var canvas_line = document.getElementById("canvas_line");
    var context_line = canvas_line.getContext("2d");
    if ((rects.length===0)&&(polygon_array.length===0)&&(circle_array.length===0)) {
      //大坑啊 滑动条的值是一个string。。。。。。。。。。。。。。。。。。。。。。。。。。
      // img_Paddingleft=parseInt(slider_horizontal.value);
      img_Paddingleft=-value;
      context.clearRect (0 , 0 , canvas_width , canvas_height ) ;
      context.drawImage (imgLoad,img_Paddingleft,img_PaddingTop,imgLoad.width*scale,imgLoad.height*scale);
      return;
    }
    //矩形
    for (var i = 0; i < rects.length; i++) {
      var offsetX=rects[i].x-img_Paddingleft;
      rects[i].x=offsetX;
    }
    //画线
    for (var i = 0; i < polygon_array.length; i++) {
      for (var j = 0; j < polygon_array[i].length; j++) {
        var offsetX=polygon_array[i][j].x-img_Paddingleft;
        polygon_array[i][j].x=offsetX;
      }
    }
    //画点
    for (var i = 0; i < circle_array.length; i++) {
      for (var j = 0; j < circle_array[i].length; j++) {
        var offsetX=circle_array[i][j].x-img_Paddingleft;
        circle_array[i][j].x=offsetX;
      }
    }
    img_Paddingleft=-value;
    context.clearRect (0 , 0 , canvas_width , canvas_height ) ;
    context_rect.clearRect (0 , 0 , canvas_width , canvas_height ) ;
    context_line.clearRect(0 , 0 , canvas.width , canvas.height);
    context.drawImage (imgLoad,img_Paddingleft,img_PaddingTop,imgLoad.width*scale,imgLoad.height*scale) ;
    //画矩形
    for (var i = 0; i < rects.length; i++) {
       rects[i].x=rects[i].x+img_Paddingleft;
      context_rect.strokeRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
      context_rect.fillStyle="#F00";/*设置填充颜色*/
      context_rect.fillRect(rects[i].x-5,rects[i].y-5,10,10);
      context_rect.fillRect(rects[i].x+rects[i].width-5,rects[i].y+rects[i].height-5,10,10);
    }
    //画点
    for (var i = 0; i < circle_array.length; i++) {
      for (var j = 0; j < circle_array[i].length; j++) {
         circle_array[i][j].x=circle_array[i][j].x+img_Paddingleft;
         var circle = circle_array[i][j];
         // 绘制圆圈
         context_line.globalAlpha = 0.85;
         context_line.beginPath();
         context_line.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
         context_line.fillStyle = circle.color;
         context_line.strokeStyle = "black";
         context_line.fill();
         context_line.stroke();
      }
    }
    /*画线*/
    for (var i = 0; i < polygon_array.length; i++) {
      polygon_array[i][0].x=polygon_array[i][0].x+img_Paddingleft;
      context_line.beginPath();
      context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
      for (var j = 1; j < polygon_array[i].length; j++) {
        polygon_array[i][j].x=polygon_array[i][j].x+img_Paddingleft;
        context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
      }
      context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
      context_line.strokeStyle="#9d4dca";
      context_line.stroke();
    }
};
//垂直滑动条
function vertical(value){
  var canvas = document.getElementById("canvas");
    var context=canvas.getContext("2d");
    var canvas_rect = document.getElementById("canvas_rect");
    var context_rect = canvas_rect.getContext("2d");
    if ((rects.length===0)&&(polygon_array.length===0)&&(circle_array.length===0)) {
      // img_PaddingTop=parseInt(slider_vertical.value);
      img_PaddingTop=-value;
      context.clearRect (0 , 0 , canvas_width , canvas_height ) ;
      context.drawImage (imgLoad,img_Paddingleft,img_PaddingTop,imgLoad.width*scale,imgLoad.height*scale);
      return;
    }
    for (var i = 0; i < rects.length; i++) {
      var offsetY=rects[i].y-img_PaddingTop;
      rects[i].y=offsetY;
    }
    //画线
    for (var i = 0; i < polygon_array.length; i++) {
      for (var j = 0; j < polygon_array[i].length; j++) {
        var offsetY=polygon_array[i][j].y-img_PaddingTop;
        polygon_array[i][j].y=offsetY;
      }
    }
    //画点
    for (var i = 0; i < circle_array.length; i++) {
      for (var j = 0; j < circle_array[i].length; j++) {
        var offsetY=circle_array[i][j].y-img_PaddingTop;
        circle_array[i][j].y=offsetY;
      }
    }
   // img_PaddingTop=parseInt(slider_vertical.value);
      img_PaddingTop=-value;
    context.clearRect (0 , 0 , canvas_width , canvas_height ) ;
    context_rect.clearRect (0 , 0 , canvas_width , canvas_height ) ;
      context_line.clearRect(0 , 0 , canvas.width , canvas.height);
    context.drawImage (imgLoad,img_Paddingleft,img_PaddingTop,imgLoad.width*scale,imgLoad.height*scale);

    for (var i = 0; i < rects.length; i++) {
       rects[i].y=rects[i].y+img_PaddingTop;
      context_rect.strokeRect(rects[i].x,rects[i].y,rects[i].width,rects[i].height);
      context_rect.fillStyle="#F00";/*设置填充颜色*/
      context_rect.fillRect(rects[i].x-5,rects[i].y-5,10,10);
      context_rect.fillRect(rects[i].x+rects[i].width-5,rects[i].y+rects[i].height-5,10,10);
    }
    //画点
    for (var i = 0; i < circle_array.length; i++) {
      for (var j = 0; j < circle_array[i].length; j++) {
         circle_array[i][j].y=circle_array[i][j].y+img_PaddingTop;
         var circle = circle_array[i][j];
         // 绘制圆圈
         context_line.globalAlpha = 0.85;
         context_line.beginPath();
         context_line.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
         context_line.fillStyle = circle.color;
         context_line.strokeStyle = "black";
         context_line.fill();
         context_line.stroke();
      }
    }
    /*画线*/
    for (var i = 0; i < polygon_array.length; i++) {
      polygon_array[i][0].y=polygon_array[i][0].y+img_PaddingTop;
      context_line.beginPath();
      context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
      for (var j = 1; j < polygon_array[i].length; j++) {
        polygon_array[i][j].y=polygon_array[i][j].y+img_PaddingTop;
        context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
      }
      context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
      context_line.strokeStyle="#9d4dca";
      context_line.stroke();
    }
}
