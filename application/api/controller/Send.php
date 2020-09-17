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

namespace app\api\controller;

use service\SmsService;
use think\Controller;

error_reporting(0);

/**
 * Class Send
 * @package app\api\controller
 */
class Send extends Controller {

    public function sendLoginSms()
    {
        $smsService = new SmsService();

        $mobile = $this->request->param('mobile');

        $verify_code = rand(100,999).rand(100,999);
        $data = array();
        $data['auth_code'] = $verify_code;
        $data['send_acode_time'] = time();
        session($mobile, $verify_code);
//        $update = D('member')->editMemberCommon($data, array('member_id'=>session('member_id')));
//        if (!$update) {
//            return result(-1, '系统发生错误，如有疑问请与管理员联系', 'mobile');
//        }

        $param = array();
        $param['send_time'] = date('Y-m-d H:i',time());
        $param['verify_code'] = $verify_code;
        $param['web_title']	= config('web_title');
        $message =  /*"【".$param['web_title']."】*/"您本次请求登录的验证码是".$verify_code."。请在页面中提交验证码完成验证。";

        $result = $smsService->smsBao($mobile, $message);

        return $result;
    }

    public function sendRegisterSms()
    {
        $smsService = new SmsService();

        $mobile = $this->request->param('mobile');

        $verify_code = rand(100,999).rand(100,999);
        $data = array();
        $data['auth_code'] = $verify_code;
        $data['send_acode_time'] = time();
        session($mobile, $verify_code);
//        $update = D('member')->editMemberCommon($data, array('member_id'=>session('member_id')));
//        if (!$update) {
//            return result(-1, '系统发生错误，如有疑问请与管理员联系', 'mobile');
//        }

        $param = array();
        $param['send_time'] = date('Y-m-d H:i',time());
        $param['verify_code'] = $verify_code;
        $param['web_title']	= config('web_title');
        $message =  /*"【".$param['web_title']."】*/"您本次请求注册的验证码是".$verify_code."。请在页面中提交验证码完成验证。";

        $result = $smsService->smsBao($mobile, $message);

        return $result;
    }

    /**
     * andy-发送邮件
     * @desc PHPMail
     * @parameter string to_email 接受者邮箱地址（必须）
     * @parameter string subject 邮件主题（必须）
     * @parameter string content 邮件内容（必须）
     * @parameter string to_name 接受者名称（可选）
     * @method POST
     */
    public function email()
    {
        $params = $this->request->param();
        $toemail = $params['to_email'];
        $toName = $params['to_name'];
        $subject = $params['subject'];
        $content = $params['content'];
        $result = send_mail($toemail, $toName, $subject, $content);
        if($result) {
            $this->result(null, 200, '邮件发送成功');
        }else {
            $this->result(null, 0, $result);
        }
    }


    /**
     * 验证码
     */
    public function verify_code()
    {
        $array = array(
            'imageW' => 100,
            'imageH' => 40,
            'length' => 4,
            'fontSize'=>14,
            'useNoise' => false,
            'useCurve' => false,
        );

        return captcha("", $array);
    }

    public function check_captcha_code()
    {

    }






}