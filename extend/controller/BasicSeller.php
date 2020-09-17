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

namespace controller;

use think\Controller;
use think\Session;
use think\Request;
use think\Config;
use think\Env;

/**
 * 商家后台基类
 * Class BasicSeller
 * @package controller
 * @author andy <290648237@qq.com>
 * @date 2017/9/23
 */
class BasicSeller extends Controller{

    protected $param;

    protected $themes;

    protected $method;

    protected $config;

    protected $windowEnv; // js 全局变量设置

    // 获取当前的模块，控制器和方法名
    protected $module = ''; // 页面module
    protected $controller = ''; // 页面controller
    protected $action = ''; // 页面action


    function __construct(Request $request = null)
    {
        parent::__construct($request);
        $this->config = Config::get('setting.home');
        $this->param = $request->param();
        $this->method = $request->method();

        // 获取当前的模块，控制器和方法名
        $this->module = $this->request->module();
        $this->controller = $this->request->controller();
        $this->action = $this->request->action();

        $this->assign('module', $this->module); // 页面中的模型名称
        $this->assign('controller', $this->controller); // 页面中的控制器名称
        $this->assign('action', $this->action); // 页面中的方法名称

        // TODO 初始化检查登录状态
        if (!in_array($this->action, ['login', 'register', 'logout'])) {
            // 判断是否登录
            if (empty(\session('seller_id_admin'))){
                $this->redirect(url('/seller/Login/login'));
            }

            // 检查访问权限
            if(\session('seller_is_admin') !== 1 && $this->action !== 'seller_center' && $this->action !== 'logout') {
                // 通过权限组检查用户权限
                // TODO 登录时存入卖家权限列表session
                if(!in_array($this->action, \session('seller_limits'))) {
                    $this->error('没有权限');
                }
            }

            // 卖家中心菜单
            $this->assign('menu', \session('seller_menu')); // TODO 登录时存入卖家菜单session

            // 当前菜单
            $currentMenu = $this->_getCurrentMenu(\session('seller_function_list'));
            $this->assign('current_menu', $currentMenu);

            // 左侧菜单
            $sellerMenu = \session('seller_menu');
            if($this->action == 'seller_center') {
                $leftMenu = [];
            }else {
                $leftMenu = @$sellerMenu[$currentMenu['model']]['child'];
            }
//            dump($currentMenu);die;
            $this->assign('left_menu', $leftMenu);



        }





        // 如果在控制器中没有自定义主题 则使用下面的设置
        if(!$this->themes) {
            // 设置PC端模板
            $this->themes = 'default';

            // 设置手机模板
//            if($this->request->isMobile()) {
//                // 手机端模板
//                $this->themes = 'mobile';
//            }
        }

        $this->theme(); //模板初始化

    }

    /**
     * 设置js全局变量
     * @param $data
     */
    public function setValueInEnv($data){
        foreach($data as $k => $v){
            $this->windowEnv[$k] = $v;
        }
        $this->assign('windowEnv',json_encode($this->windowEnv,JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK));
    }

    /**
     * ajax 返回
     * @param int $result
     * @param array $data
     * @param string $msg
     * @return mixed
     */
    protected function response($result = 0, $data = [], $msg = ''){
        return json(['result' => $result, 'data' => $data, 'msg' => $msg]);
    }


    /*模板相关*/
    protected function theme(){


        $this->windowEnv['domain'] = Env::get('web.host');

        $this->assign('windowEnv',json_encode($this->windowEnv));

        $this->assign('web_title', sysconf('web_title'));
        $this->assign('seo_title', sysconf('seo_title'));
        $this->assign('seo_keywords', sysconf('seo_keywords'));
        $this->assign('seo_description', sysconf('seo_description'));

    }


