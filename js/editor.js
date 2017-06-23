/**
 * Created by shadowsakura on 17/6/14.
 */
var r_foot = elmClass('r-foot');
var view_meta = elmClass('view-meta');//
var view_title = document.getElementById('view_title');


var h_title = elmClass('h-title');//标题 user部分
var Imglist = document.getElementById('ImgList');
//    del_btn需要独立开来
var changeBg_btn = elmClass('change-bg');//背景选择器
var usr_header = elmClass('usr-header');
var selected, bg_selected,del;
selected = $('#sortable').children()[0].children[0];//初始化
//各个编辑器的容器用于隐藏
var text_editor = elmClass('text-editor');
var Img_editor = elmClass('Img-editor');
var video_editor = elmClass('video-editor');
var view_editor = elmClass('view_editor');
var Bg_editor = elmClass('Bg-editor');
var title_editor = elmClass('title-editor');
var editor_parent = elmClass('meipian-r');

//纯文本编辑器1号
var editor_text = new wangEditor('editor_text');
var editor_img = new wangEditor('editor_img');
var editor_video = new wangEditor('editor_video');

var insertImg = document.getElementById('insertImg');

//
var editorList = [editor_img, editor_text, editor_video];
var editorParent = [text_editor, Img_editor, video_editor, view_editor, Bg_editor,title_editor];

for (i = 0; i < editorList.length; i++) {
    editorList[i].config.colors = {
        '#880000': '暗红色',
        '#800080': '紫色',
        '#ff0000': '红色',
        '#ff8a00': '橙色',
        '#39b54a': '绿色',
        '#167efb': '蓝色',
        '紫色': '#b04fbb'
    }
    editorList[i].config.fontsizes = {
        //格式：'value': 'title'
        2: '小',
        3: '中',
        5: '大',
        7: '特大'
    };

    //普通的自定义菜单
    editorList[i].config.menus = [
        'undo',
        'redo',
        '|',     // '|' 是菜单组的分割线
        'bold',
        'underline',
        'italic',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'eraser',
        'fontsize',
        'forecolor',
        'link',

    ];
    editorList[i].config.pasteText = true;
    editorList[i].create();
    editorList[i].onchange = function () {
        // 编辑区域内容变化时，实时打印出当前内容
        var html = this.$txt.html();
        if (selected) {
            selected.children[1].innerHTML = html;
        }
    };
}
//
$('#sortable').DDSort({
    target: 'li',
    floatStyle: {
        'border': '2px solid #ccc',
        'background-color': '#fff',
        'box-shadow': '10px 10px 20px 0 rgb(136, 164, 187)'
    },
    down: function () {
        selected = this;
        for (var i = 0; i < editorList.length; i++) {
            editorList[i].$txt.html(selected.children[1].innerHTML)
        }
        var Img = document.createElement('img');
        allnone();
        _delImg(insertImg)
        upDel();
        selected.style.border = '2px solid #ccc';
        if ($(selected).children()[0].children[0])
            if ($(selected).children()[0].children[0].src == '') {
                text_editor.style.display = 'block';
                Img_editor.style.display = 'none';
                console.log(insertImg.children);
                insertImg.children[0].src = '';
            } else {
                text_editor.style.display = 'none';
                Img_editor.style.display = 'block';
                if(insertImg.children[0]){
                    console.log(insertImg.children[0])
                    insertImg.children[0].src = $(selected).children()[0].children[0].src;
                }else{
                    Img.src=$(selected).children()[0].children[0].src;
                    insertImg.appendChild(Img)
                }
            }
    },
    up: function () {
        selected.style.border = '2px solid #ccc'
        selected = this;
    },
})

$('#add_text').on('click', function () {
    allnone();
    text_editor.style.display='block';

    var li = returnLi()
    $(selected).after(li);
    selected = li;
    _delImg(insertImg)
    upDel()
    selected.style.border = '2px solid #ccc'
    editor_text.$txt.html('<p><br></p>');
});
//插入图片
$('#add_up').on('change', function () {
    var del_item = document.createElement('div');
    del_item.className = 'del_item'; //del_item
    var li = returnLi()//返回创建的li
    $(selected).after(li);
    var docObj = document.getElementById('add_up');
    var fileList = docObj.files;//获取到文件
    var Img = document.createElement('img');
    insertImg.innerHTML = '';
    for (var i = 0; i < fileList.length; i++) {
        selected = li;
        var src = fileList[i].name;
        Img.src = window.URL.createObjectURL(docObj.files[i]);
        insertImg.appendChild(Img)
        $(selected).children()[0].children[0].src = Img.src
    }
    _delImg(insertImg);
    docObj.value = '';
    upDel()//更新删除按钮
    allnone();
    Img_editor.style.display = 'block';
    selected.style.border = '2px solid #ccc';
    editor_img.$txt.html('<p><br></p>');
})


