/*
画点线的所有交互脚本，包括绘制点与绘制线的部分。
*/
//一个不规则，多个不规则动态创建多个circles、points类
//index=0,档第一个闭合后，index+=1
//circles数组的名字为"circle"+index;
 var canvas_line = document.getElementById("canvas_line");
 var context_line=canvas_line.getContext("2d");
 //点与线的数组，线的数组也是根据点绘制
 var polygon_array=[];
 var circle_array=[];

//点与线临时的数组
 var points=[];
 var circles=[];

 var isDragging = false;
 //改变形状时的圆圈索引
 var index=-1;
 //当前圆圈拖拽点的索引
 var indexJ=-1;
 //选定圆圈
 var previousSelectedCircle_line;
 var imgLoad = new Image();
 //是否可以拖拽
 var moveCircleLine=false;
 //拖拽圆圈的索引
 var moveCircleLine_index=-1;
 //click点的的偏移量
 var offsetX=0;
 var offsetY=0;
 //鼠标拖拽与点击点的偏移量
 var moveCircleLine_x=0;
 var moveCircleLine_y=0;

 function polygon_points(arr){
   this.type="polygon";
   //当前所有点的数组
   this.arr=arr;
 };

 function Point(x, y) {
     this.x = x;
     this.y = y;

   }
 function Circle(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 5;
      this.color = "green";
      this.isSelected = false;
   }
