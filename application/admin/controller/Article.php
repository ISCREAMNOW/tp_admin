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
use service\ToolsService;
use think\Db;

/**
 * 文章管理
 * Article
 * @package app\admin\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/18
 */
class Article extends BasicAdmin
{
    /**
     * shop_article_class表
     */
    public $categoryTable = 'article_class';

    /**
     * shop_article表
     */
    public $articleTable = 'article';


    /**
     * 文章分类管理
     */
    public function category()
    {
        $this->title = '文章分类管理';
        $db = Db::name($this->categoryTable)->order('ac_sort asc, ac_id asc');
        return parent::_list($db, false);
    }

    /**
     * 文章分类 列表数据处理
     * @param array $data
     */
    protected function _category_data_filter(&$data)
    {
        foreach ($data as &$vo) {

            $vo['ids'] = join(',', ToolsService::getArrSubIds($data, $vo['ac_id'], 'ac_id', 'ac_parent_id'));
        }
        $data = ToolsService::arr2table($data, 'ac_id', 'ac_parent_id');
    }


    /**
     * 添加、编辑文章分类
     */
    public function addCategory() {
        return $this->_form($this->categoryTable, 'categoryform');
    }


    /**
     * 文档分类 表单数据前缀方法
     * @param array $vo
     */
    protected function _addCategory_form_filter(&$vo) {
        $this->_article_form_filter($vo);
    }


    /**
     * 删除文章分类
     */
    public function delCategory() {
        if (DataService::update($this->categoryTable)) {
            $this->success("删除成功！", '');
        }
        $this->error("删除失败，请稍候再试！");
    }


    /**
     * 文章分类 表单数据前缀方法
     * @param array $vo
     */
    protected function _article_form_filter(&$vo) {
        if ($this->request->isGet()) {
            // 上级分类处理
            $_menus = Db::name($this->categoryTable)->order('ac_sort asc,ac_id asc')->select();
            $_menus[] = ['ac_name' => '顶级分类', 'ac_id' => '0', 'ac_parent_id' => '-1'];

            $menus = ToolsService::arr2table($_menus,"ac_id","ac_parent_id");

            foreach ($menus as $key => &$menu) {
                if (substr_count($menu['path'], '-') > 3) {
                    unset($menus[$key]);
                    continue;
                }
                if (isset($vo['ac_parent_id'])) {
                    $current_path = "-{$vo['ac_parent_id']}-{$vo['ac_id']}";
                    if ($vo['ac_parent_id'] !== '' && (stripos("{$menu['path']}-", "{$current_path}-") !== false || $menu['path'] === $current_path)) {
                        unset($menus[$key]);
                    }
                }
            }
            $this->assign('menus', $menus);
        }
    }

    /***************************** 单页内容管理 *****************************/
    /**
     * 文章列表
     */
    public function article()
    {
        $this->title = '文章管理';
        $get = $this->request->get();

        // 根据分类搜索文章
        if(isset($get['ac_id']) && $get['ac_id'] !== '' && $get['ac_id'] != '-1') {
            $cateIds = $this->_searchByCategory($get['ac_id']);
            if($cateIds !== '') {
                $db = Db::name($this->articleTable)->where('ac_id', 'in', $cateIds);
            }else {
                $db = Db::name($this->articleTable)->where('ac_id', $get['ac_id']);
            }
        }else {
            // 实例Query对象
            $db = Db::name($this->articleTable);
        }

        // 应用搜索条件
        foreach (['article_title', 'article_show'] as $key) {
            if (isset($get[$key]) && $get[$key] !== '') {
                $db->where($key, 'like', "%{$get[$key]}%");
            }
        }

        // 文章分类名称
        $data = parent::_list($db, true, false);
        foreach($data['list'] as $key=>$list) {
            $data['list'][$key]['cname'] = Db::name($this->categoryTable)->where('ac_id', $list['ac_id'])->value('ac_name');
        }

        // 获取文章分类
        $menus = $this->_getDocumentCategory();
        $this->assign('menus', $menus);
        return $this->fetch('', $data);
    }



