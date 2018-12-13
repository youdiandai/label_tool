//一个不规则，多个不规则动态创建多个circles、points类
//index=0,档第一个闭合后，index+=1
//circles数组的名字为"circle"+index;
 var canvas_line = document.getElementById("canvas_line");
 var context_line=canvas_line.getContext("2d");
 //
 var polygon_array=[];
 var circle_array=[];

 var points=[];
 var circles=[];
 var isDragging = false;
 var index=-1;
 var previousSelectedCircle_line;
 var imgLoad = new Image();

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
      this.color = "blue";
      this.isSelected = false;
   }
function Draw_Line(){

   canvas_line.onmousedown=function(e){
     var clickX = e.pageX - canvas_line.offsetLeft;
     var clickY = e.pageY - canvas_line.offsetTop;
     //判断当前点击点是否在已经绘制的圆圈上，如果是执行相关操作，并return，不进入画线的代码
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
              console.log(points);
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
          console.log(index);
          console.log(123);
          isDragging=true;
          //停止搜索
          return;
        }
      }

    // context_line.clearRect(0,0,canvas_line.width,canvas_line.height);
    //遍历数组画圆
     var circle=new Circle(clickX,clickY);
     circles.push(circle);
     circles[0].color="green";
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
     console.log(points);
     context_line.beginPath();
    // context_line.lineW idth=5;
     context_line.lineWidth = 4;
     context_line.moveTo(points[0].x,points[0].y);
     for (var i = 0; i < points.length; i++) {
       context_line.lineTo(points[i].x, points[i].y);
     }
     context_line.fillStyle="#cccc66";
     context_line.fill();
     context_line.strokeStyle="#9d4dca";
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
          console.log(index);
          circles[index].x=x1;
          circles[index].y=y1;
          points[index].x=x1;
          points[index].y=y1;
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
            context_line.moveTo(polygon_array[i].x,polygon_array[i].y);
            for (var j = 0; j < polygon_array[i].length; j++) {
              context_line.lineTo(polygon_array[i][j].x, polygon_array[i][j].y);
            }
            context_line.lineTo(polygon_array[i].x,polygon_array[i].y);
            // context_line.fillStyle="#831f68";
            context_line.fillStyle="#cccc66";
            context_line.fill();
            context_line.strokeStyle="#9d4dca";
            context_line.stroke();
          }
          ////
          // for(var i=0; i<circles.length; i++) {
          //    var circle = circles[i];
          //    // 绘制圆圈
          //    context_line.globalAlpha = 0.85;
          //    context_line.beginPath();
          //    context_line.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
          //    context_line.fillStyle = circle.color;
          //    context_line.strokeStyle = "black";
          //    context_line.fill();
          //    context_line.stroke();
          //  }
          // context_line.beginPath();
          // context_line.moveTo(points[0].x,points[0].y);
          // for (var i = 0; i < points.length; i++) {
          //   context_line.lineTo(points[i].x, points[i].y);
          // }
          // context_line.lineTo(points[0].x,points[0].y);
          // // context_line.fillStyle="#831f68";
          // context_line.fillStyle="#cccc66";
          // context_line.fill();
          // context_line.strokeStyle="#9d4dca";
          // context_line.stroke();
          };
        }
      };

      canvas_line.onmouseup=function(){
        isDragging=false;
      };

      canvas_line.onmouseout=function(){
        isDragging=false;
      };

};
// $("#success").on("click",function(){
//   var classify=$("#classify").val();
//   var name=$("#sign_name").val();
//   console.log(classify);
//   //最少三个点一个三角形
//   if (points.length>=3) {
//     polygon_array.push([].concat(points));
//     var polygon=new polygon_points(points);
//     sign_Information.push(polygon);
//     console.log(sign_Information);
//     //更新vue数组
//     sign_context_line.items.push({ name:name,id:name,classify:classify});
//     // console.log(sign_context_line)
//   }
//   $("#classify").val("");
//   $("#sign_name").val("");
//   points=[];
//   $(".tool_tip").get(0).style.display="none";
//   $(".theme-popover-mask").get(0).style.display="none";
//   $(".tool_tip").removeClass("top");
// });
