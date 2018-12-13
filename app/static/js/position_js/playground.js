/*
贝塞尔曲线脚本，来自开源项目，源码不是太懂，只需要提供绘制曲线的canvas就可以使用
*/
var canvas_bezier = document.getElementById('canvas_bezier')
var ctx_bezier = canvas_bezier.getContext('2d')
var t = 0 //贝塞尔函数涉及的占比比例，0<=t<=1
var clickNodes = [] //点击的控制点对象数组
var bezierNodes = [] //绘制内部控制点的数组
var isPrinted = false //当前存在绘制的曲线
var isPrinting = false //正在绘制中
var num = 0 //控制点数
var isDrag = false //是否进入拖拽行为
var isDragNode = false //是否点击到了控制点
var dragIndex = 0 //被拖拽的点的索引
var clickon = 0 //鼠标按下时间戳
var clickoff = 0 //鼠标抬起
$("#bezier_div").on("click",function(){
  document.getElementById("canvas").style.zIndex="3";
  document.getElementById("canvas_rect").style.zIndex="2";
  document.getElementById("canvas_line").style.zIndex="1";
  document.getElementById("canvas_bezier").style.zIndex="4";
  document.getElementById("glasscan").style.zIndex="0";
  $("#print").get(0).style.display="block";
  $("#clear").get(0).style.display="block";
});
//鼠标按下遍历节点绘制点
$(canvas_bezier).mousedown(function(e){
    isDrag = true
    clickon = new Date().getTime()
    var diffLeft = $(this).offset().left,
        diffTop = $(this).offset().top,
        clientX = e.clientX,
        clientY = e.clientY,
        x = clientX - diffLeft,
        y = clientY - diffTop
    clickNodes.forEach(function(item, index) {
        var absX = Math.abs(item.x - x),
            absY = Math.abs(item.y - y)
        if(absX < 5 && absY < 5) {
            isDragNode = true
            dragIndex = index
        }
    })
}).mousemove(function(e) {//移动的时候，根据鼠标位置绘制线
    if(isDrag && isDragNode) {
        var diffLeft = $(this).offset().left,
        diffTop = $(this).offset().top,
        clientX = e.clientX,
        clientY = e.clientY,
        x = clientX - diffLeft,
        y = clientY - diffTop
        clickNodes[dragIndex] = {
            x: x,
            y: y
        }
        ctx_bezier.clearRect(0, 0, canvas_bezier.width, canvas_bezier.height)
        clickNodes.forEach(function(item, index) {
            var x = item.x,
                y = item.y,
                i = parseInt(index, 10) + 1
            ctx_bezier.fillText("p" + i, x, y + 20)
            ctx_bezier.fillText("p" + i + ': ('+ x +', '+ y +')', 10, i * 20)
            ctx_bezier.beginPath()
            ctx_bezier.arc(x, y, 4, 0, Math.PI * 2, false)
            ctx_bezier.fill()
            ctx_bezier.beginPath()
            ctx_bezier.moveTo(startX, startY)
            ctx_bezier.lineTo(x, y)
            ctx_bezier.strokeStyle = '#696969'
            ctx_bezier.stroke()
            if (index) {
                var startX = clickNodes[index - 1].x,
                    startY = clickNodes[index - 1].y
                ctx_bezier.beginPath()
                ctx_bezier.moveTo(startX, startY)
                ctx_bezier.lineTo(x, y)
                ctx_bezier.stroke()
            }
        })
        if(isPrinted) {
            var bezierArr = []
            for(i = 0; i < 1; i+=0.01) {
                bezierArr.push(bezier(clickNodes, i))
            }
            bezierArr.forEach(function(obj, index) {
                if (index) {
                    var startX = bezierArr[index - 1].x,
                        startY = bezierArr[index - 1].y,
                        x = obj.x,
                        y = obj.y
                    ctx_bezier.beginPath()
                    ctx_bezier.moveTo(startX, startY)
                    ctx_bezier.lineTo(x, y)
                    ctx_bezier.strokeStyle = 'red'
                    ctx_bezier.stroke()
                }
            })
        }
    }
}).mouseup(function(e) {
    isDrag = false
    isDragNode = false
    clickoff = new Date().getTime()
    if(clickoff - clickon < 200) {
        var diffLeft = $(this).offset().left,
        diffTop = $(this).offset().top,
        clientX = e.clientX,
        clientY = e.clientY
        x = clientX - diffLeft,
        y = clientY - diffTop
        if(!isPrinted && !isDragNode) {
            num++
            var ctx_bezier = canvas_bezier.getContext('2d')
            ctx_bezier.font = "16px Microsoft YaHei";
            ctx_bezier.fillStyle = '#696969'
            ctx_bezier.fillText("p" + num, x, y + 20);
            ctx_bezier.fillText("p" + num + ': ('+ x +', '+ y +')', 10, num * 20)
            ctx_bezier.beginPath()
            ctx_bezier.arc(x, y, 4, 0, Math.PI * 2, false)
            ctx_bezier.fill()
            if(clickNodes.length) {
                var startX = clickNodes[clickNodes.length - 1].x,
                    startY = clickNodes[clickNodes.length - 1].y
                ctx_bezier.beginPath()
                ctx_bezier.moveTo(startX, startY)
                ctx_bezier.lineTo(x, y)
                ctx_bezier.strokeStyle = '#696969'
                ctx_bezier.stroke()
            }
            clickNodes.push({
                x: x,
                y: y
            })
        }
    }
})
$('#print').click(function() {
    if(!num) return
    if(!isPrinting) {
        isPrinted = true
        drawBezier(ctx_bezier, clickNodes)
    }
})
$('#clear').click(function() {
    if(!isPrinting) {
        isPrinted = false
        ctx_bezier.clearRect(0, 0, canvas_bezier.width, canvas_bezier.height)
        clickNodes = []
        bezierNodes = []
        t = 0
        num = 0
    }
})

