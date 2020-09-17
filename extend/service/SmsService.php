<?php

// +----------------------------------------------------------------------
// | Apprh.Shop
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2027 http://www.apprh.com All rights reserved.
// +----------------------------------------------------------------------
// | Notice: This code is not open source, it is strictly prohibited
// |         to distribute the copy, otherwise it will pursue its
// |         legal responsibility.
// +----------------------------------------------------------------------
// | Author: 雲溪荏苒 <290648237@qq.com>
// +----------------------------------------------------------------------

namespace service;

class SmsService
{

    /**
     * 短信宝接口
     * @param int $mobile 手机号
     * @param string $smsContent 短信内容
     * @return array
     */
    public function smsBao($mobile, $smsContent)
    {
        $statusStr = array(
            "0" => "短信发送成功",
            "-1" => "参数不全",
            "-2" => "服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！",
            "30" => "密码错误",
            "40" => "账号不存在",
            "41" => "余额不足",
            "42" => "帐户已过期",
            "43" => "IP地址限制",
            "50" => "内容含有敏感词"
        );

        $smsapi = "http://www.smsbao.com/"; //短信网关
        $user = sysconf('sms_uid'); //短信平台帐号
        $pass = md5(sysconf('sms_pwd')); //短信平台密码
        $phone = $mobile;
        $sendurl = $smsapi."sms?u=".$user."&p=".$pass."&m=".$phone."&c=".urlencode($smsContent);
        $result = file_get_contents($sendurl) ;

        $data = [
            'code' => $result,
            'message' => $statusStr[$result]
        ];

        return $data;
    }
}




