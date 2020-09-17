<?php
// +----------------------------------------------------------------------
// | Ht.Memorial
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2017 http://www.yn123.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: andy <290648237@qq.com>
// +----------------------------------------------------------------------

namespace app\admin\controller;


use controller\BasicAdmin;
use service\DataService;
use service\ToolsService;
use think\Db;

/**
 * 网站前端栏目管理
 * Class Column
 * @package app\admin\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/10/3
 */
class Column extends BasicAdmin
{
    /**
     * 绑定操作模型
     * @var string
     */
    public $table = 'SiteColumn';

    /**
     * 栏目列表
     */
    public function index()
    {
        $this->title = '网站栏目管理';
        $db = Db::name($this->table)->order('sort asc,id asc');
        return parent::_list($db, false);
    }

    /**
     * 列表数据处理
     * @param array $data
     */
    protected function _index_data_filter(&$data) {
        foreach ($data as &$vo) {
//            ($vo['url'] !== '#') && ($vo['url'] = url($vo['url']));
            $vo['ids'] = join(',', ToolsService::getArrSubIds($data, $vo['id']));
        }
        $data = ToolsService::arr2table($data);
    }

    /**
     * 添加栏目
     * @return array|string
     */
    public function add()
    {
        return $this->_form($this->table, 'form');
    }

    /**
     * 编辑栏目
     * @return array|string
     */
    public function edit()
    {
        return $this->add();
    }

    /**
     * 表单数据前缀方法
     * @param array $vo
     */
    protected function _form_filter(&$vo)
    {

        if($this->request->isGet()) {
            // 上级栏目处理
            $_menus = Db::name($this->table)->where('status', '1')->order('sort desc,id asc')->select();
            $menus = ToolsService::arr2table($_menus);
            foreach ($menus as $key => &$menu) {
                if (substr_count($menu['path'], '-') > 3) {
                    unset($menus[$key]);
                    continue;
                }
                if(isset($vo['pid'])) {
                    $current_path = "-{$vo['pid']}-{$vo['id']}";
                    if($vo['pid'] !== '' && (stripos("{$menu['path']}-", "{$current_path}-") !== false || $menu['path'] === $current_path)) {
                        unset($menus[$key]);
                    }
                }
            }
            //读取系统功能节点 todo

            $this->assign('menus', $menus);

            // 读取分类列表/单页列表
            $_cateList = Db::name('cms_article_class')->select();
            $pageList = Db::name('article')->select();
            $cateList = ToolsService::arr2table($_cateList, 'class_id');

//            dump($pageList);die;
            $this->assign('cateList', $cateList);
            $this->assign('pageList', $pageList);
        } else {
            // post
            if ($vo['url_id'] != '' && $vo['url'] == '') {
                // 如果栏目地址文本框内容为空 则取下拉框中的值
                $urlIdArr = explode('_', $vo['url_id']);

                if ($urlIdArr[0] == 'category') {
                    // 属于分类ID 拼接url地址
                    $vo['url'] =/* 'frontend/News/lists/ac_id/'.$urlIdArr[1].'.html'; */url('frontend/News/lists', ['ac_id' => $urlIdArr[1]]);
                    $vo['category_id'] = $urlIdArr[1];
                    $vo['page_id'] = 0;
                }elseif ($urlIdArr[0] == 'page') {
                    // 属于单页ID
//                    $pageInfo = PageModel::getDataById($urlIdArr[1]);
//                    if($pageInfo['name'] != '') {
//                        // 如果单页标识不为空
//                        $vo['short_name'] = $pageInfo['name'];
//                    }
                    $vo['url'] = /*'/frontend/Article/view/aid/'.$urlIdArr[1].'.html'; */ url('frontend/Article/show', ['article_id' => $urlIdArr[1]]);
                    $vo['page_id'] = $urlIdArr[1];
                    $vo['category_id'] = 0;
                } else {
                    // 默认为空 拼接url地址
                    $vo['url'] = '/'; //url('/');
                }
            }

            unset($vo['url_id']);
        }
    }

    /**
     * 删除栏目
     */
    public function del()
    {
        if(DataService::update($this->table)) {
            $this->success("栏目删除成功！", '');
        }
        $this->error("栏目删除失败，请稍后再试！");
    }

    /**
     * 栏目禁用
     */
    public function forbid()
    {
        if(DataService::update($this->table)) {
            $this->success("栏目禁用成功！", '');
        }
        $this->error("栏目禁用失败，请稍后再试！");
    }

    public function resume()
    {
        if(DataService::update($this->table)) {
            $this->success("栏目启用成功！", '');
        }
        $this->error("栏目启用失败，请稍后再试！");
    }
}
