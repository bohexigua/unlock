require.config({
    paths : {
        "jquery" : "jquery-3.1.1.min"
    }
});

define(['jquery'],function($){
    //����ֱ����ת�Ƕȣ���ʱ�룩
    function calcAngle(x, y, pos){
        var segmentX = x - pos.left;
        var segmentY = y - pos.top;
        var angle = 0;                                                          //��ת�Ƕ�
        if(!segmentX && segmentY < 0){                                          //����λ��   atan( Y / 0 ) ---- Y < 0
            angle = 90;
        }
        else if(!segmentX && segmentY > 0){                                     //����λ��   atan( Y / 0 ) ---- Y > 0
            angle = 270;
        }
        else if(segmentX > 0 && segmentY < 0){                                   //��һ����
            angle = Math.atan( -segmentY / segmentX ) * 180 / Math.PI;
        }
        else if(segmentX < 0 && segmentY < 0){                                  //�ڶ�����
            angle = Math.atan( segmentX / segmentY ) * 180 / Math.PI + 90;
        }
        else if(segmentX < 0 && segmentY > 0){                                  //��������
            angle = Math.atan( -segmentY / segmentX ) * 180 / Math.PI + 180;
        }
        else{                                                                   //��������
            angle = Math.atan( segmentX / segmentY ) * 180 / Math.PI + 270;
        }
        return angle;
    }
     return calcAngle;
});