function drawBezier(ctx_bezier, origin_nodes) {
    if(t > 1) {
        isPrinting = false
        return
    }
    isPrinting = true
    var nodes = origin_nodes
    t += 0.01
    ctx_bezier.clearRect(0, 0, canvas_bezier.width, canvas_bezier.height)
    drawnode(nodes)
    window.requestAnimationFrame(drawBezier.bind(this, ctx_bezier, nodes))
}
function drawnode(nodes) {
    if(!nodes.length) return
    var _nodes = nodes
    var next_nodes = []
    _nodes.forEach(function(item, index) {
        var x = item.x,
            y = item.y
        if(_nodes.length === num) {
            ctx_bezier.font = "16px Microsoft YaHei"
            var i = parseInt(index, 10) + 1
            ctx_bezier.fillText("p" + i, x, y + 20)
            ctx_bezier.fillText("p" + i + ': ('+ x +', '+ y +')', 10, i * 20)
        }
        ctx_bezier.beginPath()
        ctx_bezier.arc(x, y, 4, 0, Math.PI * 2, false)
        ctx_bezier.fill()
        if(_nodes.length === 1) {
            bezierNodes.push(item)
            if(bezierNodes.length > 1) {
                bezierNodes.forEach(function (obj, i) {
                    if (i) {
                        var startX = bezierNodes[i - 1].x,
                            startY = bezierNodes[i - 1].y,
                            x = obj.x,
                            y = obj.y
                        ctx_bezier.beginPath()
                        ctx_bezier.moveTo(startX, startY)
                        ctx_bezier.lineTo(x, y)
                        ctx_bezier.strokeStyle = 'red'
                        ctx_bezier.stroke()
                    }
                })
            }
        }
        if(index) {
            var startX = _nodes[index - 1].x,
                startY = _nodes[index - 1].y
            ctx_bezier.beginPath()
            ctx_bezier.moveTo(startX, startY)
            ctx_bezier.lineTo(x, y)
            ctx_bezier.strokeStyle = '#696969'
            ctx_bezier.stroke()
        }
    })
    if(_nodes.length) {
        for(var i = 0; i < _nodes.length - 1; i++) {
            var arr = [{
                x: _nodes[i].x,
                y: _nodes[i].y
            }, {
                x: _nodes[i + 1].x,
                y: _nodes[i + 1].y
            }]
            next_nodes.push(bezier(arr, t))
        }
        drawnode(next_nodes)
    }

}
function factorial(num) { //递归阶乘
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

function bezier(arr, t) { //通过各控制点与占比t计算当前贝塞尔曲线上的点坐标
    var x = 0,
        y = 0,
        n = arr.length - 1
    arr.forEach(function(item, index) {
        if(!index) {
            x += item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index)
            y += item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index)
        } else {
            x += factorial(n) / factorial(index) / factorial(n - index) * item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index)
            y += factorial(n) / factorial(index) / factorial(n - index) * item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index)
        }
    })
    return {
        x: x,
        y: y
    }
}
var getRandomColor = function(){
      return '#'+Math.floor(Math.random()*16777215).toString(16);
}