function Draw_Line(){

   canvas_line.onmousedown=function(e){
     var clickX = e.pageX - canvas_line.offsetLeft;
     var clickY = e.pageY - canvas_line.offsetTop;
     //判断当前点击点是否在已经绘制的圆圈上，如果是执行相关操作，并return，不进入画线的代码
    if (circle_array.length>0) {
     for (var i = 0; i < circle_array.length; i++) {
       for (var j = 0; j < circle_array[i].length; j++)
       {
            var circle = circle_array[i][j];
            //使用勾股定理计算这个点与圆心之间的距离
            var distanceFromCenter = Math.sqrt(Math.pow(circle.x - clickX, 2)
                + Math.pow(circle.y - clickY, 2));
            //如果点击点为第一个点，则闭合曲线，禁止改变点位置
            var distanceFromCenter_circle0 = Math.sqrt(Math.pow(circle_array[i][0].x - clickX, 2)
                + Math.pow(circle_array[i][0].y - clickY, 2));
                if (distanceFromCenter_circle0<=circle_array[i][0].radius) {
                  //不需要再添加点
                  // var point=new Point(clickX,clickY);
                  // points.push(point);
                  context_line.beginPath();
                  context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
                  for (var a = 0; a < polygon_array[i].length; a++) {
                    context_line.lineTo(polygon_array[i][a].x, polygon_array[i][a].y);
                  }
                  context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
                  context_line.stroke();
                  // console.log("不可拖动");
                  // return;
                }
                if (distanceFromCenter <= circle.radius) {
                  // 清除之前选择的圆圈
                  if (previousSelectedCircle_line != null) previousSelectedCircle_line.isSelected = false;
                  previousSelectedCircle_line = circle;
                  index=i;
                  indexJ=j;
                  isDragging=true;
                  //开始拖动的时候，以前的没有闭合的点全部清除；
                  circles=[];
                  points=[];
                  //停止搜索
                  return;
                }

       }
     }
     /*重绘
      isPointInPath只能判断鼠标点击点是否在最后一次绘制的图形上，
      所以每点击一次，就循环重新绘制，到哪一步判断为true的时候，记录下当时这个循环的索引
     */
     context_line.clearRect(0,0,canvas_line.width,canvas_line.height);
     for (var i = 0; i < circle_array.length; i++) {
       for (var j = 0; j < circle_array[i].length; j++) {
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
     //绘制线
     for (var i = 0; i < polygon_array.length; i++) {
       context_line.beginPath();
       context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
       for (var j = 0; j < polygon_array[i].length; j++) {
         context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
       }
       context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
       if(context_line.isPointInPath(clickX,clickY)){
         offsetX=clickX;
         offsetY=clickY;
         console.log("拖动");
         //此时的i就是当前鼠标点击的图形所在的circlearry的位置
         moveCircleLine_index=i;
         console.log(moveCircleLine_index);
         moveCircleLine=true;

         context_line.fillStyle="rgba(237,208,112,0.5)";
       }
       else {
         context_line.fillStyle="rgba(237,208,112,0)";
       };
       context_line.fill();
       context_line.strokeStyle="red";
       context_line.stroke();
     }
     //等循环绘制后，在return
     if (moveCircleLine) {
       circles=[];
       points=[];
       return;
     }
}
/*逻辑：
  第一次点击形成闭合曲线之前，点和circle加入points和circles数组，当形成闭合曲线，polygon_array=points,circle_array=circles数组的名字为
   赋值后清空，保存点和circles，以后的所有判断都基于最后的两个数组。
   那么circles和points清空后，此时polygon_array和circlearray里边包含一个数组，再次点击
   还需要往circles和points加入点，然后在判断是否点击了第一项

*/
  for(var i=1; i<circles.length; i++) {
     var circle = circles[i];
     //使用勾股定理计算这个点与圆心之间的距离
     var distanceFromCenter = Math.sqrt(Math.pow(circle.x - clickX, 2)
         + Math.pow(circle.y - clickY, 2));
     //如果点击点为第一个点，则闭合曲线，禁止改变点位置
     var distanceFromCenter_circle0 = Math.sqrt(Math.pow(circles[0].x - clickX, 2)
             + Math.pow(circles[0].y - clickY, 2));
         if (distanceFromCenter_circle0<=circles[0].radius) {
           //不需要再添加点
           // var point=new Point(clickX,clickY);
           // points.push(point);
           context_line.beginPath();
           context_line.moveTo(points[0].x,points[0].y);
           for (var i = 0; i < points.length; i++) {
             context_line.lineTo(points[i].x, points[i].y);
           }
           context_line.lineTo(points[0].x,points[0].y);
           context_line.stroke();
           console.log("不可拖动");
           $(".tool_tip").get(0).style.display="block";
           $(".theme-popover-mask").get(0).style.display="block";
           if (circles[0].y<=(canvas_rect.height/2)) {
              $(".tool_tip").addClass("top");
              //-20 25是三角的大小 可修改
              $(".tool_tip").get(0).style.left=circles[0].x+canvas_rect.offsetLeft-20+"px";
              $(".tool_tip").get(0).style.top=circles[0].y+canvas_rect.offsetTop+25+"px";
           }
           else {
             //-20+25 -300位置调节 可修改
             $(".tool_tip").get(0).style.left=circles[0].x+canvas_rect.offsetLeft-20+"px";
             $(".tool_tip").get(0).style.top=circles[0].y+canvas_rect.offsetTop+25-300+"px";
            }
           return;
         }

     // 如果是其他的点，则设置可以拖动
     if (distanceFromCenter <= circle.radius) {
       // 清除之前选择的圆圈
       if (previousSelectedCircle_line != null) previousSelectedCircle_line.isSelected = false;

       previousSelectedCircle_line = circle;
       index=i;
       indexJ=j;
       isDragging=true;
       //停止搜索
       return;
     }
   }

    // context_line.clearRect(0,0,canvas_line.width,canvas_line.height);
    //遍历数组画圆
     var circle=new Circle(clickX,clickY);
     circles.push(circle);
     circles[0].color="red";
     circles[0].radius=7;
     for(var i=0; i<circles.length; i++) {
        var circle = circles[i];
        // 绘制圆圈
        context_line.globalAlpha = 0.85;
        context_line.beginPath();
        context_line.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
        context_line.fillStyle = circle.color;
        context_line.strokeStyle = "black";
        context_line.fill();
        context_line.stroke();
      }
      // 画点
     var point=new Point(clickX,clickY);
     points.push(point);
     context_line.beginPath();
    // context_line.lineWidth=5;
     context_line.lineWidth = 2;
     context_line.moveTo(points[0].x,points[0].y);
     for (var i = 0; i < points.length; i++) {
       context_line.lineTo(points[i].x, points[i].y);
     }
     // context_line.fillStyle="#cccc66";
     // context_line.fill();
     context_line.strokeStyle="red";
     context_line.stroke();
   };
   canvas_line.onmousemove=function(e){
      // 判断圆圈是否开始拖拽
      if (isDragging == true) {
        // 判断拖拽对象是否存在
        if (previousSelectedCircle_line != null) {
          // 取得鼠标位置
          var x1 = e.pageX - canvas_line.offsetLeft;
          var y1 = e.pageY - canvas_line.offsetTop;
          context_line.clearRect(0,0,canvas_line.width,canvas_line.height);
          circle_array[index][indexJ].x=x1;
          circle_array[index][indexJ].y=y1;
          polygon_array[index][indexJ].x=x1;
          polygon_array[index][indexJ].y=y1;
          for (var i = 0; i < circle_array.length; i++) {
            for (var j = 0; j < circle_array[i].length; j++) {
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
          for (var i = 0; i < polygon_array.length; i++) {
            context_line.beginPath();
            context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
            for (var j = 0; j < polygon_array[i].length; j++) {
              context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
            }
            context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
            context_line.strokeStyle="red";
            context_line.stroke();
          }
          };
        }  //拖拽图形
        else if (moveCircleLine) {
          //开始拖动多边形
          var x1 = e.pageX - canvas_line.offsetLeft;
          var y1 = e.pageY - canvas_line.offsetTop;
          //鼠标移动的距离与点击的偏移量
          moveCircleLine_x=x1-offsetX;
          moveCircleLine_y=y1-offsetY;
          context_line.clearRect(0,0,canvas_line.width,canvas_line.height);
          /*拖动时
            不能直接用
            for (var i = 0; i < circle_array.length; i++) {
               for (var j = 0; j < circle_array[i].length; j++) {
                 circle_array[i][j].x=circle_array[i][j].x+moveCircleLine_x
               }
            }
            按照上面的方法写，机器每移动一次会执行n次for循环，相当于游戏开发中的一帧内多次执行for
            具体多少次机器性能定，所以每执行一次那么就会+moveCircleLine_x,那x会无限大或者无限小。
          */
          //先根据鼠标位置直接画点，不赋值操作，等到鼠标up的时候，在赋值，up只有一次，onmousemove有n次
        for (var i = 0; i < circle_array[moveCircleLine_index].length; i++) {
          var circle = circle_array[moveCircleLine_index][i];
          // 绘制圆圈
          context_line.globalAlpha = 0.85;
          context_line.beginPath();
          context_line.arc(circle.x+moveCircleLine_x, circle.y+moveCircleLine_y, circle.radius, 0, Math.PI*2);
          context_line.fillStyle = circle.color;
          context_line.strokeStyle = "black";
          context_line.fill();
          context_line.stroke();
        }
          for (var i = 0; i < circle_array.length; i++) {
            if (i==moveCircleLine_index) {
              continue;
            }
            for (var j = 0; j < circle_array[i].length; j++) {
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
            //先根据鼠标位置直接画线，不赋值操作，等到鼠标up的时候，在赋值，up只有一次，onmousemove有n次
          context_line.beginPath();
          context_line.moveTo(polygon_array[moveCircleLine_index][0].x+moveCircleLine_x,polygon_array[moveCircleLine_index][0].y+moveCircleLine_y);
          for (var i = 1; i < polygon_array[moveCircleLine_index].length; i++) {
            context_line.lineTo(polygon_array[moveCircleLine_index][i].x+moveCircleLine_x, polygon_array[moveCircleLine_index][i].y+moveCircleLine_y);
          }
          context_line.fillStyle="rgba(237,208,112,0.5)";
          context_line.lineTo(polygon_array[moveCircleLine_index][0].x+moveCircleLine_x,polygon_array[moveCircleLine_index][0].y+moveCircleLine_y);
          context_line.fill();
          context_line.strokeStyle="red";
          context_line.stroke();

          for (var i = 0; i < polygon_array.length; i++) {
            if (i==moveCircleLine_index) {
              continue;
            }
            context_line.beginPath();
            context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
            for (var j = 0; j < polygon_array[i].length; j++) {
              context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
            }
            context_line.fillStyle="rgba(237,208,112,0)";
            context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
            context_line.fill();
            context_line.strokeStyle="red";
            context_line.stroke();
          }
        }
      };

      canvas_line.onmouseup=function(){
        isDragging=false;
        moveCircleLine=false;
        //鼠标抬起，根据鼠标相对于点击位置的偏移量赋值
        if (moveCircleLine_index>=0) {
          for (var i = 0; i < circle_array[moveCircleLine_index].length; i++) {
            circle_array[moveCircleLine_index][i].x=circle_array[moveCircleLine_index][i].x+moveCircleLine_x;
            circle_array[moveCircleLine_index][i].y=circle_array[moveCircleLine_index][i].y+moveCircleLine_y;
          }
          for (var i = 0; i < polygon_array[moveCircleLine_index].length; i++) {
            polygon_array[moveCircleLine_index][i].x=polygon_array[moveCircleLine_index][i].x+moveCircleLine_x;
            polygon_array[moveCircleLine_index][i].y=polygon_array[moveCircleLine_index][i].y+moveCircleLine_y;
          }
        }
        // moveCircleLine_index=-1;
        moveCircleLine_x=0;
        moveCircleLine_y=0;
      };

      canvas_line.onmouseout=function(){
        isDragging=false;
        moveCircleLine=false;
      };

};
//刷新circles
 function refush_circleLine(indexid){
   context_line.clearRect(0,0,2000,2000);
   for (var i = 0; i < circle_array.length; i++) {
     for (var j = 0; j < circle_array[i].length; j++) {
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
   for (var i = 0; i < polygon_array.length; i++) {
     context_line.beginPath();
     context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
     if (i==indexid) {
       context_line.fillStyle="rgba(237,208,112,0.5)";
     }
     else {
       context_line.fillStyle="rgba(237,208,112,0)";
     }
     for (var j = 0; j < polygon_array[i].length; j++) {
       context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
     }
     context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
     context_line.fill();
     context_line.strokeStyle="red";
     context_line.stroke();
   }
 };
 function refush_circleLineDisable(){
  context_line.clearRect(0,0,2000,2000);
   for (var i = 0; i < circle_array.length; i++) {
     for (var j = 0; j < circle_array[i].length; j++) {
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
   for (var i = 0; i < polygon_array.length; i++) {
     context_line.beginPath();
     context_line.moveTo(polygon_array[i][0].x,polygon_array[i][0].y);
       context_line.fillStyle="rgba(237,208,112,0)";
     for (var j = 0; j < polygon_array[i].length; j++) {
       context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
     }
     context_line.lineTo(polygon_array[i][0].x,polygon_array[i][0].y);
     context_line.fill();
     context_line.strokeStyle="red";
     context_line.stroke();
   }
 };
