require.config({
    paths : {
        "jquery" : "jquery-3.1.1.min"
    }
});

define(['jquery', 'calcAngle', 'init'],function($, calcAngle, unlockSeq){
    var seq = "";
    var $container = $('#unlock');
    var $li = $('.unlock-circle > li');
    var $p = $('.unlock-prompt');
    var $input = $('.unlock-radio input');
    var queue = [];                    //盛放已经装入的元素
    var lastData = {};                //存放上一次触碰的圆点
    var confirmSeq = "";              //用于设置密码的确认密码
    //预处理圆点的圆心以及其序号
    $li.each(function(index, elem){
        elem.index = index;
        elem.pos = {
            left: elem.offsetLeft + elem.offsetWidth / 2,
            top: elem.offsetTop + elem.offsetHeight / 2
        }
    });
    /*判断 localstorage 中是否存在值，如果不存在，那么默认输入解锁手势，
     若存在，则设置解锁手势，设置手势默认输入一遍*/

    $container.on('touchmove', touchMove);
    $container.on('touchend',function(event){
        var setFlag = $input.eq(0).prop('checked');                    //判断当前是否在设置密码
        if(lastData.$hr){
            lastData.$hr.remove();
            $container.off('touchmove');
            setTimeout(function(){                                       //800ms后页面初始化
                queue = [];
                lastData = {};
                seq = "";
                $('hr').remove();
                $p.html('请输入手势密码');
                $li.removeClass('unlock-selected')
                $container.on('touchmove', touchMove);
            },800);
            if(setFlag && confirmSeq){                //确认设置密码
                if(confirmSeq == seq){
                    localStorage.setItem("unlockSeq", confirmSeq);
                    unlockSeq = confirmSeq;
                    $input.removeProp('checked');
                    $input.eq(1).prop('checked', 'checked');                //变换至解锁状态，同时更新 localstroge
                    $p.html('密码设置成功');
                    confirmSeq = "";
                }
                else{
                    confirmSeq = "";
                    $p.html('两次输入的不一样');
                }
                return ;
            }
            if(setFlag && seq.length < 5){
                $p.html('密码太短，至少需要5个点');
                return ;
            }
            //初始设置密码
            if(setFlag && !confirmSeq) {                   //首次设置密码
                confirmSeq = seq;
                $p.html('请再次输入手势密码');
                return ;
            }
            if(!setFlag){                                  //验证密码
                if(!unlockSeq){                             //如果没有设置密码去验证密码，强行跳回设置密码
                    $input.removeProp('checked');
                    $input.eq(0).prop('checked', 'checked');
                    $p.html('请先设置密码');
                }
                else{
                    if(unlockSeq != seq) $p.html('输入的密码不正确');
                    else                 $p.html('密码正确！');
                }
            }
        }
    });

    function touchMove(event){
        var clientX = event.touches[0].clientX;
        var clientY = event.touches[0].clientY;
        var $target = collision(clientX, clientY);
        var angle = 0;
        if($target && $.inArray($target.prop('index'), queue) == -1){
            var index = $target.prop('index');
            queue.push(index);
            seq += index;
            $target.addClass('unlock-selected');
            var $hr = $('<hr/>');
            $container.append($hr);
            var pos = $target.prop('pos');
            //不是第一次进来，既已经在画线...
            if(lastData.$hr){
                angle = calcAngle(pos.left, pos.top, lastData.pos);
                lastData.$hr.css({
                    'width': dist(pos.left, pos.top, lastData.$target),
                    'transform': 'rotate(-'+ angle +'deg)'
                });
            }
            //保存这次的状态
            lastData.$hr = $hr;
            lastData.pos = pos;
            lastData.index = index;
            lastData.$target = $target;
            angle = calcAngle(clientX, clientY, lastData.pos);
            $hr.css({
                'left': pos.left,
                'top': pos.top,
                'width': dist(clientX, clientY, $target),
                'transform': 'rotate(-'+ angle +'deg)'
            });
        }else if(lastData.$hr){
            angle = calcAngle(clientX, clientY, lastData.pos);
            lastData.$hr.css({
                'width': dist(clientX, clientY, lastData.$target),
                'transform': 'rotate(-'+ angle +'deg)'
            });
        }
        event.preventDefault();                             //禁止默认行为
    }
    //碰撞检测
    function collision(x, y){
        var $target;
        var flag = false;
        $li.each(function(index, elem){
            var distance = dist(x, y, $(elem));
            if(distance < elem.offsetWidth / 2){
                flag = true;
                $target = $(elem);
            }
        });
        if(flag) return $target;
        else return null;
    }
    //计算 触点 到 LI 圆心的距离
    function dist(x, y, $target){
        var pos = $target.prop('pos');
        return Math.sqrt((x - pos.left) * (x - pos.left) + (y - pos.top) * (y - pos.top));
    }
});
