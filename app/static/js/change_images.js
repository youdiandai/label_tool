/*
测试脚本，用于切换图像，实际没有引用
*/
var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");
function switchImg(image)
{
  var img=new Image();
  img.src=image;
  img.onload=function(){
      context.clearRect (0 , 0 , canvas.width,canvas.height ) ;
      context.drawImage (img,0,0,canvas.width,canvas.height);
        };

};