    /**
     * 根据文章分类搜索
     * @param int $ac_id 文章分类id
     * @return array|string
     */
    private function _searchByCategory($ac_id) {
        $cateData = Db::name($this->categoryTable)->where('ac_id', $ac_id)->field('ac_id')->select();
        $cateIds = [];
        foreach ($cateData as $cate) {
            $cateIds[] = $cate['ac_id'];

        }
        $cateIds = implode(',', $cateIds);
        return $cateIds;
    }

    /**
     * 获取文章分类 辅助方法
     * @return array
     */
    private function _getDocumentCategory() {
        // 文章分类处理
        $_menus = Db::name($this->categoryTable)->order('ac_sort asc,ac_id asc')->select();

        $menus = ToolsService::arr2table($_menus,'ac_id','ac_parent_id');
        foreach ($menus as $key => &$menu) {

            if (substr_count($menu['path'], '-') > 3) {
                unset($menus[$key]);
                continue;
            }
            if (isset($vo['ac_parent_id'])) {
                $current_path = "-{$vo['ac_parent_id']}-{$vo['ac_id']}";
                if ($vo['ac_parent_id'] !== '' && (stripos("{$menu['path']}-", "{$current_path}-") !== false || $menu['path'] === $current_path)) {
                    unset($menus[$key]);
                }
            }
        }
        return $menus;
    }

    /**
     * 添加文章
     * @return array|string
     */
    public function add()
    {
        $params = $this->request->param();

        if ($this->request->isPost()) {//处理新增保存 或者 编辑保存
            unset($params['spm']);

            $vo = $params;
            // 提交
            if(isset($vo['article_id'])) {//编辑后提交

                // 更新
                $vo['article_time'] = time();//修改时间

                // 更新cms_article表
                db($this->articleTable)->update($vo);

                $relation_object_id = $vo['article_id'];

            }else {//新增
                $vo['article_time'] = time();//修改时间

                // 插入article表
                $relation_object_id=db($this->articleTable)->insertGetId($vo);

            }
            $relation_object_id !== false ? $this->success('恭喜，保存成功哦！', url('/').'admin.html#'.url('article').'?spm='.$this->request->param('spm')) : $this->error('保存失败，请稍候再试！');

//            $relation_object_id !== false ? $this->success('恭喜，保存成功哦！', url('/#article/article').'?spm='.$this->request->param('spm')) : $this->error('保存失败，请稍候再试！');
        }else {//显示新增或者编辑页面
            // 显示
            $data = [];
            if(isset($params['article_id'])) {
                $title = '编辑文章';
                $data = db($this->articleTable)->find($params['article_id']);

            }else {
                $title = '新增文章';
            }

            // 上级分类处理
            $_menus = Db::name($this->categoryTable)->order('ac_sort asc,ac_id asc')->select();
            $_menus[] = ['ac_name' => '顶级分类', 'ac_id' => '0', 'ac_parent_id' => '-1'];
            $menus = ToolsService::arr2table($_menus,"ac_id","ac_parent_id");
            foreach ($menus as $key => &$menu) {
                if (substr_count($menu['path'], '-') > 3) {
                    unset($menus[$key]);
                    continue;
                }
                if (isset($vo['ac_parent_id'])) {
                    $current_path = "-{$vo['ac_parent_id']}-{$vo['ac_id']}";
                    if ($vo['ac_parent_id'] !== '' && (stripos("{$menu['path']}-", "{$current_path}-") !== false || $menu['path'] === $current_path)) {
                        unset($menus[$key]);
                    }
                }
            }

            $this->assign('menus', $menus);
            $this->assign('title', $title);

            return $this->fetch('articleform', ['vo' => $data]);
        }
    }


    /**
     * 删除文章
     */
    public function del() {
        $doc_id = $this->request->param('id');

        if (DataService::update($this->articleTable)) {
            DataService::update($this->articleTable, ['article_id' => $doc_id]); // 删除内容
            $this->success("删除成功！", '');
        }
        $this->error("删除失败，请稍候再试！");
    }
}
