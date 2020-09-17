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
use service\DataService;
use service\NodeService;
use service\ToolsService;

/**
 * 系统功能节点管理
 * Class Node
 * @package app\admin\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/02/15 18:13
 */
class Node extends BasicAdmin
{

    /**
     * 指定当前默认模型
     * @var string
     */
    public $table = 'SystemNode';

    /**
     * 显示节点列表
     */
    public function index()
    {
        $nodes = ToolsService::arr2table(NodeService::get(), 'node', 'pnode');
        $alert = ['type' => 'danger', 'title' => '安全警告', 'content' => '结构为系统自动生成, 状态数据请勿随意修改!'];
        return view('', ['title' => '系统节点管理', 'nodes' => $nodes, 'alert' => $alert]);
    }

    /**
     * 保存节点变更
     */
    public function save()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();
            if (isset($post['list'])) {
                $data = [];
                foreach ($post['list'] as $vo) {
                    $data['node'] = $vo['node'];
                    $data[$vo['name']] = $vo['value'];
                }
                !empty($data) && DataService::save($this->table, $data, 'node');
                $this->success('参数保存成功！', '');
            }
        } else {
            $this->error('访问异常，请重新进入...');
        }
    }

}