function returnLi() {//返回创建好的li 图文列表
    var li = document.createElement('li');
    li.className = 'ui-draggable ui-draggable-handle';
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('div');
    var img = document.createElement('img');
    var p = document.createElement('p');
    var br = document.createElement('br');
    p.appendChild(br);
    div1.className = 'l-img';
    div2.className = 'l-content';
    div3.className = 'del_item';
    div1.appendChild(img);
    div2.appendChild(p);
    li.appendChild(div1);
    li.appendChild(div2);
    li.appendChild(div3);
    return li;
}
function getImgfile(e) { //获取到文件目录
    //初始化部分
    insertImg.innerHTML = '';
    allnone();
    Img_editor.style.display = 'block';
    var cachetxt = editor_text.$txt[0].innerHTML;
    editor_text.$txt.html('<p><br></p>');
    editor_img.$txt.html(cachetxt);
//        _Img.src=''
//        allnone()//将全部编   辑器状态初始化display:none
    var docObj = document.getElementById('upload');
    var fileList = docObj.files;//获取到文件
    var Img = document.createElement('img');
//        _Img.innerHTML=''
    for (var i = 0; i < fileList.length; i++) {
        var src = fileList[i].name;
        Img.src = window.URL.createObjectURL(docObj.files[i]);
        insertImg.appendChild(Img)
        $(selected).children()[0].children[0].src = Img.src
    }
    setTimeout(function () { //因为被清除了找找在哪的问题
        selected.children[1].innerHTML = cachetxt;
        console.log(cachetxt)
    }, 100)
    _delImg(insertImg);
    docObj.value = '';
    upDel()
}
function addImgfile(){//添加封面图片
    var src = bg_selected.getAttribute('data-link')
    var docObj = document.getElementById('upload4');
    var fileList = docObj.files;//获取到文件-->
    var Img = document.createElement('img');
    for (var i = 0; i < fileList.length; i++) {
        var src = fileList[i].name;
        Img.src = window.URL.createObjectURL(docObj.files[i]);
    }
    usr_header.style.backgroundImage='url('+Img.src+')';
}

function changeImg(e) { //更换编辑器图片
    console.log('Imgchanging……');
    var docObj = document.getElementById('upload2');
    var fileList = docObj.files;//获取到文件-->
    Img_editor.style.display = 'block';
    insertImg.innerHTML = ''; //初始化;-->
    var Img = document.createElement('img');
    for (var i = 0; i < fileList.length; i++) {
        var src = fileList[i].name;
        Img.src = window.URL.createObjectURL(docObj.files[i]);
        $(selected).children()[0].children[0].src = window.URL.createObjectURL(docObj.files[i]);//改变item中的图片
    }
    insertImg.appendChild(Img);
    _delImg(insertImg);
    docObj.value = '';
    upDel()
}

function allnone() {//所有编辑器容器初始化操作
    editor_parent.style.backgroundColor = ''
    for (var i = 0; i < editorParent.length; i++) {
        editorParent[i].style.display = 'none';
        r_foot.style.display='none';
    }
}
function elmClass(str) {//返回数组中的第一个class
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(str)[0];
    } else {
        document.body.innerHTML = "<a href='http://down.360safe.com/cse/360cse_8.7.0.306.exe' style='position: absolute;left: 50%;top: 50%;font-size: 30px;transform:translateX(-50%) translateY(-50%);color: #000;'>您的浏览器版本过低,请点击下载360浏览器</a>"
    }
}

function upDel() { //为删除按钮更新列表
    del = $('.del_item');
    var drag = $('.ui-draggable');
    var List = {img: [], txt: [], src: []};
    for (var i = 0; i < del.length; i++) {
        del[i].removeEventListener('click', clearaLL)
        del[i].addEventListener('click', clearaLL)
        drag[i].style.border = '2px solid rgba(0,0,0,0.1)';
//            if(drag[i].children[0].children[0].src){
        console.log('ok')
        List.img.push(drag[i].children[0].innerHTML);
        List.src.push(drag[i].children[0].children[0].src);
//                List.txt.push(drag[i])
//            }
        if (drag[i].children[1].innerHTML) {
            List.txt.push(drag[i].children[1].innerHTML)
        }
    }
    return List;
}


function clearaLL() { //删除一个图文版块
    var pre = $(selected).prev()[0];
    var next = $(selected).next()[0];
    if (del.length == 1) {
        var a = alert('请保留一个元素')
        if (true) {

        }
    } else {
        var b = confirm('是否删除');
        if (b) {
            $(selected).remove();
            upDel();
//                for(var i=0;i<editorList.length;i++){ //此时的selected还保留原来,所以其编辑器还可以对上面的Item进行监听
//                    editorList[i].$txt.html('<p><br></p>')
//                }
        }
    }

    del = $('.del_item')
    console.log('剩余' + del.length)
    setTimeout(function () { //不知道为什么原因 进行清除内容的时候会和selected.remove()一起被执行 可能是因为清除监听的缘故
        if (pre) {
            selected = pre;
        } else {
            selected = next;
        }
        selected.style.border = '2px solid #ccc'
        for (var i = 0; i < editorList.length; i++) {
            editorList[i].$txt.html(selected.children[1].innerHTML)
        }
    }, 0)
}
upDel();




