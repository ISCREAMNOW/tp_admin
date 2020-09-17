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
 * wap 端基类
 * Class BasicMobile
 * @package controller
 * @author andy <290648237@qq.com>
 * @date 2017/9/28
 */
class BasicMobile extends Controller{

    protected $param;

    protected $themes;

    protected $template_dir;

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

        //mca定位兼容ajax
        $aName = $this->action;
        $ajaxArr = ['ajax','ajaxAsk','ajaxPost'];
        if(in_array($aName, $ajaxArr)){
            $aNameArr = ['act'=>I('act'),'sAction'=>I('sAction'),'action'=>I('action')];
            $aNameArr = array_filter($aNameArr);
            sort($aNameArr);
            $aName = $aName.'/logic/'.$aNameArr[0];
        }

        $mca = $this->module.'/'.$this->controller.'/'.$aName; //定位动作

        // TODO 初始化检查登录状态

        // TODO 获取前端菜单


        // TODO 初始化地区选择数据
        // 获取地区列表
        $areaList = D('area')->getOpenAreaList();
        $this->assign('areaList', $areaList);

        $currentAreaId = 25;
        if(session('current_area_id')) {
            // 如果session中不存在默认地区id 则将默认地区设置为云南 25
            $currentAreaId = session('current_area_id');
        }
        $currentAreaName = D('area')->getAreaNameById($currentAreaId);

        $this->assign('currentAreaId', $currentAreaId); // 初始化默认地区为云南
        $this->assign('currentAreaName', $currentAreaName);

        // 如果在控制器中没有自定义主题 则使用下面的设置
        $this->themes = '';
//        if(!$this->themes) {
//            // 设置PC端模板
//            $this->themes = 'default';
//
//            // 设置手机模板
//            if ($this->request->isMobile()) {
//
//                // 过滤不跳转手机端的页面
//                $filterArr = [
//                    'module' => [
//                        'cms'
//                    ],
//                    'mca' => [
////                        'home/Tools/test'
//                    ]
//                ];
//                if(!in_array($this->module, $filterArr['module']) && !in_array($mca, $filterArr['mca'])){
//                    //手机端模板
//                    $this->themes = 'mobile';
//                }
//            }
//        }

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

    protected function fetch($template = '', $vars = [], $replace = [], $config = [])
    {
        if($template == '') {
            // 如果传入的模板为空则调用当前action方法
            $template = strtolower($this->request->action());
        }
        $this->template_dir = $this->themes.":".strtolower($this->request->module()).":".strtolower($this->request->controller()).":".$template;
        $config['view_path'] = Config::get("template.view_path") . $this->themes . "/";

        return parent::fetch($this->template_dir, $vars, $replace, $config); // TODO: Change the autogenerated stub
    }

//    public function _empty(){
//        echo __FUNCTION__;
//        return "the function not exits";
//    }

    public function __destruct()
    {
        // TODO: Implement __destruct() method.
        Session::set('last_url',$this->request->url());
    }
}