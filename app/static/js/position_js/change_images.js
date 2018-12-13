var canvas=document.getElementById("canvas")；
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
