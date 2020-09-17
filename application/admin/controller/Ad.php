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
 * 广告管理
 * Class Ad
 * @package app\admin\controller
 * @author andy <290648237@qq.com>
 * @date 2017/9/25
 */
class Ad extends BasicAdmin
{

    /**
     * 指定当前数据表
     * @var string
     */
    public $table = 'Ad';

    /**
     * 指定当前广告位数据表
     * @var string
     */
    public $positionTable = 'AdPosition';

    /**
     * 广告列表
     * @return mixed
     */
    public function index()
    {
        $position_id = $this->request->param('position_id');
        $this->assign('position_id', $position_id);
        $this->title = '广告管理 - '. $this->_get_pname_byid($position_id);

        $get = $this->request->get();
        // 实例Query对象
        $map = [];
        if(isset($position_id)){
            $map['position_id'] = $position_id;
        }
        $db = Db::name($this->table)->where($map);

        // 应用搜索条件
        foreach (['name'] as $key) {
            if (isset($get[$key]) && $get[$key] !== '') {
                $db->where($key, 'like', "%{$get[$key]}%");
            }
        }

        // 广告位名称
        $data = parent::_list($db, true, false);
        foreach($data['list'] as $key=>$list) {
            $data['list'][$key]['position_name'] = $this->_get_pname_byid($list['position_id']);
        }
        return $this->fetch('', $data);
    }

    /**
     * 添加广告
     */
    public function add() {
        return $this->_form($this->table, 'form');
    }

    /**
     * 编辑广告
     */
    public function edit() {
        return $this->add();
    }

    /**
     * 删除广告
     */
    public function del() {
        if (DataService::update($this->table)) {
            $this->success("删除成功！", '');
        }
        $this->error("删除失败，请稍候再试！");
    }

    /**
     * 禁用广告
     */
    public function forbid() {
        if (DataService::update($this->table)) {
            $this->success("禁用成功！", '');
        }
        $this->error("禁用失败，请稍候再试！");
    }

    /**
     * 启用广告
     */
    public function resume() {
        if (DataService::update($this->table)) {
            $this->success("启用成功！", '');
        }
        $this->error("启用失败，请稍候再试！");
    }

    /**
     * 广告位 表单数据前缀方法
     * @param array $vo
     */
    protected function _form_filter(&$vo) {
        if ($this->request->isGet()) {
            // 广告位处理
            $positionList = Db::name($this->positionTable)->order('sort asc, id asc')->select();
            $this->assign('positionList', $positionList);
            $position_id = $this->request->param('position_id');
            if($position_id){
                $vo['position_id'] = $position_id;
            }
            $positionData = Db::name($this->positionTable)->where('id', $position_id)->find();

            $this->assign('positionData', $positionData);
        }
    }

    /**
     * 广告位列表
     */
    public function position()
    {
        $this->title = '广告位管理';
        $db = Db::name($this->positionTable)->order('sort asc, id asc');
        return parent::_list($db, false);

    }

    /**
     * 根据广告位id获取广告位名称
     * @param int $position_id
     * @return mixed
     */
    private static function _get_pname_byid($position_id) {
        $result = Db::name('ad_position')->where('id', $position_id)->value('position');
        return $result;
    }

    /**
     * 添加广告位
     */
    public function addPosition() {
        return $this->_form($this->positionTable, 'positionform');
    }

    /**
     * 编辑广告位
     */
    public function editPosition() {
        return $this->addPosition();
    }

    /**
     * 删除广告位
     */
    public function delPosition() {
        if (DataService::update($this->positionTable)) {
            $this->success("删除成功！", '');
        }
        $this->error("删除失败，请稍候再试！");
    }

    /**
     * 禁用广告位
     */
    public function forbidPosition() {
        if (DataService::update($this->positionTable)) {
            $this->success("禁用成功！", '');
        }
        $this->error("禁用失败，请稍候再试！");
    }

    /**
     * 启用广告位
     */
    public function resumePosition() {
        if (DataService::update($this->positionTable)) {
            $this->success("启用成功！", '');
        }
        $this->error("启用失败，请稍候再试！");
    }




}
