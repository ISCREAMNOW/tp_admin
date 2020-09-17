<?php


namespace app\admin\controller;

use axios\tpr\service\ApiDocService;
use controller\BasicAdmin;
use think\Env;


/**
 * 接口管理
 * Class Api
 * @package app\admin\controller
 * @author andy <290648237@qq.com>
 * @date 2017/05/16
 */
class Api extends BasicAdmin
{
    /**
     * 显示api列表
     * @return mixed
     */
    public function index()
    {
        $this->assign('alert', [
            'type'    => 'success',
            'title'   => '操作提示',
            'content' => '
            <p>
                <strong>类注释标识：</strong><br />
                1. @desc ; 2. @package ; <br/>
<pre style="background: #dff0d8; color:#3c763d;">
    /**
     * Class Login
     * @package app\api\controller
     * @author andy <290648237@qq.com>
     * @date 2017/05/16
     */
</pre>
            </p>
            <p>
                <strong>接口注释标识：</strong><br />
                1. @desc ; 2. @method ; 3. @parameter ; 4. @response<br/>
<pre style="background: #dff0d8; color:#3c763d;">
    /**
     * 登陆接口
     * @desc 验证用户名密码
     * @method POST
     * @parameter string username 用户名（必须）
     * @parameter string password 密码（必须）
     *
     * @response string code 状态码（默认"200"）
     * @response array data data数组
     * @response string data.member_name 用户名
     * @response string data.member_truename 真实姓名
     * @response string data.member_nickname 昵称
     * @response string data.member_token 令牌
     * @response string message 消息内容
     */
</pre>
            </p>'
        ]);

        // 设置页面标题
        $this->title = '接口管理';


        $hiddenClass = [
            /*'Testlogin', 'Testnologin',*/ 'Tools', 'Send' // 过滤不需要显示的api类
        ];
        $hiddenMethod = [
            '__construct', '__destruct', // 过滤不需要显示的方法
        ];
        $api = ApiDocService::api('api', '', $hiddenClass, $hiddenMethod);
//        halt($api);
        $this->assign('domain', Env::get('web.host'));

        return $this->fetch('index', ['list' => $api]);
    }


    /**
     * 接口调试
     * @return mixed
     */
    public function debug()
    {
        $class = $this->request->param('class');
        $this->assign('class_name',$class);
        $method = $this->request->param('method');

        $result = ApiDocService::makeMethodDoc($class,$method);
        $this->assign('domain',Env::get('web.host'));

        $url = empty($result['route']) ? $result['path'] : $result['route'];
        $url = Env::get('web.host').$url;
        $result['url'] = $url;
        
        $this->assign('requestUrl', $url);
        return $this->fetch('debug', ['data' => $result]);
    }

}
