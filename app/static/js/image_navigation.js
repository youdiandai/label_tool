function createImageDiv(url, class_name) {
    //创建用来包含图片的div，设置img_src和img_class两个属性用来后期生成img标签
    var div = document.createElement('div');
    div.setAttribute('img_src', url);
    div.setAttribute('img_class', class_name);
    //div.appendChild(createLittleImage(url, class_name, index));
    return div
}

function createImgNavi() {
    //创建图片导航条，首先创建所有图片的imageDiv，然后加载前五张图片，并设置第一张图片为当前图片
    var div = document.getElementById('little_images');
    for (var i = 0; i < img_files.length; i++) {
        var _img_div = null;
        _img_div = createImageDiv(img_files[i], 'little_img');
        _img_div.id = 'navi_div_' + i;
        div.appendChild(_img_div);
    }
    var image_divs = div.children;
    for (var i = 0; i < 5; i++) {
        divCreateImg(image_divs[i]);
    }
    image_divs[0].children[0].style.border = 'red 4px solid';
}

function divCreateImg(div) {
    //在imageDiv标签内部创建img图片，使用div的属性，并设置图片点击后跳转
    var img = document.createElement('img');
    img.src = div.getAttribute('img_src');
    img.className = div.getAttribute('img_class');
    img.onclick = function () {
        refreshImgNavi(parseInt(img.parentElement.id.split('_')[2]));
    };
    div.appendChild(img);
}

function divCleanImg(div) {
    //清楚div中的图片
    div.innerHTML = "";
}

function divSetCurrent(div) {
    //设置div为当前div，具体表现是div加上了红色实线边框
    div.children[0].style.border = 'red 4px solid';
}

function divNotCurrent(div) {
    //设置div不再为当前div
    div.children[0].style.border = null;
}

function imgNaviNext() {
    //跳转到下一张图片，注意，没有跳转canvans中的图片，所以canvans中的图片还需要另外进行刷新，并修改current_index的值，目前在点击下一张时调用
    var index = current_index + 1;
    var images = document.getElementById('little_images').children;
    if (index < images.length) {
        for (var i = 0; i < images.length; i++) {
            divCleanImg(images[i]);
        }
        var display_img = [];
        if (index < 2) {
            for (var i = 0; i < 5; i++) {
                display_img.push(images[i]);
            }
        }
        else if (index > images.length - 3) {
            for (var i = images.length - 1; i > images.length - 6; i--) {
                display_img.push(images[i]);
            }
        }
        else {
            display_img.push(images[index]);
            display_img.push(images[index - 1]);
            display_img.push(images[index - 2]);
            display_img.push(images[index + 1]);
            display_img.push(images[index + 2]);
        }
        for (var i = 0; i < display_img.length; i++) {
            divCreateImg(display_img[i]);
        }
        divSetCurrent(images[index]);
    }
}

function viewNext() {
    //导航条向右挪动一格
    var images = document.getElementById('little_images').children;
    var showing_img = [];
    for (var i = 0; i < images.length; i++) {
        if (images[i].childElementCount > 0) {
            showing_img.push(images[i])
        }
    }
    var _next = showing_img[showing_img.length - 1].nextElementSibling;
    if (_next) {
        divCreateImg(showing_img[showing_img.length - 1].nextElementSibling);
        if (parseInt(_next.id.split('_')[2]) === current_index) {
            divSetCurrent(_next);
        }

        divCleanImg(showing_img[0])
    }
}

function viewPrev() {
    //导航条向左挪动一格
    var images = document.getElementById('little_images').children;
    var showing_img = [];
    for (var i = 0; i < images.length; i++) {
        if (images[i].childElementCount > 0) {
            showing_img.push(images[i])
        }
    }
    var _prev = showing_img[0].previousSibling;
    if (_prev) {
        divCreateImg(_prev);
        if (parseInt(_prev.id.split('_')[2]) === current_index) {
            divSetCurrent(_prev);
        }
        divCleanImg(showing_img[showing_img.length - 1])
    }
}

function refreshNext(images) {
    if (current_index > 1) {
        if (images[current_index + 3]) {
            divCreateImg(images[current_index + 3]);
            divCleanImg(images[current_index - 2]);
        }
    }
}

function imgNaviPrev() {
    //跳转到上一张图片，同imgNaviNext。
    var index = current_index - 1;
    if (index >= 0) {
        var images = document.getElementById('little_images').children;
        for (var i = 0; i < images.length; i++) {
            divCleanImg(images[i]);
        }
        var display_img = [];
        if (index < 2) {
            for (var i = 0; i < 5; i++) {
                display_img.push(images[i]);
            }
        }
        else if (index > images.length - 3) {
            for (var i = images.length - 1; i > images.length - 6; i--) {
                display_img.push(images[i]);
            }
        }
        else {
            display_img.push(images[index]);
            display_img.push(images[index - 1]);
            display_img.push(images[index - 2]);
            display_img.push(images[index + 1]);
            display_img.push(images[index + 2]);
        }
        for (var i = 0; i < display_img.length; i++) {
            divCreateImg(display_img[i]);
        }
        divSetCurrent(images[index]);
    }
}

function refreshPrev(images) {
    if (current_index < images.length - 2) {
        if (images[current_index - 3]) {
            divCreateImg(images[current_index - 3]);
            divCleanImg(images[current_index + 2]);
        }
    }

}

function refreshImgNavi(index) {
    //刷新导航条为以index为current_index的情况
    var images = document.getElementById('little_images').children;
    for (var i = 0; i < images.length; i++) {
        divCleanImg(images[i]);
    }
    var display_img = [];
    if (index < 2) {
        for (var i = 0; i < 5; i++) {
            display_img.push(images[i]);
        }
    }
    else if (index > images.length - 3) {
        for (var i = images.length - 1; i > images.length - 6; i--) {
            display_img.push(images[i]);
        }
    }
    else {
        display_img.push(images[index]);
        display_img.push(images[index - 1]);
        display_img.push(images[index - 2]);
        display_img.push(images[index + 1]);
        display_img.push(images[index + 2]);
    }
    for (var i = 0; i < display_img.length; i++) {
        divCreateImg(display_img[i]);
    }
    divSetCurrent(images[index]);
    current_index = index;
    mark_url = "/mark/" + images[index].getAttribute('img_src').split('/')[2];
    imageLoad(current_index);
    $.ajax({
        url: '/folder/mark_count/' + folder_id,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            var _track = document.getElementById("scroll_Track");
            var _barText = document.getElementById('scrollBarTxt');
            _track.style.width = ((data.marked / data._count) * 100) + '%';
            _barText.textContent = data.marked + '/' + data._count;
            $("#scrollBarTxt").html(data.marked + "/" + data._count);
            if (data.images[current_index].marked) {
                $(".tagg_results").html("分类信息:" + data.images[current_index].type);
            }
        },
        error: function (xhr) {
        }
    });
}