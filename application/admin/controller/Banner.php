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

use service\DataService;
use controller\BasicAdmin;
use think\Db;

/**
 * 轮播管理
 * Class Banner
 * @package app\admin\controller
 * @author andy <290648237@qq.com>
 * @date 2017/9/25
 */
class Banner extends BasicAdmin
{
    /**
     * 指定当前数据表
     * @var string
     */
    public $table = 'BannerItem';

    /**
     * 指定当前广告位数据表
     * @var string
     */
    public $bannerTable = 'Banner';

    /**
     * Banner 列表
     * @return mixed
     */
    public function index()
    {
        $banner_id = $this->request->param('banner_id');
        $this->assign('banner_id', $banner_id);
        $this->title = '轮播管理 - '. $this->get_banner_name_byid($banner_id);
        $get = $this->request->get();
        // 实例Query对象
        $map = [];
        if(isset($banner_id)){
            $map['banner_id'] = $banner_id;
        }
        $db = Db::name($this->table)->where($map);

        // 应用搜索条件
        foreach (['title'] as $key) {
            if (isset($get[$key]) && $get[$key] !== '') {
                $db->where($key, 'like', "%{$get[$key]}%");
            }
        }

        // 轮播位置名称
        $data = parent::_list($db, true, false);
        foreach($data['list'] as $key=>$list) {
            $data['list'][$key]['banner_name'] = $this->get_banner_name_byid($list['banner_id']);
        }
        return $this->fetch('', $data);
    }

    /**
     * 添加
     */
    public function add() {
        return $this->_form($this->table, 'form');
    }

    /**
     * 编辑
     */
    public function edit() {
        return $this->add();
    }

    /**
     * 删除
     */
    public function del() {
        if (DataService::update($this->table)) {
            $this->success("删除成功！", '');
        }
        $this->error("删除失败，请稍候再试！");
    }

    /**
     * 禁用
     */
    public function forbid() {
        if (DataService::update($this->table)) {
            $this->success("禁用成功！", '');
        }
        $this->error("禁用失败，请稍候再试！");
    }

    /**
     * 启用
     */
    public function resume() {
        if (DataService::update($this->table)) {
            $this->success("启用成功！", '');
        }
        $this->error("启用失败，请稍候再试！");
    }

    /**
     * 轮播位置 表单数据前缀方法
     * @param array $vo
     */
    protected function _form_filter(&$vo) {
        if ($this->request->isGet()) {
            // 轮播位置处理
            $bannerList = Db::name($this->bannerTable)->order('sort asc, id asc')->select();
            $this->assign('bannerList', $bannerList);
            $banner_id = $this->request->param('banner_id');
            if($banner_id){
                $vo['banner_id'] = $banner_id;
            }
            $bannerData = Db::name($this->bannerTable)->where('id', $banner_id)->find();
            $this->assign('bannerData', $bannerData);
        }
    }

    /**
     * 轮播位置列表
     */
    public function banner()
    {
        $this->title = '轮播位置管理';
        $db = Db::name($this->bannerTable)->order('sort asc, id asc');
        return parent::_list($db);
    }

    /**
     * 根据轮播位置id获取轮播位置名称
     * @param int $banner_id
     * @return mixed
     */
    private static function get_banner_name_byid($banner_id) {
        $result = Db::name('banner')->where('id', $banner_id)->value('name');
        return $result;
    }

    /**
     * 添加轮播位置
     */
    public function addBanner() {
        return $this->_form($this->bannerTable, 'bannerform');
    }

    /**
     * 编辑轮播位置
     */
    public function editBanner() {
        return $this->addBanner();
    }

    /**
     * 删除轮播位置
     */
    public function delBanner() {
        if (DataService::update($this->bannerTable)) {
            $this->success("删除成功！", '');
        }
        $this->error("删除失败，请稍候再试！");
    }

    /**
     * 禁用轮播位置
     */
    public function forbidBanner() {
        if (DataService::update($this->bannerTable)) {
            $this->success("禁用成功！", '');
        }
        $this->error("禁用失败，请稍候再试！");
    }

    /**
     * 启用轮播位置
     */
    public function resumeBanner() {
        if (DataService::update($this->bannerTable)) {
            $this->success("启用成功！", '');
        }
        $this->error("启用失败，请稍候再试！");
    }




}
