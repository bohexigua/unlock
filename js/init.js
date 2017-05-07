/*判断 localstorage 中是否存在值，如果不存在，那么默认输入解锁手势，
 若存在，则设置解锁手势，设置手势默认输入一遍
 */

require.config({
    paths : {
        "jquery" : "jquery-3.1.1.min"
    }
});

define(['jquery'],function($){
    var unlockSeq = localStorage.getItem("unlockSeq");
    var $input = $('.unlock-radio input');
    if(unlockSeq){                                     //说明已经过设置密码
        $input.removeProp('checked');
        $input.eq(1).prop('checked', 'checked');
        return unlockSeq;
    }
    return "";
});