    /**
     * 卖家登录成功 创建session
     *
     * @param array $sellerInfo
     * @param array $hospitalInfo
     * @param array $memberInfo
     * @param array $sellerGroupInfo
     */
    public function createSession($sellerInfo = [], $hospitalInfo = [], $memberInfo = [], $sellerGroupInfo = [])
    {

        session('is_login', 1);
        session('member_id', $memberInfo['member_id']);
        session('member_name', $memberInfo['member_name']);
        session('member_email', $memberInfo['member_email']);
        session('avatar', $memberInfo['member_avatar']);
        session('grade_id', $hospitalInfo['grade_id']);
        session('seller_id_admin', 1);
        session('seller_id', $sellerInfo['seller_id']);
        session('seller_id_admin', $sellerInfo['seller_id']);
        session('seller_name', $sellerInfo['seller_name']);
        session('seller_is_admin', $sellerInfo['is_admin']);
        session('hospital_id', $sellerInfo['hospital_id']);
        session('hospital_name', $hospitalInfo['h_name']);
        session('is_own_shop', $hospitalInfo['is_own_shop']);
        session('seller_limits', explode(',', $sellerGroupInfo['limits']));

        if($sellerInfo['is_admin']) {
            session('seller_group_name', '管理员');
            session('seller_smt_limits', false);
        } else {
            session('seller_group_name', $sellerGroupInfo['group_name']);
            session('seller_smt_limits', explode(',', $sellerGroupInfo['smt_limits']));
        }
        if(!$sellerInfo['last_login_time']) {
            $sellerInfo['last_login_time'] = time();
        }
        session('seller_last_login_time', format_time($sellerInfo['last_login_time']));
        $sellerMenu = $this->getSellerMenuList($sellerInfo['is_admin'], explode(',', $sellerGroupInfo['limits']));
        session('seller_menu', $sellerMenu['seller_menu']);
        session('seller_function_list', $sellerMenu['seller_function_list']);
    }

    /**
     * 获取卖家菜单列表
     *
     * @param $isAdmin
     * @param $limitsArr
     * @return array
     */
    public function getSellerMenuList($isAdmin, $limitsArr)
    {
       // 将不需要显示的左侧菜单过滤掉 show_left = 0
        $menuList = $this->_getMenuList();
//        foreach ($menuList as $key => $value) {
//            foreach ($value['child'] as $childKey => $childValue) {
//                if(!$childValue['show_left']) {
//                    unset($menuList[$key]['child'][$childKey]);
//                }
//            }
//        }

        $sellerMenu = [];
        if($isAdmin !== 1){
            // 如果不是管理员 则根据权限过滤菜单
//            $menuList = $this->_getMenuList();
            foreach ($menuList as $key => $value) {
                foreach ($value['child'] as $childKey => $childValue) {
                    if (!in_array($childValue['act'], $limitsArr)) {
                        unset($menuList[$key]['child'][$childKey]);
                    }
                }
                if (count($menuList[$key]['child']) > 0) {
                    $sellerMenu[$key] = $menuList[$key];
                }
            }
        } else {
            $sellerMenu = $menuList;//$this->_getMenuList();
        }
        $sellerFuncList = $this->_getSellerFunctionList($sellerMenu);
        return ['seller_menu' => $sellerMenu, 'seller_function_list' => $sellerFuncList];
    }

    private function _getCurrentMenu($sellerFuncList) {

        $currentMenu = @$sellerFuncList[$this->action];
        if(empty($currentMenu)) {
            $currentMenu = array(
                'model' => 'seller_center',
                'model_name' => '首页'
            );
        }
        return $currentMenu;
    }

