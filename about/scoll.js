window.addEventListener('load', function () {
    // 获取模块根元素
    var root = document.querySelector('.slideshow');

    // 获取图片列表及列表项
    var picList = root.querySelector('.pic-list');
    var picListItems = picList.querySelectorAll('li');
    // 子项宽度
    var picItemWidth = picListItems[0].offsetWidth;

    // 获取控制器
    var picControls = root.querySelector('.pic-controls');
    var prevBtn = picControls.querySelector('.prev');
    var nextBtn = picControls.querySelector('.next');
    var focus = picControls.querySelector('.focus');

    // 根据picListItems生成相对应的focusItems焦点
    for (var i = 0; i < picListItems.length; i++) {
        var li = document.createElement('li');
        focus.appendChild(li);
    }

    // 获取focusItems焦点
    var focusItems = focus.querySelectorAll('li');
    focusItems[0].className = 'current';

    // 前进后退按钮 交互样式
    prevBtn.addEventListener('mouseenter', function () {
        this.style.opacity = '1';
    })
    prevBtn.addEventListener('mouseleave', function () {
        this.style.opacity = '.5';
    })
    nextBtn.addEventListener('mouseenter', function () {
        this.style.opacity = '1';
    })
    nextBtn.addEventListener('mouseleave', function () {
        this.style.opacity = '.5';
    })

    /* 缓冲 动画函数
        obj需要操作的对象;
        target目标距离;
     */
    function animation(obj, target, callback) {
        // 清除定时器
        clearInterval(obj.timer);

        // 开启定时器
        obj.timer = setInterval(function () {
            // 每一次移动的距离
            var step = (target - obj.offsetLeft) / 10;

            // 取整 正值往大取整 负值往小取整
            step = step > 0 ? Math.ceil(step) : Math.floor(step);

            // 移动
            obj.style.left = obj.offsetLeft + step + 'px';

            // 判断当前的是否处于目标位置
            // 处于的话清除定时器
            if (obj.offsetLeft == target) {
                clearInterval(obj.timer);

                // 相当于 callback == true ? callback() : callback;
                callback && callback();
            }
        }, 15)
    }

    // 无缝滚动
    // 深拷贝第一个图片列表的元素并插入
    var firstPicListItem = picListItems[0].cloneNode(true);
    picList.appendChild(firstPicListItem);

    // 记录当前是第几张
    var count = 0;

    // 节流阀
    // 当上一个函数动画内容执行完毕，再去执行下一个函数动画，让事件无法连续触发
    var flag = true;

    // 位于页面控制器层所有的点击事件
    picControls.addEventListener('click', function (e) {
        // 判断点击是否是 focus next prev
        if (e.target.parentNode.className == 'focus' || e.target.classList[0] == 'prev' || e.target.classList[0] == 'next') {
            // 排他
            for (var i = 0; i < focusItems.length; i++) {
                focusItems[i].className = '';
            }
        }

        // focus
        if (e.target.parentNode.className == 'focus') {
            e.target.className = 'current';

            // 获取当前元素的索引
            var index = 0;
            for (var i = 0; i < focusItems.length; i++) {
                if (focusItems[i].className == 'current') {
                    index = i;
                    break
                }
            }

            // 将索引赋值给计数器
            count = index;

            var distance = -index * picItemWidth;
            animation(picList, distance);
        }

        // prev
        if (e.target.classList[0] == 'prev') {
            // 节流阀
            if (flag) {
                // 关闭节流阀
                flag = false;
                if (count == 0) {
                    count = picListItems.length;
                    console.log(count);
                    picList.style.left = -count * picItemWidth + 'px';
                }
                count--;
                animation(picList, -count * picItemWidth, function () {
                    // 打开节流阀
                    flag = true;
                });
            }
            // focus
            // if (count >= focusItems.length) {
            //     focusItems[0].className = 'current';
            // } else {
            //     focusItems[num].className = 'current';
            // }
        }

        // next
        if (e.target.classList[0] == 'next') {
            if (flag) {
                // 关闭节流阀
                flag = false;
                if (count == picListItems.length) {
                    count = 0;
                    picList.style.left = '0px';
                }
                count++;
                animation(picList, -count * picItemWidth, function () {
                    // 打开节流阀
                    flag = true;
                });
            }

            // focus
            // if (num >= focusItems.length) {
            //     focusItems[0].className = 'current';
            // } else {
            //     focusItems[num].className = 'current';
            // }
        }

        // focus
        if (count >= focusItems.length) {
            focusItems[0].className = 'current';
        } else {
            focusItems[count].className = 'current';
        }
    });

    // 自动播放定时器
    var timer = setInterval(function () {
        nextBtn.click();
    }, 2000);
    picControls.addEventListener('mouseenter', function () {
        // 清除定时器;
        clearInterval(timer);
    });
    picControls.addEventListener('mouseleave', function () {
        // 重新开启一个定时器
        timer = setInterval(function () {
            nextBtn.click();
        }, 2000);
    });
})
