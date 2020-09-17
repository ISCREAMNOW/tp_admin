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
 * 内容管理
 * Class Document
 * @package app\admin\controller
 * @author andy <290648237@qq.com>
 * @date 2017/6/13
 */
class Document extends BasicAdmin
{

    /**
     * 指定文档内容表
     * @var string
     */
    public $articleTable = 'cms_article';

    /**
     * 指定文章分类表
     * @var string
     */
    public $categoryTable = 'cms_article_class';

    /**
     * 指定文档标签表
     * @var string
     */
    public $tagsTable = 'cms_tag';

    /**
     *
     * 文档标签关系表
     */
    protected $tagsRelationTable = 'cms_tag_relation';

    /***************************** 文章分类管理 *****************************/

    /**
     * 文章分类管理
     */
    public function category()
    {
        $this->title = '文章分类管理';
        $db = Db::name($this->categoryTable)->order('class_sort asc, class_id asc');
        return parent::_list($db, false);
    }

    /**
     * 文章分类 列表数据处理
     * @param array $data
     */
    protected function _category_data_filter(&$data)
    {
        foreach ($data as &$vo) {
            $vo['ids'] = join(',', ToolsService::getArrSubIds($data, $vo['class_id'],"class_id"));
        }
        $data = ToolsService::arr2table($data,"class_id","pid");
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

    /***************************** 文档内容管理 *****************************/

    /**
     * 文章列表
     */
    public function article()
    {
        $this->title = '文章管理';
        $get = $this->request->get();

        // 根据分类搜索文章
        if(isset($get['class_id']) && $get['class_id'] !== '' && $get['class_id'] != '-1') {
            $cateIds = $this->_searchByCategory($get['class_id']);
            if($cateIds !== '') {
                $db = Db::name($this->articleTable)->where('article_class_id', 'in', $cateIds)->order("article_publish_time desc");
            }else {
                $db = Db::name($this->articleTable)->where('article_class_id', $get['class_id'])->order("article_publish_time desc");
            }
        }else {
            // 实例Query对象
            $db = Db::name($this->articleTable)->order("article_publish_time desc");
        }

        // 应用搜索条件
        foreach (['article_title', 'article_state', 'article_commend_flag'] as $key) {
            if (isset($get[$key]) && $get[$key] !== '') {
                $db->where($key, 'like', "%{$get[$key]}%")->order("article_publish_time desc");
            }
        }

        // 文章分类名称
        $data = parent::_list($db, true, false);
        foreach($data['list'] as $key=>$list) {
            $data['list'][$key]['cname'] = Db::name($this->categoryTable)->where('class_id', $list['article_class_id'])->value('class_name');
        }

        // 获取文章分类
        $menus = $this->_getDocumentCategory();
        $this->assign('menus', $menus);
        return $this->fetch('', $data);
    }

    /**
     * 根据文章分类搜索
     * @param int $article_class_id 商品分类id
     * @return array|string
     */
    private function _searchByCategory($article_class_id) {
        $cateData = Db::name($this->categoryTable)->where('class_id', $article_class_id)->field('class_id')->select();
        $cateIds = [];
        foreach ($cateData as $cate) {
            $cateIds[] = $cate['class_id'];

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
        $_menus = Db::name($this->categoryTable)->order('class_sort asc,class_id asc')->select();

        $menus = ToolsService::arr2table($_menus,'class_id','pid');
        foreach ($menus as $key => &$menu) {

            if (substr_count($menu['path'], '-') > 3) {
                unset($menus[$key]);
                continue;
            }
            if (isset($vo['pid'])) {
                $current_path = "-{$vo['pid']}-{$vo['class_id']}";
                if ($vo['pid'] !== '' && (stripos("{$menu['path']}-", "{$current_path}-") !== false || $menu['path'] === $current_path)) {
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
//            $image_data=array(
//                "name" => $params['article_image'],
//                "width" => '',
//                "height" => '367',
//                "path" => ''
//            );
//            $params['article_image']=serialize($image_data);
            $vo = $params;
            // 提交
            if(isset($vo['article_id'])) {//编辑后提交
                // document_tags 删除所有文章标签 重新添加
                db($this->tagsRelationTable)->where('relation_object_id', $vo['article_id'])->delete();

                // 更新
                $vo['article_modify_time'] = time();//修改时间

                // 更新cms_article表
                db($this->articleTable)->update($vo);

                $relation_object_id = $vo['article_id'];

            }else {//新增
                $vo['article_modify_time'] = time();//修改时间
                $vo['article_publish_time'] = time();//发布时间

                // 插入cms_article表
                $relation_object_id=db($this->articleTable)->insertGetId($vo);

            }

            // 处理标签
            if($params['article_tag'] != '') {
                $article_tag = explode(',', $params['article_tag']);

                foreach ($article_tag as $tag) {
                    $tagName = Db::name($this->tagsTable)->where('tag_name', $tag)->value('tag_name');
                    // 如果标签不存在 则将此标签加入标签表
                    if(empty($tagName)){
                        DataService::save(db($this->tagsTable), ['tag_name' => $tag,'tag_sort'=>100,'tag_count'=>1],"tag_id");
                    }else{//标签存在-tag_count 统计加1
                        db($this->tagsTable)->where('tag_name', $tag)->setInc("tag_count");
                    }
                    $tag_id = db($this->tagsTable)->where('tag_name', $tag)->value('tag_id');

                    // 插入 cms_tags_relation表
                    $relation_id=db($this->tagsRelationTable)->where(['relation_type'=>1,'relation_object_id'=>$relation_object_id,'relation_tag_id'=>$tag_id])->value("relation_id");
                    if(empty($relation_id)){
                        db($this->tagsRelationTable)->insert(['relation_type'=>1,'relation_object_id' => $relation_object_id, 'relation_tag_id' => $tag_id]);
                    }

                }
            }

            $relation_object_id !== false ? $this->success('恭喜，保存成功哦！', url('/').'admin.html#'.url('article').'?spm='.$this->request->param('spm')) : $this->error('保存失败，请稍候再试！');
//            $relation_object_id !== false ? $this->success('恭喜，保存成功哦！', url('/#document/article').'?spm='.$this->request->param('spm')) : $this->error('保存失败，请稍候再试！');
        }else {//显示新增或者编辑页面
            // 显示
            $data = [];
            if(isset($params['article_id'])) {
                $title = '编辑文章';
                $data = db($this->articleTable)->find($params['article_id']);

                // 获取标签
                $article_tag = db($this->tagsRelationTable)->where('relation_object_id', $params['article_id'])->select();

                if($article_tag) {
                    // 存在标签
                    foreach ($article_tag as $tag) {
                        $resultTags[] = db($this->tagsTable)->where('tag_id', $tag['relation_tag_id'])->value('tag_name');
                    }
                    $data['article_tag'] = implode(',', $resultTags);
                }
            }else {
                $title = '新增文章';
            }

            // 上级分类处理
            $_menus = Db::name($this->categoryTable)->order('class_sort asc,class_id asc')->select();
            $_menus[] = ['class_name' => '顶级分类', 'class_id' => '0', 'pid' => '-1'];
            $menus = ToolsService::arr2table($_menus,"class_id","pid");
            foreach ($menus as $key => &$menu) {
                if (substr_count($menu['path'], '-') > 3) {
                    unset($menus[$key]);
                    continue;
                }
                if (isset($vo['pid'])) {
                    $current_path = "-{$vo['pid']}-{$vo['class_id']}";
                    if ($vo['pid'] !== '' && (stripos("{$menu['path']}-", "{$current_path}-") !== false || $menu['path'] === $current_path)) {
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
     * 文章分类 表单数据前缀方法
     * @param array $vo
     */
    protected function _article_form_filter(&$vo) {
        if ($this->request->isGet()) {
            // 上级分类处理
            $_menus = Db::name($this->categoryTable)->order('class_sort asc,class_id asc')->select();
            $_menus[] = ['class_name' => '顶级分类', 'class_id' => '0', 'pid' => '-1'];
            $menus = ToolsService::arr2table($_menus,"class_id","pid");
            foreach ($menus as $key => &$menu) {
                if (substr_count($menu['path'], '-') > 3) {
                    unset($menus[$key]);
                    continue;
                }
                if (isset($vo['pid'])) {
                    $current_path = "-{$vo['pid']}-{$vo['class_id']}";
                    if ($vo['pid'] !== '' && (stripos("{$menu['path']}-", "{$current_path}-") !== false || $menu['path'] === $current_path)) {
                        unset($menus[$key]);
                    }
                }
            }

            $this->assign('menus', $menus);
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

    /**
     * 文章 待审核 0
     */
    public function forbid() {
        if (DataService::update($this->articleTable)) {
            $this->success("状态改为待审核成功！", '');
        }
        $this->error("状态改为待审核失败，请稍候再试！");
    }

    /**
     * 文章 已审核 1
     */
    public function resume() {
        if (DataService::update($this->articleTable)) {
            $this->success("状态改为已审核成功！", '');
        }
        $this->error("状态改为已审核失败，请稍候再试！");
    }

    /**
     * 文章 取消推荐 0
     */
    public function unRecommend() {
        if (DataService::update($this->articleTable)) {
            $this->success("取消推荐成功！", '');
        }
        $this->error("取消推荐失败，请稍候再试！");
    }

    /**
     * 文章 推荐置顶 1
     */
    public function recommend() {
        if (DataService::update($this->articleTable)) {
            $this->success("推荐置顶成功！", '');
        }
        $this->error("推荐置顶失败，请稍候再试！");
    }


    /**
     * 文章标签搜索建议 ajax
     *
     * @return \think\response\Json
     */
    public function tagSuggest()
    {
        $db = Db::name($this->tagsTable);

        $keyword = $this->request->get('q');

        // 应用搜索条件
        $db->where('tag_name', 'like', "%{$keyword}%");

        // 文章分类名称
        $data = parent::_list($db, true, false);

        $suggest = [];
        foreach($data['list'] as $vo) {
            $suggest[] = $vo['tag_name'];
        }

        $result = [
            'results' => $suggest
        ];
        return json($result);
    }


}
