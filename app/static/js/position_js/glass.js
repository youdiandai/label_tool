/*
放大镜部分交互
*/

var canvas_img = document.getElementById("canvas");
 var canvas_line = document.getElementById("canvas_line");
$("#glass").on("click",function(){
  canvas_img.style.zIndex="4";
  document.getElementById("canvas_bezier").style.zIndex="3";
  document.getElementById("canvas_line").style.zIndex="2";
  document.getElementById("canvas_rect").style.zIndex="1";
  document.getElementById("glasscan").style.zIndex="5";
});
var glasscan = document.getElementById("glasscan"),
    imgContext = canvas_img.getContext("2d"),
    glassContext = glasscan.getContext("2d"),
    mouse = captureMouse(canvas_img);

//获取元素内鼠标位置
function captureMouse(element){
    var  mouse = {x:0 , y:0};
    element.addEventListener('mousemove' , function(event){
    var x , y;
    if(event.pageX || event.pageY){
        x = event.pageX;
        y = event.pageY;
    }else{
        x = event.clientX + (document.body.scrollLeft ||
        document.documentElement.scrollLeft);
        y = event.clientY + (document.body.scrollTop ||
        document.documentElement.scrollTop);
    }
    x -= element.offsetLeft;
    y -= element.offsetTop;
    mouse.x = x;
    mouse.y = y;
  } , false);

    return mouse;
}
//给画布绑定鼠标移动事件
canvas_img.onmousemove = function(){
        console.log(mouse)
        glassContext.clearRect(0,0,glasscan.width,glasscan.height);
        glasscan.style.left = mouse.x + 100+ 'px';
        glasscan.style.top = mouse.y + 65 + 'px';
        glasscan.style.display = "block";
        // document.getElementById("show").innerText = mouse.x + '|' + mouse.y;     //显示鼠标位置
        var drawWidth = 50,
            drawHeight = 50;
        glassContext.drawImage(imgLoad,(mouse.x-drawWidth/4-img_Paddingleft)/scale,(mouse.y-drawHeight/4-img_PaddingTop)/scale,drawWidth,drawHeight,0,0,drawWidth*3,drawHeight*3);     //实现放大镜
        // mouse.x-drawWidth/4-img_Paddingleft 鼠标位置-padding才是图片的起始点 也就是说当鼠标移动到(img_Paddingleft,img_PaddingTop)这个点，才是真实图像的00位置
        //得到点/scale才是原图上的点

};
//绑定
canvas_img.onmouseout = function(){
  console.log(123);
        glasscan.style.display = "none";
};

canvas_line.onmousemove = function(){
console.log(1236);
};
canvas_line.onmouseout = function(){
  console.log(123);
};
