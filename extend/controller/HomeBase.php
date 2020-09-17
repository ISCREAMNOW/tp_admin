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
use think\Db;
use think\Session;
use think\Request;
use think\Config;
use think\Env;

/**
 * 前端基类
 * Class HomeBase
 * @package controller
 * @author andy <290648237@qq.com>
 * @date 2017/9/18
 */
class HomeBase extends Controller{

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

    protected $menu; // 前端顶部导航

    protected $footerMenu; // 前端底部导航

    protected $newsTopMenu; // 前端新闻顶部导航

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


        // 获取友情链接
        // 友情链接
        // 友情链接
        $fLinks = D('links')->getDatas(1); // 获取友情链接
        $this->assign('fLinks', $fLinks);
        $hLinks = D('links')->getDatas(2); // 获取合作单位链接
        $this->assign('hLinks', $hLinks);


        // TODO 获取前端菜单
        // 顶部导航菜单
        $this->makeMenuTree(1,$this->menu);
//        $this->makePathMenu();

        // TODO 获取前端底部菜单
        $this->makeMenuTree(2, $this->footerMenu);
//        $this->makePathMenu();

        // TODO 获取前端新闻顶部导航
        $this->makeMenuTree(5, $this->newsTopMenu);
        $this->makePathMenu();



        // 如果在控制器中没有自定义主题 则使用下面的设置
        if(!$this->themes) {
            // 设置PC端模板
            $this->themes = 'default';

            // 设置手机模板
            if($this->request->isMobile()){
                $this->redirect('http://m.apprh.com');
//                $this->redirect('/mobile');
            }
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
        }

        $this->theme(); //模板初始化
//        dump($this->menu);die;
        $this->assign('menu',$this->menu);
        $this->assign('footerMenu',$this->footerMenu);
        $this->assign('newsTopMenu',$this->newsTopMenu);

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

    protected function makeMenuTree($parent_id=0,&$parent_menu=[],$all=false){
        $db = Db::name("site_column")->alias('menu')->where('menu.pid',$parent_id);
        if(!$all){
            $db->where('status',1);
        }

        $menu = $db->order('sort asc')->select();
        foreach ($menu as $m){
            $parent_menu[$m['id']] = $m;
            $this->makeMenuTree($m['id'],$parent_menu[$m['id']]['sub'],$all);
        }
        return $menu;
    }

    private function makePathMenu(){
        $menu = Db::name("site_column")->where('pid','neq',0)->order('sort asc')->select();
        foreach ($menu as $m){
            $key = strval($m['url']);
            $this->menu_path[$key] = $m;
        }
        return $menu;
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