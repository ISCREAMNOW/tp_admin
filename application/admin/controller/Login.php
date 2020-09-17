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

namespace app\admin\controller;

use controller\BasicAdmin;
use service\LogService;
use service\NodeService;
use think\Db;
use think\Request;
use think\Validate;

/**
 * 系统登录控制器
 * class Login
 * @package app\admin\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/02/10 13:59
 */
class Login extends BasicAdmin
{

    /**
     * 控制器基础方法
     */
    public function _initialize()
    {
        if (session('user') && $this->request->action() !== 'out') {
            $this->redirect('@admin');
        }
    }

    /**
     * 用户登录
     * @return string
     */
    public function index(Request $request)
    {
        if ($this->request->isGet()) {
            return $this->fetch('', ['title' => '用户登录']);
        }

        if ($request->isPost()) {
            $post = $request->post()['AdminLoginModel'];
//            halt($post);
            // 验证规则
//            $rule = [
//                'AdminLoginModel.username' => 'required|string',
//                'AdminLoginModel.password' => 'required|string',
//            ];
//            // 错误信息提示
//            $msg = [
//                'AdminLoginModel.username' => '用户名不能为空',
//                'AdminLoginModel.password' => '密码不能为空',
//            ];
//            // 实例化验证类
//            $validate = new Validate($rule, $msg);
//            $validate->check($post);
//            $error = $validate->getError();
//
//            // 验证不通过 输出错误信息
//            if (!empty($error)) {
//                $this->error($error);
//            }


            // 验证码 TODO 网站上线后取消注释
            $verifyCode = trim($post['verifyCode']);
            if( !captcha_check($verifyCode) ) {
                flash('error', '验证码不正确');
                $this->redirect(url('@admin/login'));
//                $this->error('验证码不正确');
            }

            // 输入数据效验
            $username = trim($post['username']);
            $password = trim($post['password']);
//            $username = $this->request->post('username', '', 'trim');
//            $password = $this->request->post('password', '', 'trim');
            if (strlen($username) < 4) {
                flash('error', '登录账号长度不能少于4位有效字符!');
                $this->redirect(url('@admin/login'));
            }
            if (strlen($password) < 4) {
                flash('error', '登录密码长度不能少于4位有效字符!');
                $this->redirect(url('@admin/login'));
            }
//            strlen($username) < 4 && $this->error('登录账号长度不能少于4位有效字符!');
//            strlen($password) < 4 && $this->error('登录密码长度不能少于4位有效字符!');
            // 用户信息验证
            $user = Db::name('SystemUser')->where('username', $username)->find();
            if (empty($user)) {
                flash('error', '登录账号不存在，请重新输入!');
                $this->redirect(url('@admin/login'));
            }
            if (($user['password'] !== md5($password))) {
                flash('error', '登录密码与账号不匹配，请重新输入!');
                $this->redirect(url('@admin/login'));
            }
            if (empty($user['status'])) {
                flash('error', '账号已经被禁用，请联系管理!');
                $this->redirect(url('@admin/login'));
            }
//            empty($user) && flash('error', '登录账号不存在，请重新输入!'); //$this->error('登录账号不存在，请重新输入!');
//            ($user['password'] !== md5($password)) && flash('error', '登录密码与账号不匹配，请重新输入!');//$this->error('登录密码与账号不匹配，请重新输入!');
//            empty($user['status']) && flash('error', '账号已经被禁用，请联系管理!'); //$this->error('账号已经被禁用，请联系管理!');
            // 更新登录信息
            $data = ['login_at' => time(), 'login_num' => ['exp', 'login_num+1']];
            Db::name('SystemUser')->where(['id' => $user['id']])->update($data);
            session('user', $user);
            !empty($user['authorize']) && NodeService::applyAuthNode();
            LogService::write('系统管理', '用户登录系统成功');
            flash('success', '登录成功，正在进入系统...');
            $this->redirect(url('@admin'));
//            $this->success('登录成功，正在进入系统...', '@admin');
        }
    }

    /**
     * 退出登录
     */
    public function out()
    {
        LogService::write('系统管理', '用户退出系统成功');
        session('user', null);
        session_destroy();
        $this->success('退出登录成功！', '@admin/login');
    }

    public function verify_code(){
        ob_clean();
        $array = array(
            'imageW' => 180,
//            'imageH' => 49,
            'length' => 4,
            'fontSize'=> 24,
            'useNoise' => false,
            'useCurve' => false,
        );

        return captcha("", $array);
    }
}
