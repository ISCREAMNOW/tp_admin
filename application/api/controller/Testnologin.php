<?php


namespace app\api\controller;

use app\api\service\LoginService;
use app\api\validate\BaseValidate;
use controller\ApiBase;

/**
 * 测试验证无需登录类
 * Class Testnologin
 * @package app\api\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2018/1/10
 */
class Testnologin extends ApiBase
{

    /**
     * 雲溪荏苒-测试登陆接口
     * @desc 验证用户名密码
     * @method POST
     * @parameter string username 用户名（必须）
     * @parameter string password 密码（必须）
     * @parameter string verify 手机验证码（可选）
     *
     * @response string code 状态码（默认"200"）
     * @response array data data数组
     * @response string data.member_name 用户名
     * @response string data.member_truename 真实姓名
     * @response string data.member_nickname 昵称
     * @response string data.member_token 令牌
     * @response string message 消息内容
     */
    public function login()
    {
//        halt(uniqid('xiexin'));
        // 验证参数
        $validate = new BaseValidate();
        $validate->checkParamNotNull(['username', 'password']);

        $params = $this->param;

        $username = $params['username'];
        $password = $params['password'];
        $verify   = isset($params['verify']) ? $params['verify'] : '';

        $user = db('member')->where('member_name', $username)->find();





//        halt(make_password('123456', $user['member_uniq']));
        if(isset($password) && !empty($password)){
            if($user['member_passwd'] != make_password($password, $user['member_uniq'])){

                $this->wrong(400100);
            }
        }

        // 所有验证通过
        $result = LoginService::login($user);

        if(is_int($result)){
            $this->wrong($result);
        }else{
            // 获取用户信息
            if(empty($result['member_sex'])) {
                $result['member_sex'] = 3;
            }
            if (!empty($result['member_avatar'])){
                $result['member_avatar'] = get_url_with_domain($result['member_avatar']);
            }

            // 处理时间字段
            $result['member_time'] = format_time($result['member_time'], 'Y-m-d H:i:s');
            $result['member_login_time'] = format_time($result['member_login_time'], 'Y-m-d H:i:s');
            $result['member_old_login_time'] = format_time($result['member_old_login_time'], 'Y-m-d H:i:s');

            unset($result['member_uniq'], $result['member_passwd']);
        }

        $this->response($result, 200, '登录成功！');
    }


    /**
     * 雲溪荏苒-测试登陆接口
     * @desc 验证用户名密码
     * @method POST
     * @parameter string username 用户名（必须）
     * @parameter string password 密码（必须）
     * @parameter string verify 手机验证码（可选）
     *
     * @response string code 状态码（默认"200"）
     * @response array data data数组
     * @response string data.member_name 用户名
     * @response string data.member_truename 真实姓名
     * @response string data.member_nickname 昵称
     * @response string data.member_token 令牌
     * @response string message 消息内容
     */
    public function test()
    {
        $data = db('area')->select();
        $this->response($data);
    }
}
