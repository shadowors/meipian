var selected = $('#sortable').children()[0].children[0];//初始化

function oneFunc() {
    this.init.apply(this, arguments)
}
oneFunc.prototype = {
    init: function () {
        //初始化传变量
        this.bind(this, this.createElm());
        this.update = this.bind(this, this._update);
        this.update();
        this.updtitem = this.bind(this, this._updt_item);
        this._changeBg = this.bind(this, this.changeBg_);
        //初始化变量
        this.insertImg = this.id('insertImg');

        this.meipian_r = this.elmClass('meipian-r');
        this.editorListStr = ['editor_text', 'editor_img', 'editor_video']
        this.editorList = this.returnEditor(this.editorListStr);//返回各个创建好的编辑器;
        this.editorPlistStr = ['text-editor', 'Img-editor', 'view_editor', 'Bg-editor', 'title-editor'];//父元素
        this.editorParent = this.returnEditorP(this)//返回编辑器父元素
        //文章预览
        this.view_meta = this.elmClass('view-meta');
        this.h_title = this.elmClass('h-title');
        this.editorHead = this.elmClass('editorHead');
        this.view_btn = this.elmClass('btn-view');
        this.view_title = this.id('view_title');
        this.r_foot = this.elmClass('r-foot');//
        // 左边按钮
        this.usr_header = this.elmClass('usr-header');
        this.add_text = this.id('add_text');
        this.add_img = this.id('add_img');
        this.add_up = this.id('add_up');
        this.bg_btn = this.elmClass('change-bg');

        this.upload = this.id('upload');
        this.upload2 = this.id('upload2');
        this.upload4 = this.id('upload4');
        this.BgList = this.id('BgList');
        this.del = this.id('del');
        // 其他变量
        this._time = this.formatDate(new Date(), 'yyyy-MM-dd HH:mm'); //当前时间
        this._num = 0;
        this.bg_selected = $('.Img-item ')
        this.List = {img: [], txt: [], src: []};
        this.status;

        //初始化操作

        // 监听
        this.addEvent(this.h_title, 'click', this.bind(this, this._h_title));
        this.addEvent(this.editorHead, 'input', this.bind(this, this._editorHead));

        this.addEvent(this.view_btn, 'click', this.bind(this, this.view));
        this.addEvent(this.add_text, 'click', this.bind(this, this.addtext));
        this.addEvent(this.bg_btn, 'click', this.bind(this, this.changeBg));
        this.addEvent(this.add_up, 'change', this.bind(this, this.addItemImg));
        this.addEvent(this.upload, 'change', this.bind(this, this.addtextImg));
        this.addEvent(this.upload2, 'change', this.bind(this, this.changeImg));
        this.addEvent(this.upload4,'change',this.bind(this,this.uploadBg))
        this.updt_item();
        this.view();
        this.InitBg();
        //拖动插件
        $('#sortable').DDSort({ //插件似乎会导致异步
            target: 'li',
            floatStyle: {
                'border': '2px solid #f9e87e',
                'background-color': '#fff',
                'box-shadow': '10px 10px 20px 0 rgb(136, 164, 187)'
            },
            down: function (_this) {//当鼠标按下进行处理
                var childs = this.parentElement.children
                for (var i = 0; i < childs.length; i++) {
                    childs[i].style.border = '2px solid #fff'
                }
                selected = this;
                selected.style.border = '2px solid #f9e87e'
                _this.inner(_this.editorList)
                this.style.border = '2px solid #f9e87e';
                _this.bind(_this, _this.delImg(_this.insertImg))

                var Img = document.createElement('img');
                if ($(selected).children()[0].children[0])
                    if ($(selected).children()[0].children[0].src == '') {//没有图片的情况
                        _this.allnone(_this.editorParent[0]);
                        _this.insertImg.children[0].src = '';
                    } else {//有图片的情况
                        _this.allnone(_this.editorParent[1]);
                        if (_this.insertImg.children[0]) {//假如有图片这个容器
                            console.log(_this.insertImg.children[0])
                            _this.insertImg.children[0].src = $(selected).children()[0].children[0].src;
                        } else {//没有则将新创建的图片包裹进去
                            Img.src = $(selected).children()[0].children[0].src;
                            _this.insertImg.appendChild(Img)
                        }
                    }

            },
            up: function () {
                selected.style.border = '2px solid #f9e87e'
                selected = this;
            }
        }, this)

    },
    //测试
    _h_title: function () {
        this.allnone(this.editorParent[4])
    },
    _editorHead: function (_this) {
        var target = _this.target;
        var val = target.value;
        var txt = val.replace(/\n/g, ' ')
        this.h_title.innerText = txt;
    },
    addtext: function () {//创建新的文本内容
        this.allnone(this.editorParent[0]);
        this.inner(this.editorList, true);
        var li = this.createli();
        $(selected).after(li);
        selected = li;

        this.update();
        this.updt_item();
    },
    changeBg: function () {//背景编辑器
        var _imglist = [];
        for (var i = 0; i < this.List.src.length; i++) {//循环imgList;
            // console.log(this.List.src[i]);
            if (this.List.src[i] != "") {
                _imglist.push(this.List.src[i])
            }
        }
        if ($('#ImgList').children().length >= 20) {
            this.BgList.innerHTML = '';
            this.allnone(this.editorParent[3]);
        } else {
            //初始化
            this.BgList.innerHTML = '';
            this.allnone(this.editorParent[3]);
            console.log(this.List.src)
            for (var i = 0; i < _imglist.length; i++) {
                var div = document.createElement('div');
                var img = document.createElement('img');
                div.className = 'Img-item';
                if (i == 0) { //判断第一个进行初始化选择
                    div.className = 'Img-item sel';
                    this.bg_selected = div;
                }
                div.setAttribute('data-link', _imglist[i])
                img.src = _imglist[i];
                div.appendChild(img)

                this.BgList.appendChild(div);
                this.addEvent(div, 'click', this._changeBg);
            }
        }
    },
    changeBg_: function (e) {
        var div = e.target.parentElement;
        this.reCls($('#BgList'), 'sel');
        var attr = div.getAttribute('data-link')
        this.usr_header.style.backgroundImage = 'url(' + attr + ')';
        div.classList.add('sel');
    },
    InitBg:function(){
        var src= $('.ui-draggable')[0].children[0].children[0].src
        this.usr_header.style.backgroundImage = 'url(' + src + ')';
    },
    addItemImg: function () { //新添加图片item
        this.allnone(this.editorParent[1]);
        this.inner(this.editorList, true);
        var del_item = document.createElement('div');
        del_item.className = 'del_item'; //del_item
        var li = this.createli()//返回创建的li
        li.style.border='2px solid rgb(249, 232, 126)'
        $(selected).after(li)
        selected = li;
        this.update();

        var fileList = this.add_up.files;//获取到文件
        this.insertImg.innerHTML = '';
        var Img = document.createElement('img');
        for (var i = 0; i < fileList.length; i++) {
            var src = fileList[i].name;
            Img.src = window.URL.createObjectURL(this.add_up.files[i]);
            this.insertImg.appendChild(Img)
            $(selected).children()[0].children[0].src = Img.src
        }
        this.delImg(this.insertImg);
        this.updt_item();
        this.add_up.value = '';
    },
    addtextImg: function () {//为文章添加图片
        this.insertImg.innerHTML = '';//将插入图片的容器初始化
        this.allnone(this.editorParent[1]);//初始化
        var text = this.editorList[0].$txt[0].innerHTML;//只获取到文本编辑器
        var docObj = document.getElementById('upload');
        var fileList = docObj.files;//获取到文件
        var Img = document.createElement('img');
        for (var i = 0; i < fileList.length; i++) {
            var src = fileList[i].name;
            Img.src = window.URL.createObjectURL(docObj.files[i]);
            this.insertImg.appendChild(Img)
            $(selected).children()[0].children[0].src = Img.src
        }
        selected.children[1].innerHTML = text;
        this.delImg(this.insertImg);
        this.updt_item();
        this.editorList[1].$txt.html(text);
    },
    changeImg: function () {
        var docObj = document.getElementById('upload2');
        var fileList = docObj.files;//获取到文件-->
        this.allnone(this.editorParent[1]);
        this.insertImg.innerHTML = ''; //初始化;-->
        var Img = document.createElement('img');
        for (var i = 0; i < fileList.length; i++) {
            var src = fileList[i].name;
            Img.src = window.URL.createObjectURL(docObj.files[i]);
            this.insertImg.appendChild(Img);
            $(selected).children()[0].children[0].src = window.URL.createObjectURL(docObj.files[i]);//改变item中的图片
        }
        this.delImg(insertImg);
        docObj.value = '';
        this.updt_item()//更新列表和list
    },
    uploadBg:function(){
        var docObj = document.getElementById('upload4');
        var fileList = docObj.files;//获取到文件-->
        var Img = document.createElement('img');
        for (var i = 0; i < fileList.length; i++) {
            var src = fileList[i].name;
            Img.src = window.URL.createObjectURL(docObj.files[i]);
        }
        this.reCls($('#BgList'), 'sel');
        this.usr_header.style.backgroundImage='url('+Img.src+')';
    },
    updt_item: function () {//更新各个文章列表
        this.List = {img: [], txt: [], src: []};
        this.delitem_btn = $('.del_item');
        console.log(this.delitem_btn);
        console.log('---updt');
        var drag = $('.ui-draggable');
        for (var i = 0; i < this.delitem_btn.length; i++) {
            this.addEvent(this.delitem_btn[i], 'click', this.updtitem);
            this.List.img.push(drag[i].children[0].innerHTML);
            this.List.src.push(drag[i].children[0].children[0].src);
            if (drag[i].children[1].innerHTML) {
                this.List.txt.push(drag[i].children[1].innerHTML)
            }
            console.log(this.List)
        }
    },
    _updt_item: function () {
        var pre = $(selected).prev()[0];
        var next = $(selected).next()[0];
        if (this.delitem_btn.length == 1) {
            alert('请保留一个元素')
        } else {
            var b = confirm('是否删除');
            if (b) {
                $(selected).remove();
                this.updt_item()
            }
            this.delitem_btn = $('.del_item')
            console.log('剩余' + this.delitem_btn.length)
            if (pre) {
                selected = pre;
                this.nextItem(pre);
            } else {
                selected = next;
                this.nextItem();
            }
            selected.style.border = '2px solid #f9e87e';
            for (var i = 0; i < this.editorList.length; i++) {
                this.editorList[i].$txt.html(selected.children[1].innerHTML)
            }
        }
    },
    _update: function () {
        var parent = $('.ui-draggable').parent();
        var childs = parent.children();
        for (var i = 0; i < childs.length; i++) {
            childs[i].style.border = '2px solid #fff';
        }
        selected.style.border = '2px solid #f9e87e';

    },
    nextItem: function (pre) {//对下一个item进行操作
        var Img = document.createElement('img');
        if ($(selected).children()[0].children[0]) {//判断insertImg有没有Img
            if ($(selected).children()[0].children[0].src == '') {//判断有没有地址
                this.allnone(this.editorParent[0]);
                this.insertImg.children[0].src = '';
            } else {
                this.allnone(this.editorParent[1]);
                if (this.insertImg.children[0]) {//假如有这个容器
                    this.insertImg.children[0].src = $(selected).children()[0].children[0].src;
                } else {
                    Img.src = $(selected).children()[0].children[0].src;
                    this.insertImg.appendChild(Img)
                }
            }
        }
    },
    view: function () {
        //初始化
        this.updt_item();
        this.allnone(this.r_foot);
        this.allnone(this.editorParent[2]);

        this.r_foot.style.display = 'block';
        this.view_meta.innerHTML = '';
        this.view_title.innerText = '';
        this.meipian_r.style.backgroundColor='#fff';
        $('.view_content')[0].innerHTML = '';
        var cache = this.List;
        console.log(cache)
        console.log('⬆')
        // 创建meta
        var info = this.createElm('div');//信息
        var time = this.createElm('span');
        var user_link = this.createElm('span');
        var read_num = this.createElm('span');
        read_num.innerText = '阅读' + this._num;
        time.innerText = this._time;
        info.appendChild(time);
        info.appendChild(user_link);
        info.appendChild(read_num);
        info.className = 'info clearfix';
        // 操作title
        this.view_meta.appendChild(info);
        if (this.h_title.innerText == '点击设置标题') {
            this.view_title.innerText = '我的文章';
        } else {
            this.view_title.innerText = this.h_title.innerText
        }

        for (var i = 0; i < cache.txt.length; i++) {
            var view = document.createElement('div');
            view.className = 'section';
            view.innerHTML = cache.txt[i] + cache.img[i];
            console.log(cache.txt[i])
            $('.view_content').append(view);
            this.editorParent[2].style.display = 'block';
        }

    },
    createli: function () { //创建文章的容器并返回
        var li = this.createElm('li');
        li.className = 'ui-draggable ui-draggable-handle';
        var div1 = this.createElm('div');
        var div2 = this.createElm('div');
        var div3 = this.createElm('div');
        var img = this.createElm('img');
        var p = this.createElm('p');
        var br = this.createElm('br');
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
    },
    returnEditor: function (editorListStr) {//返回各个编辑器
        var list = [];
        for (var i = 0; i < editorListStr.length; i++) {
            var a = new wangEditor(editorListStr[i]);
            a.config.colors = {
                '#880000': '暗红色',
                '#800080': '紫色',
                '#ff0000': '红色',
                '#ff8a00': '橙色',
                '#39b54a': '绿色',
                '#167efb': '蓝色',
                '紫色': '#b04fbb'
            }
            a.config.fontsizes = {
                //格式：'value': 'title'
                2: '小',
                3: '中',
                5: '大',
                7: '特大'
            }
            a.config.menus = [
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
            a.config.pasteText = true;
            a.create();
            a.onchange = function () {
                // 编辑区域内容变化时，实时打印出当前内容
                var html = this.$txt.html();
                if (selected) {
                    selected.children[1].innerHTML = html;
                }
            }
            list.push(a);
        }
        return list;
    },
    returnEditorP: function () {//返回编辑器父元素
        var list = [], a;
        var parent = this.editorPlistStr;
        for (var i = 0; i < parent.length; i++) {
            a = this.elmClass(parent[i]);
            list.push(a)
        }
        return list;
    },
    createElm: function (str) {//创建元素
        return document.createElement(str)
    },
    allnone: function (_setblock) {//所有编辑器容器初始化操作
        // editor_parent.style.backgroundColor = ''
        for (var i = 0; i < this.editorParent.length; i++) {
            this.editorParent[i].style.display = 'none';
            this.r_foot.style.display = 'none';
        }
        _setblock.style.display = 'block'
        this.meipian_r.style.backgroundColor='';

    },
    reCls: function (parent, cls) {//在指定元素下清除传入的class
        var childs = parent.children();
        for (var i = 0; i < childs.length; i++) {
            childs[i].classList.remove(cls)
        }
    },

    delImg: function (parent) {//创建按钮
        var del_btn = document.createElement('div');
        del_btn.className = 'del-btn';
        var img = insertImg.children[0];
        insertImg.innerHTML = '';
        parent.appendChild(img);
        parent.appendChild(del_btn);
        this._delImg()
    },
    _delImg: function () {//创建监听 删除图片按钮
        var btn = this.elmClass('del-btn');
        this.addEvent(btn, 'click', this.bind(this, DelImg_btn))
        function DelImg_btn() {
            this.insertImg.children[0].src = '';
            this.allnone(this.editorParent[0]);
            var cache = this.editorList[1].$txt[0].innerHTML;
            $(selected).children()[0].innerHTML = '<img>'
            this.editorList[0].$txt.html(cache);
        }
    },
    inner: function (list, boolean) {//为true则初始化编辑器内容
        if (boolean) {
            for (var i = 0; i < list.length; i++) {
                list[i].$txt.html('<p><br></p>')
            }
        } else {
            for (var i = 0; i < list.length; i++) {
                list[i].$txt.html(selected.children[1].innerHTML)
            }
        }
    },
    bind: function (obj, func) {
        return function () {
            return func.apply(obj, arguments)
        }
    },
    elmClass: function (str) {
        if (document.getElementsByClassName) {
            return document.getElementsByClassName(str)[0];
        } else {
            document.body.innerHTML = "<a href='http://down.360safe.com/cse/360cse_8.7.0.306.exe' style='position: absolute;left: 50%;top: 50%;font-size: 30px;transform:translateX(-50%) translateY(-50%);color: #000;'>您的浏览器版本过低,请点击下载360浏览器</a>"
        }
    },
    id: function (id) {
        return document.getElementById(id)
    },
    addEvent: function (elm, type, func) {
        return elm.addEventListener(type, func)
    },
    removeEvent: function (elm, type, func) {
        return elm.removeEventListener(type, func)
    },
    formatDate: function (date, pattern) {//时间格式化处理
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
}


