function createImageDiv(url, class_name) {
    //创建用来包含图片的div，设置img_src和img_class两个属性用来后期生成img标签
    var div = document.createElement('div');
    div.setAttribute('img_src', url);
    div.setAttribute('img_class', class_name);
    div.className = 'little_div';
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
    refreshImgStatus(get_img_status(marked_and_types));
}

function divCreateImg(div) {
    //在imageDiv标签内部创建img图片，使用div的属性，并设置图片点击后跳转
    div.style.display = null;
    let img = document.createElement('img');
    img.src = div.getAttribute('img_src');
    img.className = 'little_img';
    img.onclick = function () {
        refreshImgNavi(parseInt(img.parentElement.id.split('_')[2]));
    };
    let _status_div = null;
    if (div.childElementCount > 0) {
        _status_div = div.firstChild;
        div.innerHTML = ""
    }
    div.appendChild(img);
    if (_status_div) {
        div.appendChild(_status_div);
    }
}

function get_img_status(marked_and_types) {
    let status = [];
    for (let y = 0; y < marked_and_types.length; y++) {
        let t = Object();
        t.marked = marked_and_types[y][0];
        t.type = marked_and_types[y][1];
        status.push(t)
    }
    return status;
}

function addImgStatus(div, index, status) {
    //给div添加图片状态
    if (status[index].marked) {
        let flag = false;
        for (let i = 0; i < div.children.length; i++) {
            if (div.children[i].tagName === 'DIV') {
                flag = true;
                div.children[i].setAttribute('data-text', status[index].type)
            }
        }
        if (flag) {

        }
        else {
            let new_div = document.createElement('div');
            new_div.className = 'tiny_div';
            new_div.setAttribute('data-text', status[index].type);
            new_div.onclick = function () {
                refreshImgNavi(parseInt(new_div.parentElement.id.split('_')[2]));
            };
            div.appendChild(new_div)
        }
    }
}

function refreshImgStatus(status) {
    let images = document.getElementById('little_images').children;
    for (let i = 0; i < images.length; i++) {
        addImgStatus(images[i], i, status)
    }
}


function divCleanImg(div) {
    //清除div中的图片
    div.style.display = 'none';
    let _tmp = null;
    if (div.childElementCount === 2) {
        _tmp = div.children[1];
    }
    if (div.childElementCount === 1 && div.firstChild.tagName === 'DIV') {
        _tmp = div.firstChild;
    }
    div.innerHTML = "";
    if (_tmp) {
        div.appendChild(_tmp)
    }
}

function divSetCurrent(div) {
    //设置div为当前div，具体表现是div加上了红色实线边框
    div.children[0].style.border = 'red 4px solid';
}


function imgNaviNext() {
    //跳转到下一张图片，注意，没有跳转canvans中的图片，所以canvans中的图片还需要另外进行刷新，并修改current_index的值，目前在点击下一张时调用
    let index = current_index + 1;
    let images = document.getElementById('little_images').children;
    if (index < images.length) {
        for (let i = 0; i < images.length; i++) {
            divCleanImg(images[i]);
        }
        let display_img = [];
        if (index < 2) {
            for (let i = 0; i < 5; i++) {
                display_img.push(images[i]);
            }
        }
        else if (index > images.length - 3) {
            for (let i = images.length - 1; i > images.length - 6; i--) {
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

function imgNaviPrev() {
    //跳转到上一张图片，同imgNaviNext。
    let index = current_index - 1;
    if (index >= 0) {
        let images = document.getElementById('little_images').children;
        for (let i = 0; i < images.length; i++) {
            divCleanImg(images[i]);
        }
        var display_img = [];
        if (index < 2) {
            for (let i = 0; i < 5; i++) {
                display_img.push(images[i]);
            }
        }
        else if (index > images.length - 3) {
            for (let i = images.length - 1; i > images.length - 6; i--) {
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
        for (let i = 0; i < display_img.length; i++) {
            divCreateImg(display_img[i]);
        }
        divSetCurrent(images[index]);
    }
}

function viewNext() {
    //导航条向右挪动一格
    let images = document.getElementById('little_images').children;
    let showing_img = [];
    for (let i = 0; i < images.length; i++) {
        if (images[i].childElementCount > 1 || (images[i].childElementCount > 0 && images[i].firstChild.tagName === 'IMG')) {
            showing_img.push(images[i])
        }
    }
    let _next = showing_img[showing_img.length - 1].nextElementSibling;
    if (_next) {
        divCreateImg(_next);
        if (parseInt(_next.id.split('_')[2]) === current_index) {
            divSetCurrent(_next);
        }
        divCleanImg(showing_img[0])
    }
}

function viewPrev() {
    //导航条向左挪动一格
    let images = document.getElementById('little_images').children;
    let showing_img = [];
    for (let i = 0; i < images.length; i++) {
        if (images[i].childElementCount > 1 || (images[i].childElementCount > 0 && images[i].firstChild.tagName === 'IMG')) {
            showing_img.push(images[i])
        }
    }
    let _prev = showing_img[0].previousSibling;
    if (_prev) {
        divCreateImg(_prev);
        if (parseInt(_prev.id.split('_')[2]) === current_index) {
            divSetCurrent(_prev);
        }
        divCleanImg(showing_img[showing_img.length - 1])
    }
}


function refreshImgNavi(index) {
    //刷新导航条为以index为current_index的情况
    let images = document.getElementById('little_images').children;
    for (let i = 0; i < images.length; i++) {
        divCleanImg(images[i]);
    }
    let display_img = [];
    if (index < 2) {
        for (let i = 0; i < 5; i++) {
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
    for (let i = 0; i < display_img.length; i++) {
        divCreateImg(display_img[i]);
    }
    divSetCurrent(images[index]);
    current_index = index;
    mark_url = "/mark/" + images[index].getAttribute('img_src').split('/')[2];
    imageLoad(current_index);
}