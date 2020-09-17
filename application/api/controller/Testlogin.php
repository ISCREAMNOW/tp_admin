<?php



namespace app\api\controller;

use controller\ApiLogin;

/**
 * 测试验证登录类
 * Class Testlogin
 * @package app\api\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2018/1/10
 */
class Testlogin extends ApiLogin
{

    /**
     * 雲溪荏苒-测试验证登录接口
     * @desc 测试验证登录接口
     * @method post
     * @parameter string token 用户token
     */
    public function index()
    {
        $this->response([], 200, '登录验证成功！');
    }
}
