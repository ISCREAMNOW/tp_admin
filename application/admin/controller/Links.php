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
 * 友链管理
 * Class Links
 * @package app\admin\controller
 * @author andy <290648237@qq.com>
 * @date 2017/6/16
 */
class Links extends BasicAdmin
{
    /**
     * 指定当前数据表
     * @var string
     */
    public $table = 'Links';

    /**
     * 列表
     */
    public function index()
    {
        $this->title = '友链管理';
        $db = Db::name($this->table)->order('sort asc, id asc');

        $data = parent::_list($db, true, false);
        foreach($data['list'] as $key=>$list) {
            if($list['type'] == 1) {
                $typeName = '友情链接';
            }else{
                $typeName = '合作单位';
            }
            $data['list'][$key]['typeName'] = $typeName;
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
     * 表单数据前缀方法
     * @param array $vo
     */
    protected function _form_filter(&$vo) {
        if ($this->request->isGet()) {
            $linkTypes = [
                1 => '友情链接',
                2 => '合作单位'
            ];
            $this->assign('linkTypes', $linkTypes);
        }
    }


}
