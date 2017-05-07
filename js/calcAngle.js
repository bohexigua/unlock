require.config({
    paths : {
        "jquery" : "jquery-3.1.1.min"
    }
});

define(['jquery'],function($){
    //计算直线旋转角度（逆时针）
    function calcAngle(x, y, pos){
        var segmentX = x - pos.left;
        var segmentY = y - pos.top;
        var angle = 0;                                                          //旋转角度
        if(!segmentX && segmentY < 0){                                          //特殊位置   atan( Y / 0 ) ---- Y < 0
            angle = 90;
        }
        else if(!segmentX && segmentY > 0){                                     //特殊位置   atan( Y / 0 ) ---- Y > 0
            angle = 270;
        }
        else if(segmentX > 0 && segmentY < 0){                                   //第一象限
            angle = Math.atan( -segmentY / segmentX ) * 180 / Math.PI;
        }
        else if(segmentX < 0 && segmentY < 0){                                  //第二象限
            angle = Math.atan( segmentX / segmentY ) * 180 / Math.PI + 90;
        }
        else if(segmentX < 0 && segmentY > 0){                                  //第三象限
            angle = Math.atan( -segmentY / segmentX ) * 180 / Math.PI + 180;
        }
        else{                                                                   //第四象限
            angle = Math.atan( segmentX / segmentY ) * 180 / Math.PI + 270;
        }
        return angle;
    }
     return calcAngle;
});