function createImageDiv(url, class_name) {
    var div = document.createElement('div');
    div.setAttribute('img_src', url);
    div.setAttribute('img_class', class_name);
    //div.appendChild(createLittleImage(url, class_name, index));
    return div
}

function createImgNavi() {
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
    var img = document.createElement('img');
    img.src = div.getAttribute('img_src');
    img.className = div.getAttribute('img_class');
    img.onclick = function () {
        refreshImgNavi(parseInt(img.parentElement.id.split('_')[2]));
    };
    div.appendChild(img);
}

function divCleanImg(div) {
    div.innerHTML = "";
}

function divSetCurrent(div) {
    div.children[0].style.border = 'red 4px solid';
}

function divNotCurrent(div) {
    div.children[0].style.border = null;
}

function imgNaviNext() {
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
    sign_context.items.splice(0, sign_context.items.length);
    points = [];
    circles = [];
    rects = [];
}