var all;
var oTop = 120;//上面的高度
var ofoot = 46;
var tool = 60;
$('.ui-draggable')[0].style.border = '2px solid #ccc'
setInterval(function () {
    var warp = elmClass('ctrl-ht')
    all = $('.meipian-c').height();
    var result = all - oTop - ofoot - tool;
    warp.style.height = result + 'px';
}, 1500);

$('.btn-view').on('click',viewer);
function viewer() {//点击预览按钮
    allnone();
    r_foot.style.display='block';
    var _num=0;      //阅读人数
    var _time =formatDate(new Date(),"yyyy-MM-dd HH:mm");
    var cache = upDel();
    console.log(cache);
    editor_parent.style.backgroundColor = 'white';

    view_meta.innerHTML=''
    console.log(h_title.innerText)
    $('.view_content')[0].innerHTML = '';

    //        预览的标题
    if(h_title.innerText=='点击设置标题'){
        view_title.innerText='我的文章';
    }else{
        view_title.innerText=h_title.innerText
    }

//        预览的时间
    var info = document.createElement('div');//
    var time = document.createElement('span');
    var user_link = document.createElement('span');
    var read_num = document.createElement('span');
    read_num.innerText='阅读'+_num;
    time.innerText=_time;
    info.appendChild(time);
    info.appendChild(user_link);
    info.appendChild(read_num);
    info.className='info clearfix';


    view_meta.appendChild(info);
    for (var i = 0; i < cache.img.length; i++) {
        var view = document.createElement('div');
        view.className = 'section';
        view.innerHTML = cache.txt[i] + cache.img[i];
        $('.view_content').append(view);
        view_editor.style.display = 'block';
    }
}
$('.h-title').on('click',function(){
    allnone();
    title_editor.style.display='block';
})
$('.shen').on('input',function(){
    var value = this.value;
    console.log(value.indexOf('↵'))
    console.log(value)
    h_title.innerText=value;
})


changeBg_btn.addEventListener('click', function () {
    var _Imglist = [];
    var cache = upDel();
    for (var i = 0; i < cache.src.length; i++) {
        if (cache.src[i] != "") {
            _Imglist.push(cache.src[i])
        }
    }
    if ($('#ImgList').children().length >= 20) {
        allnone();
        Bg_editor.style.display = 'block'//将背景编辑器显示
    } else {
        Imglist.innerHTML = ''
        allnone();
        Bg_editor.style.display = 'block'//将背景编辑器显示
        for (var i = 0; i < _Imglist.length; i++) {
            var div = document.createElement('div');
            var img = document.createElement('img');
            div.className = 'Img-item';
            if(i==0){ //判断第一个进行初始化选择
                div.className='Img-item sel';
                bg_selected = div;
            }

            div.setAttribute('data-link', _Imglist[i])
            img.src = _Imglist[i];
            div.appendChild(img)

            $('#ImgList').append(div);
            div.addEventListener('click', function () {
                reClass($('#ImgList'));
                var attr = this.getAttribute('data-link');
                usr_header.style.backgroundImage = 'url(' + attr + ')';
                this.classList.add('sel');
            })
        }
    }
})

function _delImg(parent) { //删除的图片按钮
    var del_btn = document.createElement('div');
    del_btn.className = 'del-btn';

    var img =insertImg.children[0];
    insertImg.innerHTML='';
    parent.appendChild(img);
    parent.appendChild(del_btn);
    DeImg()//创建监听事件

}
function DeImg() {//删除图片按钮
    var btn = elmClass('del-btn');
    btn.addEventListener('click', function () {
        var cache = editor_img.$txt[0].innerHTML;
        console.log(cache);
        insertImg.children[0].src = '';
        allnone();
        text_editor.style.display = 'block';
        console.log($(selected).children()[0].innerHTML = '<img>')
        editor_text.$txt.html(cache)
    })
}


function randomback(i) {//i传入数量 打算做随机背景 (未做
    var a = parseInt(Math.random() * i);
    console.log(a)
}

var cache = upDel();
usr_header.style.backgroundImage='url('+cache.src[0]+')';
viewer()//初始化默认显示view
function formatDate(date, pattern) {
    function padding(number) {
        return number < 10 ? '0' + number : '' + number
    }
    var yyyy = date.getFullYear();
    var MM = padding(date.getMonth() + 1);
    var dd = padding(date.getDate());
    var HH = padding(date.getHours());
    var mm = padding(date.getMinutes());
    var ss = padding(date.getSeconds());
    pattern = pattern.replace(/yyyy/, yyyy);
    pattern = pattern.replace(/MM/, MM);
    pattern = pattern.replace(/dd/, dd);
    pattern = pattern.replace(/HH/, HH);
    pattern = pattern.replace(/mm/, mm);
    pattern = pattern.replace(/ss/, ss);
    return pattern;
}
function reClass(parent){ //清除父元素下子元素的class;
    var childs = parent.children();
    for(var i=0;i<childs.length;i++){
        childs[i].classList.remove('sel')
    }
}