    private function _getMenuList() {
        $menuList = [
            'doctors' => [
                'name' => '医生',

                'child' => [
                    [
                        'name' => '医生管理',
                        'url' => '/seller/Doctor/doctor_list',
                        'act' => 'doctor_list',
                        'show_left' => 1
                    ],
                    [
                        'name' => '医生添加',
                        'url' => '/seller/Doctor/doctor_add',
                        'act' => 'doctor_add',
                        'show_left' => 1
                    ],
                    [
                        'name' => '医生编辑',
                        'url' => 'javascript:;',
                        'act' => 'doctor_edit',
                        'show_left' => 0
                    ],
                    [
                        'name' => '编辑图片',
                        'url' => 'javascript:;',
                        'act' => 'edit_image',
                        'show_left' => 0
                    ]
                ]
            ],
            'hospital' => [
                'name' => '医院',
                'child' => [
                    [
                        'name' => '医院信息',
                        'url' => '/seller/Hospital/hospital_info',
                        'act' => 'hospital_info',
                        'show_left' => 1
                    ],
                    [
                        'name' => '医院设置',
                        'url' => '/seller/Hospital/hospital_edit',
                        'act' => 'hospital_edit',
                        'show_left' => 1
                    ],
                    [
                        'name' => '医院图片',
                        'url' => '/seller/Hospital/hospital_image',
                        'act' => 'hospital_image',
                        'show_left' => 1
                    ],
                    [
                        'name' => '科室管理',
                        'url' => '/seller/Department/department_list',
                        'act' => 'department_list',
                        'show_left' => 1
                    ],
                    [
                        'name' => '添加科室',
                        'url' => '/seller/Department/department_add',
                        'act' => 'department_add',
                        'show_left' => 0
                    ],
                    [
                        'name' => '编辑科室',
                        'url' => 'javascript:;',
                        'act' => 'department_edit',
                        'show_left' => 0
                    ],
                    [
                        'name' => '续签列表',
                        'url' => '/seller/Hospital/renew_list',
                        'act' => 'renew_list',
                        'show_left' => 0
                    ],
                    [
                        'name' => '申请续签',
                        'url' => '/seller/Hospital/renew_add',
                        'act' => 'renew_add',
                        'show_left' => 0
                    ]
                ]
            ],
            'article' => [
                'name' => '文章',
                'child' => [
                    [
                        'name' => '文章管理',
                        'url' => '/seller/Article/article_list',
                        'act' => 'article_list',
                        'show_left' => 1
                    ],
                    [
                        'name' => '添加文章',
                        'url' => '/seller/Article/article_add',
                        'act' => 'article_add',
                        'show_left' => 0
                    ],
                    [
                        'name' => '编辑文章',
                        'url' => 'javascript:;',
                        'act' => 'article_edit',
                        'show_left' => 0
                    ],
                ]
            ],
            'account' => [
                'name' => '帐号',
                'child' => [
                    [
                        'name' => '帐号管理',
                        'url' => '/seller/Account/account_list',
                        'act' => 'account_list',
                        'show_left' => 1
                    ],
                    [
                        'name' => '添加管理员',
                        'url' => '/seller/Account/account_add',
                        'act' => 'account_add',
                        'show_left' => 0
                    ],
                    [
                        'name' => '编辑管理员',
                        'url' => 'javascript:;',
                        'act' => 'account_edit',
                        'show_left' => 0
                    ],
                    [
                        'name' => '管理员授权',
                        'url' => 'javascript:;',
                        'act' => 'auth_set',
                        'show_left' => 0
                    ],
                    [
                        'name' => '角色列表',
                        'url' => '/seller/Role/role_list',
                        'act' => 'role_list',
                        'show_left' => 1
                    ],
                    [
                        'name' => '添加角色',
                        'url' => '/seller/Role/role_add',
                        'act' => 'role_add',
                        'show_left' => 0
                    ],
                    [
                        'name' => '编辑角色',
                        'url' => 'javascript:;',
                        'act' => 'role_edit',
                        'show_left' => 0
                    ],
                    [
                        'name' => '操作日志',
                        'url' => '/seller/Log/log_list',
                        'act' => 'log_list',
                        'show_left' => 1
                    ],

                ]
            ],
        ];


        return $menuList;
    }

    private function _getSellerFunctionList($menuList) {
        $format_menu = [];
        foreach ($menuList as $key => $menu_value) {
            foreach ($menu_value['child'] as $submenu_value) {
                $format_menu[$submenu_value['act']] = array(
                    'model' => $key,
                    'model_name' => $menu_value['name'],
                    'name' => $submenu_value['name'],
                    'act' => $submenu_value['act'],
                );
            }
        }
        return $format_menu;
    }





    public function _empty(){
        echo __FUNCTION__;
        return "the function not exits";
    }

    public function __destruct()
    {
        // TODO: Implement __destruct() method.
//        Session::set('last_url',$this->request->url());
    }
}